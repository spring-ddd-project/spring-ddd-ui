import { requestClient } from '#/api/request';

export async function getMenusPage(data: any) {
  return requestClient.post('/sys/menu/index', data);
}

export async function getMenusRecyclePage(data: any) {
  return requestClient.post('/sys/menu/recycle', data);
}

export async function create(data: any) {
  return requestClient.post('/sys/menu/create', data);
}

export async function update(data: any) {
  return requestClient.put('/sys/menu/update', data);
}

export async function getMenuTreeWithoutPermission() {
  return requestClient.post('/sys/menu/getMenuTreeWithoutPermission');
}

export async function getMenuTreeWithPermission() {
  return requestClient.post('/sys/menu/getMenuTreeWithPermission');
}

export async function delById(data: any) {
  return requestClient.post('/sys/menu/delete', null, {
    params: {
      ids: data,
    },
  });
}

export async function restoreById(data: any) {
  return requestClient.post('/sys/menu/restore', null, {
    params: {
      ids: data,
    },
  });
}

export async function wipeById(data: any) {
  return requestClient.delete('/sys/menu/wipe', {
    params: {
      ids: data,
    },
  });
}
