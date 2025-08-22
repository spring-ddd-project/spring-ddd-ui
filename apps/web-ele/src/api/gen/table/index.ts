import { requestClient } from '#/api/request';

export async function getTablePage(data: any) {
  return requestClient.post('/gen/table/index', data);
}

export async function wipeTableData() {
  return requestClient.delete('/gen/table/wipe');
}

export async function codeGenerate(data: any) {
  return requestClient.post('/gen/table/generate', null, {
    params: {
      tableName: data,
    },
  });
}

export async function getTableInfoPage(data: any) {
  return requestClient.post('/gen/projectInfo/index', data);
}

export async function getTableInfo(data: any) {
  return requestClient.post('/gen/projectInfo/queryInfoByTableName', null, {
    params: {
      tableName: data,
    },
  });
}

export async function createTableInfo(data: any) {
  return requestClient.post('/gen/projectInfo/create', data);
}

export async function updateTableInfo(data: any) {
  return requestClient.put('/gen/projectInfo/update', data);
}

export async function getColumnsInfo(iId: string, database: string) {
  return requestClient.post('/gen/columns/queryByInfoId', null, {
    params: {
      infoId: iId,
      databaseName: database,
    },
  });
}

export async function getJaveEntityInfo(iId: string) {
  return requestClient.post('/gen/columns/queryJavaEntityInfoByInfoId', null, {
    params: {
      infoId: iId,
    },
  });
}

export async function createColumns(data: any) {
  return requestClient.post('/gen/columns/batchCreate', data);
}

export async function updateColumns(data: any) {
  return requestClient.put('/gen/columns/batchUpdate', data);
}
