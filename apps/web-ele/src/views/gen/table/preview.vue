<script lang="ts" setup>
import type { TreeNodeData } from 'element-plus';

import { reactive, ref } from 'vue';

import { ColPage, useVbenForm, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElCard, ElMessage, ElTreeV2 as ElTree } from 'element-plus';

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
    ElMessage.success($t('codegen.table.button.generate.result'));
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
    class="w-[100%]"
    :title="$t('codegen.table.form')"
    :destroy-on-close="true"
    :fullscreen="true"
  >
    <ColPage
      auto-content-height
      :description="$t('codegen.preview.value')"
      v-bind="props"
      :title="$t('codegen.preview.title')"
    >
      <!-- left -->
      <template #left="">
        <div>
          <ElTree
            :data="writeForm"
            :height="500"
            :props="defaultProps"
            :expand-on-click-node="false"
            @node-click="nodeClick"
          />
          <Form />
        </div>
      </template>

      <!-- right -->
      <ElCard class="ml-2">
        <div class="flex flex-col gap-2">
          <p>
            {{ rightLabel }}
          </p>
        </div>
      </ElCard>
    </ColPage>
  </Modal>
</template>
