<template>
  <section class="panel">
    <div class="panel-header">
      <div class="section-title">
        <FileText :size="18" />
        匹配文献
      </div>
      <span class="mini-badge">{{ literature.length }} 篇</span>
    </div>
    <div v-if="!literature.length" class="empty-state">暂无检索结果，请调整标签后重新检索。</div>
    <button
      v-for="item in literature"
      :key="item.id"
      class="literature-item"
      :class="{ selected: selectedIds.includes(item.id) }"
      @click="$emit('toggle', item.id)"
    >
      <span class="check-box"><Check v-if="selectedIds.includes(item.id)" :size="14" /></span>
      <span class="literature-main">
        <strong>{{ item.id }} · {{ item.title }}</strong>
        <small>{{ item.journal }} · {{ item.year }}</small>
        <span class="tag-row">
          <span v-for="tag in item.tags" :key="tag" class="soft-tag">{{ tag }}</span>
        </span>
      </span>
    </button>
  </section>
</template>

<script setup lang="ts">
import { Check, FileText } from 'lucide-vue-next';
import type { Literature } from '../types';

defineProps<{
  literature: Literature[];
  selectedIds: string[];
}>();

defineEmits<{ toggle: [id: string] }>();
</script>
