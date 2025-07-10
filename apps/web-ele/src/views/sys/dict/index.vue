<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, Page } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delDicttById, getDictPage } from '#/api/sys/dict';

import DeptForm from './form.vue';

const deptFormRef = ref();

interface RowType {
  id: string;
  parentId: null | number;
  deptName: string;
  deptStatus: string;
}

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'dictName',
  },
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    {
      field: 'dictName',
      title: 'Dictionary Name',
      align: 'left',
      treeNode: true,
    },
    {
      field: 'dictCode',
      title: 'Dictionary Code',
      align: 'left',
      treeNode: true,
    },
    { field: 'dictStatus', title: 'Status' },
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
  deptFormRef.value?.open();
};

const editRow = (row: RowType) => {
  deptFormRef.value?.open(row);
};

const expandAll = () => {
  gridApi.grid?.setAllTreeExpand(true);
};

const collapseAll = () => {
  gridApi.grid?.setAllTreeExpand(false);
};

const deleteById = (row: RowType) => {
  confirm({
    content: 'Confirm deletion?',
    icon: 'error',
  }).then(async () => {
    await delDicttById({
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
      <template #toolbar-tools>
        <ElButton class="mr-2" bg text type="primary" @click="expandAll">
          Expand All
        </ElButton>
        <ElButton type="primary" bg text @click="collapseAll">
          Collapse All
        </ElButton>
      </template>
      <template #toolbar-actions>
        <ElButton class="mr-2" bg text type="primary" @click="openForm">
          Add
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton type="primary" link @click="editRow(row)"> Edit </ElButton>
        <ElButton type="danger" link @click="deleteById(row)">
          Delete
        </ElButton>
      </template>
    </Grid>
    <DeptForm ref="deptFormRef" :grid-api="gridApi" />
  </Page>
</template>
