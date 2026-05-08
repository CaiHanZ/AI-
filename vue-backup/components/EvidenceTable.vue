<template>
  <section class="table-card">
    <div class="card-header">
      <div class="title-section">
        <h2><Link2 :size="20" /> 结构化证据链 · 可编辑模式</h2>
      </div>
      <div class="toolbar">
        <div class="search-box">
          <Search :size="16" />
          <input v-model="keyword" type="text" placeholder="在证据链中快速筛选文献 / 疗效指标..." />
        </div>
        <div class="btn-group">
          <button class="btn-secondary" @click="$emit('add')"><PlusCircle :size="16" /> 新增证据行</button>
          <button class="btn-primary" @click="$emit('save')"><CheckCircle :size="16" /> 确认证据链</button>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table class="evidence-table">
        <thead>
          <tr>
            <th class="handle-col"></th>
            <th>文献ID</th>
            <th>证型</th>
            <th>干预措施</th>
            <th>疗效指标 <span>(关键数值)</span></th>
            <th>研究类型</th>
            <th class="action-col">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredEvidence" :key="item.id">
            <td class="drag-handle"><GripVertical :size="16" /></td>
            <td><span class="inline-badge">{{ item.id }}</span></td>
            <td><input class="table-input" :value="item.syndrome" @input="patch(indexOf(item.id), { syndrome: inputValue($event) })" /></td>
            <td><input class="table-input wide-input" :value="item.intervention" @input="patch(indexOf(item.id), { intervention: inputValue($event) })" /></td>
            <td><input class="table-input wide-input" :value="item.outcome" @input="patch(indexOf(item.id), { outcome: inputValue($event) })" /></td>
            <td><input class="table-input" :value="item.studyType" @input="patch(indexOf(item.id), { studyType: inputValue($event) })" /></td>
            <td class="action-cell">
              <button class="icon-btn" title="上移" :disabled="index === 0" @click="$emit('move', item.id, -1)"><ArrowUp :size="15" /></button>
              <button class="icon-btn" title="下移" :disabled="index === filteredEvidence.length - 1" @click="$emit('move', item.id, 1)"><ArrowDown :size="15" /></button>
              <button class="icon-btn danger" title="删除" @click="$emit('remove', item.id)"><Trash2 :size="15" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer-note inner">
      <GripVertical :size="15" />
      左侧为排序手柄示意；当前版本提供上移/下移、行内编辑、删除和保存。
      <span><CheckCircle :size="15" /> 人机协同 · 证据由您掌控</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowDown, ArrowUp, CheckCircle, GripVertical, Link2, PlusCircle, Search, Trash2 } from 'lucide-vue-next';
import type { EvidenceUnit } from '../types';

const props = defineProps<{ evidence: EvidenceUnit[] }>();
const emit = defineEmits<{
  add: [];
  save: [];
  remove: [id: string];
  move: [id: string, direction: -1 | 1];
  update: [index: number, patch: Partial<EvidenceUnit>];
}>();

const keyword = ref('');
const filteredEvidence = computed(() => {
  const value = keyword.value.trim();
  if (!value) return props.evidence;
  return props.evidence.filter((item) => JSON.stringify(item).includes(value));
});

function indexOf(id: string) {
  return props.evidence.findIndex((item) => item.id === id);
}

function inputValue(event: Event) {
  return (event.target as HTMLInputElement).value;
}

function patch(index: number, payload: Partial<EvidenceUnit>) {
  if (index >= 0) emit('update', index, payload);
}
</script>
