<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElButton, ElCard, ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getColumnsInfo,
  getTableInfo,
  getTableInfoPage,
} from '#/api/gen/table';

import ConfigForm from '../table/config.vue';

const configFormRef = ref();

const writeForm = ref<Record<string, any>>({});

interface RowType {
  propValueObject: boolean;
  propColumnKey: boolean;
  propColumnName: string;
  propColumnType: string;
  propColumnComment: string;
  propJavaEntity: string;
  propJavaType: string;
  tableVisible: string;
  tableOrder: boolean;
  tableFilter: boolean;
  tableFilterComponent: number;
  tableFilterType: number;
  formComponent: number;
  formVisible: boolean;
  formRequired: boolean;
  propDictId: string;
}

const gridInfoOptions: VxeTableGridOptions<any> = {
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    {
      field: 'tableName',
      title: $t('codegen.info.tableName'),
      align: 'left',
    },
    {
      field: 'packageName',
      title: $t('codegen.info.packageName'),
    },
    {
      field: 'className',
      title: $t('codegen.info.className'),
    },
    {
      field: 'requestName',
      title: $t('codegen.info.requestName'),
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
      query: async ({ page }) => {
        return await getTableInfoPage({
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
};

const gridOptions: VxeTableGridOptions<RowType> = {
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    { align: 'left', title: '#', type: 'checkbox', width: 50 },
    {
      title: $t('codegen.info.group.column.title'),
      children: [
        {
          title: $t('codegen.info.group.column.database'),
          children: [
            {
              field: 'propColumnName',
              title: $t('codegen.info.propColumnName'),
              align: 'left',
            },
            {
              field: 'propColumnType',
              title: $t('codegen.info.propColumnType'),
            },
            {
              field: 'propColumnComment',
              title: $t('codegen.info.propColumnComment'),
            },
          ],
        },
        {
          title: $t('codegen.info.group.column.java'),
          children: [
            {
              field: 'propJavaEntity',
              title: $t('codegen.info.propJavaEntity'),
            },
            { field: 'propJavaType', title: $t('codegen.info.propJavaType') },
          ],
        },
      ],
    },
    {
      title: $t('codegen.info.group.table'),
      children: [
        { field: 'tableVisible', title: $t('codegen.info.tableVisible') },
        { field: 'tableOrder', title: $t('codegen.info.tableOrder') },
        { field: 'tableFilter', title: $t('codegen.info.tableFilter') },
        {
          field: 'tableFilterComponent',
          title: $t('codegen.info.tableFilterComponent'),
        },
        {
          field: 'tableFilterType',
          title: $t('codegen.info.tableFilterType'),
        },
      ],
    },
    {
      title: $t('codegen.info.group.form'),
      children: [
        {
          field: 'formComponent',
          title: $t('codegen.info.formComponent'),
        },
        {
          field: 'formVisible',
          title: $t('codegen.info.formVisible'),
        },
        {
          field: 'formRequired',
          title: $t('codegen.info.formRequired'),
        },
      ],
    },
    { field: 'propDictId', title: $t('codegen.info.propDictId') },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('system.common.operation'),
      width: 100,
    },
  ],
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async () => {
        return await getColumnsInfo(1);
      },
    },
  },
  pagerConfig: {
    enabled: false,
  },
  editConfig: {
    mode: 'row',
    trigger: 'click',
  },
};

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (open) => {
    if (open) {
      await getTableInfo(writeForm.value?.tableName).then((resp: any) => {
        // TODO valueFormApi.setValues(resp);
      });
    } else {
      drawerApi.setState({ loading: false });
    }
  },
  onConfirm: async () => {
    drawerApi.setState({ loading: true });
    ElMessage.success($t('system.common.save.success'));
    drawerApi.setState({ loading: false }).close();
  },
  onCancel: () => {
    writeForm.value = {};
    drawerApi.setState({ loading: false }).close();
  },
  confirmText: $t('system.common.button.confirm'),
  cancelText: $t('system.common.button.cancel'),
});

const config = (row: RowType) => {
  configFormRef.value?.open(row);
};

const deleteByIds = (row: RowType) => {

};

const open = (row: any) => {
  writeForm.value = {};
  if (row?.tableName) {
    writeForm.value = row;
  } else {
  }
  drawerApi.open();
};
const close = () => drawerApi.close();

defineExpose({ open, close });

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

const [GridInfo, gridInfoApi] = useVbenVxeGrid({
  gridOptions: gridInfoOptions,
});
</script>

<template>
  <Drawer class="w-[60%]" :title="$t('codegen.table.form')">
    <ElCard>
      <GridInfo>
        <template #header>
          <div class="card-header">
            <span>{{ $t('codegen.info.title') }}</span>
          </div>
        </template>
        <template #action="{ row }">
          <ElButton type="warning" link @click="config(row)">
            {{ $t('system.common.button.edit') }}
          </ElButton>
          <ElButton type="danger" link @click="deleteByIds(row)">
            {{ $t('system.common.button.delete') }}
          </ElButton>
        </template>
      </GridInfo>
    </ElCard>
    <ElCard style="margin-top: 1%">
      <template #header>
        <div class="card-header">
          <span>{{ $t('codegen.info.value') }}</span>
        </div>
      </template>
      <Grid />
    </ElCard>
    <ConfigForm ref="configFormRef" />
  </Drawer>
</template>
