import { requestClient } from '#/api/request';

export async function getTemplatePage(data: any) {
  return requestClient.post('/gen/template/index', data);
}

export async function getTemplateRecyclePage(data: any) {
  return requestClient.post('/gen/template/recycle', data);
}

export async function createTemplate(data: any) {
  return requestClient.post('/gen/template/create', data);
}

export async function updateTemplate(data: any) {
  return requestClient.put('/gen/template/update', data);
}

export async function deleteTemplate(data: any) {
  return requestClient.post('/gen/template/delete', null, {
    params: {
      ids: data,
    },
  });
}

export async function restoreTemplate(data: any) {
  return requestClient.post('/gen/template/restore', null, {
    params: {
      ids: data,
    },
  });
}

export async function wipeTemplate(data: any) {
  return requestClient.delete('/gen/template/wipe', {
    params: {
      ids: data,
    },
  });
}
