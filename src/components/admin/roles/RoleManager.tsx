'use client';

import React, { useState } from 'react';

const ROLES = [
  { id: 'super_admin', name: 'Super Admin', description: 'Full access to all system features.' },
  { id: 'admin', name: 'Admin', description: 'Access to most features, cannot manage super admins.' },
  { id: 'content_admin', name: 'Content Admin', description: 'Can manage pages, posts, and media only.' },
];

const PERMISSIONS = [
  'view_users',
  'manage_users',
  'view_donations',
  'manage_donations',
  'view_content',
  'manage_content',
  'view_reports',
];

const INITIAL_MAPPING: Record<string, string[]> = {
  super_admin: [...PERMISSIONS],
  admin: ['view_users', 'manage_users', 'view_donations', 'view_content', 'manage_content', 'view_reports'],
  content_admin: ['view_content', 'manage_content'],
};

export const RoleManager = () => {
  const [rolePermissions, setRolePermissions] = useState(INITIAL_MAPPING);

  const togglePermission = (roleId: string, permission: string) => {
    setRolePermissions(prev => {
      const perms = prev[roleId] || [];
      if (perms.includes(permission)) {
        return { ...prev, [roleId]: perms.filter(p => p !== permission) };
      } else {
        return { ...prev, [roleId]: [...perms, permission] };
      }
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role Management</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Configure access control levels and permissions.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                {PERMISSIONS.map(perm => (
                  <th key={perm} scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {perm.replace('_', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {ROLES.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{role.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{role.description}</span>
                    </div>
                  </td>
                  {PERMISSIONS.map(perm => {
                    const isGranted = (rolePermissions[role.id] || []).includes(perm);
                    return (
                      <td key={perm} className="px-6 py-4 whitespace-nowrap text-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isGranted}
                            onChange={() => togglePermission(role.id, perm)}
                            disabled={role.id === 'super_admin'}
                          />
                          <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 ${role.id === 'super_admin' ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
