<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElButton, ElMessage } from 'element-plus';

import Dict from '#/adapter/component/Dict.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delById, getMenusPage } from '#/api/sys/menu';

import MenuForm from './form.vue';
import RecycleForm from './recycle.vue';

const menuFormRef = ref();
const recycleFormRef = ref();

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
      query: async () => {
        return await getMenusPage({
          page: false,
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

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

const openForm = () => {
  menuFormRef.value?.open();
};

const openRecycleForm = () => {
  recycleFormRef.value?.open();
};

const editRow = (row: RowType) => {
  menuFormRef.value?.open(row);
};

const expandAll = () => {
  gridApi.grid?.setAllTreeExpand(true);
};

const collapseAll = () => {
  gridApi.grid?.setAllTreeExpand(false);
};

const deleteById = (row?: RowType) => {
  const ids: string[] = row
    ? [row.id]
    : gridApi.grid.getCheckboxRecords().map((item) => item.id);

  if (ids.length === 0) {
    ElMessage.warning($t('system.common.delete.warning'));
    return;
  }

  confirm({
    content: $t('system.common.delete.confirm'),
    icon: 'error',
  }).then(async () => {
    try {
      await delById(ids);
      await gridApi.reload();
      ElMessage.success($t('system.common.delete.success'));
    } catch {
      ElMessage.error($t('system.common.delete.error'));
    }
  });
};
</script>

<template>
  <Page>
    <Grid>
      <template #menuType="{ row }">
        <Dict dict-key="menu_types" :value="row.menuType" />
      </template>
      <template #toolbar-tools>
        <ElButton class="mr-2" bg text type="primary" @click="expandAll">
          {{ $t('system.common.button.expand') }}
        </ElButton>
        <ElButton type="primary" bg text @click="collapseAll">
          {{ $t('system.common.button.collapse') }}
        </ElButton>
      </template>
      <template #toolbar-actions>
        <ElButton class="mr-2" bg text type="primary" @click="openForm">
          {{ $t('system.common.button.add') }}
        </ElButton>
        <ElButton class="mr-2" bg text type="danger" @click="deleteById()">
          {{ $t('system.common.button.delete') }}
        </ElButton>
        <ElButton class="mr-2" bg text type="info" @click="openRecycleForm">
          {{ $t('system.common.button.recycle') }}
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton type="primary" link @click="editRow(row)">
          {{ $t('system.common.button.edit') }}
        </ElButton>
        <ElButton type="danger" link @click="deleteById(row)">
          {{ $t('system.common.button.delete') }}
        </ElButton>
      </template>
    </Grid>
    <MenuForm ref="menuFormRef" :grid-api="gridApi" />
    <RecycleForm ref="recycleFormRef" :grid-api="gridApi" />
  </Page>
</template>
