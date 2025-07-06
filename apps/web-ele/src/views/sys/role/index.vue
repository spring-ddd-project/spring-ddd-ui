<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, Page } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delRoleById, getRolePage } from '#/api/sys/role/role';

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
}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { field: 'roleName', title: 'Role Name', align: 'left', treeNode: true },
    { field: 'roleCode', title: 'Role Code' },
    { field: 'roleDesc', title: 'Role Description' },
    { field: 'dataScope', title: 'Data Scope' },
    { field: 'ownerStatus', title: 'Owner' },
    { field: 'roleStatus', title: 'Role Status' },
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

const expandAll = () => {
  gridApi.grid?.setAllTreeExpand(true);
};

const collapseAll = () => {
  gridApi.grid?.setAllTreeExpand(false);
};

const deleteById = (row: RowType) => {
  confirm({
    content: 'Confirm deletion?',
    icon: 'error',
  }).then(async () => {
    await delRoleById({
      id: row.id,
    })
      .then(async () => {
        await gridApi.reload();
        ElMessage.success('Deletion successful');
      })
      .catch(() => {
        ElMessage.error('Deletion failed');
      });
  });
};
</script>

<template>
  <Page>
    <div class="vp-raw h-[300px] w-full">
      <Grid>
        <template #toolbar-tools>
          <ElButton class="mr-2" type="primary" @click="expandAll">
            Expand All
          </ElButton>
          <ElButton type="primary" @click="collapseAll"> Collapse All</ElButton>
        </template>
        <template #toolbar-actions>
          <ElButton class="mr-2" type="primary" @click="openForm">
            Add
          </ElButton>
        </template>
        <template #action="{ row }">
          <ElButton type="success" link @click="linkForm(row)">
            Permissions
          </ElButton>
          <ElButton type="primary" link @click="editRow(row)"> Edit </ElButton>
          <ElButton type="danger" link @click="deleteById(row)">
            Delete
          </ElButton>
        </template>
      </Grid>
    </div>
    <RoleForm ref="roleFormRef" :grid-api="gridApi" />
    <GrantingPermissionsForm ref="grantingPermissionsRef" />
  </Page>
</template>
