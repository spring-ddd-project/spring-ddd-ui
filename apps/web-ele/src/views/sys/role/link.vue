<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import { ref } from 'vue';

import { useVbenDrawer, useVbenForm, VbenTree } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { ElMessage } from 'element-plus';

import { getMenuTreeWithPermission } from '#/api/sys/menu';
import { linkRoleAndMenus, queryMenusByRoleId } from '#/api/sys/role';

const writeForm = ref<Record<string, any>>({});
const treeData = ref<any>([]);
const selectedTreeData = ref<any>([]);

const [Form, formApi] = useVbenForm({
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
      await getMenuTreeWithPermission().then((resp: any) => {
        treeData.value = resp;
      });
      await queryMenusByRoleId({
        roleId: writeForm.value?.id,
      }).then((resp: any) => {
        selectedTreeData.value = resp.map((item: any) => item.menuId);
        formApi.setValues({
          permissions: selectedTreeData.value,
        });
      });
    } else {
      drawerApi.setState({ loading: false });
    }
  },
  onConfirm: async () => {
    drawerApi.setState({ loading: true });
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    await linkRoleAndMenus({
      roleId: writeForm.value.id,
      menuIds: values.permissions,
    })
      .then(() => {
        ElMessage.success($t('system.common.save.success'));
      })
      .catch((error: any) => {
        ElMessage.error(`${$t('system.common.save.error')}: ${error}`);
      })
      .finally(() => {
        drawerApi.setState({ loading: false }).close();
      });
  },
  onCancel: () => {
    treeData.value = [];
    selectedTreeData.value = [];
    writeForm.value = {};
    drawerApi.setState({ loading: false }).close();
  },
  confirmText: $t('system.common.button.confirm'),
  cancelText: $t('system.common.button.cancel'),
});

const open = (row: any) => {
  treeData.value = [];
  selectedTreeData.value = [];
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
</script>

<template>
  <Drawer class="w-[35%]" :title="$t('system.common.alert.permissions')">
    <Form>
      <template #permissions="slotProps">
        <VbenTree
          :tree-data="treeData"
          multiple
          bordered
          :default-expanded-level="2"
          :get-node-class="getNodeClass"
          v-bind="slotProps"
          value-field="id"
          label-field="name"
          icon-field="meta.icon"
        >
          <template #node="{ value }">
            <IconifyIcon v-if="value.meta.icon" :icon="value.meta.icon" />
            {{ value.name }}
          </template>
        </VbenTree>
      </template>
    </Form>
  </Drawer>
</template>
