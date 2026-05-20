<script lang="ts" setup>
import { ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { getAllEntitiesApi } from '#/api/sys/column-permission';

const emit = defineEmits<{
  (e: 'confirm', data: any): void;
}>();

function flattenDeptTree(nodes: any[]): Map<number, string> {
  const map = new Map<number, string>();
  const traverse = (list: any[]) => {
    list.forEach((node) => {
      map.set(node.id, node.deptName);
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    });
  };
  traverse(nodes);
  return map;
}

const fetchUsersWithDept = async () => {
  const [{ getUserPage }, { getTree }] = await Promise.all([
    import('#/api/sys/user'),
    import('#/api/sys/dept'),
  ]);
  const [userRes, deptRes] = await Promise.all([
    getUserPage({ pageNum: 1, pageSize: 10_000 }),
    getTree({}),
  ]);
  const items = userRes?.data?.items || [];
  const deptMap = flattenDeptTree(deptRes?.data || []);
  return {
    code: 0,
    data: {
      items: items.map((item: any) => ({
        ...item,
        displayLabel: `${item.username}-${deptMap.get(item.deptId) || '未知部门'}`,
      })),
    },
  };
};

const allEntities = ref<any[]>([]);
const currentEntityColumns = ref<any[]>([]);
const loading = ref(false);

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  layout: 'horizontal',
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    colon: true,
    labelWidth: 120,
  },
  schema: [
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: $t('system.role.allData'), value: 'all' },
          { label: $t('system.dept.title'), value: 'dept' },
          { label: $t('system.user.title'), value: 'user' },
          { label: $t('system.role.selfData'), value: 'self' },
        ],
      },
      fieldName: 'dimensionType',
      label: $t('system.role.dimensionType'),
      rules: 'required',
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        showSearch: true,
        treeNodeFilterProp: 'deptName',
        api: async () => {
          const { getTree } = await import('#/api/sys/dept');
          return getTree({});
        },
        resultField: 'data',
        labelField: 'deptName',
        valueField: 'id',
        childrenField: 'children',
        multiple: true,
        placeholder:
          $t('system.common.placeholder.input') + $t('system.dept.deptName'),
      },
      fieldName: 'dimensionIds',
      label: $t('system.role.specifyDept'),
      dependencies: {
        if: (values) => values.dimensionType === 'dept',
        triggerFields: ['dimensionType'],
      },
    },
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        filterOption: true,
        api: fetchUsersWithDept,
        resultField: 'data.list',
        labelField: 'displayLabel',
        valueField: 'id',
        showSearch: true,
        clearable: true,
        multiple: true,
        placeholder: `${$t('system.common.placeholder.input')} ${$t('system.user.title')}`,
      },
      fieldName: 'dimensionUserIds',
      label: $t('system.role.specifyUser'),
      dependencies: {
        if: (values) => values.dimensionType === 'user',
        triggerFields: ['dimensionType'],
      },
    },
    {
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '对当前登录用户生效',
      },
      fieldName: 'selfPlaceholder',
      label: $t('system.role.selfData'),
      dependencies: {
        if: (values) => values.dimensionType === 'self',
        triggerFields: ['dimensionType'],
      },
    },
    {
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '对所有用户生效',
      },
      fieldName: 'allPlaceholder',
      label: $t('system.role.allData'),
      dependencies: {
        if: (values) => values.dimensionType === 'all',
        triggerFields: ['dimensionType'],
      },
    },
    {
      component: 'Select',
      componentProps: {
        options: [],
        placeholder:
          $t('system.common.placeholder.input') + $t('system.role.scope'),
        onChange: (value: string) => {
          const entity = allEntities.value.find((e) => e.entityCode === value);
          currentEntityColumns.value = entity?.columns || [];
          formApi.setFieldValue('columns', []);
        },
      },
      fieldName: 'entityCode',
      label: $t('system.columnPermission.entityName'),
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        multiple: true,
        options: [],
        placeholder:
          $t('system.common.placeholder.input') +
          $t('system.role.visibleColumns'),
      },
      fieldName: 'columns',
      label: $t('system.role.visibleColumns'),
      rules: 'required',
    },
  ],
});

// 动态加载实体选项到页面 Select
watch(
  () => currentEntityColumns.value,
  (cols) => {
    const options = cols.map((c: any) => ({
      label: `${c.label} (${c.field})`,
      value: c.field,
    }));
    formApi.updateSchema([
      {
        fieldName: 'columns',
        componentProps: {
          options,
        },
      },
    ]);
  },
);

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (isOpen) => {
    if (isOpen) {
      loading.value = true;
      try {
        const res = await getAllEntitiesApi();
        if (res && Array.isArray(res)) {
          allEntities.value = res;
          const entityOptions = res.map((e: any) => ({
            label: e.entityName,
            value: e.entityCode,
          }));
          formApi.updateSchema([
            {
              fieldName: 'entityCode',
              componentProps: {
                options: entityOptions,
              },
            },
          ]);
        }
      } finally {
        loading.value = false;
      }
    }
  },
  onConfirm: () => {
    formApi.validate().then(async (e) => {
      if (e.valid) {
        const values = await formApi.getValues();
        const entity = allEntities.value.find(
          (item) => item.entityCode === values.entityCode,
        );

        let dimensionIds: number[] = [];
        if (values.dimensionType === 'dept') {
          dimensionIds = values.dimensionIds || [];
        } else if (values.dimensionType === 'user') {
          dimensionIds = values.dimensionUserIds || [];
        }

        const rule = {
          dimensionType: values.dimensionType,
          dimensionIds,
          entityCode: values.entityCode,
          entityName: entity?.entityName || values.entityCode,
          columns: values.columns || [],
        };
        emit('confirm', rule);
        modalApi.close();
      } else {
        ElMessage.error($t('system.common.validation.error'));
      }
      await modalApi.setState({ loading: false }).close();
    });
  },
  confirmText: $t('system.common.button.confirm'),
  cancelText: $t('system.common.button.cancel'),
});

const open = (row?: any) => {
  formApi.resetForm();
  currentEntityColumns.value = [];
  if (row) {
    const entity = allEntities.value.find(
      (e) => e.entityCode === row.entityCode,
    );
    currentEntityColumns.value = entity?.columns || [];
    formApi.setValues({
      dimensionType: row.dimensionType || 'all',
      dimensionIds: row.dimensionIds || [],
      dimensionUserIds: row.dimensionIds || [],
      entityCode: row.entityCode,
      columns: row.columns || [],
    });
  }
  modalApi.open();
};
const close = () => modalApi.close();

defineExpose({ open, close });
</script>

<template>
  <Modal class="w-[45%]" :title="$t('system.role.ruleTitle')">
    <Form style="width: auto" />
  </Modal>
</template>
