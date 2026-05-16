<script lang="ts" setup>
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';

import { useAccess } from '@vben/access';
import { confirm, Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElButton, ElMessage } from 'element-plus';

import Dict from '#/adapter/component/Dict.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delRoleById, getRolePage } from '#/api/sys/role';
import { useColumnPermission } from '#/composables/useColumnPermission';

import RoleForm from './form.vue';
import GrantingPermissionsForm from './link.vue';
import RoleRecycleForm from './recycle.vue';

const { hasAccessByCodes } = useAccess();
const roleFormRef = ref();
const grantingPermissionsRef = ref();
const roleRecycleRef = ref();

const { applyColumnPermission, loadMetadata } = useColumnPermission('sys_role');

interface RowType {
  id: string;
  roleName: string;
  roleCode: string;
  roleDesc: string;
  dataScope: number;
  roleStatus: boolean;
  ownerStatus: boolean;
}

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('system.role.label')}`,
      },
      fieldName: 'roleName',
      label: $t('system.role.label'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('system.role.code')}`,
      },
      fieldName: 'roleCode',
      label: $t('system.role.code'),
    },
  ],
  showCollapseButton: true,
  submitButtonOptions: {
    content: $t('system.common.button.search'),
  },
  resetButtonOptions: {
    content: $t('system.common.button.reset'),
  },
  submitOnChange: false,
  submitOnEnter: true,
};

const allColumns = [
  { title: 'No.', type: 'seq', width: 50 },
  { align: 'left', title: '#', type: 'checkbox', width: 50 },
  {
    field: 'roleName',
    title: $t('system.role.label'),
  },
  { field: 'roleCode', title: $t('system.role.code') },
  { field: 'roleDesc', title: $t('system.role.desc') },
  { field: 'dataScope', title: $t('system.role.scope') },
  {
    field: 'ownerStatus',
    title: $t('system.role.owner'),
    slots: { default: 'ownerStatus' },
  },
  {
    field: 'roleStatus',
    title: $t('system.role.status'),
    slots: { default: 'roleStatus' },
  },
  {
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: $t('system.common.operation'),
    width: 300,
  },
];

const gridOptions: VxeTableGridOptions<RowType> = {
  columns: allColumns,
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getRolePage({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  editConfig: {
    mode: 'row',
    trigger: 'click',
  },
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    zoom: true,
    search: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
});

onMounted(async () => {
  await loadMetadata();
  const filtered = applyColumnPermission(allColumns);
  gridApi.setState({ columns: filtered });
});

const openRecycleForm = () => {
  roleRecycleRef.value?.open();
};

const openForm = () => {
  roleFormRef.value?.open();
};

const editRow = (row: RowType) => {
  roleFormRef.value?.open(row);
};

const grantingPermissions = (row: RowType) => {
  grantingPermissionsRef.value?.open(row);
};

const deleteByIds = (row?: RowType) => {
  const ids: string[] = row
    ? [row.id]
    : gridApi.grid.getCheckboxRecords().map((item) => item.id);

  if (ids.length === 0) {
    ElMessage.warning($t('system.common.delete.warning'));
    return;
  }

  confirm({
    content: $t('system.common.delete.confirm'),
    icon: 'error',
  }).then(async () => {
    try {
      await delRoleById(ids);
      await gridApi.reload();
      ElMessage.success($t('system.common.delete.success'));
    } catch {
      ElMessage.error($t('system.common.delete.error'));
    }
  });
};
</script>

<template>
  <Page>
    <Grid>
      <template #ownerStatus="{ row }">
        <Dict dict-key="common_status" :value="row.ownerStatus" />
      </template>
      <template #roleStatus="{ row }">
        <Dict dict-key="common_status" :value="row.roleStatus" />
      </template>
      <template #toolbar-actions>
        <ElButton
          class="mr-2"
          bg
          text
          type="primary"
          @click="openForm"
          v-if="hasAccessByCodes(['sys:role:create'])"
        >
          {{ $t('system.common.button.add') }}
        </ElButton>
        <ElButton
          class="mr-2"
          bg
          text
          type="danger"
          @click="deleteByIds()"
          v-if="hasAccessByCodes(['sys:role:delete'])"
        >
          {{ $t('system.common.button.delete') }}
        </ElButton>
        <ElButton class="mr-2" bg text type="info" @click="openRecycleForm">
          {{ $t('system.common.button.recycle') }}
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton
          type="primary"
          link
          @click="grantingPermissions(row)"
          v-if="hasAccessByCodes(['sys:role:linkRoleAndMenus'])"
        >
          {{ $t('system.role.grantingPermissions') }}
        </ElButton>
        <ElButton
          type="primary"
          link
          @click="editRow(row)"
          v-if="hasAccessByCodes(['sys:role:update'])"
        >
          {{ $t('system.common.button.edit') }}
        </ElButton>
        <ElButton
          type="danger"
          link
          @click="deleteByIds(row)"
          v-if="hasAccessByCodes(['sys:role:delete'])"
        >
          {{ $t('system.common.button.delete') }}
        </ElButton>
      </template>
    </Grid>
    <RoleForm ref="roleFormRef" :grid-api="gridApi" />
    <GrantingPermissionsForm ref="grantingPermissionsRef" :grid-api="gridApi" />
    <RoleRecycleForm ref="roleRecycleRef" :grid-api="gridApi" />
  </Page>
</template>
