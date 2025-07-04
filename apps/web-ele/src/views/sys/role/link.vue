<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { ElMessage, ElTreeV2 } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { create, getMenuTreeWithPermission, update } from '#/api/sys/menu/menu';

const writeForm = ref<Record<string, any>>({});
const treeData = ref<any>([]);
const defaultProps = {
  children: 'children',
  label: 'name',
};

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
        api: getMenuTreeWithPermission,
        resultField: 'data',
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
        multiple: true,
        showCheckBox: true,
      },
      fieldName: 'parentId',
      label: 'Parent Menu',
    },
  ],
});

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: (open) => {
    if (open) {
      drawerApi.setState({ loading: true });
      getMenuTreeWithPermission().then((resp: any) => {
        treeData.value = resp;
      });
    }
  },
  onConfirm: () => {
    formApi.validate().then(async (e) => {
      drawerApi.setState({ loading: true });
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
      await drawerApi.setState({ loading: false }).close();
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
  drawerApi.open();
};
const close = () => drawerApi.close();

defineExpose({ open, close });
</script>

<template>
  <Drawer class="w-[600px]" title="Granting Permission">
    <!--    <Form style="width: auto" />-->
    <ElTreeV2
      :data="treeData"
      show-checkbox
      node-key="id"
      default-expand-all
      :props="defaultProps"
    />
  </Drawer>
</template>
