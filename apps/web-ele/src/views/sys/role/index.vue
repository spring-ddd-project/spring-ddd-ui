<script lang="ts" setup>
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useAccess } from '@vben/access';
import { confirm, Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElButton, ElMessage } from 'element-plus';

import Dict from '#/adapter/component/Dict.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delRoleById, getRolePage } from '#/api/sys/role';

import RoleForm from './form.vue';
import GrantingPermissionsForm from './link.vue';
import RoleRecycleForm from './recycle.vue';

const { hasAccessByCodes } = useAccess();
const roleFormRef = ref();
const grantingPermissionsRef = ref();
const roleRecycleRef = ref();

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

const gridOptions: VxeTableGridOptions<RowType> = {
  columns: [
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
      slots: { default: 'owner' },
    },
    {
      field: 'roleStatus',
      title: $t('system.role.status'),
      slots: { default: 'status' },
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('system.common.operation'),
      width: 200,
    },
  ],
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
  treeConfig: {
    parentField: 'parentId',
    rowField: 'id',
    transform: true,
  },
  toolbarConfig: {
    custom: true,
    export: true,
    // import: true,
    refresh: true,
    zoom: true,
    search: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
});

const linkForm = (row: RowType) => {
  grantingPermissionsRef.value?.open(row);
};

const openForm = () => {
  roleFormRef.value?.open();
};

const openRecycleForm = () => {
  roleRecycleRef.value?.open();
};

const editRow = (row: RowType) => {
  roleFormRef.value?.open(row);
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
      <template #owner="{ row }">
        <Dict dict-key="common_status" :value="row.ownerStatus" />
      </template>
      <template #status="{ row }">
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
        <ElButton
          class="mr-2"
          bg
          text
          type="info"
          @click="openRecycleForm"
          v-if="hasAccessByCodes(['sys:role:recycle'])"
        >
          {{ $t('system.common.button.recycle') }}
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton type="success" link @click="linkForm(row)">
          {{ $t('system.common.button.permissions') }}
        </ElButton>
        <ElButton type="primary" link @click="editRow(row)">
          {{ $t('system.common.button.edit') }}
        </ElButton>
        <ElButton type="danger" link @click="deleteByIds(row)">
          {{ $t('system.common.button.delete') }}
        </ElButton>
      </template>
    </Grid>
    <RoleForm ref="roleFormRef" :grid-api="gridApi" />
    <RoleRecycleForm ref="roleRecycleRef" :grid-api="gridApi" />
    <GrantingPermissionsForm ref="grantingPermissionsRef" />
  </Page>
</template>
