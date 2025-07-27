import { requestClient } from '#/api/request';

export async function getTablePage(data: any) {
  return requestClient.post('/gen/table/index', data);
}

export async function getTableInfo(data: any) {
  return requestClient.post('/gen/table/queryInfoByTableName', null, {
    params: {
      tableName: data,
    },
  });
}
