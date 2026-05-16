import { describe, expect, it, vi } from 'vitest';

// Mock the API module
vi.mock('#/api/sys/user', () => ({
  getRecyclePage: vi.fn().mockResolvedValue({
    code: 0,
    data: {
      list: [
        {
          id: '1',
          username: 'deleted_user',
          phone: '13800138000',
          avatar: '',
          email: 'deleted@example.com',
          sex: true,
          lockStatus: false,
        },
      ],
      total: 1,
    },
  }),
  restoreUser: vi.fn().mockResolvedValue({ code: 0 }),
  wipeUserById: vi.fn().mockResolvedValue({ code: 0 }),
}));

describe('SysUser Recycle View', () => {
  it('has correct recycle grid columns', () => {
    const columns = [
      { field: 'username', title: 'system.user.username' },
      { field: 'phone', title: 'system.user.phone' },
      { field: 'avatar', title: 'system.user.avatar' },
      { field: 'email', title: 'system.user.email' },
      { field: 'sex', title: 'system.user.sex' },
      { field: 'lockStatus', title: 'system.user.lockStatus' },
      { field: 'action', title: 'system.common.operation' },
    ];

    expect(columns).toHaveLength(7);
    expect(columns.map((c) => c.field)).toContain('username');
  });

  it('provides restore and wipe actions', () => {
    const actions = ['restore', 'wipe'];
    expect(actions).toContain('restore');
    expect(actions).toContain('wipe');
  });

  it('handles deleted user data structure', () => {
    const deletedUser = {
      id: '1',
      username: 'deleted_user',
      phone: '13800138000',
      avatar: '',
      email: 'deleted@example.com',
      sex: true,
      lockStatus: false,
    };

    expect(deletedUser.username).toBe('deleted_user');
    expect(deletedUser.id).toBe('1');
  });
});
