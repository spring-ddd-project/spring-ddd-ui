<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

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
      label: $t('system.dict.item.label'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'itemValue',
      label: $t('system.dict.item.value'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      fieldName: 'sortOrder',
      label: $t('system.dict.order'),
      rules: 'required',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'itemStatus',
      label: $t('system.dict.status'),
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
        ElMessage.success($t('system.common.save.success'));
        props.gridApi.reload({
          dictId: writeForm.value.dictId,
        });
      } else {
        ElMessage.error($t('system.common.validation.error'));
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
    formApi.resetForm();
  }
  drawerApi.open();
};
const close = () => {
  writeForm.value = {};
  formApi.resetForm();
  drawerApi.close();
};

defineExpose({ open, close });
</script>

<template>
  <Drawer class="w-[35%]" :title="$t('system.dict.item.form')">
    <Form style="width: auto" />
  </Drawer>
</template>
