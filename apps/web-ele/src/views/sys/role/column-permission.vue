<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

const emit = defineEmits<{
  (e: 'change', data: any[]): void;
}>();

const rowData = ref<any[]>([]);

const gridOptions: VxeTableGridOptions<any> = {
  columns: [
    { title: 'No.', type: 'seq', width: 50 },
    { field: 'entityName', title: '业务实体', width: 150 },
    { field: 'entityCode', title: '实体编码', width: 150 },
    {
      field: 'columns',
      title: '受限列配置',
      slots: { default: 'columns' },
    },
  ],
  data: [],
  keepSource: true,
  editConfig: {
    mode: 'row',
    trigger: 'click',
  },
  toolbarConfig: {
    custom: false,
    export: false,
    refresh: false,
    zoom: false,
    search: false,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

// A mockup of available entities
const availableEntities = [
  {
    entityCode: 'sys_user',
    entityName: '用户管理',
    availableColumns: [
      { label: '手机号 (phone)', value: 'phone' },
      { label: '邮箱 (email)', value: 'email' },
      { label: '性别 (sex)', value: 'sex' },
      { label: '入职日期 (joinDate)', value: 'joinDate' },
    ],
  },
  {
    entityCode: 'sys_role',
    entityName: '角色管理',
    availableColumns: [
      { label: '角色名 (roleName)', value: 'roleName' },
      { label: '角色编码 (roleCode)', value: 'roleCode' },
      { label: '描述 (roleDesc)', value: 'roleDesc' },
    ],
  },
  {
    entityCode: 'sys_dept',
    entityName: '部门管理',
    availableColumns: [
      { label: '部门名称 (deptName)', value: 'deptName' },
      { label: '联系人 (leader)', value: 'leader' },
      { label: '电话 (phone)', value: 'phone' },
    ],
  },
  {
    entityCode: 'sys_post',
    entityName: '岗位管理',
    availableColumns: [
      { label: '岗位名称 (postName)', value: 'postName' },
      { label: '岗位编码 (postCode)', value: 'postCode' },
    ],
  },
  {
    entityCode: 'sys_menu',
    entityName: '菜单管理',
    availableColumns: [
      { label: '路径 (path)', value: 'path' },
      { label: '图标 (icon)', value: 'icon' },
    ],
  },
];

const [Modal, modalApi] = useVbenModal({
  onConfirm: () => {
    // Collect customized data
    const records = gridApi.grid.getTableData().fullData;
    const finalData = records
      .filter((r) => r.columns && r.columns.length > 0)
      .map((r) => ({
        entityCode: r.entityCode,
        entityName: r.entityName,
        columns: r.columns,
      }));
    emit('change', finalData);
    modalApi.close();
  },
  onOpenChange: (isOpen) => {
    if (isOpen) {
      gridApi.grid.loadData(rowData.value);
    }
  },
  confirmText: $t('system.common.button.confirm'),
  cancelText: $t('system.common.button.cancel'),
});

const open = (currentData: any[]) => {
  // Merge currentData with availableEntities
  const existingMap = new Map();
  if (currentData && Array.isArray(currentData)) {
    currentData.forEach((item) =>
      existingMap.set(item.entityCode, item.columns),
    );
  }

  rowData.value = availableEntities.map((entity) => ({
    ...entity,
    columns: existingMap.get(entity.entityCode) || [],
  }));

  modalApi.open();
};

const close = () => modalApi.close();

defineExpose({ open, close });
</script>

<template>
  <Modal class="w-[60%]" title="配置列级数据权限">
    <div class="h-[400px]">
      <Grid>
        <template #columns="{ row }">
          <el-select
            v-model="row.columns"
            multiple
            placeholder="请选择受限字段"
            style="width: 100%"
          >
            <el-option
              v-for="item in row.availableColumns"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </Grid>
    </div>
  </Modal>
</template>
