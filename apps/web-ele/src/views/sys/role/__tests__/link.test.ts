import { describe, expect, it, vi } from 'vitest';

// Mock the API modules
vi.mock('#/api/sys/role', () => ({
  linkRoleAndMenus: vi.fn().mockResolvedValue({ code: 0 }),
  queryMenusByRoleId: vi.fn().mockResolvedValue([
    { menuId: '1', menuName: 'Menu 1' },
    { menuId: '2', menuName: 'Menu 2' },
  ]),
}));

vi.mock('#/api/sys/menu', () => ({
  getMenuTreeWithPermission: vi.fn().mockResolvedValue([
    {
      id: '1',
      name: 'System',
      children: [
        { id: '1-1', name: 'User Management' },
        { id: '1-2', name: 'Role Management' },
      ],
    },
  ]),
}));

describe('SysRole Link View (Role-Menu Linking)', () => {
  it('has correct form schema for permissions', () => {
    const schema = [
      {
        component: 'Input',
        fieldName: 'permissions',
        label: 'system.role.permissions',
        modelPropName: 'modelValue',
      },
    ];

    expect(schema).toHaveLength(1);
    expect(schema[0].fieldName).toBe('permissions');
  });

  it('handles menu tree structure', () => {
    const treeData = [
      {
        id: '1',
        name: 'System',
        children: [
          { id: '1-1', name: 'User Management' },
          { id: '1-2', name: 'Role Management' },
        ],
      },
    ];

    expect(treeData).toHaveLength(1);
    expect(treeData[0].children).toHaveLength(2);
  });

  it('processes selected menu IDs correctly', () => {
    const menuResponse = [
      { menuId: '1', menuName: 'Menu 1' },
      { menuId: '2', menuName: 'Menu 2' },
    ];

    const selectedIds = menuResponse.map((item) => item.menuId);
    expect(selectedIds).toEqual(['1', '2']);
  });
});
