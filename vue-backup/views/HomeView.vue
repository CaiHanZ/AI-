<template>
  <section class="hero">
    <h1>专家证据工作台 · V1.0</h1>
    <p>围绕缺血性脑卒中中医文献，完成标签检索、证据链编辑、知识图谱查看与受约束AI摘要生成。</p>
    <div class="query-box">
      <input v-model="question" type="text" placeholder="例如：恢复期气虚痰瘀证使用补阳还五汤的疗效如何？" />
      <button class="btn-primary" @click="$emit('navigate', 'search')"><Search :size="16" /> 进入精细工作台</button>
    </div>
    <div class="examples">
      <button v-for="item in examples" :key="item" class="example-chip" @click="question = item">{{ item }}</button>
    </div>
  </section>

  <section class="dual-mode">
    <article class="mode-card">
      <h3><SlidersHorizontal :size="18" /> 精细模式 · 手动全程控制</h3>
      <p>逐层筛选标签、逐篇筛选文献、自由编辑证据链，适合严谨科研场景。</p>
      <ul class="path-list">
        <li><strong>精细路径</strong><span>标签筛选 → 文献列表 → 证据表 → 图谱 → 受约束AI生成</span></li>
        <li><strong>核心优势</strong><span>证据可回溯、可编辑、可复核</span></li>
      </ul>
      <button class="btn-outline" @click="$emit('navigate', 'search')"><Table2 :size="16" /> 开始检索</button>
    </article>
    <article class="mode-card quiet">
      <h3><Bot :size="18" /> 大众问答入口 · 后续版本</h3>
      <p>自然语言一框式问答将作为 V2.0 能力扩展；V1.0 先沉淀可追溯证据底座。</p>
      <ul class="path-list">
        <li><strong>当前状态</strong><span>保留入口概念，不作为主流程实现</span></li>
        <li><strong>演进方向</strong><span>问题解析 → 标签转换 → 证据链推荐 → 专家确认</span></li>
      </ul>
      <span class="btn-outline disabled"><Lock :size="16" /> V2.0 规划</span>
    </article>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Bot, Lock, Search, SlidersHorizontal, Table2 } from 'lucide-vue-next';

defineEmits<{ navigate: [screen: 'search'] }>();

const question = ref('');
const examples = ['气虚血瘀证常用中成药及NIHSS变化', '醒脑开窍针法对 Barthel 指数的影响', '恢复期益气活血法的总有效率 Meta 证据'];
</script>
