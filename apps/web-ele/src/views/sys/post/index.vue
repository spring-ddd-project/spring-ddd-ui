<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useAccess } from '@vben/access';
import { confirm, Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElButton, ElMessage } from 'element-plus';

import Dict from '#/adapter/component/Dict.vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delPostById, getPostPage } from '#/api/sys/post';

import PostForm from './form.vue';
import PostRecycleForm from './recycle.vue';

const postFormRef = ref();
const postRecycleFormRef = ref();

const { hasAccessByCodes } = useAccess();

interface RowType {
  id: string;
  parentId: null | number;
  postName: string;
  postStatus: string;
}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    {
      field: 'postName',
      title: $t('system.post.postName'),
      align: 'left',
      treeNode: true,
    },
    {
      field: 'postStatus',
      title: $t('system.post.status'),
      slots: { default: 'status' },
    },
    { field: 'sortOrder', title: $t('system.post.order'), sortable: true },
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
        return await getPostPage({
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
  postFormRef.value?.open();
};

const openRecycleForm = () => {
  postRecycleFormRef.value?.open();
};

const editRow = (row: RowType) => {
  postFormRef.value?.open(row);
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
      await delPostById(ids);
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
        <Dict dict-key="common_status" :value="row.postStatus" />
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
          v-if="hasAccessByCodes(['sys:post:create'])"
        >
          {{ $t('system.common.button.add') }}
        </ElButton>
        <ElButton
          class="mr-2"
          bg
          text
          type="danger"
          @click="deleteById()"
          v-if="hasAccessByCodes(['sys:post:delete'])"
        >
          {{ $t('system.common.button.delete') }}
        </ElButton>
        <ElButton
          class="mr-2"
          bg
          text
          type="info"
          @click="openRecycleForm"
          v-if="hasAccessByCodes(['sys:post:recycle'])"
        >
          {{ $t('system.common.button.recycle') }}
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton
          type="primary"
          link
          @click="editRow(row)"
          v-if="hasAccessByCodes(['sys:post:update'])"
        >
          {{ $t('system.common.button.edit') }}
        </ElButton>
        <ElButton
          type="danger"
          link
          @click="deleteById(row)"
          v-if="hasAccessByCodes(['sys:post:delete'])"
        >
          {{ $t('system.common.button.delete') }}
        </ElButton>
      </template>
    </Grid>
    <PostForm ref="postFormRef" :grid-api="gridApi" />
    <PostRecycleForm ref="postRecycleFormRef" :grid-api="gridApi" />
  </Page>
</template>
