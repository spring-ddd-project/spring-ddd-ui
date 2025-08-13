<script lang="ts" setup>
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElButton, ElMessage } from 'element-plus';

import Dict from '#/adapter/component/Dict.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getTableInfo, getTablePage, wipeTableData } from '#/api/gen/table';

import GenInfoForm from '../info/form.vue';
import ConfigForm from './config.vue';

const genInfoFormRef = ref();
const configFormRef = ref();

interface RowType {
  id: string;
  tableName: string;
  tableComment: string;
  createTime: string;
  tableCollation: string;
}

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('codegen.info.databaseName')}`,
      },
      fieldName: 'databaseName',
      label: $t('codegen.info.databaseName'),
      labelWidth: 120,
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('codegen.table.tableName')}`,
      },
      fieldName: 'tableName',
      label: $t('codegen.table.tableName'),
    },
  ],
  showCollapseButton: true,
  submitButtonOptions: {
    content: $t('system.common.button.search'),
  },
  resetButtonOptions: {
    content: $t('system.common.button.reset'),
  },
  submitOnChange: false,
  submitOnEnter: true,
};

const gridOptions: VxeTableGridOptions<RowType> = {
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    {
      field: 'tableSchema',
      title: $t('codegen.table.tableSchema'),
      align: 'left',
    },
    {
      field: 'tableName',
      title: $t('codegen.table.tableName'),
    },
    { field: 'tableComment', title: $t('codegen.table.tableComment') },
    { field: 'createTime', title: $t('codegen.table.createTime') },
    { field: 'tableCollation', title: $t('codegen.table.tableCollation') },
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
      query: async ({ page }, formValues) => {
        return await getTablePage({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
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

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
});

const config = (row: RowType) => {
  configFormRef.value?.open(row);
};

const codegen = (row: RowType) => {
  getTableInfo(row?.tableName).then((resp: any) => {
    if (!resp) {
      ElMessage.warning($t('codegen.info.tableInfoConfig'));
      return;
    }
    genInfoFormRef.value?.open(row, resp.id);
  });
};

const sync = async () => {
  await wipeTableData().then(() => {
    ElMessage.success($t('codegen.table.sync.result'));
    gridApi.reload();
  });
};
</script>

<template>
  <Page>
    <Grid>
      <template #owner="{ row }">
        <Dict dict-key="common_status" :value="row.ownerStatus" />
      </template>
      <template #status="{ row }">
        <Dict dict-key="common_status" :value="row.roleStatus" />
      </template>
      <template #toolbar-actions>
        <ElButton class="mr-2" bg text type="danger" @click="sync">
          {{ $t('codegen.table.sync.title') }}
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton type="warning" link @click="config(row)">
          {{ $t('codegen.table.button.config') }}
        </ElButton>
        <ElButton type="primary" link @click="codegen(row)">
          {{ $t('codegen.table.button.generate') }}
        </ElButton>
      </template>
    </Grid>
    <GenInfoForm ref="genInfoFormRef" />
    <ConfigForm ref="configFormRef" />
  </Page>
</template>
