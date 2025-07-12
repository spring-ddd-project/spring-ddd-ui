<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, Page, useVbenModal } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delItemById, getItemPage } from '#/api/sys/dict';

import ItemForm from './form.vue';
import Dict from "#/adapter/component/Dict.vue";

const itemFormRef = ref();

const writeForm = ref<Record<string, any>>({});

interface RowType {
  id: string;
  dictId: string;
  itemLabel: string;
  itemValue: number;
  itemStatus: string;
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
    },
    {
      field: 'itemValue',
      title: 'Item Value',
      align: 'left',
    },
    { field: 'itemStatus', title: 'Status', slots: { default: 'status' } },
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
          dictId: writeForm.value.id ?? writeForm.value.dictId,
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
  const dictId = writeForm.value.id;
  writeForm.value = {};
  writeForm.value.dictId = dictId;
  itemFormRef.value?.open(writeForm.value);
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
  writeForm.value = {};
  writeForm.value = row?.id ? row : {};
  modalApi.setState({ title: `Dict Name: ${row.dictName}` });
  modalApi.open();
};
const close = () => modalApi.close();

defineExpose({ open, close });
</script>

<template>
  <Modal class="w-[65%]">
    <Page>
      <Grid>
        <template #status="{ row }">
          <Dict dict-key="common_status" :value="row.itemStatus" />
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
      <ItemForm ref="itemFormRef" :grid-api="gridApi" />
    </Page>
  </Modal>
</template>
