<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteTemplate, getTemplatePage } from '#/api/gen/template';

import TemplateForm from './form.vue';
import RecycleForm from './recycle.vue';

const templateFormRef = ref();
const recycleFormRef = ref();

interface RowType {
  id: string;
  templateName: string;
  templateContent: string;
}

const gridOptions: VxeTableGridOptions<RowType> = {
  checkboxConfig: {
    highlight: true,
  },
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    { field: 'templateName', title: $t('codegen.template.name') },
    { field: 'templateContent', title: $t('codegen.template.content') },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('system.common.operation'),
      width: 150,
    },
  ],
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getTemplatePage({
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
    search: false,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

const openRecycleForm = () => {
  recycleFormRef.value?.open();
};

const openForm = () => {
  templateFormRef.value?.open();
};

const editRow = (row: RowType) => {
  templateFormRef.value?.open(row);
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
      await deleteTemplate(ids);
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
        <ElButton type="primary" link @click="editRow(row)">
          {{ $t('system.common.button.edit') }}
        </ElButton>
        <ElButton type="danger" link @click="deleteByIds(row)">
          {{ $t('system.common.button.delete') }}
        </ElButton>
      </template>
    </Grid>
    <TemplateForm ref="templateFormRef" :grid-api="gridApi" />
    <RecycleForm ref="recycleFormRef" :grid-api="gridApi" />
  </Page>
</template>
