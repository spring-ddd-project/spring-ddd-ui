import { requestClient } from '#/api/request';

export async function getDictPage(data: any) {
  return requestClient.post('/sys/dict/index', data);
}

export async function getItemLabelByDictCodeAndValue(
  code: string,
  value: number,
) {
  return requestClient.post('/sys/dict/getItemLabel', null, {
    params: {
      dictCode: code,
      itemValue: value,
    },
  });
}

export async function createDict(data: any) {
  return requestClient.post('/sys/dict/create', data);
}

export async function updateDict(data: any) {
  return requestClient.put('/sys/dict/update', data);
}

export async function delDictById(data: any) {
  return requestClient.post('/sys/dict/delete', null, {
    params: {
      ids: data,
    },
  });
}

export async function getItemPage(data: any) {
  return requestClient.post('/sys/dict/item/index', data);
}

export async function createItem(data: any) {
  return requestClient.post('/sys/dict/item/create', data);
}

export async function updateItem(data: any) {
  return requestClient.put('/sys/dict/item/update', data);
}

export async function delItemById(data: any) {
  return requestClient.post('/sys/dict/item/delete', data);
}
