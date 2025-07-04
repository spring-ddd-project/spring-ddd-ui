<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import {
  create,
  getMenuTreeWithoutPermission,
  update,
} from '#/api/sys/menu/menu';

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
        showSearch: true,
        treeNodeFilterProp: 'name',
        api: getMenuTreeWithoutPermission,
        resultField: 'data',
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
        multiple: true,
        treeCheckable: true,
        treeDefaultExpandAll: true,
      },
      fieldName: 'parentId',
      label: 'Parent Menu',
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
  <Modal class="w-[65%]" title="Data handling">
    <Form style="width: auto" />
  </Modal>
</template>
