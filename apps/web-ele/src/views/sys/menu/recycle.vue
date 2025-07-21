<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

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
    {
      field: 'name',
      title: $t('system.menu.name'),
      align: 'left',
      treeNode: true,
      slots: { default: 'menuName' },
    },
    { field: 'component', title: $t('system.menu.component.label') },
    { field: 'permission', title: $t('system.menu.permission.label') },
    { field: 'path', title: $t('system.menu.path') },
    {
      field: 'menuType',
      title: $t('system.menu.menuType.label'),
      slots: { default: 'menuType' },
    },
    { field: 'meta.order', title: $t('system.menu.order'), sortable: true },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('system.common.operation'),
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
    ElMessage.warning($t('system.common.delete.warning'));
    return;
  }

  confirm({
    content: $t('system.common.delete.confirm'),
    icon: 'error',
  }).then(async () => {
    try {
      await wipeById(ids);
      await localGridApi.reload();
      ElMessage.success($t('system.common.delete.success'));
    } catch {
      ElMessage.error($t('system.common.delete.error'));
    }
  });
};

const restoreByIds = (row?: RowType) => {
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
      await restoreById(ids);
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
  <Modal class="w-[65%]" :title="$t('system.common.alert.recycle')">
    <Grid>
      <template #menuType="{ row }">
        <Dict dict-key="menu_types" :value="row.menuType" />
      </template>
      <template #toolbar-actions>
        <ElButton class="mr-2" bg text type="success" @click="restoreByIds()">
          {{ $t('system.common.button.restore') }}
        </ElButton>
        <ElButton class="mr-2" bg text type="danger" @click="wipeByIds()">
          {{ $t('system.common.button.wipe') }}
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton type="success" link @click="restoreByIds(row)">
          {{ $t('system.common.button.restore') }}
        </ElButton>
        <ElButton type="danger" link @click="wipeByIds(row)">
          {{ $t('system.common.button.wipe') }}
        </ElButton>
      </template>
    </Grid>
    <MenuForm ref="menuFormRef" :grid-api="gridApi" />
  </Modal>
</template>
