<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { getAllRole } from '#/api/sys/role/';
import { linkUserAndRole, queryRolesByUserId } from '#/api/sys/user/';

const writeForm = ref<Record<string, any>>({});

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  layout: 'horizontal',
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    colon: true,
  },
  submitOnChange: true,
  schema: [
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        filterOption: true,
        api: getAllRole,
        showSearch: true,
        labelField: 'roleName',
        valueField: 'id',
        clearable: true,
        multiple: true,
        collapseTagsTooltip: true,
      },
      fieldName: 'roleIds',
      label: 'Roles',
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (isOpen) => {
    if (isOpen) {
      await queryRolesByUserId({
        userId: writeForm.value.id,
      }).then((resp: any) => {
        formApi.setValues({
          roleIds: resp.map((item: any) => item.roleId),
        });
      });
    }
  },
  onConfirm: () => {
    formApi.validate().then(async (e) => {
      if (e.valid) {
        Object.assign(writeForm.value, await formApi.getValues());
        await linkUserAndRole({
          userId: writeForm.value.id,
          roleIds: writeForm.value.roleIds,
        });
        ElMessage.success('Saved successfully');
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
  <Modal class="w-[40%]" title="Assign Roles">
    <Form style="width: auto" />
  </Modal>
</template>
