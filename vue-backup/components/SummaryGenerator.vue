<template>
  <section class="generation-container">
    <div class="header-row">
      <div>
        <h2><Bot :size="20" /> 受约束AI生成 · 科研综述</h2>
        <div class="badge-group">
          <span class="mini-badge"><CheckCircle :size="14" /> 基于已确认证据链</span>
          <span class="mini-badge"><Shield :size="14" /> 可溯源 · 可复核</span>
        </div>
      </div>
    </div>

    <div class="evidence-summary">
      <div class="summary-title"><Layers :size="18" /> 当前证据链摘要（{{ evidence.length }}个证据单元）</div>
      <div class="evidence-tags">
        <span v-for="item in evidence" :key="item.id" class="tag">{{ item.id }}: {{ item.syndrome }} | {{ item.formula }} | {{ item.outcome }}</span>
      </div>
    </div>

    <div class="toolbar split">
      <div class="task-selector">
        <button v-for="item in tasks" :key="item.value" class="task-btn" :class="{ active: model === item.value }" @click="model = item.value">
          {{ item.label }}
        </button>
      </div>
      <div class="action-buttons">
        <button class="btn-secondary" :disabled="loading" @click="$emit('generate', model)"><RefreshCw :size="16" /> 重新生成</button>
      </div>
    </div>

    <div class="result-area">
      <div class="result-header">
        <h3><Quote :size="18" /> 生成结果（每段带文献角标）</h3>
        <button class="copy-btn" @click="copyText"><Copy :size="15" /> 复制全文</button>
      </div>
      <p class="generated-text">{{ summary?.content || '请选择生成类型并点击重新生成。' }}</p>
      <div class="ref-list">
        <h4><BookOpen :size="16" /> 参考文献追溯</h4>
        <button v-for="ref in summary?.references || []" :key="ref.id" class="ref-item" @click="$emit('trace', ref.id)">
          <span class="inline-badge">{{ ref.id }}</span>
          <span>{{ ref.title }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BookOpen, Bot, CheckCircle, Copy, Layers, Quote, RefreshCw, Shield } from 'lucide-vue-next';
import type { EvidenceUnit, GeneratedSummary, SummaryTask } from '../types';

defineProps<{
  evidence: EvidenceUnit[];
  summary: GeneratedSummary | null;
  loading?: boolean;
}>();

defineEmits<{
  generate: [task: SummaryTask];
  trace: [id: string];
}>();

const model = ref<SummaryTask>('summary');
const tasks: Array<{ value: SummaryTask; label: string }> = [
  { value: 'summary', label: '综述摘要' },
  { value: 'basis', label: '课题申报证据说明' },
  { value: 'pattern', label: '证型用药规律总结' },
];

function copyText() {
  const text = document.querySelector('.generated-text')?.textContent || '';
  if (text) navigator.clipboard?.writeText(text);
}
</script>
