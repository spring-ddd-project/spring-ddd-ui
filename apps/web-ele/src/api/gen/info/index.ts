import { requestClient } from '#/api/request';

export async function getInfoPage(data: any) {
  return requestClient.post('/gen/projectInfo/index', data);
}
export async function createInfo(data: any) {
  return requestClient.post('/gen/projectInfo/create', data);
}

export async function updateInfo(data: any) {
  return requestClient.put('/gen/projectInfo/update', data);
}

export async function deleteInfo(data: any) {
  return requestClient.post('/gen/projectInfo/delete', null, {
    params: {
      ids: data,
    },
  });
}

export async function wipeInfo(data: any) {
  return requestClient.delete('/gen/projectInfo/delete', {
    params: {
      ids: data,
    },
  });
}
