<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, useVbenModal } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

import Dict from '#/adapter/component/Dict.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDictPage, restoreDictById, wipeDictById } from '#/api/sys/dict';

import DictForm from './form.vue';
import ItemIndex from './item/index.vue';

const props = defineProps<{
  gridApi: any;
}>();
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

const [Grid, localGridApi] = useVbenVxeGrid({
  gridOptions,
});

const deleteByIds = (row?: RowType) => {
  const ids: string[] = row
    ? [row.id]
    : localGridApi.grid.getCheckboxRecords().map((item) => item.id);

  if (ids.length === 0) {
    ElMessage.warning('Please select at least one item to delete');
    return;
  }

  confirm({
    content: `Confirm deletion of ${ids.length} record(s)?`,
    icon: 'error',
  }).then(async () => {
    try {
      await wipeDictById(ids);
      await localGridApi.reload();
      ElMessage.success('Deletion successful');
    } catch {
      ElMessage.error('Deletion failed');
    }
  });
};

const restoreDictByIds = (row?: RowType) => {
  const ids: string[] = row
    ? [row.id]
    : localGridApi.grid.getCheckboxRecords().map((item) => item.id);

  if (ids.length === 0) {
    ElMessage.warning('Please select at least one record to restore');
    return;
  }

  confirm({
    content: `Are you sure you want to restore ${ids.length} ${ids.length === 1 ? 'record' : 'records'}?`,
    icon: 'error',
  }).then(async () => {
    try {
      await restoreDictById(ids);
      await localGridApi.reload();
      await props.gridApi.reload();
      ElMessage.success('restored successfully');
    } catch {
      ElMessage.error('Failed to restore');
    }
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
      <template #status="{ row }">
        <Dict dict-key="common_status" :value="row.dictStatus" />
      </template>
      <template #toolbar-actions>
        <ElButton
          class="mr-2"
          bg
          text
          type="success"
          @click="restoreDictByIds()"
        >
          Restore
        </ElButton>
        <ElButton class="mr-2" bg text type="danger" @click="deleteByIds()">
          Wipe
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton type="primary" link @click="restoreDictByIds(row)">
          restore
        </ElButton>
        <ElButton type="danger" link @click="deleteByIds(row)">
          delete
        </ElButton>
      </template>
    </Grid>
    <DictForm ref="dictFormRef" :grid-api="gridApi" />
    <ItemIndex ref="itemIndexRef" />
  </Modal>
</template>
