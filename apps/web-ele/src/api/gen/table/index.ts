import { requestClient } from '#/api/request';

export async function getTablePage(data: any) {
  return requestClient.post('/gen/table/index', data);
}
