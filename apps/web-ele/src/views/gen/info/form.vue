<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
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
      label: $t('system.user.username'),
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('system.user.username')}`,
      },
      rules: 'required',
    },
    {
      component: 'VbenInputPassword',
      fieldName: 'password',
      label: $t('system.user.password'),
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('system.user.password')}`,
      },
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
        placeholder: `${$t('system.common.placeholder.input')} ${$t('system.dept.deptId')}`,
      },
      fieldName: 'deptId',
      label: $t('system.dept.deptId'),
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
      label: $t('system.user.sex'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: $t('system.user.phone'),
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('system.user.phone')}`,
      },
    },
    {
      component: 'Input',
      fieldName: 'avatar',
      label: $t('system.user.avatar'),
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('system.user.avatar')}`,
      },
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: $t('system.user.email'),
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('system.user.email')}`,
      },
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'lockStatus',
      label: $t('system.user.lockStatus'),
      defaultValue: false,
    },
  ],
});

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (open) => {
    if (open) {
      // TODO
    } else {
      drawerApi.setState({ loading: false });
    }
  },
  onConfirm: async () => {
    drawerApi.setState({ loading: true });
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();

    drawerApi.setState({ loading: false }).close();
  },
  onCancel: () => {
    writeForm.value = {};
    drawerApi.setState({ loading: false }).close();
  },
  confirmText: $t('system.common.button.confirm'),
  cancelText: $t('system.common.button.cancel'),
});

const open = (row: any) => {
  writeForm.value = {};
  if (row?.id) {
    writeForm.value = row;
    formApi.setValues(row);
  } else {
    formApi.setValues({});
  }
  drawerApi.open();
};
const close = () => drawerApi.close();

defineExpose({ open, close });
</script>

<template>
  <Drawer class="w-[60%]" :title="$t('system.common.alert.form')">
    <Form style="width: auto" />
  </Drawer>
</template>
