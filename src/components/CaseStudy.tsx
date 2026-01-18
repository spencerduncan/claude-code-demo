import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { caseStudy } from '../data/caseStudy';

export function CaseStudy() {
  const [activeTab, setActiveTab] = useState<'overview' | 'triage' | 'testing' | 'metaprocess' | 'plan'>('overview');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <span className="text-purple-400 text-sm font-medium uppercase tracking-wider">
          Case Study
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
          {caseStudy.title}
        </h2>
        <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
          How I navigate architecture pivots: reveal constraints, plan with evidence, execute in parallel.
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
        {(['overview', 'triage', 'testing', 'metaprocess', 'plan'] as const).map((tab) => (
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
            {tab === 'metaprocess' && 'Knowledge Loop'}
            {tab === 'plan' && 'Full Plan'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'triage' && <TriageTab />}
        {activeTab === 'testing' && <TestingTab />}
        {activeTab === 'metaprocess' && <MetaprocessTab />}
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

function MetaprocessTab() {
  const meta = caseStudy.metaprocess;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <p className="text-slate-400 text-center max-w-2xl mx-auto">
        {meta.subtitle}
      </p>

      {/* The Trigger */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-yellow-400 mb-4">The Trigger</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-yellow-400 mt-1">⚡</span>
            <div>
              <span className="text-white font-medium">{meta.trigger.problem}</span>
              <span className="text-slate-400"> — {meta.trigger.scale}</span>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border-l-2 border-yellow-400/50">
            <p className="text-slate-300 italic">"{meta.trigger.insight}"</p>
          </div>
        </div>
      </div>

      {/* Research Path */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-blue-400 mb-4">Research Path</h3>
        <div className="space-y-3">
          {meta.researchPath.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-blue-400 font-mono text-sm w-8">{i + 1}.</span>
              <span className="text-white">{item.step}</span>
              <span className="text-slate-500 flex-1 border-b border-dotted border-white/10"></span>
              <span className="text-slate-400 text-sm">{item.source}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* The Loop */}
      <div className="glass rounded-xl p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">{meta.title}</h3>
        <div className="grid md:grid-cols-5 gap-4">
          {meta.loop.map((step, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-2xl mb-2">{step.emoji}</div>
              <div className="text-white font-medium text-sm">{step.phase}</div>
              <div className="text-slate-400 text-xs mt-1">{step.action}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Code Example */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-green-400 mb-4">Backsliding Prevention</h3>
        <p className="text-slate-400 text-sm mb-4">{meta.codeExample.description}</p>
        <div className="bg-[var(--color-terminal-bg)] rounded-lg p-4 font-mono text-xs text-[var(--color-terminal-text)] overflow-x-auto">
          <pre>{meta.codeExample.code}</pre>
        </div>
      </div>

      {/* Extraction Results */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">What Got Extracted</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-slate-500 text-sm">From:</span>
            <p className="text-white">{meta.extraction.from}</p>
          </div>
          <div>
            <span className="text-slate-500 text-sm">To:</span>
            <p className="text-white">{meta.extraction.to}</p>
          </div>
        </div>
        <div className="space-y-2">
          {meta.extraction.additions.map((addition, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-green-400 mt-1">+</span>
              <span className="text-slate-300">{addition}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insight */}
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl px-6 py-4 border border-purple-500/20">
          <p className="text-slate-200 font-medium">{meta.keyInsight}</p>
        </div>
      </div>
    </motion.div>
  );
}

function PlanTab() {
  const [planContent, setPlanContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}redshipblueship-unified-port-plan.md`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.text();
      })
      .then(text => {
        setPlanContent(text);
        setLoading(false);
      })
      .catch(() => {
        setPlanContent(caseStudy.planExcerpt);
        setLoading(false);
      });
  }, []);

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
          <span className="text-slate-500 text-sm">885 lines</span>
        </div>
        <div className="overflow-auto max-h-[70vh] p-6">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading plan...</div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({children}) => <h1 className="text-2xl font-bold text-white border-b border-white/10 pb-2 mb-4">{children}</h1>,
                h2: ({children}) => <h2 className="text-xl font-semibold text-purple-400 mt-8 mb-4">{children}</h2>,
                h3: ({children}) => <h3 className="text-lg font-semibold text-blue-400 mt-6 mb-3">{children}</h3>,
                p: ({children}) => <p className="text-slate-300 mb-4 leading-relaxed">{children}</p>,
                strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
                em: ({children}) => <em className="text-slate-200">{children}</em>,
                code: ({children, className}) => {
                  const isBlock = className?.includes('language-');
                  return isBlock ? (
                    <code className="text-[var(--color-terminal-text)]">{children}</code>
                  ) : (
                    <code className="text-green-400 bg-slate-800/50 px-1.5 py-0.5 rounded text-sm">{children}</code>
                  );
                },
                pre: ({children}) => <pre className="bg-[var(--color-terminal-bg)] text-[var(--color-terminal-text)] p-4 rounded-lg overflow-x-auto mb-4 text-sm">{children}</pre>,
                ul: ({children}) => <ul className="list-disc list-inside text-slate-300 mb-4 space-y-1">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-1">{children}</ol>,
                li: ({children}) => <li className="text-slate-300">{children}</li>,
                a: ({href, children}) => <a href={href} className="text-purple-400 hover:underline">{children}</a>,
                table: ({children}) => <div className="overflow-x-auto mb-4"><table className="w-full text-sm border-collapse">{children}</table></div>,
                thead: ({children}) => <thead className="bg-slate-800/50">{children}</thead>,
                tbody: ({children}) => <tbody>{children}</tbody>,
                tr: ({children}) => <tr className="border-b border-white/5">{children}</tr>,
                th: ({children}) => <th className="text-slate-400 font-medium px-3 py-2 text-left border border-white/10">{children}</th>,
                td: ({children}) => <td className="text-slate-300 px-3 py-2 border border-white/10">{children}</td>,
                hr: () => <hr className="border-white/10 my-8" />,
                blockquote: ({children}) => <blockquote className="border-l-4 border-purple-500/50 pl-4 italic text-slate-400 my-4">{children}</blockquote>,
              }}
            >
              {planContent || ''}
            </ReactMarkdown>
          )}
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
          View on GitHub →
        </a>
      </div>
    </motion.div>
  );
}
