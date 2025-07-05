<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage, ElTree as Tree } from 'element-plus';

import { getMenuTreeWithPermission } from '#/api/sys/menu/menu';
import { linkRoleAndMenus, queryMenusByRoleId } from '#/api/sys/role/role';

const writeForm = ref<Record<string, any>>({});
const treeData = ref<any>([]);
const selectedTreeData = ref<any>([]);
const treeRef = ref<any>(null); // TODO get tree data

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
      });
    } else {
      drawerApi.setState({ loading: false });
    }
  },
  onConfirm: async () => {
    drawerApi.setState({ loading: true });
    await linkRoleAndMenus({
      roleId: writeForm.value.id,
      menuIds: writeForm.value.permissions,
    })
      .then(() => {
        ElMessage.success('Saved successfully');
      })
      .catch((error: any) => {
        ElMessage.error(error.message);
      })
      .finally(() => {
        drawerApi.setState({ loading: false }).close();
      });
  },
  onCancel: () => {
    drawerApi.setState({ loading: false }).close();
  },
});

const open = (row: any) => {
  if (row?.id) {
    writeForm.value = row;
  }
  drawerApi.open();
};
const close = () => drawerApi.close();

defineExpose({ open, close });
</script>

<template>
  <Drawer class="w-[35%]" title="Granting Permission">
    <Tree
      :data="treeData"
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checked-keys="selectedTreeData"
      :props="{
        label: (data: any) => data.name,
        children: 'children',
      }"
    />
  </Drawer>
</template>
