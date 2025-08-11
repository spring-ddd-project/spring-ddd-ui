import { requestClient } from '#/api/request';

export async function getTablePage(data: any) {
  return requestClient.post('/gen/table/index', data);
}

export async function wipeTableData() {
  return requestClient.delete('/gen/table/wipe');
}

export async function getTableInfoPage(data: any) {
  return requestClient.post('/gen/info/index', data);
}

export async function getTableInfo(data: any) {
  return requestClient.post('/gen/info/queryInfoByTableName', null, {
    params: {
      tableName: data,
    },
  });
}

export async function createTableInfo(data: any) {
  return requestClient.post('/gen/info/create', data);
}

export async function updateTableInfo(data: any) {
  return requestClient.put('/gen/info/update', data);
}

export async function getColumnsInfo(data: any) {
  return requestClient.post('/gen/columns/queryByInfoId', null, {
    params: {
      infoId: data,
    },
  });
}

export async function createColumns(data: any) {
  return requestClient.post('/gen/columns/batchCreate', data);
}
