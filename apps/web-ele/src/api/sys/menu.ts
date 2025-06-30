import { requestClient } from '#/api/request';

export async function getMenusPage(data: any) {
  return requestClient.post('/sys/menu/index', data);
}

export async function create(data: any) {
  return requestClient.post('/sys/menu/create', data);
}

export async function update(data: any) {
  return requestClient.put('/sys/menu/update', data);
}

export async function getParentTree() {
  return requestClient.post('/sys/menu/all');
}

export async function delById(data: any) {
  return requestClient.post('/sys/menu/delete', data);
}
