<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElCard, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getColumnsInfo, getTableInfo } from '#/api/gen/table';

const writeForm = ref<Record<string, any>>({});

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

const gridOptions: VxeTableGridOptions<any> = {
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    {
      title: $t('codegen.info.group.column.title'),
      children: [
        {
          title: $t('codegen.info.group.column.database'),
          children: [
            {
              field: 'propColumnName',
              title: $t('codegen.info.propColumnName'),
              align: 'left',
            },
            {
              field: 'propColumnType',
              title: $t('codegen.info.propColumnType'),
            },
            {
              field: 'propColumnComment',
              title: $t('codegen.info.propColumnComment'),
            },
          ],
        },
        {
          title: $t('codegen.info.group.column.java'),
          children: [
            {
              field: 'propJavaEntity',
              title: $t('codegen.info.propJavaEntity'),
            },
            { field: 'propJavaType', title: $t('codegen.info.propJavaType') },
          ],
        },
      ],
    },
    {
      title: $t('codegen.info.group.table'),
      children: [
        { field: 'tableVisible', title: $t('codegen.info.tableVisible') },
        { field: 'tableOrder', title: $t('codegen.info.tableOrder') },
        { field: 'tableFilter', title: $t('codegen.info.tableFilter') },
        {
          field: 'tableFilterComponent',
          title: $t('codegen.info.tableFilterComponent'),
        },
        {
          field: 'tableFilterType',
          title: $t('codegen.info.tableFilterType'),
        },
      ],
    },
    {
      title: $t('codegen.info.group.form'),
      children: [
        {
          field: 'formComponent',
          title: $t('codegen.info.formComponent'),
        },
        {
          field: 'formVisible',
          title: $t('codegen.info.formVisible'),
        },
        {
          field: 'formRequired',
          title: $t('codegen.info.formRequired'),
        },
      ],
    },
    { field: 'propDictId', title: $t('codegen.info.propDictId') },
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
      query: async () => {
        return await getColumnsInfo(await formApi.getValues().id);
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
