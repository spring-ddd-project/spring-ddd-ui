<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { create, getParentTree } from '#/api/sys/menu';

const props = defineProps<{
  gridApi: any;
}>();

const writeForm = ref();

const menuTreeData = ref();

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  layout: 'horizontal',
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    colon: true,
    labelWidth: 120,
  },
  submitOnChange: true,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
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
      defaultValue: '1',
      fieldName: 'menuType',
      label: 'Menu Type',
      rules: 'required',
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        placeholder: 'please select',
        showSearch: true,
        treeNodeFilterProp: 'name',
        api: getParentTree,
        labelField: 'name',
        valueField: 'id',
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
      dependencies: {
        if(values) {
          return values.menuType !== '3';
        },
        triggerFields: ['menuType'],
      },
    },
    {
      component: 'Input',
      fieldName: 'component',
      label: 'Component',
      dependencies: {
        if(values) {
          return values.menuType === '2';
        },
        triggerFields: ['menuType'],
      },
    },
    {
      component: 'Input',
      fieldName: 'redirect',
      label: 'Redirect',
      dependencies: {
        if(values) {
          return values.menuType === '1';
        },
        triggerFields: ['menuType'],
      },
    },
    {
      component: 'Input',
      fieldName: 'permission',
      label: 'Permission',
      dependencies: {
        if(values) {
          return values.menuType !== '1';
        },
        triggerFields: ['menuType'],
      },
    },
    {
      component: 'IconPicker',
      fieldName: 'icon',
      label: 'Icon',
      componentProps: {
        placeholder: 'Please select an icon',
        allowClear: true,
      },
      rules: 'required',
      dependencies: {
        if(values) {
          return values.menuType !== '3';
        },
        triggerFields: ['menuType'],
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'order',
      label: 'Menu Order',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'affixTab',
      label: 'Affix Tab',
      dependencies: {
        if(values) {
          return values.menuType === '2';
        },
        triggerFields: ['menuType'],
      },
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'noBasicLayout',
      label: 'No Basic Layout',
      dependencies: {
        if(values) {
          return values.menuType === '2';
        },
        triggerFields: ['menuType'],
      },
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'visible',
      label: 'Visible',
      dependencies: {
        if(values) {
          return values.menuType !== '3';
        },
        triggerFields: ['menuType'],
      },
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'embedded',
      label: 'Embedded',
      dependencies: {
        if(values) {
          return values.menuType === '2';
        },
        triggerFields: ['menuType'],
      },
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'menuStatus',
      label: 'MenuStatus',
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
  <Modal class="w-[60%]" title="新增">
    <Form style="width: auto" />
  </Modal>
</template>
