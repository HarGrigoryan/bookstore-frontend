import type { LoginResponseDTO, UserDTO } from "../types";
import { Role } from "./Enums";    
import {RoleLabel} from './Enums';
import type { Permission } from "./Enums";
import { fetchUserData } from "../api/auth"; 

export async function updateUserContext(resp: LoginResponseDTO) {
  // Save auth data
  localStorage.setItem('jwt', resp.accessToken);
  localStorage.setItem('refreshToken', resp.refreshToken);
  localStorage.setItem('username', resp.username);
  localStorage.setItem('userId', String(resp.userId));

  // Fetch full user data
  const user: UserDTO = await fetchUserData(resp.userId);

  // Save user profile info
  localStorage.setItem('firstname', user.firstname);
  localStorage.setItem('lastname', user.lastname);
  localStorage.setItem('email', user.email);
  localStorage.setItem('createdAt', user.createdAt);
  localStorage.setItem('updatedAt', user.updatedAt);

  // 4️⃣ Handle role selection
  let selectedRole: Role;

  if (user.roles.length <= 1) {
    selectedRole = user.roles[0];
  } else {
    selectedRole = await selectRoleDropdown(user.roles);
  }

  localStorage.setItem('role', selectedRole);

  const permissionsForRole: Permission[] =
    user.permissions[selectedRole] ?? [];

  localStorage.setItem(
    'permissions',
    JSON.stringify(permissionsForRole)
  );
}


function selectRoleDropdown(roles: Role[]): Promise<Role> {
  return new Promise((resolve, reject) => {
    const overlay = document.createElement('div');
    overlay.style.cssText =
      'position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:9999';

    const box = document.createElement('div');
    box.style.cssText =
      'background:#fff;padding:16px;border-radius:8px;min-width:200px';

    const title = document.createElement('h3');
    title.textContent = 'Select your role';
    title.style.margin = '0 0 12px 0';
    title.style.fontSize = '18px';


    const select = document.createElement('select');
    roles.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r;                 
      opt.textContent = RoleLabel[r];
      select.appendChild(opt);
    });
    select.style.marginRight = '10px';

    const btn = document.createElement('button');
    btn.textContent = 'Continue';
    btn.style.marginTop = '8px';

    btn.onclick = () => {
      resolve(select.value as Role);
      document.body.removeChild(overlay);
    };

    box.append(title, select, btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  });
}

export function isManager(): boolean {
  return localStorage.getItem('role') === Role.MANAGER;
}

export function isStaff(): boolean {
  return localStorage.getItem('role')  === Role.STAFF;
}

export function isManagerOrStaff() : boolean{
  return isManager() || isStaff();
}

export async function hasPermission(p: Permission): Promise<boolean> {
  const raw = localStorage.getItem('permissions');
  if (!raw) return false;

  const permissions: Permission[] = JSON.parse(raw);
  return permissions.includes(p);
}
