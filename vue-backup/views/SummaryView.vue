<template>
  <div class="page-pad">
    <div v-if="store.notice" class="notice">{{ store.notice }}</div>
    <SummaryGenerator
      :evidence="store.evidenceChain"
      :summary="store.summary"
      :loading="store.loading"
      @generate="store.runSummary"
      @trace="store.openSource"
    />
    <div class="step-actions">
      <button class="btn-secondary" @click="$emit('navigate', 'edit')"><ArrowLeft :size="16" /> 返回编辑</button>
      <button class="btn-outline" @click="$emit('navigate', 'graph')"><Network :size="16" /> 查看图谱</button>
    </div>
  </div>
  <SourceModal :trace="store.sourceTrace" @close="store.closeSource" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ArrowLeft, Network } from 'lucide-vue-next';
import SourceModal from '../components/SourceModal.vue';
import SummaryGenerator from '../components/SummaryGenerator.vue';
import { useEvidenceStore } from '../stores/evidence';

defineEmits<{ navigate: [screen: 'edit' | 'graph'] }>();

const store = useEvidenceStore();

onMounted(async () => {
  if (!store.evidenceChain.length) await store.buildChain();
  if (!store.summary) store.runSummary('summary');
});
</script>
