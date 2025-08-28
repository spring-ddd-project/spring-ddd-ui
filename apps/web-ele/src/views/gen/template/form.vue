<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElInput, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { createTemplate, updateTemplate } from '#/api/gen/template/';

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
    labelWidth: 130,
  },
  submitOnChange: true,
  schema: [
    {
      component: 'Input',
      fieldName: 'templateName',
      label: $t('codegen.template.name'),
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('codegen.template.name')}`,
      },
      rules: 'required',
    },
    {
      component: 'textarea',
      fieldName: 'templateContent',
      label: $t('codegen.template.content'),
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('codegen.template.content')}`,
      },
      rules: 'required',
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  onConfirm: () => {
    formApi.validate().then(async (e) => {
      if (e.valid) {
        Object.assign(writeForm.value, await formApi.getValues());
        await (writeForm.value.id
          ? updateTemplate(writeForm.value)
          : createTemplate(writeForm.value));
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
  writeForm.value = {};
  if (row?.id) {
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
  <Modal class="w-[40%]" :title="$t('system.common.alert.form')">
    <Form style="width: auto">
      <template #templateContent="slotProps">
        <ElInput v-bind="slotProps" type="textarea" :rows="10" />
      </template>
    </Form>
  </Modal>
</template>
