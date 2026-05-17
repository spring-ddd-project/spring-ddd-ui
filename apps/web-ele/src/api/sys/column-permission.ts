import { requestClient } from '#/api/request';

export interface EntityColumnMetadata {
  entityCode: string;
  entityName: string;
  columns: Array<{ field: string; label: string }>;
}

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

export async function getAllEntitiesApi() {
  return requestClient.post<EntityColumnMetadata[]>('/sys/column-permission/entities');
}
