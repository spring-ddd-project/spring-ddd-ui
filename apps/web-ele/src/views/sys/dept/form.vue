<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { createDept, getTree, updateDept } from '#/api/sys/dept';

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
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        placeholder: 'If left blank, this will be set as the root department.',
        showSearch: true,
        treeNodeFilterProp: 'deptName',
        api: getTree,
        resultField: 'data',
        labelField: 'deptName',
        valueField: 'id',
        childrenField: 'children',
        checkStrictly: true,
      },
      fieldName: 'parentId',
      label: 'Parent Department',
      help: 'Leave blank to make this a root department.',
    },
    {
      component: 'Input',
      fieldName: 'deptName',
      label: 'Department Name',
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
      fieldName: 'deptStatus',
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
          ? updateDept(writeForm.value)
          : createDept(writeForm.value));
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
