<script lang="ts" setup>
import type { TreeNodeData } from 'element-plus';

import { reactive, ref } from 'vue';

import { ColPage, useVbenForm, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElCard, ElMessage, ElTree } from 'element-plus';

import { codeDownload } from '#/api/gen/table';

const writeForm = ref();
const rightLabel = ref();

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

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (open) => {
    if (!open) modalApi.setState({ loading: false });
  },
  onConfirm: () => {
    codeDownload().then(() => {
      ElMessage.success($t('codegen.table.button.generate.result'));
    });
    modalApi.setState({ loading: false }).close();
  },
  onCancel: () => {
    writeForm.value = {};
    modalApi.setState({ loading: false }).close();
  },
  confirmText: $t('system.common.button.download'),
  cancelText: $t('system.common.button.cancel'),
});

const defaultProps = {
  children: 'children',
  label: 'label',
};

const nodeClick = (data: TreeNodeData) => {
  rightLabel.value = data.value;
};

const open = (row?: any) => {
  writeForm.value = {};
  if (row) {
    writeForm.value = row;
  }
  modalApi.open();
};

const close = () => {
  formApi.resetForm();
  modalApi.close();
  writeForm.value = {};
  rightLabel.value = '';
};

defineExpose({ open, close });
</script>

<template>
  <Modal
    class="gen-preview-modal w-[100%]"
    :title="$t('codegen.table.form')"
    :destroy-on-close="true"
    :fullscreen="true"
  >
    <ColPage
      :auto-content-height="false"
      :description="$t('codegen.preview.value')"
      v-bind="props"
      :title="$t('codegen.preview.title')"
    >
      <!-- left -->
      <template #left="">
        <div class="flex h-full flex-col overflow-hidden">
          <div class="flex-1 overflow-auto">
            <ElTree
              :data="writeForm"
              :props="defaultProps"
              :expand-on-click-node="true"
              accordion
              node-key="value"
              @node-click="nodeClick"
            />
          </div>
          <Form />
        </div>
      </template>

      <!-- right -->
      <ElCard
        class="ml-2 flex h-full flex-col"
        body-class="flex-1 overflow-auto p-4"
      >
        <div class="font-mono text-sm">
          <pre class="m-0 whitespace-pre-wrap">{{ rightLabel }}</pre>
        </div>
      </ElCard>
    </ColPage>
  </Modal>
</template>

<style>
.gen-preview-modal .relative.min-h-40 {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.gen-preview-modal .relative.min-h-40 > .relative {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.gen-preview-modal .relative.min-h-40 > .relative > .h-full.p-4 {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}
</style>
