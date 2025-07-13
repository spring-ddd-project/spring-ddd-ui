<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { confirm, useVbenModal } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getRecyclePage, wipeUserById } from '#/api/sys/user';

const props = defineProps<{
  gridApi: any;
}>();

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
    { title: '序号', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    { field: 'username', title: 'User Name', align: 'left' },
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
      width: 150,
    },
  ],
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getRecyclePage({
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

const [Grid, localGridApi] = useVbenVxeGrid({
  gridOptions,
});

const wipeById = (row: RowType) => {
  confirm({
    content: 'Confirm deletion?',
    icon: 'error',
  }).then(async () => {
    await wipeUserById([row.id])
      .then(async () => {
        await localGridApi.reload();
        ElMessage.success('Deletion successful');
        await props.gridApi.reload();
      })
      .catch(() => {
        ElMessage.error('Deletion failed');
      });
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
  <Modal class="w-[70%]" title="Data Recycle">
    <Grid>
      <template #toolbar-actions>
        <ElButton class="mr-2" bg text type="danger"> Wipe </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton type="success" link> restore </ElButton>
        <ElButton type="danger" link @click="wipeById(row)"> wipe </ElButton>
      </template>
    </Grid>
  </Modal>
</template>
