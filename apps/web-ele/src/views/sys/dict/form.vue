<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { createDict, updateDict } from '#/api/sys/dict';

const props = defineProps<{
  gridApi: any;
}>();

const writeForm = ref<Record<string, any>>({});

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  layout: 'horizontal',
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    colon: true,
    labelWidth: 200,
  },
  submitOnChange: true,
  schema: [
    {
      component: 'Input',
      fieldName: 'dictName',
      label: 'Dictionary Name',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'dictCode',
      label: 'Dictionary Code',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      fieldName: 'sortOrder',
      label: 'Order',
      rules: 'required',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'dictStatus',
      label: 'Status',
      defaultValue: true,
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  onConfirm: () => {
    formApi.validate().then(async (e) => {
      if (e.valid) {
        Object.assign(writeForm.value, await formApi.getValues());
        await (writeForm.value.id
          ? updateDict(writeForm.value)
          : createDict(writeForm.value));
        ElMessage.success($t('system.common.save.success'));
        props.gridApi.reload();
      } else {
        ElMessage.error($t('system.common.validation.error'));
      }
      await modalApi.setState({ loading: false }).close();
    });
  },
  confirmText: $t('system.common.button.confirm'),
  cancelText: $t('system.common.button.cancel'),
});

const open = (row: any) => {
  if (row?.id) {
    writeForm.value = row;
    formApi.setValues(row);
  } else {
    writeForm.value = {};
    formApi.setValues({});
  }
  modalApi.open();
};
const close = () => modalApi.close();

defineExpose({ open, close });
</script>

<template>
  <Modal class="w-[65%]" :title="$t('system.common.alert.form')">
    <Form style="width: auto" />
  </Modal>
</template>
