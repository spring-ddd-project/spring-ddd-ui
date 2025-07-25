import { requestClient } from '#/api/request';

export async function getInfoPage(data: any) {
  return requestClient.post('/gen/info/index', data);
}
export async function createInfo(data: any) {
  return requestClient.post('/gen/info/create', data);
}

export async function updateInfo(data: any) {
  return requestClient.put('/gen/info/update', data);
}

export async function deleteInfo(data: any) {
  return requestClient.post('/gen/info/delete', null, {
    params: {
      ids: data,
    },
  });
}

export async function wipeInfo(data: any) {
  return requestClient.delete('/gen/info/delete', {
    params: {
      ids: data,
    },
  });
}
