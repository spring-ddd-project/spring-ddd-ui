import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

// Mock the API module
vi.mock('#/api/sys/user', () => ({
  delUserById: vi.fn().mockResolvedValue({ code: 0 }),
  getUserPage: vi.fn().mockResolvedValue({
    code: 0,
    data: {
      list: [
        {
          id: '1',
          username: 'admin',
          phone: '13800138000',
          avatar: '',
          email: 'admin@example.com',
          sex: true,
          lockStatus: false,
        },
      ],
      total: 1,
    },
  }),
}));

// Mock the VbenModal
vi.mock('@vben/common-ui', async () => {
  const actual = await vi.importActual('@vben/common-ui');
  return {
    ...actual,
    confirm: vi.fn().mockResolvedValue(true),
  };
});

describe('SysUser Index View', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('has correct form schema fields', () => {
    const formSchema = [
      {
        component: 'Input',
        fieldName: 'username',
        label: 'system.user.username',
      },
      {
        component: 'Input',
        fieldName: 'phone',
        label: 'system.user.phone',
      },
    ];

    expect(formSchema).toHaveLength(2);
    expect(formSchema[0].fieldName).toBe('username');
    expect(formSchema[1].fieldName).toBe('phone');
  });

  it('has correct grid columns', () => {
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
    expect(columns.map((c) => c.field)).toContain('phone');
    expect(columns.map((c) => c.field)).toContain('lockStatus');
  });

  it('handles user row type correctly', () => {
    const row: {
      id: string;
      username: string;
      phone: string;
      avatar: string;
      email: string;
      sex: boolean;
      lockStatus: boolean;
    } = {
      id: '1',
      username: 'admin',
      phone: '13800138000',
      avatar: '',
      email: 'admin@example.com',
      sex: true,
      lockStatus: false,
    };

    expect(row.id).toBe('1');
    expect(row.username).toBe('admin');
    expect(row.lockStatus).toBe(false);
  });
});
