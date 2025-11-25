<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { createRole, updateRole } from '#/api/sys/role';

import ColumnPermissionModal from './column-permission.vue';

const props = defineProps<{
  gridApi: any;
}>();

const writeForm = ref<Record<string, any>>({});
const columnPermissionRef = ref();

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
      label: $t('system.role.label'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'roleCode',
      label: $t('system.role.code'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'roleDesc',
      label: $t('system.role.desc'),
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        multiple: true,
        options: [
          { label: '部门 (Dept)', value: 'dept' },
          { label: '岗位 (Post)', value: 'post' },
          { label: '用户 (User)', value: 'user' },
          { label: '本人 (Self)', value: 'self' },
        ],
      },
      fieldName: 'dimensions',
      label: '权限维度',
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        api: () => Promise.resolve([]), // Should be replaced with real dept api
        multiple: true,
        placeholder: '请选择部门',
      },
      fieldName: 'deptIds',
      label: '指定部门',
      dependencies: {
        if: (values) => values.dimensions?.includes('dept'),
        triggerFields: ['dimensions'],
      },
    },
    {
      component: 'Select',
      componentProps: {
        multiple: true,
        options: [], // Should be replaced with post options
        placeholder: '请选择岗位',
      },
      fieldName: 'postIds',
      label: '指定岗位',
      dependencies: {
        if: (values) => values.dimensions?.includes('post'),
        triggerFields: ['dimensions'],
      },
    },
    {
      component: 'Select',
      componentProps: {
        multiple: true,
        options: [], // Should be replaced with user options
        placeholder: '请选择用户',
      },
      fieldName: 'userIds',
      label: '指定用户',
      dependencies: {
        if: (values) => values.dimensions?.includes('user'),
        triggerFields: ['dimensions'],
      },
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'ownerStatus',
      label: $t('system.role.owner'),
      defaultValue: false,
      rules: 'required',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'roleStatus',
      label: $t('system.role.status'),
      defaultValue: true,
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  onConfirm: () => {
    formApi.validate().then(async (e) => {
      if (e.valid) {
        const values = await formApi.getValues();
        const dimensions = values.dimensions || [];

        const dataPermission = {
          rowScope: {
            deptIds: dimensions.includes('dept') ? values.deptIds : [],
            postIds: dimensions.includes('post') ? values.postIds : [],
            userIds: dimensions.includes('user') ? values.userIds : [],
            self: dimensions.includes('self'),
          },
          columnRules: writeForm.value.columnRules || [],
        };

        const submitData = {
          ...writeForm.value,
          ...values,
          dataPermission,
          id: writeForm.value.id,
        };

        await (submitData.id ? updateRole(submitData) : createRole(submitData));
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

const openColumnPermission = () => {
  columnPermissionRef.value?.open(writeForm.value.columnRules || []);
};

const onColumnPermissionChange = (data: any[]) => {
  writeForm.value.columnRules = data;
};

const open = (row: any) => {
  if (row?.id) {
    const editRow = { ...row };
    const dp = editRow.dataPermission || {};

    const dimensions: string[] = [];
    if (dp.rowScope?.deptIds?.length > 0) dimensions.push('dept');
    if (dp.rowScope?.postIds?.length > 0) dimensions.push('post');
    if (dp.rowScope?.userIds?.length > 0) dimensions.push('user');
    if (dp.rowScope?.self) dimensions.push('self');

    const formValues = {
      ...editRow,
      dimensions,
      deptIds: dp.rowScope?.deptIds || [],
      postIds: dp.rowScope?.postIds || [],
      userIds: dp.rowScope?.userIds || [],
    };

    writeForm.value = {
      ...editRow,
      columnRules: dp.columnRules || [],
    };
    formApi.setValues(formValues);
  } else {
    writeForm.value = { columnRules: [] };
    formApi.resetForm();
  }
  modalApi.open();
};
const close = () => modalApi.close();

defineExpose({ open, close });
</script>

<template>
  <Modal class="w-[40%]" :title="$t('system.common.alert.form')">
    <Form style="width: auto" />
    <div style="margin-left: 130px; margin-bottom: 20px">
      <ElButton type="primary" @click="openColumnPermission">
        配置列级具体权限
      </ElButton>
      <span
        v-if="writeForm.dataPermission && writeForm.dataPermission.length > 0"
        class="ml-4 text-gray-500"
      >
        (已配置 {{ writeForm.dataPermission.length }} 个业务表限制)
      </span>
      <span v-else class="ml-4 text-sm text-gray-400">
        (默认对所有列拥有完全访问权限)
      </span>
    </div>
  </Modal>
  <ColumnPermissionModal
    ref="columnPermissionRef"
    @change="onColumnPermissionChange"
  />
</template>
