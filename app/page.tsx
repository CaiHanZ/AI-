'use client';

import { useMemo, useState } from 'react';
import { initialEvidence, literature } from './data';
import type { EvidenceUnit, Screen } from './types';

const navItems: Array<{ key: Screen; label: string }> = [
  { key: 'home', label: '首页' },
  { key: 'search', label: '证据检索' },
  { key: 'edit', label: '证据链编辑' },
  { key: 'graph', label: '知识图谱' },
  { key: 'summary', label: 'AI摘要' },
];

const graphNodes = [
  { id: 'disease', label: '缺血性脑卒中', type: 'disease', x: 47, y: 42, size: 116, refs: ['RCT-01', 'RCT-02', 'SysRev-03', 'OBS-04'] },
  { id: 'stage', label: '恢复期', type: 'stage', x: 28, y: 42, size: 92, refs: ['RCT-01', 'RCT-02', 'SysRev-03', 'OBS-04'] },
  { id: 's1', label: '气虚痰瘀证', type: 'syndrome', x: 15, y: 22, size: 92, refs: ['RCT-01', 'SysRev-03'] },
  { id: 's2', label: '气虚血瘀证', type: 'syndrome', x: 16, y: 62, size: 92, refs: ['RCT-02'] },
  { id: 's3', label: '风痰阻络证', type: 'syndrome', x: 54, y: 68, size: 92, refs: ['OBS-04'] },
  { id: 't1', label: '益气活血', type: 'therapy', x: 67, y: 20, size: 92, refs: ['RCT-01'] },
  { id: 't2', label: '化痰通络', type: 'therapy', x: 76, y: 58, size: 92, refs: ['OBS-04'] },
  { id: 'f1', label: '补阳还五汤', type: 'formula', x: 84, y: 28, size: 92, refs: ['RCT-01'] },
  { id: 'o1', label: 'NIHSS / Barthel', type: 'outcome', x: 64, y: 43, size: 92, refs: ['RCT-01'] },
  { id: 'o2', label: '总有效率 OR', type: 'outcome', x: 37, y: 17, size: 92, refs: ['SysRev-03'] },
  { id: 'study', label: 'RCT / 系统综述', type: 'study', x: 86, y: 74, size: 92, refs: ['RCT-01', 'RCT-02', 'SysRev-03'] },
];

const graphEdges = [
  ['stage', 'disease'],
  ['s1', 'stage'],
  ['s2', 'stage'],
  ['s3', 'stage'],
  ['s1', 't1'],
  ['t1', 'f1'],
  ['f1', 'o1'],
  ['s1', 'o2'],
  ['s3', 't2'],
  ['o1', 'study'],
  ['t2', 'study'],
];

