import { requestClient } from '#/api/request';

export async function getUserPostList(params: any) {
  return requestClient.get('/sys/userPost', { params });
}

export async function batchSaveUserPost(data: any) {
  return requestClient.post('/sys/userPost/batch', data);
}
