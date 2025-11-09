<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { confirm, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getBindRecyclePage, restoreBind, wipeBind } from '#/api/gen/bind';

const props = defineProps<{
  gridApi: any;
}>();

interface RowType {
  id: string;
  columnType: string;
  entityType: string;
  componentType: string;
}

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
  },
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    { field: 'columnType', title: $t('codegen.bind.columnType') },
    { field: 'entityType', title: $t('codegen.bind.entityType') },
    { field: 'componentType', title: $t('codegen.bind.componentType') },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('system.common.operation'),
      width: 200,
    },
  ],
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getBindRecyclePage({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
        });
      },
    },
  },
  editConfig: {
    mode: 'row',
    trigger: 'click',
  },
  treeConfig: {
    parentField: 'parentId',
    rowField: 'id',
    transform: true,
  },
  toolbarConfig: {
    custom: true,
    export: true,
    // import: true,
    refresh: true,
    zoom: true,
  },
};

const [Grid, localGridApi] = useVbenVxeGrid({
  gridOptions,
});

const wipe = (row?: RowType) => {
  const ids: string[] = row
    ? [row.id]
    : localGridApi.grid.getCheckboxRecords().map((item) => item.id);

  if (ids.length === 0) {
    ElMessage.warning($t('system.common.delete.warning'));
    return;
  }

  confirm({
    content: $t('system.common.delete.confirm'),
    icon: 'error',
  }).then(async () => {
    await wipeBind(ids)
      .then(async () => {
        await localGridApi.reload();
        ElMessage.success($t('system.common.delete.success'));
        await props.gridApi.reload();
      })
      .catch(() => {
        ElMessage.error($t('system.common.delete.error'));
      });
  });
};

const restore = (row?: RowType) => {
  const ids: string[] = row
    ? [row.id]
    : localGridApi.grid.getCheckboxRecords().map((item) => item.id);

  if (ids.length === 0) {
    ElMessage.warning($t('system.common.restore.warning'));
    return;
  }

  confirm({
    content: $t('system.common.restore.confirm'),
    icon: 'error',
  }).then(async () => {
    try {
      await restoreBind(ids);
      await localGridApi.reload();
      await props.gridApi.reload();
      ElMessage.success($t('system.common.restore.success'));
    } catch {
      ElMessage.error($t('system.common.restore.error'));
    }
  });
};

const [Modal, modalApi] = useVbenModal({
  onClosed: () => {
    modalApi.setData({ loading: false }).close();
  },
  showConfirmButton: false,
  showCancelButton: false,
});

const open = () => {
  modalApi.open();
};
const close = () => modalApi.close();

defineExpose({ open, close });
</script>

<template>
  <Modal class="w-[70%]" :title="$t('system.common.alert.recycle')">
    <Grid>
      <template #toolbar-actions>
        <ElButton class="mr-2" bg text type="success" @click="restore()">
          {{ $t('system.common.button.restore') }}
        </ElButton>
        <ElButton class="mr-2" bg text type="danger" @click="wipe()">
          {{ $t('system.common.button.wipe') }}
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton type="success" link @click="restore(row)">
          {{ $t('system.common.button.restore') }}
        </ElButton>
        <ElButton type="danger" link @click="wipe(row)">
          {{ $t('system.common.button.wipe') }}
        </ElButton>
      </template>
    </Grid>
  </Modal>
</template>
