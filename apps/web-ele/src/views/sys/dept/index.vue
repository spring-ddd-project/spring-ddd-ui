<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useAccess } from '@vben/access';
import { confirm, Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElButton, ElMessage } from 'element-plus';

import Dict from '#/adapter/component/Dict.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delDeptById, getDeptPage } from '#/api/sys/dept';

import DeptForm from './form.vue';
import DeptRecycleForm from './recycle.vue';

const deptFormRef = ref();
const deptRecycleFormRef = ref();

const { hasAccessByCodes } = useAccess();

interface RowType {
  id: string;
  parentId: null | number;
  deptName: string;
  deptStatus: string;
}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    {
      field: 'deptName',
      title: $t('system.dept.deptName'),
      align: 'left',
      treeNode: true,
    },
    {
      field: 'deptStatus',
      title: $t('system.dept.status'),
      slots: { default: 'status' },
    },
    { field: 'sortOrder', title: $t('system.dept.order'), sortable: true },
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
        return await getDeptPage({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
        });
      },
    },
  },
  sortConfig: {
    remote: false,
    trigger: 'cell',
    defaultSort: [{ field: 'sortOrder', order: 'asc' }],
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

const openForm = () => {
  deptFormRef.value?.open();
};

const openRecycleForm = () => {
  deptRecycleFormRef.value?.open();
};

const editRow = (row: RowType) => {
  deptFormRef.value?.open(row);
};

const expandAll = () => {
  gridApi.grid?.setAllTreeExpand(true);
};

const collapseAll = () => {
  gridApi.grid?.setAllTreeExpand(false);
};

const deleteById = (row?: RowType) => {
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
      await delDeptById(ids);
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
      <template #status="{ row }">
        <Dict dict-key="common_status" :value="row.deptStatus" />
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
        <ElButton
          class="mr-2"
          bg
          text
          type="primary"
          @click="openForm"
          v-if="hasAccessByCodes(['sys:dept:create'])"
        >
          {{ $t('system.common.button.add') }}
        </ElButton>
        <ElButton
          class="mr-2"
          bg
          text
          type="danger"
          @click="deleteById()"
          v-if="hasAccessByCodes(['sys:dept:delete'])"
        >
          {{ $t('system.common.button.delete') }}
        </ElButton>
        <ElButton
          class="mr-2"
          bg
          text
          type="info"
          @click="openRecycleForm"
          v-if="hasAccessByCodes(['sys:dept:recycle'])"
        >
          {{ $t('system.common.button.recycle') }}
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton
          type="primary"
          link
          @click="editRow(row)"
          v-if="hasAccessByCodes(['sys:dept:update'])"
        >
          {{ $t('system.common.button.edit') }}
        </ElButton>
        <ElButton
          type="danger"
          link
          @click="deleteById(row)"
          v-if="hasAccessByCodes(['sys:dept:delete'])"
        >
          {{ $t('system.common.button.delete') }}
        </ElButton>
      </template>
    </Grid>
    <DeptForm ref="deptFormRef" :grid-api="gridApi" />
    <DeptRecycleForm ref="deptRecycleFormRef" :grid-api="gridApi" />
  </Page>
</template>
