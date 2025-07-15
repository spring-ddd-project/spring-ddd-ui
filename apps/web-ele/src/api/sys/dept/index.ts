import { requestClient } from '#/api/request';

export async function getDeptPage(data: any) {
  return requestClient.post('/sys/dept/index', data);
}

export async function getDeptRecyclePage(data: any) {
  return requestClient.post('/sys/dept/recycle', data);
}

export async function getTree(data: any) {
  return requestClient.post('/sys/dept/tree', data);
}

export async function createDept(data: any) {
  return requestClient.post('/sys/dept/create', data);
}

export async function updateDept(data: any) {
  return requestClient.put('/sys/dept/update', data);
}

export async function delDeptById(data: any) {
  return requestClient.post('/sys/dept/delete', null, {
    params: {
      ids: data,
    },
  });
}

export async function wipeDeptById(data: any) {
  return requestClient.delete('/sys/dept/wipe', {
    params: {
      ids: data,
    },
  });
}

export async function restoreDeptById(data: any) {
  return requestClient.post('/sys/dept/restore', null, {
    params: {
      ids: data,
    },
  });
}
