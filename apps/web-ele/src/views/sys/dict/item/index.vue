<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, Page, useVbenModal } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delItemById, getItemPage } from '#/api/sys/dict';

import ItemForm from './form.vue';

const itemFormRef = ref();

const writeForm = ref<Record<string, any>>({});

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
      field: 'itemLabel',
      title: 'Item Name',
      align: 'left',
      treeNode: true,
    },
    {
      field: 'itemValue',
      title: 'Item Value',
      align: 'left',
      treeNode: true,
    },
    { field: 'itemStatus', title: 'Status' },
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
        return await getItemPage({
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
  itemFormRef.value?.open();
};

const editRow = (row: RowType) => {
  itemFormRef.value?.open(row);
};

const deleteById = (row: RowType) => {
  confirm({
    content: 'Confirm deletion?',
    icon: 'error',
  }).then(async () => {
    await delItemById({
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

const [Modal, modalApi] = useVbenModal({
  onConfirm: () => {
    modalApi.setState({ loading: false }).close();
  },
});

const open = (row: any) => {
  writeForm.value = row?.id ? row : {};
  modalApi.open();
};
const close = () => modalApi.close();

defineExpose({ open, close });
</script>

<template>
  <Modal class="w-[65%]" title="Dictionary Item">
    <Page>
      <Grid>
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
      <ItemForm ref="itemFormRef" :grid-api="gridApi" />
    </Page>
  </Modal>
</template>
