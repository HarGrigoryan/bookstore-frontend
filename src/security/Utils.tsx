import type { LoginResponseDTO, UserDTO } from "../types";
import type { Role, Permission } from "./Enums";
import { fetchUserData } from "../api/auth"; // adjust path if needed

export async function updateUserContext(resp: LoginResponseDTO) {
  // 1️⃣ Save auth data
  localStorage.setItem('jwt', resp.accessToken);
  localStorage.setItem('refreshToken', resp.refreshToken);
  localStorage.setItem('username', resp.username);
  localStorage.setItem('userId', String(resp.userId));

  // 2️⃣ Fetch full user data
  const user: UserDTO = await fetchUserData(resp.userId);

  // 3️⃣ Save user profile info
  localStorage.setItem('firstname', user.firstname);
  localStorage.setItem('lastname', user.lastname);
  localStorage.setItem('email', user.email);
  localStorage.setItem('createdAt', user.createdAt);
  localStorage.setItem('updatedAt', user.updatedAt);

  // 4️⃣ Handle role selection
  let selectedRole: Role;

  if (user.roles.length <= 1) {
    // ✅ Only one role → auto-select
    selectedRole = user.roles[0];
  } else {
    // ⚠️ Multiple roles → ask user
    selectedRole = await selectRoleDropdown(user.roles);

  }

  // 5️⃣ Save selected role
  localStorage.setItem('role', selectedRole);

  // 6️⃣ Save permissions for that role
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

    const select = document.createElement('select');
    roles.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r;
      opt.textContent = r;
      select.appendChild(opt);
    });

    const btn = document.createElement('button');
    btn.textContent = 'Continue';
    btn.style.marginTop = '8px';

    btn.onclick = () => {
      resolve(select.value as Role);
      document.body.removeChild(overlay);
    };

    box.append(select, btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  });
}
