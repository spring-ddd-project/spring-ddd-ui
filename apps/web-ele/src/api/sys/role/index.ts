import { requestClient } from '#/api/request';

export async function getRolePage(data: any) {
  return requestClient.post('/sys/role/index', data);
}
export async function getRoleRecyclePage(data: any) {
  return requestClient.post('/sys/role/recycle', data);
}

export async function getAllRole(data: any) {
  return requestClient.post('/sys/role/all', data);
}

export async function createRole(data: any) {
  return requestClient.post('/sys/role/create', data);
}

export async function updateRole(data: any) {
  return requestClient.put('/sys/role/update', data);
}

export async function delRoleById(data: any) {
  return requestClient.post('/sys/role/delete', null, {
    params: {
      ids: data,
    },
  });
}

export async function restoreRoleById(data: any) {
  return requestClient.post('/sys/role/restore', null, {
    params: {
      ids: data,
    },
  });
}

export async function wipeRoleById(data: any) {
  return requestClient.delete('/sys/role/wipe', {
    params: {
      ids: data,
    },
  });
}

export async function linkRoleAndMenus(data: any) {
  return requestClient.post('/sys/role/linkRoleAndMenus', null, {
    params: {
      roleId: data.roleId,
      menuIds: data.menuIds,
    },
  });
}
export async function queryMenusByRoleId(data: any) {
  return requestClient.post('/sys/role/queryMenusByRoleId', null, {
    params: {
      roleId: data.roleId,
    },
  });
}
