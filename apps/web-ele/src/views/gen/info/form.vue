<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElCard, ElMessage, ElSwitch } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getColumnsInfo } from '#/api/gen/table';
import { getAllDict } from '#/api/sys/dict';

import ConfigForm from '../table/config.vue';

const configFormRef = ref();

const writeForm = ref<Record<string, any>>({});

const infoId = ref();

interface RowType {
  id: string;
  infoId: string;
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
              editRender: { name: 'input' },
              field: 'propJavaEntity',
              title: $t('codegen.info.propJavaEntity'),
            },
            {
              editRender: { name: 'input' },
              field: 'propJavaType',
              title: $t('codegen.info.propJavaType'),
            },
          ],
        },
      ],
    },
    {
      title: $t('codegen.info.group.table'),
      children: [
        {
          field: 'tableVisible',
          title: $t('codegen.info.tableVisible'),
          slots: { default: 'tableVisible' },
        },
        {
          field: 'tableOrder',
          title: $t('codegen.info.tableOrder'),
          slots: { default: 'tableOrder' },
        },
        {
          field: 'tableFilter',
          title: $t('codegen.info.tableFilter'),
          slots: { default: 'tableFilter' },
        },
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
    {
      field: 'propDictId',
      title: $t('codegen.info.propDictId'),
      editRender: {
        name: 'VxeSelect',
        props: {
          clearable: true,
          filterable: true,
          remote: true,
          remoteConfig: {
            enabled: true,
            autoLoad: true,
            queryMethod: getAllDict,
          },
          labelField: 'dictName',
          valueField: 'id',
        },
      },
    },
  ],
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async () => {
        return await getColumnsInfo(infoId.value);
      },
    },
  },
  pagerConfig: {
    enabled: false,
  },
  editConfig: {
    mode: 'cell',
    trigger: 'click',
  },
};

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (open) => {
    if (!open) {
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

const open = (row: any, iId: string) => {
  writeForm.value = {};
  if (row?.tableName) {
    writeForm.value = row;
    infoId.value = iId;
  }
  drawerApi.open();
};
const close = () => drawerApi.close();

defineExpose({ open, close });

const [Grid] = useVbenVxeGrid({
  gridOptions,
});
</script>

<template>
  <Drawer class="w-[100%]" :title="$t('codegen.table.form')">
    <ElCard>
      <template #header>
        <div class="card-header">
          <span>{{ $t('codegen.info.title') }}</span>
        </div>
      </template>
    </ElCard>
    <ElCard style="margin-top: 1%">
      <template #header>
        <div class="card-header">
          <span>{{ $t('codegen.info.value') }}</span>
        </div>
      </template>
      <Grid>
        <template #tableVisible="{ row }">
          <ElSwitch v-model="row.tableVisible" />
        </template>
        <template #tableOrder="{ row }">
          <ElSwitch v-model="row.tableOrder" />
        </template>
        <template #tableFilter="{ row }">
          <ElSwitch v-model="row.tableFilter" />
        </template>
      </Grid>
    </ElCard>
    <ConfigForm ref="configFormRef" />
  </Drawer>
</template>
