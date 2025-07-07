<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, Page } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delUserById, getUserPage } from '#/api/sys/user';

import UserForm from './form.vue';
import RecycleForm from './recycle.vue';
import LinkForm from './link.vue';

const userFormRef = ref();
const recycleFormRef = ref();
const linkFormRef = ref();

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

const openRecycleForm = () => {
  recycleFormRef.value?.open();
};

const openForm = () => {
  userFormRef.value?.open();
};

const editRow = (row: RowType) => {
  userFormRef.value?.open(row);
};

const linkRow = (row: RowType) => {
  linkFormRef.value?.open(row);
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
    <Grid>
      <template #toolbar-actions>
        <ElButton class="mr-2" bg text type="primary" @click="openForm">
          Add
        </ElButton>
        <ElButton class="mr-2" bg text type="danger" @click="openRecycleForm">
          Recycle
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton type="success" link @click="linkRow(row)"> Roles </ElButton>
        <ElButton type="primary" link @click="editRow(row)"> Edit </ElButton>
        <ElButton type="danger" link @click="deleteById(row)">
          Delete
        </ElButton>
      </template>
    </Grid>
    <UserForm ref="userFormRef" :grid-api="gridApi" />
    <RecycleForm ref="recycleFormRef" :grid-api="gridApi" />
    <LinkForm ref="linkFormRef" />
  </Page>
</template>
