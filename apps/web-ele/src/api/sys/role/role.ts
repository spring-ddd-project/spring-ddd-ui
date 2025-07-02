import { requestClient } from '#/api/request';

export async function getRolePage(data: any) {
  return requestClient.post('/sys/role/index', data);
}

export async function createRole(data: any) {
  return requestClient.post('/sys/role/create', data);
}

export async function updateRole(data: any) {
  return requestClient.put('/sys/role/update', data);
}

export async function delRoleById(data: any) {
  return requestClient.post('/sys/role/delete', data);
}
