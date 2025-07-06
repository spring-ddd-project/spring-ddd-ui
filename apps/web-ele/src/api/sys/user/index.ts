import { requestClient } from '#/api/request';

export async function getUserPage(data: any) {
  return requestClient.post('/sys/user/index', data);
}

export async function createUser(data: any) {
  return requestClient.post('/sys/user/create', data);
}

export async function updateUser(data: any) {
  return requestClient.put('/sys/user/update', data);
}

export async function delUserById(data: any) {
  return requestClient.post('/sys/user/delete', data);
}
