<template>
  <div class="workspace-grid">
    <EvidenceFilters :filters="store.filters" :loading="store.loading" @update-filter="store.setFilter" @search="store.runSearch" />
    <LiteratureList :literature="store.literature" :selected-ids="store.selectedLiteratureIds" @toggle="store.toggleLiterature" />
    <section class="panel evidence-preview">
      <div class="panel-header">
        <div class="section-title"><Layers :size="18" /> 结构化证据摘要</div>
        <button class="btn-primary" :disabled="store.loading" @click="goBuild"><ArrowRight :size="16" /> 生成证据链</button>
      </div>
      <div v-if="store.notice" class="notice">{{ store.notice }}</div>
      <div class="unit-grid">
        <EvidenceCard v-for="item in previewEvidence" :key="item.id" :evidence="item" @trace="store.openSource" />
      </div>
    </section>
  </div>
  <SourceModal :trace="store.sourceTrace" @close="store.closeSource" />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { ArrowRight, Layers } from 'lucide-vue-next';
import EvidenceCard from '../components/EvidenceCard.vue';
import EvidenceFilters from '../components/EvidenceFilters.vue';
import LiteratureList from '../components/LiteratureList.vue';
import SourceModal from '../components/SourceModal.vue';
import { fallbackEvidence } from '../data/fallback';
import { useEvidenceStore } from '../stores/evidence';

const store = useEvidenceStore();
const emit = defineEmits<{ navigate: [screen: 'edit'] }>();

const previewEvidence = computed(() => {
  const ids = store.selectedLiteratureIds.length ? store.selectedLiteratureIds : store.literature.map((item) => item.id);
  return fallbackEvidence.filter((item) => ids.includes(item.id)).slice(0, 4);
});

async function goBuild() {
  await store.buildChain();
  emit('navigate', 'edit');
}

onMounted(() => {
  if (!store.literature.length) store.runSearch();
});
</script>
