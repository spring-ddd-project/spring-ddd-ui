<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { createUser, updateUser } from '#/api/sys/user/';
import { getTree } from '#/api/sys/dept';

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
      fieldName: 'username',
      label: 'User Name',
      rules: 'required',
    },
    {
      component: 'VbenInputPassword',
      fieldName: 'password',
      label: 'Password',
      rules: 'required',
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        showSearch: true,
        treeNodeFilterProp: 'deptName',
        api: getTree,
        resultField: 'data',
        labelField: 'deptName',
        valueField: 'id',
        childrenField: 'children',
        checkStrictly: true,
      },
      fieldName: 'deptId',
      label: 'Department',
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'Male',
            value: true,
          },
          {
            label: 'Female',
            value: false,
          },
        ],
      },
      defaultValue: true,
      fieldName: 'sex',
      label: 'Sex',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: 'Phone',
    },
    {
      component: 'Input',
      fieldName: 'avatar',
      label: 'Avatar',
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: 'Email',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'lockStatus',
      label: 'Lock Status',
      defaultValue: false,
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  onConfirm: () => {
    formApi.validate().then(async (e) => {
      if (e.valid) {
        Object.assign(writeForm.value, await formApi.getValues());
        await (writeForm.value.id
          ? updateUser(writeForm.value)
          : createUser(writeForm.value));
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
  writeForm.value = {};
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
