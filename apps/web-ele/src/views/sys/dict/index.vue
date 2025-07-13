<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, Page } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

import Dict from '#/adapter/component/Dict.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delDictById, getDictPage } from '#/api/sys/dict';

import DictForm from './form.vue';
import ItemIndex from './item/index.vue';
import RecycleForm from './recycle.vue';

const dictFormRef = ref();
const itemIndexRef = ref();
const recycleFormRef = ref();

interface RowType {
  id: string;
  parentId: null | number;
  deptName: string;
  deptStatus: string;
}

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
  },
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    {
      field: 'dictName',
      title: 'Dictionary Name',
      align: 'left',
    },
    {
      field: 'dictCode',
      title: 'Dictionary Code',
      align: 'left',
    },
    {
      field: 'dictStatus',
      title: 'Status',
      slots: { default: 'status' },
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: 'Operation',
      width: 150,
    },
  ],
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getDictPage({
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

const openRecycleForm = () => {
  recycleFormRef.value?.open();
};

const openForm = () => {
  dictFormRef.value?.open();
};

const editRow = (row: RowType) => {
  dictFormRef.value?.open(row);
};

const openItemRow = (row: RowType) => {
  itemIndexRef.value?.open(row);
};

const deleteByIds = (row?: RowType) => {
  const ids: string[] = row
    ? [row.id]
    : gridApi.grid.getCheckboxRecords().map((item) => item.id);

  if (ids.length === 0) {
    ElMessage.warning('Please select at least one item to delete');
    return;
  }

  confirm({
    content: `Confirm deletion of ${ids.length} record(s)?`,
    icon: 'error',
  }).then(async () => {
    try {
      await delDictById(ids);
      await gridApi.reload();
      ElMessage.success('Deletion successful');
    } catch {
      ElMessage.error('Deletion failed');
    }
  });
};
</script>

<template>
  <Page>
    <Grid>
      <template #status="{ row }">
        <Dict dict-key="common_status" :value="row.dictStatus" />
      </template>
      <template #toolbar-actions>
        <ElButton class="mr-2" bg text type="primary" @click="openForm">
          Add
        </ElButton>
        <ElButton class="mr-2" bg text type="danger" @click="deleteByIds()">
          Delete
        </ElButton>
        <ElButton class="mr-2" bg text type="info" @click="openRecycleForm()">
          Recycle
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton type="success" link @click="openItemRow(row)">
          item
        </ElButton>
        <ElButton type="primary" link @click="editRow(row)"> edit </ElButton>
        <ElButton type="danger" link @click="deleteByIds(row)">
          delete
        </ElButton>
      </template>
    </Grid>
    <DictForm ref="dictFormRef" :grid-api="gridApi" />
    <ItemIndex ref="itemIndexRef" />
    <RecycleForm ref="recycleFormRef" :grid-api="gridApi" />
  </Page>
</template>
