<template>
  <article class="evidence-unit">
    <div class="unit-top">
      <span class="inline-badge">{{ evidence.id }}</span>
      <button class="icon-btn" title="原文回溯" @click="$emit('trace', evidence.id)">
        <ExternalLink :size="15" />
      </button>
    </div>
    <h3>{{ evidence.title }}</h3>
    <p>{{ evidence.journal }}</p>
    <div class="unit-fields">
      <span>证型：{{ evidence.syndrome }}</span>
      <span>治法：{{ evidence.therapy }}</span>
      <span>干预：{{ evidence.intervention }}</span>
      <span>指标：{{ evidence.outcome }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next';
import type { EvidenceUnit } from '../types';

defineProps<{ evidence: EvidenceUnit }>();
defineEmits<{ trace: [id: string] }>();
</script>
