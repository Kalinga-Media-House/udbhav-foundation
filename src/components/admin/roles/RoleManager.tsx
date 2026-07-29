'use client';

import { useEffect, useState } from 'react';

import {
  fetchAllRoles,
  fetchAllPermissions,
  fetchRolePermissions,
  updateRolePermissions,
} from '@/features/roles/actions';
import { Role, Permission, RolePermission } from '@/features/roles/types';
import { exportToCSV } from '@/lib/utils/csv-export';

export function RoleManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePerms, setRolePerms] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [r, p, rp] = await Promise.all([
          fetchAllRoles(),
          fetchAllPermissions(),
          fetchRolePermissions(),
        ]);
        setRoles(r);
        setPermissions(p);
        setRolePerms(rp);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleToggle = (roleId: string, permissionId: string) => {
    setRolePerms((prev) => {
      const exists = prev.find((rp) => rp.role_id === roleId && rp.permission_id === permissionId);
      if (exists) {
        return prev.filter((rp) => !(rp.role_id === roleId && rp.permission_id === permissionId));
      } else {
        return [...prev, { role_id: roleId, permission_id: permissionId }];
      }
    });
  };

  const handleSave = async (roleId: string) => {
    try {
      setSaving(true);
      const permsForRole = rolePerms
        .filter((rp) => rp.role_id === roleId)
        .map((rp) => rp.permission_id);
      await updateRolePermissions(roleId, permsForRole);
      alert('Saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Error saving permissions');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const data = roles.map((role) => {
      const row: any = { Role: role.name };
      permissions.forEach((p) => {
        row[p.name] = rolePerms.some((rp) => rp.role_id === role.id && rp.permission_id === p.id)
          ? 'Yes'
          : 'No';
      });
      return row;
    });
    exportToCSV(data, 'role_permissions.csv');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="rounded bg-white p-6 text-black shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Role & Permission Manager</h2>
        <button
          onClick={handleExport}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Export to CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">Role</th>
              {permissions.map((p) => (
                <th
                  key={p.id}
                  className="border border-gray-200 px-4 py-2"
                  title={p.description || p.name}
                >
                  {p.name}
                </th>
              ))}
              <th className="border border-gray-200 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td className="border border-gray-200 px-4 py-2 font-medium">{role.name}</td>
                {permissions.map((p) => {
                  const hasPerm = rolePerms.some(
                    (rp) => rp.role_id === role.id && rp.permission_id === p.id
                  );
                  return (
                    <td key={p.id} className="border border-gray-200 px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={hasPerm}
                        onChange={() => handleToggle(role.id, p.id)}
                        className="h-4 w-4"
                      />
                    </td>
                  );
                })}
                <td className="border border-gray-200 px-4 py-2 text-center">
                  <button
                    onClick={() => handleSave(role.id)}
                    disabled={saving}
                    className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600 disabled:opacity-50"
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
