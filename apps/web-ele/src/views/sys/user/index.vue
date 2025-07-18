<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElButton, ElMessage } from 'element-plus';

import Dict from '#/adapter/component/Dict.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delUserById, getUserPage } from '#/api/sys/user';

import UserForm from './form.vue';
import LinkForm from './link.vue';
import RecycleForm from './recycle.vue';

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
  },
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    { field: 'username', title: 'User Name', align: 'left' },
    { field: 'phone', title: 'phone' },
    { field: 'avatar', title: 'avatar' },
    { field: 'email', title: 'email' },
    { field: 'sex', title: 'sex', slots: { default: 'sex' } },
    {
      field: 'lockStatus',
      title: 'Lock Status',
      slots: { default: 'lockStatus' },
    },
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

const deleteByIds = (row?: RowType) => {
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
      await delUserById(ids);
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
      <template #sex="{ row }">
        <Dict dict-key="sex_type" :value="row.sex" />
      </template>
      <template #lockStatus="{ row }">
        <Dict dict-key="common_status" :value="row.lockStatus" />
      </template>
      <template #toolbar-actions>
        <ElButton class="mr-2" bg text type="primary" @click="openForm">
          {{ $t('system.common.button.add') }}
        </ElButton>
        <ElButton class="mr-2" bg text type="danger" @click="deleteByIds()">
          {{ $t('system.common.button.delete') }}
        </ElButton>
        <ElButton class="mr-2" bg text type="info" @click="openRecycleForm">
          {{ $t('system.common.button.recycle') }}
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton type="success" link @click="linkRow(row)">
          {{ $t('system.common.button.roles') }}
        </ElButton>
        <ElButton type="primary" link @click="editRow(row)">
          {{ $t('system.common.button.edit') }}
        </ElButton>
        <ElButton type="danger" link @click="deleteByIds(row)">
          {{ $t('system.common.button.delete') }}
        </ElButton>
      </template>
    </Grid>
    <UserForm ref="userFormRef" :grid-api="gridApi" />
    <RecycleForm ref="recycleFormRef" :grid-api="gridApi" />
    <LinkForm ref="linkFormRef" />
  </Page>
</template>
