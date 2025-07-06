<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { createRole, updateRole } from '#/api/sys/role/role';

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
      label: 'Role Name',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'roleCode',
      label: 'Role Code',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'roleDesc',
      label: 'Role Description',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          {
            label: 'All',
            value: 1,
          },
          {
            label: 'Department',
            value: 2,
          },
        ],
        placeholder: 'Please select the data access scope',
        showSearch: true,
      },
      fieldName: 'roleScope',
      defaultValue: 1,
      label: 'Role Scope',
      rules: 'required',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'ownerStatus',
      label: 'Is Owner',
      defaultValue: false,
      rules: 'required',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'roleStatus',
      label: 'Role Status',
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
          ? updateRole(writeForm.value)
          : createRole(writeForm.value));
        ElMessage.success('Saved successfully');
        props.gridApi.reload();
      } else {
        ElMessage.error('Validation failed');
      }
      await modalApi.setState({ loading: false }).close();
    });
  },
});

const open = (row: any) => {
  if (row?.id) {
    writeForm.value = row;
    formApi.setValues(row);
  } else {
    formApi.setValues({});
  }
  modalApi.open();
};
const close = () => modalApi.close();

defineExpose({ open, close });
</script>

<template>
  <Modal class="w-[40%]" title="Data handling">
    <Form style="width: auto" />
  </Modal>
</template>
