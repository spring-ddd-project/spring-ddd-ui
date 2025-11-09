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
import { delDictById, getDictPage } from '#/api/sys/dict';

import DictForm from './form.vue';
import ItemIndex from './item/index.vue';
import RecycleForm from './recycle.vue';

const dictFormRef = ref();
const itemIndexRef = ref();
const recycleFormRef = ref();

const { hasAccessByCodes } = useAccess();

interface RowType {
  id: string;
  parentId: null | number;
  deptName: string;
  deptStatus: string;
}

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('system.dict.label')}`,
      },
      fieldName: 'dictName',
      label: $t('system.dict.label'),
      labelWidth: 120,
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: `${$t('system.common.placeholder.input')} ${$t('system.dict.code')}`,
      },
      fieldName: 'dictCode',
      label: $t('system.dict.code'),
      labelWidth: 120,
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
  checkboxConfig: {
    highlight: true,
  },
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    {
      field: 'dictName',
      title: $t('system.dict.label'),
    },
    {
      field: 'dictCode',
      title: $t('system.dict.code'),
    },
    {
      field: 'dictStatus',
      title: $t('system.dict.status'),
      slots: { default: 'status' },
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('system.common.operation'),
      width: 150,
    },
  ],
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getDictPage({
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

const openRecycleForm = () => {
  recycleFormRef.value?.open();
};

const openForm = () => {
  dictFormRef.value?.open();
};

const editRow = (row: RowType) => {
  dictFormRef.value?.open(row);
};

const openItemRow = (row: RowType) => {
  itemIndexRef.value?.open(row);
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
      await delDictById(ids);
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
        <Dict dict-key="common_status" :value="row.dictStatus" />
      </template>
      <template #toolbar-actions>
        <ElButton
          class="mr-2"
          bg
          text
          type="primary"
          @click="openForm"
          v-if="hasAccessByCodes(['sys:dict:create'])"
        >
          {{ $t('system.common.button.add') }}
        </ElButton>
        <ElButton
          class="mr-2"
          bg
          text
          type="danger"
          @click="deleteByIds()"
          v-if="hasAccessByCodes(['sys:dict:delete'])"
        >
          {{ $t('system.common.button.delete') }}
        </ElButton>
        <ElButton
          class="mr-2"
          bg
          text
          type="info"
          @click="openRecycleForm()"
          v-if="hasAccessByCodes(['sys:dict:recycle'])"
        >
          {{ $t('system.common.button.recycle') }}
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton
          type="success"
          link
          @click="openItemRow(row)"
          v-if="hasAccessByCodes(['sys:dict:item:index'])"
        >
          {{ $t('system.common.button.item') }}
        </ElButton>
        <ElButton
          type="primary"
          link
          @click="editRow(row)"
          v-if="hasAccessByCodes(['sys:dict:update'])"
        >
          {{ $t('system.common.button.edit') }}
        </ElButton>
        <ElButton
          type="danger"
          link
          @click="deleteByIds(row)"
          v-if="hasAccessByCodes(['sys:dict:delete'])"
        >
          {{ $t('system.common.button.delete') }}
        </ElButton>
      </template>
    </Grid>
    <DictForm ref="dictFormRef" :grid-api="gridApi" />
    <ItemIndex ref="itemIndexRef" />
    <RecycleForm ref="recycleFormRef" :grid-api="gridApi" />
  </Page>
</template>
