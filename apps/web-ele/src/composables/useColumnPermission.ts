import { onMounted, ref } from 'vue';

import { getColumnPermissionMetadataApi } from '#/api/sys/column-permission';

export function useColumnPermission(entityCode: string) {
  const visibleColumns = ref<Set<string>>(new Set());
  const metadata = ref<Record<string, string[]>>({});

  const loadMetadata = async () => {
    try {
      const data = await getColumnPermissionMetadataApi();
      metadata.value = data || {};
      const cols = data?.[entityCode];
      visibleColumns.value =
        cols && cols.length > 0 ? new Set(cols) : new Set();
    } catch {
      visibleColumns.value = new Set();
    }
  };

  onMounted(() => {
    loadMetadata();
  });

  const isColumnVisible = (field: string): boolean => {
    if (visibleColumns.value.size === 0) {
      return true;
    }
    return visibleColumns.value.has(field);
  };

  const applyColumnPermission = (columns: any[]): any[] => {
    const systemFields = new Set(['action', 'checkbox', 'seq']);
    return columns.filter((col) => {
      if (!col.field || systemFields.has(col.field)) {
        return true;
      }
      return isColumnVisible(col.field);
    });
  };

  return {
    visibleColumns,
    metadata,
    isColumnVisible,
    applyColumnPermission,
    loadMetadata,
  };
}
