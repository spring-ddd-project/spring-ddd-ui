import { requestClient } from '#/api/request';

export async function getBindPage(data: any) {
  return requestClient.post('/gen/column/bind/index', data);
}
export async function createBind(data: any) {
  return requestClient.post('/gen/column/bindcreate', data);
}

export async function updateBind(data: any) {
  return requestClient.put('/gen/column/bindupdate', data);
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
  return requestClient.delete('/gen/column/bind/delete', {
    params: {
      ids: data,
    },
  });
}
