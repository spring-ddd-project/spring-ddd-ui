<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { useAccess } from '@vben/access';
import { confirm, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElButton, ElMessage } from 'element-plus';

import Dict from '#/adapter/component/Dict.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getRoleRecyclePage,
  restoreRoleById,
  wipeRoleById,
} from '#/api/sys/role';

const props = defineProps<{
  gridApi: any;
}>();

const { hasAccessByCodes } = useAccess();

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
      width: 120,
    },
  ],
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getRoleRecyclePage({
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

const [Grid, localGridApi] = useVbenVxeGrid({
  gridOptions,
});

const deleteByIds = (row?: RowType) => {
  const ids: string[] = row
    ? [row.id]
    : localGridApi.grid.getCheckboxRecords().map((item) => item.id);

  if (ids.length === 0) {
    ElMessage.warning($t('system.common.delete.warning'));
    return;
  }

  confirm({
    content: $t('system.common.delete.confirm'),
    icon: 'error',
  }).then(async () => {
    try {
      await wipeRoleById(ids);
      await localGridApi.reload();
      ElMessage.success($t('system.common.delete.success'));
    } catch {
      ElMessage.error($t('system.common.delete.error'));
    }
  });
};

const restoreRoleByIds = (row?: RowType) => {
  const ids: string[] = row
    ? [row.id]
    : localGridApi.grid.getCheckboxRecords().map((item) => item.id);

  if (ids.length === 0) {
    ElMessage.warning($t('system.common.restore.warning'));
    return;
  }

  confirm({
    content: $t('system.common.restore.confirm'),
    icon: 'error',
  }).then(async () => {
    try {
      await restoreRoleById(ids);
      await localGridApi.reload();
      await props.gridApi.reload();
      ElMessage.success($t('system.common.restore.success'));
    } catch {
      ElMessage.error($t('system.common.restore.error'));
    }
  });
};

const [Modal, modalApi] = useVbenModal({
  onClosed: () => {
    modalApi.setData({ loading: false }).close();
  },
  showConfirmButton: false,
  showCancelButton: false,
});

const open = () => {
  modalApi.open();
};
const close = () => modalApi.close();

defineExpose({ open, close });
</script>

<template>
  <Modal class="w-[70%]" :title="$t('system.common.alert.recycle')">
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
          type="success"
          @click="restoreRoleByIds()"
          v-if="hasAccessByCodes(['sys:role:restore'])"
        >
          {{ $t('system.common.button.restore') }}
        </ElButton>
        <ElButton
          class="mr-2"
          bg
          text
          type="danger"
          @click="deleteByIds()"
          v-if="hasAccessByCodes(['sys:role:wipe'])"
        >
          {{ $t('system.common.button.wipe') }}
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton type="success" link @click="restoreRoleByIds(row)">
          {{ $t('system.common.button.restore') }}
        </ElButton>
        <ElButton type="danger" link @click="deleteByIds(row)">
          {{ $t('system.common.button.wipe') }}
        </ElButton>
      </template>
    </Grid>
  </Modal>
</template>
