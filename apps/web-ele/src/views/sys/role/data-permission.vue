<script lang="ts" setup>
import { nextTick, ref } from 'vue';

import { useVbenDrawer, useVbenForm } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { updateRole } from '#/api/sys/role';

import DataPermissionRuleForm from './data-permission-rule-form.vue';

const props = defineProps<{
  gridApi: any;
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

const currentRole = ref<any>({});
const columnRules = ref<any[]>([]);
const ruleFormRef = ref();
const editingIndex = ref<number>(-1);

const [ScopeForm, scopeFormApi] = useVbenForm({
  showDefaultActions: false,
  layout: 'horizontal',
  commonConfig: {
    componentProps: { class: 'w-full' },
    colon: true,
    labelWidth: 120,
  },
  schema: [
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: $t('system.role.allData'), value: 1 },
          { label: $t('system.role.deptData'), value: 2 },
          { label: $t('system.role.deptAndSubData'), value: 3 },
          { label: $t('system.role.selfData'), value: 4 },
          { label: $t('system.role.customData'), value: 5 },
        ],
      },
      fieldName: 'dataScope',
      label: '数据范围',
    },
    {
      component: 'Select',
      componentProps: {
        multiple: true,
        options: [
          { label: $t('system.dept.title'), value: 'dept' },
          { label: $t('system.user.title'), value: 'user' },
          { label: $t('system.role.selfData'), value: 'self' },
        ],
      },
      fieldName: 'dimensions',
      label: '权限维度',
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
      fieldName: 'deptIds',
      label: $t('system.role.specifyDept'),
      dependencies: {
        if: (values) => values.dimensions?.includes('dept'),
        triggerFields: ['dimensions'],
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
      fieldName: 'userIds',
      label: $t('system.role.specifyUser'),
      dependencies: {
        if: (values) => values.dimensions?.includes('user'),
        triggerFields: ['dimensions'],
      },
    },
  ],
});

const gridOptions: any = {
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    {
      field: 'dimensionType',
      title: $t('system.role.dimensionType'),
      width: 120,
      slots: {
        default: ({ row }: any) => {
          const map: Record<string, string> = {
            all: $t('system.role.allData'),
            dept: $t('system.dept.title'),
            user: $t('system.user.title'),
            self: $t('system.role.selfData'),
          };
          return (
            map[row.dimensionType] ||
            row.dimensionType ||
            $t('system.role.allData')
          );
        },
      },
    },
    {
      field: 'dimensionValue',
      title: $t('system.role.dimensionValue'),
      slots: {
        default: ({ row }: any) => {
          if (row.dimensionType === 'self') return $t('system.role.selfData');
          if (row.dimensionType === 'all' || !row.dimensionType)
            return $t('system.role.allData');
          if (row.dimensionIds && row.dimensionIds.length > 0) {
            return row.dimensionIds.join(', ');
          }
          return '-';
        },
      },
    },
    { field: 'entityName', title: '页面', width: 150 },
    {
      field: 'columns',
      title: $t('system.role.visibleColumns'),
      slots: {
        default: ({ row }: any) => {
          const count = row.columns?.length || 0;
          return `${count} 列`;
        },
      },
    },
    {
      field: 'action',
      title: $t('system.common.operation'),
      width: 150,
      slots: { default: 'action' },
    },
  ],
  data: [],
  keepSource: true,
  toolbarConfig: {
    custom: false,
    export: false,
    refresh: false,
    zoom: false,
    search: false,
  },
};

const [Grid, vxeGridApi] = useVbenVxeGrid({ gridOptions });

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: (isOpen) => {
    if (isOpen) {
      const dp = currentRole.value.dataPermission || {};
      const rs = dp.rowScope || {};
      const dimensions: string[] = [];
      if (rs.deptIds?.length > 0) dimensions.push('dept');
      if (rs.userIds?.length > 0) dimensions.push('user');
      if (rs.self) dimensions.push('self');

      scopeFormApi.setValues({
        dataScope: dp.dataScope || currentRole.value.dataScope || 1,
        dimensions,
        deptIds: rs.deptIds || [],
        userIds: rs.userIds || [],
      });

      columnRules.value = dp.columnRules || [];
      nextTick(() => {
        if (vxeGridApi.grid?.loadData) {
          vxeGridApi.grid.loadData(columnRules.value);
        }
      });
    }
  },
  onConfirm: async () => {
    drawerApi.setState({ loading: true });
    try {
      const scopeValues = await scopeFormApi.getValues();
      const dimensions = scopeValues.dimensions || [];

      const dataPermission = {
        dataScope: scopeValues.dataScope,
        rowScope: {
          deptIds: dimensions.includes('dept') ? scopeValues.deptIds : [],
          postIds: [],
          userIds: dimensions.includes('user') ? scopeValues.userIds || [] : [],
          self: dimensions.includes('self'),
        },
        columnRules: columnRules.value,
      };

      const submitData = {
        ...currentRole.value,
        dataScope: scopeValues.dataScope,
        dataPermission,
      };

      await updateRole(submitData);
      ElMessage.success($t('system.common.save.success'));
      props.gridApi.reload();
      drawerApi.close();
    } catch (error: any) {
      ElMessage.error(`${$t('system.common.save.error')}: ${error.message}`);
    } finally {
      drawerApi.setState({ loading: false });
    }
  },
  confirmText: $t('system.common.button.confirm'),
  cancelText: $t('system.common.button.cancel'),
});

const open = (row: any) => {
  currentRole.value = { ...row };
  editingIndex.value = -1;
  drawerApi.open();
};

const openAddRule = () => {
  editingIndex.value = -1;
  ruleFormRef.value?.open();
};

const openEditRule = (row: any, index: number) => {
  editingIndex.value = index;
  ruleFormRef.value?.open(row);
};

const deleteRule = (index: number) => {
  columnRules.value.splice(index, 1);
  if (vxeGridApi.grid?.loadData) {
    vxeGridApi.grid.loadData(columnRules.value);
  }
};

const onRuleConfirm = (rule: any) => {
  if (editingIndex.value >= 0) {
    columnRules.value[editingIndex.value] = rule;
  } else {
    columnRules.value.push(rule);
  }
  if (vxeGridApi.grid?.loadData) {
    vxeGridApi.grid.loadData(columnRules.value);
  }
};

const close = () => drawerApi.close();

defineExpose({ open, close });
</script>

<template>
  <Drawer class="w-[50%]" :title="$t('system.role.dataPermissionDrawerTitle')">
    <div class="mb-6">
      <h3 class="mb-2 text-base font-semibold">
        {{ $t('system.role.rowScope') }}
      </h3>
      <ScopeForm style="width: auto" />
    </div>

    <div class="mb-2 flex items-center justify-between">
      <h3 class="text-base font-semibold">
        {{ $t('system.role.columnRules') }}
      </h3>
      <ElButton type="primary" size="small" @click="openAddRule">
        + {{ $t('system.common.button.add') }}
      </ElButton>
    </div>

    <Grid>
      <template #action="{ row, rowIndex }">
        <ElButton type="primary" link @click="openEditRule(row, rowIndex)">
          {{ $t('system.common.button.edit') }}
        </ElButton>
        <ElButton type="danger" link @click="deleteRule(rowIndex)">
          {{ $t('system.common.button.delete') }}
        </ElButton>
      </template>
    </Grid>

    <DataPermissionRuleForm ref="ruleFormRef" @confirm="onRuleConfirm" />
  </Drawer>
</template>
