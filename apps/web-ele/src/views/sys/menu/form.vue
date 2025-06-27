<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { create } from '#/api/sys/menu';

const props = defineProps<{
  gridApi: any;
}>();

const writeForm = ref();

const menuTreeData = ref([]);

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  layout: 'horizontal',
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  schema: [
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'Catalog',
            value: '1',
          },
          {
            label: 'Menu',
            value: '2',
          },
          {
            label: 'Button',
            value: '3',
          },
        ],
      },
      fieldName: 'radioGroup',
      label: 'Menu Type',
      rules: 'required',
    },
    {
      component: 'TreeSelect',
      componentProps: {
        allowClear: true,
        placeholder: 'please select',
        showSearch: true,
        treeData: menuTreeData,
        treeNodeFilterProp: 'label',
      },
      fieldName: 'treeSelect',
      label: 'Parent Menu',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'title',
      label: 'Global Title',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: 'Menu Name',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'path',
      label: 'Path',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'component',
      label: 'Component',
    },
    {
      component: 'Input',
      fieldName: 'redirect',
      label: 'Redirect',
    },
    {
      component: 'Input',
      fieldName: 'permission',
      label: 'Permission',
    },
    {
      component: 'InputNumber',
      fieldName: 'order',
      label: 'Menu Order',
    },
    {
      component: 'Select',
      fieldName: 'affixTab',
      label: 'Affix Tab',
      componentProps: {
        filterable: true,
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      },
    },
    {
      component: 'Select',
      fieldName: 'noBasicLayout',
      label: 'No Basic Layout',
      componentProps: {
        filterable: true,
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'createBy',
      label: '创建人',
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  onConfirm: () => {
    formApi.validate().then(async (e) => {
      modalApi.setState({ loading: true });
      if (e.valid) {
        Object.assign(writeForm.value, await formApi.getValues());
        await create(writeForm.value);
        ElMessage.success('保存成功');
        props.gridApi.reload();
      } else {
        ElMessage.error('校验失败');
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
  <Modal class="w-[600px]" title="新增">
    <Form />
  </Modal>
</template>
