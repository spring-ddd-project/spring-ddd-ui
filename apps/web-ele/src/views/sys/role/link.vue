<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import { ref } from 'vue';

import { useVbenDrawer, useVbenForm, VbenTree } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { ElMessage, ElOption, ElSelect } from 'element-plus';

import { getMenuTreeWithPermission } from '#/api/sys/menu';
import { linkRoleAndMenus, queryMenusByRoleId } from '#/api/sys/role';
import {
  batchSaveRoleMenuDataScope,
  getRoleMenuDataScopeList,
} from '#/api/sys/roleMenuDataScope';

const writeForm = ref<Record<string, any>>({});
const treeData = ref<any>([]);
const selectedIds = ref<any>([]);
const dataScopeMap = ref<Record<number, number>>({});

const DEFAULT_DATA_SCOPE = 0;

const dataScopeOptions = [
  { label: 'All', value: 0 },
  { label: 'Dept Only', value: 1 },
  { label: 'Dept and Children', value: 2 },
  { label: 'Personal', value: 3 },
  { label: 'Post', value: 4 },
];

const [Form] = useVbenForm({
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'permissions',
      formItemClass: 'items-start',
      label: $t('system.role.permissions'),
      modelPropName: 'modelValue',
    },
  ],
});

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (open) => {
    if (open) {
      dataScopeMap.value = {};
      await getMenuTreeWithPermission().then((resp: any) => {
        treeData.value = resp;
      });
      await queryMenusByRoleId({
        roleId: writeForm.value?.id,
      }).then((resp: any) => {
        selectedIds.value = [
          ...new Set(resp.map((item: any) => String(item.menuId))),
        ];
      });
      await getRoleMenuDataScopeList({
        roleId: writeForm.value?.id,
      }).then((resp: any) => {
        const list = resp?.data || resp || [];
        list.forEach((item: any) => {
          dataScopeMap.value[item.menuId] =
            item.dataScope ?? DEFAULT_DATA_SCOPE;
        });
      });
    } else {
      drawerApi.setState({ loading: false });
    }
  },
  onConfirm: async () => {
    drawerApi.setState({ loading: true });
    const menuIds: string[] = selectedIds.value || [];

    let permissionSaved = false;
    await linkRoleAndMenus({
      roleId: writeForm.value.id,
      menuIds,
    })
      .then(() => {
        permissionSaved = true;
      })
      .catch((error: any) => {
        ElMessage.error(`${$t('system.common.save.error')}: ${error}`);
      });

    const items = menuIds.map((menuId) => ({
      menuId: Number(menuId),
      dataScope: dataScopeMap.value[Number(menuId)] ?? DEFAULT_DATA_SCOPE,
    }));

    await batchSaveRoleMenuDataScope({
      roleId: writeForm.value.id,
      items,
    })
      .then(() => {
        if (permissionSaved) {
          ElMessage.success($t('system.common.save.success'));
        }
      })
      .catch((error: any) => {
        ElMessage.error(`${$t('system.common.save.error')}: ${error}`);
      })
      .finally(async () => {
        drawerApi.setState({ loading: false }).close();
      });
  },
  onCancel: () => {
    drawerApi.setState({ loading: false }).close();
  },
  confirmText: $t('system.common.button.confirm'),
  cancelText: $t('system.common.button.cancel'),
});

const open = (row: any) => {
  treeData.value = [];
  selectedIds.value = [];
  dataScopeMap.value = {};
  if (row?.id) {
    writeForm.value = row;
  }
  drawerApi.open();
};
const close = () => drawerApi.close();

defineExpose({ open, close });

function getNodeClass(node: Recordable<any>) {
  const classes: string[] = [];
  if (node.value?.menuType === 3) {
    node.value.children = null;
  }

  return classes.join(' ');
}

function onDataScopeChange(menuId: number, value: number) {
  dataScopeMap.value[menuId] = value;
}
</script>

<template>
  <Drawer class="w-[45%]" :title="$t('system.common.alert.permissions')">
    <Form>
      <template #permissions="_slotProps">
        <VbenTree
          :tree-data="treeData"
          multiple
          bordered
          :default-expanded-level="2"
          :get-node-class="getNodeClass"
          v-model="selectedIds"
          value-field="id"
          label-field="name"
          icon-field="meta.icon"
        >
          <template #node="{ value }">
            <div class="flex w-full items-center justify-between pr-2">
              <span class="flex items-center gap-2">
                <IconifyIcon v-if="value.meta.icon" :icon="value.meta.icon" />
                {{ value.name }}
              </span>
              <ElSelect
                v-if="value.menuType !== 3"
                :model-value="dataScopeMap[value.id] ?? DEFAULT_DATA_SCOPE"
                :disabled="!selectedIds.includes(String(value.id))"
                size="small"
                style="width: 160px"
                @change="onDataScopeChange(value.id, $event)"
                @click.stop
              >
                <ElOption
                  v-for="opt in dataScopeOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </ElSelect>
            </div>
          </template>
        </VbenTree>
      </template>
    </Form>
  </Drawer>
</template>
