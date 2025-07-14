<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, useVbenModal } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

import Dict from '#/adapter/component/Dict.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getMenusRecyclePage, restoreById, wipeById } from '#/api/sys/menu';

import MenuForm from './form.vue';

const props = defineProps<{
  gridApi: any;
}>();

const menuFormRef = ref();

interface RowType {
  id: string;
  parentId: null | number;
  name: string;
  permission: string;
  path: string;
  menuType: number;
}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    { field: 'name', title: 'Menu Name', align: 'left', treeNode: true },
    { field: 'component', title: 'Component' },
    { field: 'permission', title: 'Permission' },
    { field: 'path', title: 'Path' },
    { field: 'menuType', title: 'Menu Type', slots: { default: 'menuType' } },
    { field: 'meta.order', title: 'Order', sortable: true },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: 'Operation',
      width: 120,
    },
  ],
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getMenusRecyclePage({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
        });
      },
    },
  },
  sortConfig: {
    remote: false,
    trigger: 'cell',
    defaultSort: [{ field: 'meta.order', order: 'asc' }],
  },
  pagerConfig: {
    enabled: false,
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

const wipeByIds = (row?: RowType) => {
  const ids: string[] = row
    ? [row.id]
    : localGridApi.grid.getCheckboxRecords().map((item) => item.id);

  if (ids.length === 0) {
    ElMessage.warning('Please select at least one item to delete');
    return;
  }

  confirm({
    content: `Confirm deletion of ${ids.length} record(s)?`,
    icon: 'error',
  }).then(async () => {
    try {
      await wipeById(ids);
      await localGridApi.reload();
      ElMessage.success('Deletion successful');
    } catch {
      ElMessage.error('Deletion failed');
    }
  });
};

const restoreByIds = (row?: RowType) => {
  const ids: string[] = row
    ? [row.id]
    : localGridApi.grid.getCheckboxRecords().map((item) => item.id);

  if (ids.length === 0) {
    ElMessage.warning('Please select at least one record to restore');
    return;
  }

  confirm({
    content: `Are you sure you want to restore ${ids.length} ${ids.length === 1 ? 'record' : 'records'}?`,
    icon: 'error',
  }).then(async () => {
    try {
      await restoreById(ids);
      await localGridApi.reload();
      await props.gridApi.reload();
      ElMessage.success('restored successfully');
    } catch {
      ElMessage.error('Failed to restore');
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
  <Modal class="w-[65%]" title="Data handling">
    <Grid>
      <template #menuType="{ row }">
        <Dict dict-key="menu_types" :value="row.menuType" />
      </template>
      <template #toolbar-actions>
        <ElButton class="mr-2" bg text type="success" @click="restoreByIds()">
          Restore
        </ElButton>
        <ElButton class="mr-2" bg text type="danger" @click="wipeByIds()">
          Wipe
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton type="success" link @click="restoreByIds(row)">
          restore
        </ElButton>
        <ElButton type="danger" link @click="wipeByIds(row)"> wipe </ElButton>
      </template>
    </Grid>
    <MenuForm ref="menuFormRef" :grid-api="gridApi" />
  </Modal>
</template>
