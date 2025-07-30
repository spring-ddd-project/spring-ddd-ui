<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { getTableInfo } from '#/api/gen/table';

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

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (open) => {
    if (open) {
      await getTableInfo(writeForm.value?.tableName).then((resp: any) => {
        formApi.setValues(resp);
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
</script>

<template>
  <Drawer class="w-[60%]" :title="$t('codegen.table.form')">
    <Form />
  </Drawer>
</template>
