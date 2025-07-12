<script setup lang="ts">
import type { EpPropMergeType } from 'element-plus/es/utils';

import { computed, ref, watchEffect } from 'vue';

import { ElTag } from 'element-plus';

import { getItemLabelByDictCodeAndValue } from '#/api/sys/dict/';

const props = defineProps<{
  dictKey: string;
  type?: EpPropMergeType<any, any, any>;
  value: boolean | number;
}>();

const normalizedValue = computed(() => {
  return typeof props.value === 'boolean' ? (props.value ? 1 : 0) : props.value;
});

const label = ref('');

watchEffect(async () => {
  label.value = await getItemLabelByDictCodeAndValue(
    props.dictKey,
    normalizedValue.value,
  );
});
</script>

<template>
  <ElTag :type="type || 'success'">{{ label }}</ElTag>
</template>
