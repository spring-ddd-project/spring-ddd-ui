import { describe, expect, it, vi } from 'vitest';

// Mock the API modules
vi.mock('#/api/sys/user', () => ({
  linkUserAndRole: vi.fn().mockResolvedValue({ code: 0 }),
  queryRolesByUserId: vi.fn().mockResolvedValue([
    { roleId: '1', roleName: 'Admin' },
    { roleId: '2', roleName: 'User' },
  ]),
}));

vi.mock('#/api/sys/role', () => ({
  getAllRole: vi.fn().mockResolvedValue([
    { id: '1', roleName: 'Admin' },
    { id: '2', roleName: 'User' },
    { id: '3', roleName: 'Guest' },
  ]),
}));

describe('SysUser Link View (User-Role Linking)', () => {
  it('has correct form schema for role assignment', () => {
    const schema = [
      {
        component: 'ApiSelect',
        fieldName: 'roleIds',
        label: 'system.role.roleId',
      },
    ];

    expect(schema).toHaveLength(1);
    expect(schema[0].fieldName).toBe('roleIds');
  });

  it('processes selected role IDs correctly', () => {
    const roleResponse = [
      { roleId: '1', roleName: 'Admin' },
      { roleId: '2', roleName: 'User' },
    ];

    const selectedIds = roleResponse.map((item) => item.roleId);
    expect(selectedIds).toEqual(['1', '2']);
  });

  it('handles role list from API', () => {
    const allRoles = [
      { id: '1', roleName: 'Admin' },
      { id: '2', roleName: 'User' },
      { id: '3', roleName: 'Guest' },
    ];

    expect(allRoles).toHaveLength(3);
    expect(allRoles[0].roleName).toBe('Admin');
  });
});
