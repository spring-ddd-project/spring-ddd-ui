import { requestClient } from '#/api/request';

export async function getColumnPermissionMetadataApi() {
  return requestClient.post<Record<string, string[]>>(
    '/sys/column-permission/metadata',
  );
}

export async function getVisibleColumnsApi(entityCode: string) {
  return requestClient.post<string[]>(
    '/sys/column-permission/visible-columns',
    null,
    {
      params: { entityCode },
    },
  );
}
