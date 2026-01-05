import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../api/fetchWithAuth'; 
import { Role, Permission } from '../security/Enums';
import type { UserDTO } from '../types';
import { isManager } from '../security/Utils';


type Props = {
  userId: number;
  onClose: () => void;
  onUpdated?: () => void;
};

export default function UserDetailsModal({ userId, onClose, onUpdated }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserDTO | null>(null);

  // form fields
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [enabled, setEnabled] = useState(false);

  // roles/permissions state
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Partial<Record<Role, Permission[]>>>({});

  const [canEditRolesOrPermissions, setCanEditRolesOrPermissions] = useState(false);
 

  useEffect(() => {
    let mounted = true;

    setAllRoles(Object.values(Role));
    setAllPermissions(Object.values(Permission));

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchWithAuth(`/api/users/${userId}`);
        if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
        const data = await res.json() as UserDTO;
        if (!mounted) return;
        setUser(data);
        setFirstname(data.firstname ?? '');
        setLastname(data.lastname ?? '');
        setEnabled(Boolean(data.enabled));
        setUserRoles(data.roles ?? []);
        setRolePermissions(data.permissions ?? {});
        setCanEditRolesOrPermissions(isManager);
      } catch (e: any) {
        setError(e.message || 'Failed to load user');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => { mounted = false; };
  }, [userId]);

  async function handleSave() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth(`/api/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ firstname, lastname, enabled }),
      });
      if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
      const updated = await res.json();
      setUser(updated);
      if (onUpdated) onUpdated();
        const existingRoles = user?.roles ?? [];

        const rolesToAdd = userRoles.filter(r => !existingRoles.includes(r));

        if (rolesToAdd.length) {
        await fetchWithAuth(`/api/users/${userId}/roles`, {
            method: 'POST',
            body: JSON.stringify(rolesToAdd),
        });
        }

        const rolesToRemove = existingRoles.filter(r => !userRoles.includes(r));

        if (rolesToRemove.length) {
            await fetchWithAuth(`/api/users/${userId}/roles`, {
                method: 'DELETE',
                body: JSON.stringify(rolesToRemove),
            });
        }
       const oldPermissions: Partial<Record<Role, Permission[]>> = user?.permissions ?? {};

        for (const role of userRoles) {
            const newPerms = rolePermissions[role] ?? [];
            const oldPerms = oldPermissions[role] ?? [];

            // Permissions to add
            const toAdd = newPerms.filter((p: Permission) => !oldPerms.includes(p));
            if (toAdd.length) {
                await fetchWithAuth(`/api/users/${userId}/permissions`, {
                method: 'POST',
                body: JSON.stringify({ roleName: role, permissionNames: toAdd }),
                });
            }

            // Permissions to remove
            const toRemove = oldPerms.filter((p: Permission) => !newPerms.includes(p));
            if (toRemove.length) {
                await fetchWithAuth(`/api/users/${userId}/permissions`, {
                method: 'DELETE',
                body: JSON.stringify({ roleName: role, permissionNames: toRemove }),
                });
            }
            }




    } catch (e: any) {
      setError(e.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  }

    function toggleRole(role: Role) {
    setUserRoles(prev =>
        prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );

    setRolePermissions(prev => {
        const copy = { ...prev };
        if (copy[role]) delete copy[role]; // remove permissions with role
        else copy[role] = [];
        return copy;
    });
    }


    function togglePermission(role: Role, permission: Permission) {
        setRolePermissions(prev => {
            const current = prev[role] ?? [];
            const has = current.includes(permission);

            return {
            ...prev,
            [role]: has
                ? current.filter(p => p !== permission)
                : [...current, permission],
            };
        });
    }



  if (loading) {
    return (
      <div className="modal-backdrop">
        <div className="modal"><p>Loading...</p></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-backdrop">
        <div className="modal">
          <div style={{ color: 'red' }}>{error}</div>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="modal-backdrop" style={backdropStyle}>
      <div className="modal" style={modalStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2>User — {user.firstname} {user.lastname}</h2>
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    right: 10,
                    border: 'none',
                    background: 'transparent',
                    fontSize: 28,
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    padding: 0, 
                    outline: 'none'
                }}
                >
                ×
            </button>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>First name: </label>
          <input value={firstname} onChange={e => setFirstname(e.target.value)} style={{ textAlign: 'center' }}/>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Last name: </label>
          <input value={lastname} onChange={e => setLastname(e.target.value)} style={{ textAlign: 'center' }}/>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>
            <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} />
            Enabled
          </label>

           {/* Immutable info */}
            <div style={{ marginTop: 6, fontSize: 13, color: '#555' }}>
                <div><strong>Date joined: </strong>{user.createdAt}</div>
                <div><strong>Last Updated: </strong>{user.updatedAt}</div>
            </div>

        </div>

        <div style={{ marginTop: 12 }}>
          <h4>Roles</h4>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {allRoles.length ? allRoles.map(r => (
              <label key={String(r)} style={{ border: '1px solid #ddd', padding: 6, borderRadius: 4 }}>
                <input
                  type="checkbox"
                  checked={userRoles.includes(r)}
                  onChange={() => toggleRole(r)}
                  disabled={!canEditRolesOrPermissions}
                />
                {' '}{String(r)}
              </label>
            )) : <small>No roles endpoint or empty.</small>}
          </div>
        </div>

        {userRoles.map(role => (
  <div key={role} style={{ marginTop: 16 }}>
    <h4>{role} permissions</h4>

    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {allPermissions.map(p => (
        <label key={p} style={{ border: '1px solid #eee', padding: 6 }}>
          <input
            type="checkbox"
            checked={rolePermissions[role]?.includes(p) ?? false}
            onChange={() => togglePermission(role, p)}
            disabled={!canEditRolesOrPermissions}
          />
            {' '}{p}
            </label>
        ))}
        </div>
    </div>
    ))}


        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* minimal inline styles — replace with your classes if you want */
const backdropStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(0,0,0,0.4)', zIndex: 9999
};
const modalStyle: React.CSSProperties = {
  background: '#fff',
  padding: '0px 20px 20px 20px',    
  borderRadius: 8,
  minWidth: 420,
  maxWidth: '90%',
  maxHeight: '80vh',      
  overflowY: 'auto',     
  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
  position: 'relative',   
};

