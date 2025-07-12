<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { createItem, updateItem } from '#/api/sys/dict';

const props = defineProps<{
  gridApi: any;
}>();

const writeForm = ref<Record<string, any>>({});

const dictId = ref('');

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  layout: 'horizontal',
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    colon: true,
    labelWidth: 200,
  },
  submitOnChange: true,
  schema: [
    {
      component: 'Input',
      fieldName: 'itemLabel',
      label: 'Item Label',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'itemValue',
      label: 'Item Value',
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
      fieldName: 'itemStatus',
      label: 'Status',
      defaultValue: true,
    },
  ],
});

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: () => {
    formApi.validate().then(async (e) => {
      if (e.valid) {
        Object.assign(writeForm.value, await formApi.getValues());
        writeForm.value.dictId = dictId.value;
        await (writeForm.value.id
          ? updateItem(writeForm.value)
          : createItem(writeForm.value));
        ElMessage.success('Saved successfully');
        props.gridApi.reload({
          dictId: writeForm.value.dictId,
        });
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
    writeForm.value = {};
    dictId.value = row.dictId;
    formApi.setValues({});
  }
  drawerApi.open();
};
const close = () => drawerApi.close();

defineExpose({ open, close });
</script>

<template>
  <Drawer class="w-[35%]" title="Dictionary Item Data handling">
    <Form style="width: auto" />
  </Drawer>
</template>
