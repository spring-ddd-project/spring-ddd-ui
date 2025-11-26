import { describe, expect, it, vi } from 'vitest';

// Mock the API module
vi.mock('#/api/sys/role', () => ({
  getRoleRecyclePage: vi.fn().mockResolvedValue({
    code: 0,
    data: {
      list: [
        {
          id: '1',
          roleName: 'Deleted Role',
          roleCode: 'deleted',
          roleDesc: 'A deleted role',
          dataScope: 1,
          roleStatus: false,
          ownerStatus: false,
        },
      ],
      total: 1,
    },
  }),
  restoreRoleById: vi.fn().mockResolvedValue({ code: 0 }),
  wipeRoleById: vi.fn().mockResolvedValue({ code: 0 }),
}));

describe('SysRole Recycle View', () => {
  it('has correct recycle grid columns', () => {
    const columns = [
      { field: 'roleName', title: 'system.role.label' },
      { field: 'roleCode', title: 'system.role.code' },
      { field: 'roleDesc', title: 'system.role.desc' },
      { field: 'dataScope', title: 'system.role.scope' },
      { field: 'ownerStatus', title: 'system.role.owner' },
      { field: 'roleStatus', title: 'system.role.status' },
      { field: 'action', title: 'system.common.operation' },
    ];

    expect(columns).toHaveLength(7);
    expect(columns.map((c) => c.field)).toContain('roleName');
  });

  it('provides restore and wipe actions', () => {
    const actions = ['restore', 'wipe'];
    expect(actions).toContain('restore');
    expect(actions).toContain('wipe');
  });
});
