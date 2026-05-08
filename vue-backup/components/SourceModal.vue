<template>
  <div v-if="trace" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <div class="modal-header">
        <h3><FileSearch :size="18" /> 原文回溯 · {{ trace.id }}</h3>
        <button class="icon-btn" @click="$emit('close')"><X :size="18" /></button>
      </div>
      <div class="modal-body">
        <h4>{{ trace.title }}</h4>
        <p class="muted">{{ trace.journal }}</p>
        <div class="detail-grid">
          <div v-for="(value, key) in trace.fields" :key="key" class="detail-field">
            <span>{{ key }}</span>
            <strong>{{ value }}</strong>
          </div>
        </div>
        <div class="source-highlight">
          <Quote :size="18" />
          <span>{{ trace.sourceText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileSearch, Quote, X } from 'lucide-vue-next';
import type { SourceTrace } from '../types';

defineProps<{ trace: SourceTrace | null }>();
defineEmits<{ close: [] }>();
</script>
