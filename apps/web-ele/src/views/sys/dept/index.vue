<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, Page } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

import Dict from '#/adapter/component/Dict.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delDeptById, getDeptPage } from '#/api/sys/dept';

import DeptForm from './form.vue';

const deptFormRef = ref();

interface RowType {
  id: string;
  parentId: null | number;
  deptName: string;
  deptStatus: string;
}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    {
      field: 'deptName',
      title: 'Department Name',
      align: 'left',
      treeNode: true,
    },
    { field: 'deptStatus', title: 'Status', slots: { default: 'status' } },
    { field: 'sortOrder', title: 'Order', sortable: true },
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
        return await getDeptPage({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
        });
      },
    },
  },
  sortConfig: {
    remote: false,
    trigger: 'cell',
    defaultSort: [{ field: 'sortOrder', order: 'asc' }],
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

const deleteById = (row?: RowType) => {
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
      await delDeptById(ids);
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
        <Dict dict-key="common_status" :value="row.deptStatus" />
      </template>
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
        <ElButton type="primary" link @click="editRow(row)"> edit </ElButton>
        <ElButton type="danger" link @click="deleteById(row)">
          delete
        </ElButton>
      </template>
    </Grid>
    <DeptForm ref="deptFormRef" :grid-api="gridApi" />
  </Page>
</template>
