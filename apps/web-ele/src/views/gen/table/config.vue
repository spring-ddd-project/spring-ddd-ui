<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import {
  createTableInfo,
  getTableInfo,
  updateTableInfo,
} from '#/api/gen/table';

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
      disabled: true,
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'databaseName',
      label: $t('codegen.info.databaseName'),
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('codegen.info.databaseName')}`,
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

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (open) => {
    if (open) {
      await getTableInfo(writeForm.value?.tableName).then(async (resp: any) => {
        await formApi.setValues(resp);
        writeForm.value = {};
        Object.assign(writeForm.value, await resp);
      });
    } else {
      modalApi.setState({ loading: false });
    }
  },
  onConfirm: async () => {
    formApi.validate().then(async (e) => {
      if (e.valid) {
        Object.assign(writeForm.value, await formApi.getValues());
        await (writeForm.value.id
          ? updateTableInfo(writeForm.value)
          : createTableInfo(writeForm.value));
        ElMessage.success($t('system.common.save.success'));
      } else {
        ElMessage.error($t('system.common.validation.error'));
      }
      await modalApi.setState({ loading: false }).close();
    });
  },
  onCancel: () => {
    writeForm.value = {};
    modalApi.setState({ loading: false }).close();
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
    formApi.resetForm();
  }
  modalApi.open();
};
const close = () => modalApi.close();

defineExpose({ open, close });
</script>

<template>
  <Modal class="w-[40%]" :title="$t('codegen.table.form')">
    <Form />
  </Modal>
</template>
