<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, Page } from '@vben/common-ui';

import { ElButton, ElMessage, ElTag } from 'element-plus';

import Dict from '#/adapter/component/Dict.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delDictById, getDictPage } from '#/api/sys/dict';

import DictForm from './form.vue';
import ItemIndex from './item/index.vue';

const dictFormRef = ref();
const itemIndexRef = ref();

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
    { title: '序号', type: 'seq', width: 50 },
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

const openForm = () => {
  dictFormRef.value?.open();
};

const editRow = (row: RowType) => {
  dictFormRef.value?.open(row);
};

const openItemRow = (row: RowType) => {
  itemIndexRef.value?.open(row);
};

const deleteById = (row: RowType) => {
  confirm({
    content: 'Confirm deletion?',
    icon: 'error',
  }).then(async () => {
    await delDictById({
      id: row.id,
    })
      .then(async () => {
        await gridApi.reload();
        ElMessage.success('Deletion successful');
      })
      .catch(() => {
        ElMessage.error('Deletion failed');
      });
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
      </template>
      <template #action="{ row }">
        <ElButton type="success" link @click="openItemRow(row)">
          Item
        </ElButton>
        <ElButton type="primary" link @click="editRow(row)"> Edit </ElButton>
        <ElButton type="danger" link @click="deleteById(row)">
          Delete
        </ElButton>
      </template>
    </Grid>
    <DictForm ref="dictFormRef" :grid-api="gridApi" />
    <ItemIndex ref="itemIndexRef" />
  </Page>
</template>
