<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, Page } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

import Dict from '#/adapter/component/Dict.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delRoleById, getRolePage } from '#/api/sys/role';

import RoleForm from './form.vue';
import GrantingPermissionsForm from './link.vue';

const roleFormRef = ref();
const grantingPermissionsRef = ref();

interface RowType {
  id: string;
  roleName: string;
  roleCode: string;
  roleDesc: string;
  dataScope: number;
  roleStatus: boolean;
  ownerStatus: boolean;
}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { field: 'roleName', title: 'Role Name', align: 'left', treeNode: true },
    { field: 'roleCode', title: 'Role Code' },
    { field: 'roleDesc', title: 'Role Description' },
    { field: 'dataScope', title: 'Data Scope' },
    { field: 'ownerStatus', title: 'Owner', slots: { default: 'owner' } },
    { field: 'roleStatus', title: 'Role Status', slots: { default: 'status' } },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: 'Operation',
      width: 200,
    },
  ],
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getRolePage({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
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
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

const linkForm = (row: RowType) => {
  grantingPermissionsRef.value?.open(row);
};

const openForm = () => {
  roleFormRef.value?.open();
};

const editRow = (row: RowType) => {
  roleFormRef.value?.open(row);
};

const deleteByIds = (row?: RowType) => {
  const ids: string[] = row
    ? [row.id]
    : gridApi.grid.getCheckboxRecords().map((item) => item.id);

  if (ids.length === 0) {
    ElMessage.warning('Please select at least one item to delete');
    return;
  }

  confirm({
    content: 'Confirm deletion?',
    icon: 'error',
  }).then(async () => {
    try {
      await delRoleById(ids);
      await gridApi.reload();
      ElMessage.success('Deletion successful');
    } catch {
      ElMessage.error('Deletion failed');
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
        <ElButton class="mr-2" bg text type="primary" @click="openForm">
          Add
        </ElButton>
        <ElButton class="mr-2" bg text type="danger" @click="deleteByIds()">
          Delete
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton type="success" link @click="linkForm(row)">
          permissions
        </ElButton>
        <ElButton type="primary" link @click="editRow(row)"> edit </ElButton>
        <ElButton type="danger" link @click="deleteByIds(row)">
          delete
        </ElButton>
      </template>
    </Grid>
    <RoleForm ref="roleFormRef" :grid-api="gridApi" />
    <GrantingPermissionsForm ref="grantingPermissionsRef" />
  </Page>
</template>
