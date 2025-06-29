import { requestClient } from '#/api/request';

export async function getMenusPage(data: any) {
  return requestClient.post('/sys/menu/page', data);
}

export async function create(data: any) {
  return requestClient.post('/sys/menu/create', data);
}

export async function getParentTree() {
  return requestClient.post('/sys/menu/all');
}
