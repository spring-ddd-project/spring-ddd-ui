<script lang="ts" setup>
import { reactive, ref } from 'vue';

import { ColPage, useVbenForm, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElCard, ElTreeV2 as ElTree } from 'element-plus';

const writeForm = ref<Record<string, any>>({});

const props = reactive({
  leftCollapsedWidth: 5,
  leftCollapsible: true,
  leftMaxWidth: 50,
  leftMinWidth: 20,
  leftWidth: 30,
  resizable: true,
  rightWidth: 70,
  splitHandle: true,
  splitLine: true,
});

interface Tree {
  label: string;
  children?: Tree[];
}

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (open) => {
    if (!open) modalApi.setState({ loading: false });
  },
  onConfirm: () => {},
  onCancel: () => {
    writeForm.value = {};
    modalApi.setState({ loading: false }).close();
  },
  confirmText: $t('system.common.button.confirm'),
  cancelText: $t('system.common.button.cancel'),
});

const defaultProps = {
  children: 'children',
  label: 'label',
  id: 'id',
};

/**
 * 打开弹窗时填充树数据
 */
const open = (row?: any) => {
  writeForm.value = {};
  if (row) {
    writeForm.value = row;
    console.log('tree data:', JSON.stringify(writeForm.value));
  }
  modalApi.open();
};

const close = () => {
  formApi.resetForm();
  modalApi.close();
};

defineExpose({ open, close });
</script>

<template>
  <Modal
    class="w-[100%]"
    :title="$t('codegen.table.form')"
    :destroy-on-close="true"
    :fullscreen="true"
  >
    <ColPage
      auto-content-height
      description="ColPage 是一个双列布局组件，支持左侧折叠、拖拽调整宽度等功能。"
      v-bind="props"
      title="ColPage 双列布局组件"
    >
      <!-- 左侧树 -->
      <template #left="">
        <div
          :style="{ minWidth: '200px' }"
          class="border-border bg-card mr-2 rounded-[var(--radius)] border p-2"
        >
          <ElTree
            style="max-width: 600px"
            :data="writeForm"
            :props="defaultProps"
          />
          <Form />
        </div>
      </template>

      <!-- 右侧内容（示例） -->
      <ElCard class="ml-2" title="基本使用">
        <div class="flex flex-col gap-2">
          <p class="font-bold text-red-600">
            这是一个实验性的组件，用法可能会发生变动，也可能最终不会被采用。在其用法正式出现在文档中之前，不建议在生产环境中使用。
          </p>
        </div>
      </ElCard>
    </ColPage>
  </Modal>
</template>
