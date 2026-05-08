<template>
  <div class="page-bg">
    <div class="dashboard">
      <header class="navbar">
        <button class="logo logo-button" @click="activeScreen = 'home'">
          <div class="logo-icon"><Brain :size="22" /></div>
          <div class="logo-text">缺血性脑卒中中医智能证据构建系统</div>
        </button>
        <nav class="nav-links" aria-label="主导航">
          <button
            v-for="item in navItems"
            :key="item.key"
            class="nav-btn"
            :class="{ active: activeScreen === item.key }"
            @click="activeScreen = item.key"
          >
            {{ item.label }}
          </button>
        </nav>
      </header>
      <main>
        <HomeView v-if="activeScreen === 'home'" @navigate="activeScreen = $event" />
        <SearchView v-else-if="activeScreen === 'search'" @navigate="activeScreen = $event" />
        <EditView v-else-if="activeScreen === 'edit'" @navigate="activeScreen = $event" />
        <GraphView v-else-if="activeScreen === 'graph'" @navigate="activeScreen = $event" />
        <SummaryView v-else @navigate="activeScreen = $event" />
      </main>
      <footer class="footer">
        <Database :size="16" />
        共享结构化证据底座（缺血性脑卒中专病库 · 800+核心文献） · 所有生成内容均带可追溯角标
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Brain, Database } from 'lucide-vue-next';
import HomeView from '../views/HomeView.vue';
import SearchView from '../views/SearchView.vue';
import EditView from '../views/EditView.vue';
import GraphView from '../views/GraphView.vue';
import SummaryView from '../views/SummaryView.vue';

type Screen = 'home' | 'search' | 'edit' | 'graph' | 'summary';

const activeScreen = ref<Screen>('home');
const navItems: Array<{ key: Screen; label: string }> = [
  { key: 'home', label: '首页' },
  { key: 'search', label: '证据检索' },
  { key: 'edit', label: '证据链编辑' },
  { key: 'graph', label: '知识图谱' },
  { key: 'summary', label: 'AI摘要' },
];
</script>
