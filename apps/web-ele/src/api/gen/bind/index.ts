import { requestClient } from '#/api/request';

export async function getBindPage(data: any) {
  return requestClient.post('/gen/column/bind/index', data);
}

export async function getBindRecyclePage(data: any) {
  return requestClient.post('/gen/column/bind/recycle', data);
}
export async function createBind(data: any) {
  return requestClient.post('/gen/column/bind/create', data);
}

export async function updateBind(data: any) {
  return requestClient.put('/gen/column/bind/update', data);
}

export async function deleteBind(data: any) {
  return requestClient.post('/gen/column/bind/delete', null, {
    params: {
      ids: data,
    },
  });
}

export async function restoreBind(data: any) {
  return requestClient.post('/gen/column/bind/restore', null, {
    params: {
      ids: data,
    },
  });
}

export async function wipeBind(data: any) {
  return requestClient.delete('/gen/column/bind/wipe', {
    params: {
      ids: data,
    },
  });
}
