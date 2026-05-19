<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { createRole, updateRole } from '#/api/sys/role';

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
      fieldName: 'roleName',
      label: $t('system.role.label'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'roleCode',
      label: $t('system.role.code'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'roleDesc',
      label: $t('system.role.desc'),
      rules: 'required',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'ownerStatus',
      label: $t('system.role.owner'),
      defaultValue: false,
      rules: 'required',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'roleStatus',
      label: $t('system.role.status'),
      defaultValue: true,
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  onConfirm: () => {
    formApi.validate().then(async (e) => {
      if (e.valid) {
        const values = await formApi.getValues();
        const submitData = {
          ...writeForm.value,
          ...values,
          dataPermission: writeForm.value.dataPermission || null,
          id: writeForm.value.id,
        };

        await (submitData.id ? updateRole(submitData) : createRole(submitData));
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
    const editRow = { ...row };
    writeForm.value = { ...editRow };
    formApi.setValues(editRow);
  } else {
    writeForm.value = {};
    formApi.resetForm();
  }
  modalApi.open();
};
const close = () => modalApi.close();

defineExpose({ open, close });
</script>

<template>
  <Modal class="w-[40%]" :title="$t('system.common.alert.form')">
    <Form style="width: auto" />
  </Modal>
</template>
