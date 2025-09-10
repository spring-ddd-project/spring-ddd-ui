<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { createAggregate, updateAggregate } from '#/api/gen/aggregate';
import { getJaveEntityInfo } from '#/api/gen/table';

const props = defineProps<{
  gridApi: any;
}>();

const writeForm = ref<Record<string, any>>({});
const infoId = ref();
const entityList = ref([]);

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
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        showSearch: true,
        options: entityList.value,
        clearable: true,
        multiple: true,
        placeholder: `${$t('system.common.placeholder.input')} ${$t('codegen.aggregate.objectValue')}`,
      },
      fieldName: 'objectValue',
      label: $t('codegen.aggregate.objectValue'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'objectName',
      label: $t('codegen.aggregate.objectName'),
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('codegen.aggregate.objectName')}`,
      },
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: $t('codegen.aggregate.radio.root'),
            value: 1,
          },
          {
            label: $t('codegen.aggregate.radio.valueObject'),
            value: 2,
          },
          {
            label: $t('codegen.aggregate.radio.extend'),
            value: 3,
          },
          {
            label: $t('codegen.aggregate.radio.mask'),
            value: 4,
          },
        ],
      },
      fieldName: 'objectType',
      label: $t('codegen.aggregate.objectType'),
      rules: 'required',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'hasCreated',
      label: $t('codegen.aggregate.hasCreated'),
      defaultValue: true,
    },
  ],
});

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: () => {
    formApi.validate().then(async (e) => {
      if (e.valid) {
        Object.assign(writeForm.value, await formApi.getValues());
        writeForm.value.infoId = infoId.value;
        writeForm.value.objectValue = JSON.stringify(
          writeForm.value.objectValue,
        );
        await (writeForm.value.id
          ? updateAggregate(writeForm.value)
          : createAggregate(writeForm.value));
        ElMessage.success($t('system.common.save.success'));
        props.gridApi.reload();
      } else {
        ElMessage.error($t('system.common.validation.error'));
      }
      await drawerApi.setState({ loading: false }).close();
    });
  },
  confirmText: $t('system.common.button.confirm'),
  cancelText: $t('system.common.button.cancel'),
});

const open = (row: any, fData: string[]) => {
  if (row?.id) {
    const objectValueArray = (() => {
      try {
        return JSON.parse(row.objectValue);
      } catch {
        return [];
      }
    })();

    writeForm.value = {
      ...row,
      objectValue: objectValueArray,
    };

    infoId.value = row.infoId;
    formApi.setValues(writeForm.value);
  } else {
    infoId.value = row;
    writeForm.value = {};
    formApi.resetForm();
    getEntityInfo(infoId.value, fData);
  }
  drawerApi.open();
};

const close = () => drawerApi.close();

defineExpose({ open, close });

const getEntityInfo = async (infoId: string, fData: string[]) => {
  return await getJaveEntityInfo(infoId).then((resp: any) => {
    const fullEntityList = (entityList.value = resp.map((item: any) => ({
      label: `${item.propJavaEntity} - ${item.propColumnComment}`,
      value: item.propJavaEntity,
    })));

    const excludeValues: Set<any> = new Set(
      fData.flatMap((str) => {
        try {
          return JSON.parse(str) as string[];
        } catch {
          return [];
        }
      }),
    );

    entityList.value = fullEntityList.filter(
      (item: any) => !excludeValues.has(item.value),
    );

    formApi.updateSchema([
      {
        componentProps: {
          options: entityList.value,
        },
        fieldName: 'objectValue',
      },
    ]);
  });
};
</script>

<template>
  <Drawer class="w-[40%]" :title="$t('system.common.alert.form')">
    <Form style="width: auto" />
  </Drawer>
</template>
