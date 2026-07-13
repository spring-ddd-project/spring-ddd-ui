import { requestClient } from '#/api/request';

export async function getPostPage(data: any) {
  return requestClient.post('/sys/post/index', data);
}

export async function getPostRecyclePage(data: any) {
  return requestClient.post('/sys/post/recycle', data);
}

export async function getTree(data: any) {
  return requestClient.post('/sys/post/tree', data);
}

export async function createPost(data: any) {
  return requestClient.post('/sys/post/create', data);
}

export async function updatePost(data: any) {
  return requestClient.put('/sys/post/update', data);
}

export async function delPostById(data: any) {
  return requestClient.post('/sys/post/delete', null, {
    params: {
      ids: data,
    },
  });
}

export async function wipePostById(data: any) {
  return requestClient.delete('/sys/post/wipe', {
    params: {
      ids: data,
    },
  });
}

export async function restorePostById(data: any) {
  return requestClient.post('/sys/post/restore', null, {
    params: {
      ids: data,
    },
  });
}
