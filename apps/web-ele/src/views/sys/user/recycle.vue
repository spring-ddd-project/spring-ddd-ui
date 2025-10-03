<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { useAccess } from '@vben/access';
import { confirm, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElButton, ElMessage } from 'element-plus';

import Dict from '#/adapter/component/Dict.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getRecyclePage, restoreUser, wipeUserById } from '#/api/sys/user';

const props = defineProps<{
  gridApi: any;
}>();

const { hasAccessByCodes } = useAccess();

interface RowType {
  id: string;
  username: string;
  phone: string;
  avatar: string;
  email: string;
  sex: boolean;
  lockStatus: boolean;
}

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
  },
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    { field: 'username', title: $t('system.user.username') },
    { field: 'phone', title: $t('system.user.phone') },
    { field: 'avatar', title: $t('system.user.avatar') },
    { field: 'email', title: $t('system.user.email') },
    { field: 'sex', title: $t('system.user.sex'), slots: { default: 'sex' } },
    {
      field: 'lockStatus',
      title: $t('system.user.lockStatus'),
      slots: { default: 'lockStatus' },
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
      query: async ({ page }) => {
        return await getRecyclePage({
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

const wipeUsers = (row?: RowType) => {
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
    await wipeUserById(ids)
      .then(async () => {
        await localGridApi.reload();
        ElMessage.success($t('system.common.delete.success'));
        await props.gridApi.reload();
      })
      .catch(() => {
        ElMessage.error($t('system.common.delete.error'));
      });
  });
};

const restoreUsers = (row?: RowType) => {
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
      await restoreUser(ids);
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
      <template #sex="{ row }">
        <Dict dict-key="sex_type" :value="row.sex" />
      </template>
      <template #lockStatus="{ row }">
        <Dict dict-key="common_status" :value="row.lockStatus" />
      </template>
      <template #toolbar-actions>
        <ElButton
          class="mr-2"
          bg
          text
          type="success"
          @click="restoreUsers()"
          v-if="hasAccessByCodes(['sys:user:restore'])"
        >
          {{ $t('system.common.button.restore') }}
        </ElButton>
        <ElButton class="mr-2" bg text type="danger" @click="wipeUsers()">
          {{ $t('system.common.button.wipe') }}
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton type="success" link @click="restoreUsers(row)">
          {{ $t('system.common.button.restore') }}
        </ElButton>
        <ElButton
          type="danger"
          link
          @click="wipeUsers(row)"
          v-if="hasAccessByCodes(['sys:user:wipe'])"
        >
          {{ $t('system.common.button.wipe') }}
        </ElButton>
      </template>
    </Grid>
  </Modal>
</template>
