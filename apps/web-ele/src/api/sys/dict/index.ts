import { requestClient } from '#/api/request';

export async function getDictPage(data: any) {
  return requestClient.post('/sys/dict/index', data);
}

export async function getDictRecyclePage(data: any) {
  return requestClient.post('/sys/dict/recycle', data);
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

export async function getItemLabelByDictCode(code: string) {
  return requestClient.post('/sys/dict/item/getItemLabelByCode', null, {
    params: {
      dictCode: code,
    },
  });
}

export async function getAllDict() {
  return requestClient.post('/sys/dict/queryAll');
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

export async function restoreDictById(data: any) {
  return requestClient.post('/sys/dict/restore', null, {
    params: {
      ids: data,
    },
  });
}

export async function wipeDictById(data: any) {
  return requestClient.delete('/sys/dict/wipe', {
    params: {
      ids: data,
    },
  });
}

export async function getItemPage(data: any) {
  return requestClient.post('/sys/dict/item/index', data);
}

export async function getItemRecyclePage(data: any) {
  return requestClient.post('/sys/dict/item/recycle', data);
}

export async function createItem(data: any) {
  return requestClient.post('/sys/dict/item/create', data);
}

export async function updateItem(data: any) {
  return requestClient.put('/sys/dict/item/update', data);
}

export async function delItemById(data: any) {
  return requestClient.post('/sys/dict/item/delete', null, {
    params: {
      ids: data,
    },
  });
}

export async function restoreItemById(data: any) {
  return requestClient.post('/sys/dict/item/restore', null, {
    params: {
      ids: data,
    },
  });
}
export async function wipeItemById(data: any) {
  return requestClient.delete('/sys/dict/item/wipe', {
    params: {
      ids: data,
    },
  });
}