export default function Page() {
  const [screen, setScreen] = useState<Screen>('home');
  const [question, setQuestion] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(literature.map((item) => item.id)));
  const [evidence, setEvidence] = useState<EvidenceUnit[]>(initialEvidence);
  const [keyword, setKeyword] = useState('');
  const [notice, setNotice] = useState('已加载缺血性脑卒中专题语料示例。后端接口接入后，此处可替换为真实检索结果。');
  const [activeTask, setActiveTask] = useState<'summary' | 'basis' | 'pattern'>('summary');
  const [trace, setTrace] = useState<EvidenceUnit | null>(null);
  const [selectedNode, setSelectedNode] = useState(graphNodes[0]);

  const previewEvidence = useMemo(
    () => initialEvidence.filter((item) => selectedIds.has(item.id)),
    [selectedIds],
  );

  const filteredEvidence = useMemo(
    () => evidence.filter((item) => JSON.stringify(item).includes(keyword)),
    [evidence, keyword],
  );

  const summaryText = useMemo(() => {
    const refText = evidence.slice(0, 3).map((item) => `【${item.id}】`).join('、');
    return {
      summary: `多项结构化证据提示，缺血性脑卒中恢复期相关证型以气虚痰瘀证和气虚血瘀证较为集中，益气活血、活血通络及针刺干预均显示出改善神经功能和日常生活能力的趋势 ${refText}。其中补阳还五汤加减与常规治疗联用可降低NIHSS评分并提升Barthel指数，系统综述结果进一步支持针刺方案对总有效率的改善。`,
      basis: `现有证据已经形成“证型-治法-方药-疗效指标”的可追溯链条，但研究类型、证型粒度和疗效指标仍存在异质性 ${refText}。因此，围绕缺血性脑卒中恢复期构建结构化证据库，有助于提高课题立项时的证据组织效率和原文回溯能力。`,
      pattern: `当前证据链显示，气虚相关证型多对应益气活血类治法，方药以补阳还五汤、脑心通胶囊为代表；风痰阻络证更偏向化痰通络策略。疗效观察集中于NIHSS、Barthel、Fugl-Meyer和总有效率等指标 ${refText}。`,
    }[activeTask];
  }, [activeTask, evidence]);

  function navigate(next: Screen) {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleLiterature(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function buildChain() {
    const picked = initialEvidence.filter((item) => selectedIds.has(item.id));
    setEvidence(picked.length ? picked : initialEvidence);
    navigate('edit');
  }

  function patchEvidence(index: number, key: keyof EvidenceUnit, value: string) {
    setEvidence((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)));
  }

  function moveEvidence(index: number, direction: -1 | 1) {
    setEvidence((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const clone = [...current];
      [clone[index], clone[nextIndex]] = [clone[nextIndex], clone[index]];
      return clone;
    });
  }

  function deleteEvidence(index: number) {
    setEvidence((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function addEvidence() {
    setEvidence((current) => [
      ...current,
      {
        id: `NEW-${String(current.length + 1).padStart(2, '0')}`,
        title: '新增证据单元',
        journal: '待补充',
        syndrome: '待编辑',
        therapy: '待编辑',
        intervention: '待编辑',
        formula: '待编辑',
        outcome: '待编辑',
        studyType: '待编辑',
        sourceText: '请补充原文片段。',
      },
    ]);
  }

  return (
    <div className="page-bg">
      <div className="dashboard">
        <header className="navbar">
          <button className="logo logo-button" onClick={() => navigate('home')}>
            <div className="logo-icon">脑</div>
            <div className="logo-text">缺血性脑卒中中医智能证据构建系统</div>
          </button>
          <nav className="nav-links" aria-label="主导航">
            {navItems.map((item) => (
              <button key={item.key} className={`nav-btn ${screen === item.key ? 'active' : ''}`} onClick={() => navigate(item.key)}>
                {item.label}
              </button>
            ))}
          </nav>
        </header>

        <main>
          {screen === 'home' && (
            <section className="screen active">
              <div className="hero">
                <h1>专家证据工作台 · V1.0</h1>
                <p>围绕缺血性脑卒中中医文献，完成标签检索、证据链编辑、知识图谱查看与受约束AI摘要生成。</p>
                <div className="query-box">
                  <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="例如：恢复期气虚痰瘀证使用补阳还五汤的疗效如何？" />
                  <button className="btn-primary" onClick={() => navigate('search')}>进入精细工作台</button>
                </div>
                <div className="chips">
                  {['气虚血瘀证常用中成药及NIHSS变化', '醒脑开窍针法对 Barthel 指数的影响', '恢复期益气活血法的总有效率 Meta 证据'].map((item) => (
                    <button key={item} className="chip" onClick={() => setQuestion(item)}>{item}</button>
                  ))}
                </div>
              </div>
              <div className="dual-mode">
                <article className="mode-card">
                  <h3>精细模式 · 手动全程控制</h3>
                  <p>逐层筛选标签、逐篇筛选文献、自由编辑证据链，保留完全控制权，适合严谨科研。</p>
                  <ul className="path-list">
                    <li><strong>精细路径</strong><span>标签筛选 → 文献列表 → 证据表 → 图谱 → 受约束AI生成</span></li>
                    <li><strong>核心优势</strong><span>证据可回溯、可编辑、可复核，减少幻觉风险</span></li>
                  </ul>
                  <button className="btn-outline" onClick={() => navigate('search')}>开始检索</button>
                </article>
                <article className="mode-card">
                  <h3>大众问答入口 · 后续版本</h3>
                  <p>自然语言一框式问答将作为 V2.0 能力扩展；V1.0 先沉淀可追溯证据底座。</p>
                  <ul className="path-list">
                    <li><strong>当前状态</strong><span>保留入口概念，不作为主流程实现</span></li>
                    <li><strong>演进方向</strong><span>问题解析 → 标签转换 → 证据链推荐 → 专家确认</span></li>
                  </ul>
                  <span className="btn-outline">V2.0 规划</span>
                </article>
              </div>
            </section>
          )}

          {screen === 'search' && (
            <section className="screen active">
              <div className="workspace-grid">
                <aside className="filter-panel">
                  <div className="section-title">标签体系筛选</div>
                  <div className="filter-grid">
                    <SelectField label="病程阶段" options={['恢复期', '急性期', '后遗症期']} />
                    <SelectField label="证型" options={['气虚痰瘀证', '气虚血瘀证', '风痰阻络证', '痰瘀互结证']} />
                    <SelectField label="治法" options={['益气活血', '活血通络', '化痰通络', '醒脑开窍']} />
                    <SelectField label="方药/干预" options={['补阳还五汤', '脑心通胶囊', '化痰通络汤', '醒脑开窍针法']} />
                    <SelectField label="疗效指标" options={['NIHSS', 'Barthel', 'Fugl-Meyer', '总有效率']} />
                    <SelectField label="研究类型" options={['不限', 'RCT', '系统综述', '队列研究']} />
                  </div>
                  <button className="btn-primary wide" onClick={() => setNotice('已按当前标签检索，当前显示示例结果。')}>检索匹配文献</button>
                </aside>
                <section className="panel">
                  <div className="panel-header">
                    <div className="section-title">匹配文献</div>
                    <span className="mini-badge">{literature.length} 篇</span>
                  </div>
                  {literature.map((item) => (
                    <button key={item.id} className={`literature-item ${selectedIds.has(item.id) ? 'selected' : ''}`} onClick={() => toggleLiterature(item.id)}>
                      <span className="check-box">{selectedIds.has(item.id) ? '✓' : ''}</span>
                      <span className="literature-main">
                        <strong>{item.id} · {item.title}</strong>
                        <small>{item.journal} · {item.year}</small>
                        <span className="tag-row">{item.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}</span>
                      </span>
                    </button>
                  ))}
                </section>
                <section className="panel">
                  <div className="panel-header">
                    <div className="section-title">结构化证据摘要</div>
                    <button className="btn-primary" onClick={buildChain}>生成证据链</button>
                  </div>
                  <div className="notice">{notice}</div>
                  <div className="unit-grid">{previewEvidence.map((item) => <EvidenceCard key={item.id} item={item} onTrace={setTrace} />)}</div>
                </section>
              </div>
            </section>
          )}

          {screen === 'edit' && (
            <section className="screen active">
              <div className="notice">证据链可在前端会话内编辑。接入后端后，“确认证据链”将保存排序、增删改查结果。</div>
              <section className="table-card">
                <div className="card-header">
                  <div className="panel-header">
                    <h2>结构化证据链 · 可编辑模式</h2>
                    <div className="toolbar">
                      <div className="search-box-small">
                        <span>检索</span>
                        <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="在证据链中快速筛选..." />
                      </div>
                      <button className="btn-secondary" onClick={addEvidence}>新增证据行</button>
                      <button className="btn-primary" onClick={() => alert('证据链已在当前前端会话中保存。接入后端后这里会调用 updateEvidenceChain 接口。')}>确认证据链</button>
                    </div>
                  </div>
                </div>
                <div className="table-container">
                  <table className="evidence-table">
                    <thead>
                      <tr><th></th><th>文献ID</th><th>证型</th><th>干预措施</th><th>疗效指标 (关键数值)</th><th>研究类型</th><th>操作</th></tr>
                    </thead>
                    <tbody>
                      {filteredEvidence.map((item) => {
                        const index = evidence.findIndex((entry) => entry.id === item.id);
                        return (
                          <tr key={item.id}>
                            <td className="drag-handle">⋮⋮</td>
                            <td><span className="inline-badge">{item.id}</span></td>
                            <td><input className="table-input" value={item.syndrome} onChange={(event) => patchEvidence(index, 'syndrome', event.target.value)} /></td>
                            <td><input className="table-input wide-input" value={item.intervention} onChange={(event) => patchEvidence(index, 'intervention', event.target.value)} /></td>
                            <td><input className="table-input wide-input" value={item.outcome} onChange={(event) => patchEvidence(index, 'outcome', event.target.value)} /></td>
                            <td><input className="table-input" value={item.studyType} onChange={(event) => patchEvidence(index, 'studyType', event.target.value)} /></td>
                            <td className="action-cell">
                              <button className="icon-btn" onClick={() => moveEvidence(index, -1)}>↑</button>
                              <button className="icon-btn" onClick={() => moveEvidence(index, 1)}>↓</button>
                              <button className="icon-btn danger" onClick={() => deleteEvidence(index)}>×</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="footer-note"><span>左侧为排序手柄示意；当前版本支持上移、下移、行内编辑、删除和保存。</span><span>人机协同 · 证据由您掌控</span></div>
              </section>
              <div className="step-actions">
                <button className="btn-secondary" onClick={() => navigate('search')}>返回检索</button>
                <button className="btn-outline" onClick={() => navigate('graph')}>查看知识图谱</button>
                <button className="btn-primary" onClick={() => navigate('summary')}>生成受约束摘要</button>
              </div>
            </section>
          )}

          {screen === 'graph' && (
            <section className="screen active">
              <section className="graph-shell">
                <div className="graph-head"><div><h2>证型-治法-方药-指标知识图谱</h2><p>点击节点查看关联证据。此版本用前端图谱展示 V1.0 的证据结构。</p></div><button className="btn-secondary" onClick={() => setSelectedNode(graphNodes[0])}>重置视图</button></div>
                <div className="graph-canvas">
                  <svg className="graph-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {graphEdges.map(([source, target]) => {
                      const a = graphNodes.find((node) => node.id === source)!;
                      const b = graphNodes.find((node) => node.id === target)!;
                      return <line key={`${source}-${target}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
                    })}
                  </svg>
                  {graphNodes.map((node) => (
                    <button key={node.id} className={`graph-node ${node.type} ${selectedNode.id === node.id ? 'selected' : ''}`} style={{ left: `calc(${node.x}% - ${node.size / 2}px)`, top: `calc(${node.y}% - ${node.size / 2}px)`, width: node.size, height: node.size }} onClick={() => setSelectedNode(node)}>{node.label}</button>
                  ))}
                </div>
                <aside className="node-detail"><span className="mini-badge">{selectedNode.type}</span><h3>{selectedNode.label}</h3><p>关联证据：{selectedNode.refs.join('、') || '暂无'}</p></aside>
              </section>
              <div className="step-actions"><button className="btn-secondary" onClick={() => navigate('edit')}>返回证据链</button><button className="btn-primary" onClick={() => navigate('summary')}>生成AI摘要</button></div>
            </section>
          )}

          {screen === 'summary' && (
            <section className="screen active">
              <section className="summary-shell">
                <div className="panel-header"><div><h2>受约束AI生成 · 科研综述</h2><div className="badge-group"><span className="badge">基于已确认证据链</span><span className="badge">可溯源 · 可复核</span></div></div></div>
                <div className="evidence-summary"><div className="summary-title">当前证据链摘要（{evidence.length}个证据单元）</div><div className="evidence-tags">{evidence.map((item) => <span className="tag" key={item.id}>{item.id}: {item.syndrome} | {item.formula} | {item.outcome}</span>)}</div></div>
                <div className="toolbar">
                  <div className="task-selector">
                    {[
                      ['summary', '综述摘要'],
                      ['basis', '课题申报证据说明'],
                      ['pattern', '证型用药规律总结'],
                    ].map(([key, label]) => <button key={key} className={`task-btn ${activeTask === key ? 'active' : ''}`} onClick={() => setActiveTask(key as typeof activeTask)}>{label}</button>)}
                  </div>
                  <button className="btn-secondary">重新生成</button>
                </div>
                <div className="result-area">
                  <div className="result-header"><h3>生成结果（每段带文献角标）</h3><button className="btn-secondary" onClick={() => navigator.clipboard?.writeText(summaryText)}>复制全文</button></div>
                  <p className="generated-text">{summaryText}</p>
                  <div className="ref-list"><h4>参考文献追溯</h4>{evidence.map((item) => <button key={item.id} className="ref-item" onClick={() => setTrace(item)}><span className="inline-badge">{item.id}</span><span>{item.title}</span></button>)}</div>
                </div>
              </section>
              <div className="step-actions"><button className="btn-secondary" onClick={() => navigate('edit')}>返回编辑</button><button className="btn-outline" onClick={() => navigate('graph')}>查看图谱</button></div>
            </section>
          )}
        </main>

        <footer className="site-footer">共享结构化证据底座（缺血性脑卒中专病库 · 800+核心文献） · 所有生成内容均带可追溯角标</footer>
      </div>
      {trace && <SourceModal item={trace} onClose={() => setTrace(null)} />}
    </div>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return <label className="field">{label}<select>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function EvidenceCard({ item, onTrace }: { item: EvidenceUnit; onTrace: (item: EvidenceUnit) => void }) {
  return (
    <article className="evidence-unit">
      <div className="unit-top"><span className="inline-badge">{item.id}</span><button className="icon-btn" onClick={() => onTrace(item)}>↗</button></div>
      <h3>{item.title}</h3>
      <p>{item.journal}</p>
      <div className="unit-fields"><span>证型：{item.syndrome}</span><span>治法：{item.therapy}</span><span>干预：{item.intervention}</span><span>指标：{item.outcome}</span></div>
    </article>
  );
}

function SourceModal({ item, onClose }: { item: EvidenceUnit; onClose: () => void }) {
  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header"><h3>原文回溯 · {item.id}</h3><button className="icon-btn" onClick={onClose}>×</button></div>
        <div className="modal-body">
          <h4>{item.title}</h4>
          <p className="muted">{item.journal}</p>
          <div className="detail-grid">
            <Detail label="证型" value={item.syndrome} />
            <Detail label="治法" value={item.therapy} />
            <Detail label="干预" value={item.intervention} />
            <Detail label="疗效指标" value={item.outcome} />
            <Detail label="方药" value={item.formula} />
            <Detail label="研究类型" value={item.studyType} />
          </div>
          <div className="source-highlight"><strong>原文片段：</strong><span>{item.sourceText}</span></div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="detail-field"><span>{label}</span><strong>{value}</strong></div>;
}
