<template>
  <div class="page-pad">
    <div v-if="store.notice" class="notice">{{ store.notice }}</div>
    <EvidenceTable
      :evidence="store.evidenceChain"
      @add="addEvidence"
      @save="store.saveChain"
      @remove="store.removeEvidence"
      @move="store.moveEvidence"
      @update="store.updateEvidence"
    />
    <div class="step-actions">
      <button class="btn-secondary" @click="$emit('navigate', 'search')"><ArrowLeft :size="16" /> 返回检索</button>
      <button class="btn-outline" @click="$emit('navigate', 'graph')"><Network :size="16" /> 查看知识图谱</button>
      <button class="btn-primary" @click="$emit('navigate', 'summary')"><Bot :size="16" /> 生成受约束摘要</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ArrowLeft, Bot, Network } from 'lucide-vue-next';
import EvidenceTable from '../components/EvidenceTable.vue';
import { useEvidenceStore } from '../stores/evidence';

defineEmits<{ navigate: [screen: 'search' | 'graph' | 'summary'] }>();

const store = useEvidenceStore();

function addEvidence() {
  store.evidenceChain.push({
    id: `NEW-${String(store.evidenceChain.length + 1).padStart(2, '0')}`,
    title: '新增证据单元',
    journal: '待补充',
    syndrome: '待编辑',
    therapy: '待编辑',
    intervention: '待编辑',
    formula: '待编辑',
    outcome: '待编辑',
    studyType: '待编辑',
    sourceText: '请补充原文片段。',
  });
}

onMounted(() => {
  if (!store.evidenceChain.length) store.buildChain();
});
</script>
