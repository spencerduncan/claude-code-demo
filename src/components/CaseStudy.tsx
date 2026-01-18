import { motion } from 'framer-motion';
import { useState } from 'react';
import { caseStudy } from '../data/caseStudy';

export function CaseStudy() {
  const [activeTab, setActiveTab] = useState<'overview' | 'triage' | 'testing' | 'plan'>('overview');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <span className="text-purple-400 text-sm font-medium uppercase tracking-wider">
          Full Case Study
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
          {caseStudy.title}
        </h2>
        <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
          {caseStudy.subtitle}
        </p>
      </div>

      {/* Vision Quote */}
      <motion.div
        className="glass rounded-xl p-6 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-lg text-slate-300 italic text-center">
          "{caseStudy.vision}"
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-2 flex-wrap">
        {(['overview', 'triage', 'testing', 'plan'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab === 'overview' && 'The Pivot'}
            {tab === 'triage' && 'Issue Triage'}
            {tab === 'testing' && 'Test Strategy'}
            {tab === 'plan' && 'Full Plan'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'triage' && <TriageTab />}
        {activeTab === 'testing' && <TestingTab />}
        {activeTab === 'plan' && <PlanTab />}
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* The Problem */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-red-400 mb-4">The Problem: DLL Approach Failed</h3>
        <div className="space-y-3">
          {caseStudy.problemsRevealed.map((problem, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-red-400 mt-1">✗</span>
              <div>
                <span className="text-white font-medium">{problem.title}</span>
                <span className="text-slate-400"> — {problem.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Insight */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-blue-400 mb-4">The Insight</h3>
        <p className="text-slate-300">
          {caseStudy.insight}
        </p>
      </div>

      {/* The Solution */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-green-400 mb-4">The Solution: Unified Build</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {caseStudy.solutionBenefits.map((benefit, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <span className="text-slate-300">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Process Pattern */}
      <div className="glass rounded-xl p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">The Process Pattern</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {caseStudy.processSteps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl mb-2">{step.emoji}</div>
              <div className="text-white font-medium">{step.phase}</div>
              <div className="text-slate-400 text-sm mt-1">{step.action}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TriageTab() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <p className="text-slate-400 text-center">
        Not all work was wasted. The failed approach clarified constraints and validated foundations.
      </p>

      <div className="glass rounded-xl overflow-hidden">
        <div className="grid grid-cols-4 bg-slate-800/50 text-sm font-medium">
          <div className="px-4 py-3 border-r border-white/10 text-slate-400">Issues</div>
          <div className="px-4 py-3 border-r border-white/10 text-slate-400">Status</div>
          <div className="px-4 py-3 border-r border-white/10 text-slate-400">Outcome</div>
          <div className="px-4 py-3 text-slate-400">Carries Forward?</div>
        </div>
        {caseStudy.issueTriage.map((row, i) => (
          <motion.div
            key={i}
            className="grid grid-cols-4 border-t border-white/5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="px-4 py-3 border-r border-white/10 font-mono text-sm text-slate-300">
              {row.issues}
            </div>
            <div className="px-4 py-3 border-r border-white/10">
              <span className={`text-sm ${
                row.status === 'Done' ? 'text-green-400' :
                row.status === 'Open' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {row.status === 'Done' ? '✅' : row.status === 'Open' ? '🟡' : '❌'} {row.status}
              </span>
            </div>
            <div className="px-4 py-3 border-r border-white/10 text-slate-300 text-sm">
              {row.outcome}
            </div>
            <div className="px-4 py-3 text-sm">
              <span className={row.carriesForward ? 'text-green-400' : 'text-red-400'}>
                {row.carriesForward ? 'Yes' : 'No'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center text-slate-400 text-sm">
        <strong className="text-white">Key insight:</strong> Failed experiments aren't wasted—they constrain the solution space.
      </div>
    </motion.div>
  );
}

function TestingTab() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <p className="text-slate-400 text-center">
        Tests designed for autonomous workers: objective pass/fail, no subjective evaluation.
      </p>

      {/* Test Commands */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-green-400 mb-4">Built-in Test Mode</h3>
        <div className="bg-[var(--color-terminal-bg)] rounded-lg p-4 font-mono text-sm space-y-2">
          {caseStudy.testCommands.map((cmd, i) => (
            <div key={i} className="flex gap-4">
              <span className="text-[var(--color-terminal-green)]">$</span>
              <span className="text-[var(--color-terminal-text)]">{cmd.command}</span>
              <span className="text-slate-500 ml-auto"># {cmd.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why This Matters */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">Why This Design?</h3>
        <div className="space-y-3">
          {caseStudy.testingRationale.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">→</span>
              <div>
                <span className="text-white font-medium">{item.principle}</span>
                <span className="text-slate-400"> — {item.reason}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Development Sequence */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">Test Gates</h3>
        <div className="space-y-3">
          {caseStudy.testGates.map((gate, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-purple-400 font-mono text-sm w-8">{i + 1}.</span>
              <span className="text-white">{gate.phase}</span>
              <span className="text-slate-500 flex-1 border-b border-dotted border-white/10"></span>
              <code className="text-green-400 text-sm">{gate.gate}</code>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function PlanTab() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <p className="text-slate-400 text-center">
        The full 885-line plan document produced through the reveal → plan → execute cycle.
      </p>

      <div className="glass rounded-xl overflow-hidden">
        <div className="bg-slate-800/50 px-4 py-3 flex items-center justify-between">
          <span className="text-slate-300 font-medium">redshipblueship-unified-port-plan.md</span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-purple-400 text-sm hover:text-purple-300"
          >
            {expanded ? 'Collapse' : 'Expand Full Plan'}
          </button>
        </div>
        <div className={`overflow-auto transition-all duration-300 ${expanded ? 'max-h-[600px]' : 'max-h-[300px]'}`}>
          <pre className="p-4 text-xs text-slate-300 font-mono whitespace-pre-wrap">
{caseStudy.planExcerpt}
          </pre>
        </div>
      </div>

      {/* Download Link */}
      <div className="text-center">
        <a
          href="https://github.com/spencerduncan/claude-code-demo/blob/main/redshipblueship-unified-port-plan.md"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
        >
          View full plan on GitHub →
        </a>
      </div>
    </motion.div>
  );
}
