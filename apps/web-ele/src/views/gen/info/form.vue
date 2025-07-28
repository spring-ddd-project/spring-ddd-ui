<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElCard, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getTableInfo, getTablePage } from '#/api/gen/table';

const writeForm = ref<Record<string, any>>({});
const genTag = reactive([
  {
    color: 'processing',
    label: $t('codegen.info.tag.attribute'),
    value: 'attribute',
  },
  {
    color: 'success',
    label: $t('codegen.info.tag.table'),
    value: 'table',
  },
  {
    color: 'default',
    label: $t('codegen.info.tag.form'),
    value: 'form',
  },
]);

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  layout: 'horizontal',
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    colon: true,
    labelWidth: 130,
  },
  submitOnChange: true,
  schema: [
    {
      component: 'Input',
      fieldName: 'tableName',
      label: $t('codegen.info.tableName'),
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('codegen.info.tableName')}`,
      },
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'packageName',
      label: $t('codegen.info.packageName'),
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('codegen.info.packageName')}`,
      },
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'className',
      label: $t('codegen.info.className'),
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('codegen.info.className')}`,
      },
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'requestName',
      label: $t('codegen.info.requestName'),
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('codegen.info.requestName')}`,
      },
      rules: 'required',
    },
  ],
});

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (open) => {
    if (open) {
      await getTableInfo(writeForm.value?.tableName).then((resp: any) => {
        // TODO valueFormApi.setValues(resp);
      });
    } else {
      drawerApi.setState({ loading: false });
    }
  },
  onConfirm: async () => {
    drawerApi.setState({ loading: true });
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    ElMessage.success($t('system.common.save.success') + values);
    drawerApi.setState({ loading: false }).close();
  },
  onCancel: () => {
    writeForm.value = {};
    drawerApi.setState({ loading: false }).close();
  },
  confirmText: $t('system.common.button.confirm'),
  cancelText: $t('system.common.button.cancel'),
});

const open = (row: any) => {
  writeForm.value = {};
  if (row?.tableName) {
    writeForm.value = row;
    formApi.setValues(row);
  } else {
    formApi.setValues({});
  }
  drawerApi.open();
};
const close = () => drawerApi.close();

defineExpose({ open, close });

const gridOptions: VxeTableGridOptions<any> = {
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    {
      field: 'tableName',
      title: $t('codegen.table.tableName'),
      align: 'left',
    },
    { field: 'tableComment', title: $t('codegen.table.tableComment') },
    { field: 'createTime', title: $t('codegen.table.createTime') },
    { field: 'tableCollation', title: $t('codegen.table.tableCollation') },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('system.common.operation'),
      width: 100,
    },
  ],
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getTablePage({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
        });
      },
    },
  },
  pagerConfig: {
    enabled: false,
  },
  editConfig: {
    mode: 'row',
    trigger: 'click',
  },
};
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});
</script>

<template>
  <Drawer class="w-[60%]" :title="$t('codegen.table.form')">
    <ElCard>
      <template #header>
        <div class="card-header">
          <span>{{ $t('codegen.info.title') }}</span>
        </div>
      </template>
      <Form />
    </ElCard>
    <ElCard style="margin-top: 1%">
      <template #header>
        <div class="card-header">
          <span>{{ $t('codegen.info.value') }}</span>
        </div>
      </template>
      <Grid />
    </ElCard>
  </Drawer>
</template>
