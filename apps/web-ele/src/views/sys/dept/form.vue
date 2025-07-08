<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { create, getMenuTreeWithoutPermission, update } from '#/api/sys/menu';

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
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  schema: [
    {
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        placeholder: 'If left blank, this will be set as the root menu.',
        showSearch: true,
        treeNodeFilterProp: 'name',
        api: getMenuTreeWithoutPermission,
        resultField: 'data',
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
        checkStrictly: true,
      },
      fieldName: 'parentId',
      label: 'Parent Menu',
      help: 'Leave blank to make this a root menu.',
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
      modalApi.setState({ loading: true });
      if (e.valid) {
        Object.assign(writeForm.value, await formApi.getValues());
        writeForm.value.order = writeForm.value.meta?.order;
        writeForm.value.title = writeForm.value.meta?.title;
        writeForm.value.affixTab = writeForm.value.meta?.affixTab;
        writeForm.value.noBasicLayout = writeForm.value.meta?.noBasicLayout;
        await (writeForm.value.id
          ? update(writeForm.value)
          : create(writeForm.value));
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
    writeForm.value = {};
    formApi.setValues({});
  }
  modalApi.open();
};
const close = () => modalApi.close();

defineExpose({ open, close });
</script>

<template>
  <Modal class="w-[65%]" title="Data handling">
    <Form style="width: auto" />
  </Modal>
</template>
