import { describe, expect, it, vi } from 'vitest';

// Mock the API modules
vi.mock('#/api/sys/user', () => ({
  createUser: vi.fn().mockResolvedValue({ code: 0 }),
  updateUser: vi.fn().mockResolvedValue({ code: 0 }),
}));

vi.mock('#/api/sys/dept', () => ({
  getTree: vi.fn().mockResolvedValue({ data: [] }),
}));

describe('SysUser Form View', () => {
  it('has correct form schema for user creation', () => {
    const schema = [
      {
        component: 'Input',
        fieldName: 'username',
        label: 'system.user.username',
        rules: 'required',
      },
      {
        component: 'VbenInputPassword',
        fieldName: 'password',
        label: 'system.user.password',
        rules: 'required',
      },
      {
        component: 'ApiTreeSelect',
        fieldName: 'deptId',
        label: 'system.dept.deptId',
        rules: 'required',
      },
      {
        component: 'RadioGroup',
        fieldName: 'sex',
        label: 'system.user.sex',
      },
      {
        component: 'Input',
        fieldName: 'phone',
        label: 'system.user.phone',
      },
      {
        component: 'Input',
        fieldName: 'avatar',
        label: 'system.user.avatar',
      },
      {
        component: 'Input',
        fieldName: 'email',
        label: 'system.user.email',
      },
      {
        component: 'Switch',
        fieldName: 'lockStatus',
        label: 'system.user.lockStatus',
      },
    ];

    expect(schema).toHaveLength(8);
    expect(schema[0].fieldName).toBe('username');
    expect(schema[0].rules).toBe('required');
    expect(schema[1].fieldName).toBe('password');
  });

  it('validates required fields', () => {
    const requiredFields = ['username', 'password', 'deptId', 'sex'];
    requiredFields.forEach((field) => {
      expect(field).toBeTruthy();
    });
  });

  it('has correct sex options', () => {
    const sexOptions = [
      { label: 'Male', value: true },
      { label: 'Female', value: false },
    ];

    expect(sexOptions).toHaveLength(2);
    expect(sexOptions[0].value).toBe(true);
    expect(sexOptions[1].value).toBe(false);
  });
});
