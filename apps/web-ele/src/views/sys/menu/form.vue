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
            label: $t('system.menu.menuType.catalog'),
            value: 1,
          },
          {
            label: $t('system.menu.menuType.menu'),
            value: 2,
          },
          {
            label: $t('system.menu.menuType.button'),
            value: 3,
          },
        ],
      },
      defaultValue: 1,
      fieldName: 'menuType',
      label: $t('system.menu.menuType.label'),
      rules: 'required',
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        placeholder: $t('system.menu.parent.placeholder'),
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
      label: $t('system.menu.parent.label'),
      help: $t('system.menu.parent.help'),
    },
    {
      component: 'Input',
      fieldName: 'meta.title',
      label: $t('system.menu.globalTitle'),
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
      label: $t('system.menu.name'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'path',
      label: $t('system.menu.path.label'),
      rules: 'required',
      dependencies: {
        if(values) {
          return values.menuType !== 3;
        },
        triggerFields: ['menuType'],
      },
      help: $t('system.menu.path.help'),
    },
    {
      component: 'Input',
      fieldName: 'component',
      label: $t('system.menu.component.label'),
      dependencies: {
        if(values) {
          return values.menuType === 2;
        },
        triggerFields: ['menuType'],
      },
      help: $t('system.menu.component.help'),
    },
    {
      component: 'Input',
      fieldName: 'redirect',
      label: $t('system.menu.redirect'),
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
      label: $t('system.menu.permission.label'),
      dependencies: {
        if(values) {
          return values.menuType === 3;
        },
        triggerFields: ['menuType'],
      },
      help: $t('system.menu.permission.help'),
    },
    {
      component: 'IconPicker',
      fieldName: 'meta.icon',
      label: $t('system.menu.icon'),
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('system.menu.icon')}`,
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
      label: $t('system.menu.order'),
      rules: 'required',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'meta.affixTab',
      label: $t('system.menu.affix'),
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
      label: $t('system.menu.basicLayout'),
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
      label: $t('system.menu.visible'),
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
      label: $t('system.menu.embedded'),
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
      label: $t('system.menu.status'),
      defaultValue: true,
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  onConfirm: () => {
    formApi.validate().then(async (e) => {
      if (e.valid) {
        Object.assign(writeForm.value, await formApi.getValues());
        writeForm.value.order = writeForm.value.meta?.order;
        writeForm.value.icon = writeForm.value.meta?.icon;
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
    formApi.resetForm();
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
