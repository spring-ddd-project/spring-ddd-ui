<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElMessage, ElOption, ElSelect, ElSwitch } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { createColumns, getColumnsInfo, updateColumns } from '#/api/gen/table';
import { getAllDict, getItemLabelByDictCode } from '#/api/sys/dict';

import ConfigForm from '../table/config.vue';

const configFormRef = ref();

const writeForm = ref<Record<string, any>>({});

const infoId = ref();
const databaseName = ref();

interface DictItem {
  id: string;
  dictName: string;
}

interface ComponenetItem {
  id: string;
  itemValue: number;
  itemLabel: string;
}

const dictData = ref<DictItem[]>([]);
const componentData = ref<ComponenetItem[]>([]);
const componentTypeData = ref<ComponenetItem[]>([]);
const typescriptData = ref<ComponenetItem[]>([]);

onMounted(() => {
  getComponent(true);
  getComponentType(true);
  getTypeScript(true);
});

interface RowType {
  id: string;
  infoId: string;
  propColumnKey: string;
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
  typescriptType: number;
  formComponent: number;
  formVisible: boolean;
  formRequired: boolean;
  propDictId: string;
}

const gridOptions: VxeTableGridOptions<RowType> = {
  columnConfig: {
    resizable: true,
  },
  rowConfig: {
    isHover: true,
  },
  columns: [
    { title: 'No.', type: 'seq', width: 50, fixed: 'left' },
    { align: 'left', title: '#', type: 'checkbox', width: 50, fixed: 'left' },
    {
      title: $t('codegen.info.group.column.title'),
      children: [
        {
          title: $t('codegen.info.group.column.database'),
          children: [
            {
              field: 'propColumnName',
              title: $t('codegen.info.propColumnName'),
              minWidth: 150,
            },
            {
              field: 'propColumnKey',
              title: $t('codegen.info.propColumnKey'),
              minWidth: 100,
            },
            {
              field: 'propColumnType',
              title: $t('codegen.info.propColumnType'),
              minWidth: 100,
            },
            {
              field: 'propColumnComment',
              title: $t('codegen.info.propColumnComment'),
              minWidth: 100,
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
              minWidth: 150,
            },
            {
              editRender: { name: 'input' },
              field: 'propJavaType',
              title: $t('codegen.info.propJavaType'),
              minWidth: 100,
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
          minWidth: 60,
        },
        {
          field: 'tableOrder',
          title: $t('codegen.info.tableOrder'),
          slots: { default: 'tableOrder' },
          minWidth: 60,
        },
        {
          field: 'tableFilter',
          title: $t('codegen.info.tableFilter'),
          slots: { default: 'tableFilter' },
          minWidth: 60,
        },
        {
          field: 'tableFilterComponent',
          title: $t('codegen.info.tableFilterComponent'),
          slots: { default: 'tableFilterComponent' },
          minWidth: 150,
        },
        {
          field: 'tableFilterType',
          title: $t('codegen.info.tableFilterType'),
          slots: { default: 'tableFilterType' },
          minWidth: 100,
        },
        {
          field: 'typescriptType',
          title: $t('codegen.info.typescriptType'),
          slots: { default: 'typescriptType' },
          minWidth: 150,
        },
      ],
    },
    {
      title: $t('codegen.info.group.form'),
      children: [
        {
          field: 'formComponent',
          title: $t('codegen.info.formComponent'),
          slots: { default: 'formComponent' },
          minWidth: 150,
        },
        {
          field: 'formVisible',
          title: $t('codegen.info.formVisible'),
          slots: { default: 'formVisible' },
          minWidth: 60,
        },
        {
          field: 'formRequired',
          title: $t('codegen.info.formRequired'),
          slots: { default: 'formRequired' },
          minWidth: 100,
        },
      ],
    },
    {
      field: 'propDictId',
      title: $t('codegen.info.propDictId'),
      slots: { default: 'propDictId' },
      fixed: 'right',
      width: 150,
    },
  ],
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async () => {
        return await getColumnsInfo(infoId.value, databaseName.value);
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
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    zoom: true,
  },
};

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (open) => {
    if (!open) {
      drawerApi.setState({ loading: false });
    }
  },
  onConfirm: async () => {
    const data: RowType[] = gridApi.grid.getFullData().map((d) => ({
      ...d,
      infoId: infoId.value,
    }));

    if (data.length === 0) return;
    await (data[0]?.id ? updateColumns(data) : createColumns(data));
    ElMessage.success($t('system.common.save.success'));
    await drawerApi.setState({ loading: false }).close();
  },
  onCancel: () => {
    drawerApi.setState({ loading: false }).close();
  },
  confirmText: $t('system.common.button.confirm'),
  cancelText: $t('system.common.button.cancel'),
});

