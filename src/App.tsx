import './index.css';
import { Hero } from './components/Hero';
import { DirectorExecutor } from './components/DirectorExecutor';
import { DemoSection } from './components/DemoSection';
import { ParallelViz } from './components/ParallelViz';
import { CTOComparison, AdjutantTable } from './components/CTOComparison';
import { LogisticsSection, KeyTakeaways } from './components/Logistics';
import { CaseStudy } from './components/CaseStudy';
import { demoSections, pivotInstructions } from './data/demos';
import { motion } from 'framer-motion';

function Section({
  id,
  title,
  subtitle,
  children,
  className = ""
}: {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`py-20 px-4 md:px-8 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {subtitle && (
            <span className="text-purple-400 text-sm font-medium uppercase tracking-wider">
              {subtitle}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">{title}</h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

function App() {
  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Hero */}
      <Hero />

      {/* Director/Executor Model */}
      <Section
        id="model"
        title="The Interaction Model"
        subtitle="Director + Executor"
      >
        <DirectorExecutor />
      </Section>

      {/* High-Value Pivot Instructions */}
      <Section
        id="pivots"
        title="High-Value Pivot Instructions"
        subtitle="Real Examples"
        className="bg-slate-900/50"
      >
        <div className="space-y-6">
          <p className="text-center text-slate-400 max-w-2xl mx-auto mb-8">
            These are the prompts that demonstrate senior engineer leverage.
            Short commands that trigger complex analysis and action.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pivotInstructions.map((pivot, i) => (
              <motion.div
                key={pivot.id}
                className="glass rounded-xl p-6 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold text-white">{pivot.title}</h3>
                <div className="bg-[var(--color-terminal-bg)] rounded p-3 font-mono text-xs text-[var(--color-terminal-text)] max-h-24 overflow-y-auto">
                  {pivot.prompt}
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 text-sm font-medium shrink-0">You:</span>
                    <span className="text-slate-400 text-sm">{pivot.youDid}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-400 text-sm font-medium shrink-0">Claude:</span>
                    <span className="text-slate-400 text-sm">{pivot.claudeDid.join(', ')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Parallel Workers Visualization */}
      <Section
        id="parallel"
        title="5 Parallel Workers"
        subtitle="Flagship Demo"
      >
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="bg-[var(--color-terminal-bg)] rounded-lg p-4 font-mono text-sm mb-4">
              <span className="text-[var(--color-terminal-green)]">$</span>{' '}
              <span className="text-[var(--color-terminal-text)]">
                Use the claude in chrome skill you have to address open issues in /spencerduncan/oottracker in parallel
              </span>
            </div>
            <p className="text-center text-slate-400">
              One sentence. 5 simultaneous development streams.
            </p>
          </div>
          <ParallelViz />
        </div>
      </Section>

      {/* Demo Sections */}
      <div id="demos" className="bg-slate-900/50">
        <Section
          title="Demo Patterns"
          subtitle="Real Workflows"
        >
          <div className="space-y-8">
            {demoSections.slice(0, 4).map((demo, i) => (
              <DemoSection key={demo.id} demo={demo} index={i} />
            ))}
          </div>
        </Section>
      </div>

      {/* More Demo Sections */}
      <Section
        title="Quality & Knowledge"
        subtitle="Enterprise Patterns"
      >
        <div className="space-y-8">
          {demoSections.slice(4).map((demo, i) => (
            <DemoSection key={demo.id} demo={demo} index={i + 4} />
          ))}
        </div>
      </Section>

      {/* Adjutant Patterns */}
      <Section
        id="adjutant"
        title="Adjutant Patterns"
        subtitle="Information Operations"
        className="bg-slate-900/50"
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-slate-400 mb-8">
            Beyond execution, Claude operates as an <span className="text-purple-400 font-medium">adjutant</span> —
            gathering intel, synthesizing status, coordinating parallel workstreams.
          </p>
          <AdjutantTable />
        </div>
      </Section>

      {/* CTO Comparison */}
      <Section
        id="comparison"
        title="The CTO Comparison"
        subtitle="Traditional vs Adjutant"
      >
        <CTOComparison />
      </Section>

      {/* Case Study */}
      <section id="case-study" className="py-20 px-4 md:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <CaseStudy />
        </div>
      </section>

      {/* Logistics Application */}
      <Section
        id="logistics"
        title=""
        className="bg-slate-900/50"
      >
        <LogisticsSection />
      </Section>

      {/* Key Takeaways */}
      <Section
        id="takeaways"
        title=""
      >
        <KeyTakeaways />
      </Section>

      {/* Footer */}
      <footer className="py-12 px-4 text-center border-t border-white/5">
        <p className="text-slate-500 text-sm">
          Built with Claude Code • Real prompts from real projects
        </p>
        <p className="text-slate-600 text-xs mt-2">
          oottracker • redshipblueship • KinderBotII
        </p>
      </footer>
    </div>
  );
}

export default App;
