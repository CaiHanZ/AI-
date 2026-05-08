<template>
  <section class="filter-panel">
    <div class="section-title">
      <SlidersHorizontal :size="18" />
      标签体系筛选
    </div>
    <div class="filter-grid">
      <label v-for="field in fields" :key="field.key" class="field">
        <span>{{ field.label }}</span>
        <select :value="filters[field.key]" @change="update(field.key, ($event.target as HTMLSelectElement).value)">
          <option v-for="option in field.options" :key="option" :value="option">{{ option || '不限' }}</option>
        </select>
      </label>
    </div>
    <button class="btn-primary wide" :disabled="loading" @click="$emit('search')">
      <Search :size="16" />
      {{ loading ? '检索中...' : '检索匹配文献' }}
    </button>
  </section>
</template>

<script setup lang="ts">
import { Search, SlidersHorizontal } from 'lucide-vue-next';
import type { EvidenceFilter } from '../types';

defineProps<{
  filters: EvidenceFilter;
  loading?: boolean;
}>();

const emit = defineEmits<{
  search: [];
  updateFilter: [key: keyof EvidenceFilter, value: string];
}>();

const fields: Array<{ key: keyof EvidenceFilter; label: string; options: string[] }> = [
  { key: 'stage', label: '病程阶段', options: ['', '急性期', '恢复期', '后遗症期'] },
  { key: 'syndrome', label: '证型', options: ['', '气虚痰瘀证', '气虚血瘀证', '风痰阻络证', '痰瘀互结证'] },
  { key: 'therapy', label: '治法', options: ['', '益气活血', '活血通络', '化痰通络', '醒脑开窍'] },
  { key: 'formula', label: '方药/干预', options: ['', '补阳还五汤', '脑心通胶囊', '化痰通络汤', '醒脑开窍针法'] },
  { key: 'outcome', label: '疗效指标', options: ['', 'NIHSS', 'Barthel', 'Fugl-Meyer', '总有效率'] },
  { key: 'studyType', label: '研究类型', options: ['', 'RCT', '系统综述', 'Meta分析', '队列研究'] },
];

function update(key: keyof EvidenceFilter, value: string) {
  emit('updateFilter', key, value);
}
</script>
