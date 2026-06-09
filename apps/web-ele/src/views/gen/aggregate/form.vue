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

const mode = ref<'add' | 'edit'>('add');
const infoId = ref<string>('');
const editData = ref<any>(null);
const usedObjectValues = ref<Set<string>>(new Set());

const parseObjectValue = (val: string): string[] => {
  try {
    return JSON.parse(val) as string[];
  } catch {
    return [];
  }
};

const clear = () => {
  editData.value = null;
  formApi.resetForm();
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
  schema: [
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        showSearch: true,
        options: [],
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

const loadAndFilterEntities = async (id: string, used: Set<string>) => {
  const resp = await getJaveEntityInfo(id);
  const allEntities = resp.map((item: any) => ({
    label: `${item.propJavaEntity} - ${item.propColumnComment}`,
    value: item.propJavaEntity,
  }));
  const filtered = allEntities.filter((item: any) => !used.has(item.value));
  formApi.updateSchema([
    {
      componentProps: {
        options: filtered,
      },
      fieldName: 'objectValue',
    },
  ]);
};

const [Drawer, drawerApi] = useVbenDrawer({
  onOpen: async () => {
    if (!infoId.value) return;
    if (mode.value === 'add') {
      clear();
    }
    await loadAndFilterEntities(infoId.value, usedObjectValues.value);
    if (mode.value === 'edit' && editData.value) {
      formApi.setValues({
        ...editData.value,
        objectValue: parseObjectValue(editData.value.objectValue),
      });
    }
  },
  onClosed: () => {
    clear();
  },
  onConfirm: () => {
    formApi.validate().then(async (e) => {
      if (e.valid) {
        const values = await formApi.getValues();
        const payload: Record<string, any> = {
          ...values,
          infoId: infoId.value,
          objectValue: JSON.stringify(values.objectValue),
        };
        if (mode.value === 'edit' && editData.value?.id) {
          payload.id = editData.value.id;
        }
        await (mode.value === 'edit' && editData.value?.id
          ? updateAggregate(payload)
          : createAggregate(payload));
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

const openAdd = (id: string, usedValues: Set<string>) => {
  mode.value = 'add';
  infoId.value = id;
  usedObjectValues.value = usedValues;
  drawerApi.open();
};

const openEdit = (row: any, usedValues: Set<string>) => {
  mode.value = 'edit';
  infoId.value = row.infoId;
  editData.value = row;
  usedObjectValues.value = usedValues;
  drawerApi.open();
};

defineExpose({ openAdd, openEdit });
</script>

<template>
  <Drawer class="w-[40%]" :title="$t('system.common.alert.form')">
    <Form style="width: auto" />
  </Drawer>
</template>
