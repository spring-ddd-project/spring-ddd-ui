<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useAccess } from '@vben/access';
import { confirm, Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElButton, ElMessage } from 'element-plus';

import Dict from '#/adapter/component/Dict.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delItemById, getItemPage } from '#/api/sys/dict';

import ItemForm from './form.vue';
import ItemRecycleForm from './recycle.vue';

const itemFormRef = ref();
const itemRecycleFormRef = ref();

const writeForm = ref<Record<string, any>>({});

const { hasAccessByCodes } = useAccess();

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
    { title: 'No.', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    {
      field: 'itemLabel',
      title: $t('system.dict.item.label'),
    },
    {
      field: 'itemValue',
      title: $t('system.dict.item.value'),
    },
    {
      field: 'itemStatus',
      title: $t('system.dict.status'),
      slots: { default: 'status' },
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('system.common.operation'),
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
  const dictId = writeForm.value.id ?? writeForm.value.dictId;
  writeForm.value = {};
  writeForm.value.dictId = dictId;
  itemFormRef.value?.open(writeForm.value);
};

const openRecycleForm = () => {
  itemRecycleFormRef.value?.open();
};

const editRow = (row: RowType) => {
  itemFormRef.value?.open(row);
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
      await delItemById(ids);
      await gridApi.reload();
      ElMessage.success($t('system.common.delete.success'));
    } catch {
      ElMessage.error($t('system.common.delete.error'));
    }
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
          <ElButton
            class="mr-2"
            bg
            text
            type="primary"
            @click="openForm"
            v-if="hasAccessByCodes(['sys:dict:item:create'])"
          >
            {{ $t('system.common.button.add') }}
          </ElButton>
          <ElButton class="mr-2" bg text type="danger" @click="deleteByIds()">
            {{ $t('system.common.button.delete') }}
          </ElButton>
          <ElButton class="mr-2" bg text type="info" @click="openRecycleForm()">
            {{ $t('system.common.button.recycle') }}
          </ElButton>
        </template>
        <template #action="{ row }">
          <ElButton type="primary" link @click="editRow(row)">
            {{ $t('system.common.button.edit') }}
          </ElButton>
          <ElButton type="danger" link @click="deleteByIds(row)">
            {{ $t('system.common.button.delete') }}
          </ElButton>
        </template>
      </Grid>
      <ItemForm ref="itemFormRef" :grid-api="gridApi" />
      <ItemRecycleForm ref="itemRecycleFormRef" :grid-api="gridApi" />
    </Page>
  </Modal>
</template>
