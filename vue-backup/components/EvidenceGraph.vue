<template>
  <section class="graph-shell">
    <div class="graph-toolbar">
      <div>
        <h2><Network :size="20" /> 证型-治法-方药-指标知识图谱</h2>
        <p>点击节点查看关联证据。V1.0 先展示可追溯证据结构，后续可接入后端图谱数据。</p>
      </div>
      <button class="btn-secondary" @click="selectedNode = positionedNodes[0]"><RefreshCw :size="16" /> 重置视图</button>
    </div>

    <div class="graph-canvas">
      <svg class="graph-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line
          v-for="edge in positionedEdges"
          :key="edge.id"
          :x1="edge.source.x"
          :y1="edge.source.y"
          :x2="edge.target.x"
          :y2="edge.target.y"
        />
      </svg>
      <button
        v-for="node in positionedNodes"
        :key="node.id"
        class="graph-node"
        :class="[node.type, { selected: selectedNode?.id === node.id }]"
        :style="{ left: `calc(${node.x}% - ${node.size / 2}px)`, top: `calc(${node.y}% - ${node.size / 2}px)`, width: `${node.size}px`, height: `${node.size}px` }"
        @click="selectedNode = node"
      >
        {{ node.label }}
      </button>
    </div>

    <aside v-if="selectedNode" class="node-detail">
      <div class="mini-badge">{{ selectedNode.type }}</div>
      <h3>{{ selectedNode.label }}</h3>
      <p>关联证据：{{ selectedNode.evidenceIds?.join('、') || '暂无' }}</p>
    </aside>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { Network, RefreshCw } from 'lucide-vue-next';
import type { GraphEdge, GraphNode } from '../types';

type PositionedNode = GraphNode & {
  x: number;
  y: number;
  size: number;
};

const props = defineProps<{
  nodes: GraphNode[];
  edges: GraphEdge[];
}>();

const layout: Record<string, { x: number; y: number; size?: number }> = {
  disease: { x: 47, y: 42, size: 116 },
  stage: { x: 28, y: 42, size: 92 },
  'syndrome-qxtyz': { x: 15, y: 22 },
  'syndrome-qxxy': { x: 16, y: 62 },
  'syndrome-ftzl': { x: 54, y: 68 },
  'therapy-yqhx': { x: 67, y: 20 },
  'therapy-htll': { x: 76, y: 58 },
  'formula-byhwt': { x: 84, y: 28 },
  'formula-nxt': { x: 37, y: 76 },
  'outcome-nihss': { x: 64, y: 43 },
  'outcome-or': { x: 37, y: 17 },
  'study-rct': { x: 86, y: 74 },
};

const selectedNode = ref<PositionedNode | null>(null);

const positionedNodes = computed<PositionedNode[]>(() =>
  props.nodes.map((node, index) => {
    const fallback = {
      x: 18 + (index % 5) * 16,
      y: 18 + Math.floor(index / 5) * 22,
      size: node.type === 'disease' ? 116 : 92,
    };
    const point = layout[node.id] || fallback;
    return { ...node, x: point.x, y: point.y, size: point.size || fallback.size };
  }),
);

const positionedEdges = computed(() =>
  props.edges
    .map((edge) => ({
      ...edge,
      source: positionedNodes.value.find((node) => node.id === edge.source),
      target: positionedNodes.value.find((node) => node.id === edge.target),
    }))
    .filter((edge): edge is GraphEdge & { source: PositionedNode; target: PositionedNode } => Boolean(edge.source && edge.target)),
);

watchEffect(() => {
  if (!selectedNode.value && positionedNodes.value.length) {
    selectedNode.value = positionedNodes.value[0];
  }
});
</script>
