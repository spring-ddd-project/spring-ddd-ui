import { requestClient } from '#/api/request';

export async function getInfoPage(data: any) {
  return requestClient.post('/gen/info/index', data);
}
