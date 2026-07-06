<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { ElButton, ElMessage } from 'element-plus';

import Dict from '#/adapter/component/Dict.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getMenusRecyclePage, restoreById, wipeById } from '#/api/sys/menu';
import { refreshParentSubtree } from './helper';
import MenuForm from './form.vue';

const props = defineProps<{
  gridApi: any;
}>();

const menuFormRef = ref();

interface RowType {
  id: string;
  parentId: null | string;
  name: string;
  permission: string;
  path: string;
  menuType: number;
  deleteStatus?: boolean;
}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    {
      field: 'name',
      title: $t('system.menu.name'),
      align: 'left',
      treeNode: true,
      slots: { default: 'menuName' },
    },
    { field: 'component', title: $t('system.menu.component.label') },
    { field: 'permission', title: $t('system.menu.permission.label') },
    { field: 'path', title: $t('system.menu.path.label') },
    {
      field: 'menuType',
      title: $t('system.menu.menuType.label'),
      slots: { default: 'menuType' },
    },
    { field: 'meta.order', title: $t('system.menu.order'), sortable: true },
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
        return await getMenusRecyclePage({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
        });
      },
    },
  },
  sortConfig: {
    remote: false,
    trigger: 'cell',
    defaultSort: [{ field: 'meta.order', order: 'asc' }],
  },
  pagerConfig: {
    enabled: false,
  },
  editConfig: {
    mode: 'row',
    trigger: 'click',
  },
  treeConfig: {
    parentField: 'parentId',
    rowField: 'id',
    transform: true,
    expandAll: true,
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

const expandAll = () => {
  localGridApi.grid?.setAllTreeExpand(true);
};

const collapseAll = () => {
  localGridApi.grid?.setAllTreeExpand(false);
};

const wipeByIds = (row?: RowType) => {
  const ids: string[] = row
    ? [row.id]
    : localGridApi.grid
        .getCheckboxRecords()
        .filter((item: RowType) => item.deleteStatus)
        .map((item: RowType) => item.id);

  if (ids.length === 0) {
    ElMessage.warning($t('system.common.delete.warning'));
    return;
  }

  confirm({
    content: $t('system.common.delete.confirm'),
    icon: 'error',
  }).then(async () => {
    try {
      await wipeById(ids);
      await localGridApi.reload();
      ElMessage.success($t('system.common.delete.success'));
    } catch {
      ElMessage.error($t('system.common.delete.error'));
    }
  });
};

const restoreByIds = (row?: RowType) => {
  const ids: string[] = row
    ? [row.id]
    : localGridApi.grid
        .getCheckboxRecords()
        .filter((item: RowType) => item.deleteStatus)
        .map((item: RowType) => item.id);

  if (ids.length === 0) {
    ElMessage.warning($t('system.common.restore.warning'));
    return;
  }

  confirm({
    content: $t('system.common.restore.confirm'),
    icon: 'error',
  }).then(async () => {
    try {
      const targetRow = row || localGridApi.grid.getCheckboxRecords()[0];
      await restoreById(ids);
      await localGridApi.reload();
      await refreshParentSubtree(props.gridApi, targetRow?.parentId);
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
  <Modal class="w-[65%]" :title="$t('system.common.alert.recycle')">
    <Grid>
      <template #menuType="{ row }">
        <Dict dict-key="menu_types" :value="row.menuType" />
      </template>
      <template #menuName="{ row }">
        <div class="flex w-full items-center gap-1">
          <div class="size-5 flex-shrink-0">
            <IconifyIcon
              v-if="row.menuType === 3"
              icon="carbon:security"
              class="size-full"
            />
            <IconifyIcon
              v-else-if="row.meta?.icon"
              :icon="row.meta?.icon || 'carbon:circle-dash'"
              class="size-full"
            />
          </div>
          <span class="flex-auto" v-if="row.menuType !== 3">
            {{ $t(row.meta?.title) }}
          </span>
          <span class="flex-auto" v-if="row.menuType === 3">
            {{ $t(row.name) }}
          </span>
          <div class="items-center justify-end"></div>
        </div>
      </template>
      <template #toolbar-tools>
        <ElButton class="mr-2" bg text type="primary" @click="expandAll">
          {{ $t('system.common.button.expand') }}
        </ElButton>
        <ElButton type="primary" bg text @click="collapseAll">
          {{ $t('system.common.button.collapse') }}
        </ElButton>
      </template>
      <template #toolbar-actions>
        <ElButton class="mr-2" bg text type="success" @click="restoreByIds()">
          {{ $t('system.common.button.restore') }}
        </ElButton>
        <ElButton class="mr-2" bg text type="danger" @click="wipeByIds()">
          {{ $t('system.common.button.wipe') }}
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton
          v-if="row.deleteStatus"
          type="success"
          link
          @click="restoreByIds(row)"
        >
          {{ $t('system.common.button.restore') }}
        </ElButton>
        <ElButton
          v-if="row.deleteStatus"
          type="danger"
          link
          @click="wipeByIds(row)"
        >
          {{ $t('system.common.button.wipe') }}
        </ElButton>
      </template>
    </Grid>
    <MenuForm ref="menuFormRef" :grid-api="gridApi" />
  </Modal>
</template>