const open = (row: any, iId: string) => {
  if (row?.tableName) {
    writeForm.value = row;
    infoId.value = iId;
    databaseName.value = row.tableSchema;
  }
  drawerApi.open();
};
const close = () => {
  writeForm.value = {};
  infoId.value = null;
  databaseName.value = null;
  dictData.value = [];
  componentData.value = [];
  componentTypeData.value = [];
  typescriptData.value = [];
  drawerApi.close();
};

defineExpose({ open, close });

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

const getDict = async (e: any) => {
  if (!e) return;
  dictData.value = await getAllDict();
};

const getComponent = async (e: any) => {
  if (!e) return;
  componentData.value = await getItemLabelByDictCode('components');
};

const getTypeScript = async (e: any) => {
  if (!e) return;
  typescriptData.value = await getItemLabelByDictCode('typescript_type');
};

const getComponentType = async (e: any) => {
  if (!e) return;
  componentTypeData.value = await getItemLabelByDictCode('component_type');
};
</script>

<template>
  <Drawer
    class="w-[100%]"
    :title="$t('codegen.table.form')"
    :destroy-on-close="true"
  >
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
      <template #formVisible="{ row }">
        <ElSwitch v-model="row.formVisible" />
      </template>
      <template #formRequired="{ row }">
        <ElSwitch v-model="row.formRequired" />
      </template>
      <template #propDictId="{ row }">
        <ElSelect
          v-model="row.propDictId"
          clearable
          filterable
          @visible-change="getDict"
        >
          <ElOption
            v-for="item in dictData"
            :key="item.id"
            :label="item.dictName"
            :value="item.id"
          />
        </ElSelect>
      </template>
      <template #typescriptType="{ row }">
        <ElSelect
          v-model="row.typescriptType"
          clearable
          filterable
          @visible-change="getTypeScript"
        >
          <ElOption
            v-for="item in typescriptData"
            :key="item.id"
            :label="item.itemLabel"
            :value="item.itemValue"
          />
        </ElSelect>
      </template>
      <template #tableFilterComponent="{ row }">
        <ElSelect
          v-model="row.tableFilterComponent"
          clearable
          filterable
          @visible-change="getComponent"
        >
          <ElOption
            v-for="item in componentData"
            :key="item.id"
            :label="item.itemLabel"
            :value="item.itemValue"
          />
        </ElSelect>
      </template>
      <template #tableFilterType="{ row }">
        <ElSelect
          v-model="row.tableFilterType"
          clearable
          filterable
          @visible-change="getComponentType"
        >
          <ElOption
            v-for="item in componentTypeData"
            :key="item.id"
            :label="item.itemLabel"
            :value="item.itemValue"
          />
        </ElSelect>
      </template>
      <template #formComponent="{ row }">
        <ElSelect
          v-model="row.formComponent"
          clearable
          filterable
          @visible-change="getComponent"
        >
          <ElOption
            v-for="item in componentData"
            :key="item.id"
            :label="item.itemLabel"
            :value="item.itemValue"
          />
        </ElSelect>
      </template>
    </Grid>
    <ConfigForm ref="configFormRef" />
  </Drawer>
</template>
