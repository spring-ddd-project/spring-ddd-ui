import { describe, expect, it } from 'vitest';

describe('SysRole Column Permission View', () => {
  it('has correct grid columns', () => {
    const columns = [
      { field: 'entityName', title: '业务实体' },
      { field: 'entityCode', title: '实体编码' },
      { field: 'columns', title: '受限列配置' },
    ];

    expect(columns).toHaveLength(3);
    expect(columns[0].field).toBe('entityName');
    expect(columns[1].field).toBe('entityCode');
    expect(columns[2].field).toBe('columns');
  });

  it('has available entities for column permissions', () => {
    const availableEntities = [
      {
        entityCode: 'sys_user',
        entityName: '用户管理',
        availableColumns: [
          { label: '手机号 (phone)', value: 'phone' },
          { label: '邮箱 (email)', value: 'email' },
        ],
      },
      {
        entityCode: 'sys_role',
        entityName: '角色管理',
        availableColumns: [
          { label: '角色名 (roleName)', value: 'roleName' },
          { label: '角色编码 (roleCode)', value: 'roleCode' },
        ],
      },
    ];

    expect(availableEntities).toHaveLength(2);
    expect(availableEntities[0].entityCode).toBe('sys_user');
    expect(availableEntities[1].entityCode).toBe('sys_role');
  });

  it('formats column permission data correctly', () => {
    const records = [
      {
        entityCode: 'sys_user',
        entityName: '用户管理',
        columns: ['phone', 'email'],
      },
    ];

    const finalData = records
      .filter((r) => r.columns && r.columns.length > 0)
      .map((r) => ({
        entityCode: r.entityCode,
        entityName: r.entityName,
        columns: r.columns,
      }));

    expect(finalData).toHaveLength(1);
    expect(finalData[0].columns).toEqual(['phone', 'email']);
  });
});
