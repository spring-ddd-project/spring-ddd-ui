import { requestClient } from '#/api/request';

export async function getUserPage(data: any) {
  return requestClient.post('/sys/user/index', data);
}

export async function getRecyclePage(data: any) {
  return requestClient.post('/sys/user/recycle', data);
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

export async function wipeUserById(data: any) {
  return requestClient.delete('/sys/user/wipe', {
    params: {
      ids: data,
    },
  });
}

export async function linkUserAndRole(data: any) {
  return requestClient.post('/sys/user/linkUserAndRole', null, {
    params: {
      userId: data.userId,
      roleIds: data.roleIds,
    },
  });
}

export async function queryRolesByUserId(data: any) {
  return requestClient.post('/sys/user/queryRolesByUserId', null, {
    params: {
      userId: data.userId,
    },
  });
}
