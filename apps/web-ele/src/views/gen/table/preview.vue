<script lang="ts" setup>
import type { TreeNodeData } from 'element-plus';

import { computed, reactive, ref } from 'vue';

import { ColPage, useVbenForm, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElCard, ElMessage, ElTree } from 'element-plus';

import { codeDownload } from '#/api/gen/table';

const writeForm = ref();
const rightLabel = ref();
const currentTableName = ref('');

interface PreviewTreeNode {
  label: string;
  value: string;
  children?: PreviewTreeNode[];
}

/**
 * 压缩 src/main/java 下的单 child 包名链，类似 IDEA 的 Compact Empty Middle Packages
 */
function compressTreeNodes(
  nodes: PreviewTreeNode[],
  path: string[] = [],
): PreviewTreeNode[] {
  return nodes.map((node) => {
    const currentPath = [...path, node.label];
    const children = node.children
      ? compressTreeNodes(node.children, currentPath)
      : undefined;

    // 当路径为 src/main/java 时，对其直接子节点压缩包名
    if (isSrcMainJavaPath(currentPath)) {
      return {
        ...node,
        children: children ? compressJavaPackages(children) : undefined,
      };
    }

    return {
      ...node,
      children,
    };
  });
}

function isSrcMainJavaPath(path: string[]): boolean {
  const src = path.at(-3);
  const main = path.at(-2);
  const java = path.at(-1);
  return (
    src?.toLowerCase() === 'src' &&
    main?.toLowerCase() === 'main' &&
    java?.toLowerCase() === 'java'
  );
}

function compressJavaPackages(nodes: PreviewTreeNode[]): PreviewTreeNode[] {
  return nodes.map((node) => {
    const compressed = compressNode(node);
    return {
      ...compressed,
      children: compressed.children
        ? compressJavaPackages(compressed.children)
        : undefined,
    };
  });
}

function compressNode(node: PreviewTreeNode): PreviewTreeNode {
  // 叶子节点（文件）或空目录，不压缩
  if (!node.children || node.children.length === 0) {
    return node;
  }

  // 多个子节点，不压缩
  if (node.children.length !== 1) {
    return node;
  }

  const [onlyChild] = node.children;

  if (!onlyChild) {
    return node;
  }

  // 唯一子节点也是目录，才压缩；如果是文件，保留当前目录层级
  if (onlyChild.children && onlyChild.children.length > 0) {
    return compressNode({
      label: `${node.label}.${onlyChild.label}`,
      value: onlyChild.value,
      children: onlyChild.children,
    });
  }

  return node;
}

const treeData = computed<PreviewTreeNode[]>(() =>
  compressTreeNodes(writeForm.value || []),
);

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
    codeDownload(currentTableName.value).then(() => {
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

const open = (row?: any, tableName?: string) => {
  writeForm.value = {};
  currentTableName.value = tableName || '';
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
              :data="treeData"
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
