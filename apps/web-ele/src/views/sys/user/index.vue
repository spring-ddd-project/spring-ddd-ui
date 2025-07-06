<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, Page } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delUserById, getUserPage } from '#/api/sys/user';

import UserForm from './form.vue';

const userFormRef = ref();

interface RowType {
  id: string;
  username: string;
  phone: string;
  avatar: string;
  email: string;
  sex: boolean;
  lockStatus: boolean;
}

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    { field: 'username', title: 'User Name', align: 'left', treeNode: true },
    { field: 'phone', title: 'phone' },
    { field: 'avatar', title: 'avatar' },
    { field: 'email', title: 'email' },
    { field: 'sex', title: 'sex' },
    { field: 'lockStatus', title: 'Lock Status' },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: 'Operation',
      width: 200,
    },
  ],
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getUserPage({
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

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

const openForm = () => {
  userFormRef.value?.open();
};

const editRow = (row: RowType) => {
  userFormRef.value?.open(row);
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
    await delUserById({
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
    <div class="vp-raw h-[300px] w-full">
      <Grid>
        <template #toolbar-tools>
          <ElButton class="mr-2" type="primary" @click="expandAll">
            Expand All
          </ElButton>
          <ElButton type="primary" @click="collapseAll"> Collapse All</ElButton>
        </template>
        <template #toolbar-actions>
          <ElButton class="mr-2" type="primary" @click="openForm">
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
    </div>
    <UserForm ref="userFormRef" :grid-api="gridApi" />
  </Page>
</template>
