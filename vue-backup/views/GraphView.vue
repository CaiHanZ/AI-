<template>
  <div class="page-pad">
    <div v-if="store.notice" class="notice">{{ store.notice }}</div>
    <EvidenceGraph :nodes="store.graphNodes" :edges="store.graphEdges" />
    <div class="step-actions">
      <button class="btn-secondary" @click="$emit('navigate', 'edit')"><ArrowLeft :size="16" /> 返回证据链</button>
      <button class="btn-primary" @click="$emit('navigate', 'summary')"><Bot :size="16" /> 生成AI摘要</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ArrowLeft, Bot } from 'lucide-vue-next';
import EvidenceGraph from '../components/EvidenceGraph.vue';
import { useEvidenceStore } from '../stores/evidence';

defineEmits<{ navigate: [screen: 'edit' | 'summary'] }>();

const store = useEvidenceStore();

onMounted(() => {
  store.loadGraph();
});
</script>
