<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useAccess } from '@vben/access';
import { confirm, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElButton, ElMessage } from 'element-plus';

import Dict from '#/adapter/component/Dict.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAggregatePage, wipeAggregate } from '#/api/gen/aggregate';

import AggregateForm from './form.vue';

const { hasAccessByCodes } = useAccess();

const infoId = ref();
const fullData = ref<string[]>([]);

interface RowType {
  id: string;
  infoId: string;
  objectName: string;
  objectValue: string;
  objectType: number;
  hasCreated: boolean;
}

const aggregateFormRef = ref();

const gridOptions: VxeTableGridOptions<RowType> = {
  checkboxConfig: {
    highlight: true,
  },
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    { field: 'objectName', title: $t('codegen.aggregate.objectName') },
    { field: 'objectValue', title: $t('codegen.aggregate.objectValue') },
    {
      field: 'objectType',
      title: $t('codegen.aggregate.objectType'),
      slots: { default: 'objectType' },
    },
    {
      field: 'hasCreated',
      title: $t('codegen.aggregate.hasCreated'),
      slots: { default: 'hasCreated' },
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('system.common.operation'),
      width: 200,
    },
  ],
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getAggregatePage({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          infoId: infoId.value,
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
    search: true,
  },
};

const [Grid, gridLocalApi] = useVbenVxeGrid({
  gridOptions,
});

const openForm = () => {
  fullData.value = gridLocalApi.grid
    .getFullData()
    .map((item) => item.objectValue);
  aggregateFormRef.value?.open(infoId.value, fullData.value);
};

const editRow = (row: RowType) => {
  fullData.value = gridLocalApi.grid
    .getCheckboxRecords()
    .map((item) => item.objectValue);
  aggregateFormRef.value?.open(row, fullData.value);
};

const deleteByIds = (row?: RowType) => {
  const ids: string[] = row
    ? [row.id]
    : gridLocalApi.grid.getCheckboxRecords().map((item) => item.id);

  if (ids.length === 0) {
    ElMessage.warning($t('system.common.delete.warning'));
    return;
  }

  confirm({
    content: $t('system.common.delete.confirm'),
    icon: 'error',
  }).then(async () => {
    try {
      await wipeAggregate(ids);
      await gridLocalApi.reload();
      ElMessage.success($t('system.common.delete.success'));
    } catch {
      ElMessage.error($t('system.common.delete.error'));
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

const open = (row: any, iId: string) => {
  if (row?.tableName) {
    infoId.value = iId;
    modalApi.setState({
      title: `${$t('codegen.aggregate.title')}: ${row.tableName}`,
    });
  }
  modalApi.open();
};
const close = () => modalApi.close();

defineExpose({ open, close });
</script>

<template>
  <Modal class="w-[70%]">
    <Grid>
      <template #objectType="{ row }">
        <Dict dict-key="aggregate_type" :value="row.objectType" />
      </template>
      <template #hasCreated="{ row }">
        <Dict dict-key="create_skip" :value="row.hasCreated" />
      </template>
      <template #toolbar-actions>
        <ElButton
          class="mr-2"
          bg
          text
          type="primary"
          @click="openForm"
          v-if="hasAccessByCodes(['gen:aggregate:create'])"
        >
          {{ $t('system.common.button.add') }}
        </ElButton>
        <ElButton
          class="mr-2"
          bg
          text
          type="danger"
          @click="deleteByIds()"
          v-if="hasAccessByCodes(['gen:aggregate:wipe'])"
        >
          {{ $t('system.common.button.delete') }}
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton type="primary" link @click="editRow(row)">
          {{ $t('system.common.button.edit') }}
        </ElButton>
        <ElButton
          type="danger"
          link
          @click="deleteByIds(row)"
          v-if="hasAccessByCodes(['gen:aggregate:wipe'])"
        >
          {{ $t('system.common.button.delete') }}
        </ElButton>
      </template>
    </Grid>
  </Modal>
  <AggregateForm ref="aggregateFormRef" :grid-api="gridLocalApi" />
</template>
