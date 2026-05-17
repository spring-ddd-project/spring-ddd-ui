<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAllEntitiesApi } from '#/api/sys/column-permission';

const emit = defineEmits<{
  (e: 'change', data: any[]): void;
}>();

const rowData = ref<any[]>([]);
const loading = ref(false);

interface EntityMeta {
  entityCode: string;
  entityName: string;
  columns: Array<{ field: string; label: string }>;
}

const allEntities = ref<EntityMeta[]>([]);

const gridOptions: VxeTableGridOptions<any> = {
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    { field: 'entityName', title: $t('system.columnPermission.entityName'), width: 150 },
    { field: 'entityCode', title: $t('system.columnPermission.entityCode'), width: 150 },
    {
      field: 'columns',
      title: $t('system.columnPermission.columns'),
      slots: { default: 'columns' },
    },
  ],
  data: [],
  keepSource: true,
  editConfig: {
    mode: 'row',
    trigger: 'click',
  },
  toolbarConfig: {
    custom: false,
    export: false,
    refresh: false,
    zoom: false,
    search: false,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

onMounted(async () => {
  try {
    loading.value = true;
    const res = await getAllEntitiesApi();
    if (res && Array.isArray(res)) {
      allEntities.value = res;
    }
  } finally {
    loading.value = false;
  }
});

const [Modal, modalApi] = useVbenModal({
  onConfirm: () => {
    const records = gridApi.grid.getTableData().fullData;
    const finalData = records
      .filter((r: any) => r.columns && r.columns.length > 0)
      .map((r: any) => ({
        entityCode: r.entityCode,
        entityName: r.entityName,
        columns: r.columns,
      }));
    emit('change', finalData);
    modalApi.close();
  },
  onOpenChange: (isOpen: boolean) => {
    if (isOpen) {
      gridApi.grid.loadData(rowData.value);
    }
  },
  confirmText: $t('system.common.button.confirm'),
  cancelText: $t('system.common.button.cancel'),
});

const open = (currentData: any[]) => {
  const existingMap = new Map<string, string[]>();
  if (currentData && Array.isArray(currentData)) {
    currentData.forEach((item: any) =>
      existingMap.set(item.entityCode, item.columns),
    );
  }

  rowData.value = allEntities.value.map((entity) => ({
    ...entity,
    availableColumns: entity.columns.map((c) => ({
      label: `${c.label} (${c.field})`,
      value: c.field,
    })),
    columns: existingMap.get(entity.entityCode) || [],
  }));

  modalApi.open();
};

const close = () => modalApi.close();

defineExpose({ open, close });
</script>

<template>
  <Modal
    class="w-[60%]"
    :title="$t('system.columnPermission.modalTitle')"
  >
    <div class="h-[400px]">
      <Grid>
        <template #columns="{ row }">
          <el-select
            v-model="row.columns"
            multiple
            :placeholder="$t('system.columnPermission.placeholder')"
            style="width: 100%"
          >
            <el-option
              v-for="item in row.availableColumns"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </Grid>
    </div>
  </Modal>
</template>
