import { requestClient } from '#/api/request';

export async function getRoleMenuDataScopeList(params: any) {
  return requestClient.get('/sys/roleMenuDataScope', { params });
}

export async function getRoleMenuDataScope(params: any) {
  return requestClient.get('/sys/roleMenuDataScope/find', { params });
}

export async function batchSaveRoleMenuDataScope(data: any) {
  return requestClient.post('/sys/roleMenuDataScope/batch', data);
}
