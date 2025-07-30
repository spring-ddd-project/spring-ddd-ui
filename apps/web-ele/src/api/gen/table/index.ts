import { requestClient } from '#/api/request';

export async function getTablePage(data: any) {
  return requestClient.post('/gen/table/index', data);
}

export async function getTableInfo(data: any) {
  return requestClient.post('/gen/info/queryInfoByTableName', null, {
    params: {
      tableName: data,
    },
  });
}

export async function getColumnsInfo(data: any) {
  return requestClient.post('/gen/columns/queryByInfoId', null, {
    params: {
      infoId: data,
    },
  });
}
