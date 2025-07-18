<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

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
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'Catalog',
            value: 1,
          },
          {
            label: 'Menu',
            value: 2,
          },
          {
            label: 'Button',
            value: 3,
          },
        ],
      },
      defaultValue: 1,
      fieldName: 'menuType',
      label: 'Menu Type',
      rules: 'required',
    },
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
      fieldName: 'meta.title',
      label: 'Global Title',
      dependencies: {
        if(values) {
          return values.menuType !== 3;
        },
        triggerFields: ['menuType'],
      },
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
          return values.menuType !== 3;
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
          return values.menuType !== 1;
        },
        triggerFields: ['menuType'],
      },
      help: "This corresponds to the index.vue path and also serves as the backend API endpoint. If it's a button, it purely represents a backend endpoint.",
    },
    {
      component: 'Input',
      fieldName: 'redirect',
      label: 'Redirect',
      dependencies: {
        if(values) {
          return values.menuType === 1;
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
          return values.menuType !== 1;
        },
        triggerFields: ['menuType'],
      },
      help: 'Permission keys must be assigned to both the menu index page and any associated buttons.',
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
          return values.menuType !== 3;
        },
        triggerFields: ['menuType'],
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'meta.order',
      label: 'Menu Order',
      rules: 'required',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'meta.affixTab',
      label: 'Affix Tab',
      dependencies: {
        if(values) {
          return values.menuType === 2;
        },
        triggerFields: ['menuType'],
      },
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'meta.noBasicLayout',
      label: 'No Basic Layout',
      dependencies: {
        if(values) {
          return values.menuType === 2;
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
          return values.menuType !== 3;
        },
        triggerFields: ['menuType'],
      },
      defaultValue: true,
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
          return values.menuType === 2;
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
