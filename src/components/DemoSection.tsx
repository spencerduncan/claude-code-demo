import { motion } from 'framer-motion';
import type { Demo } from '../data/demos';

interface DemoSectionProps {
  demo: Demo;
  index: number;
}

export function DemoSection({ demo, index }: DemoSectionProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      className={`relative ${demo.isFlagship ? 'py-16' : 'py-12'}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Flagship badge */}
      {demo.isFlagship && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-sm font-semibold text-black">
            ⭐ Flagship Demo
          </span>
        </div>
      )}

      <div className={`grid lg:grid-cols-2 gap-8 items-start ${isEven ? '' : 'lg:grid-flow-dense'}`}>
        {/* Terminal Side */}
        <motion.div
          className={isEven ? '' : 'lg:col-start-2'}
          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-[var(--color-terminal-bg)] rounded-lg overflow-hidden font-mono text-sm">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-slate-400 text-xs ml-2">claude-code</span>
            </div>

            {/* Terminal content */}
            <div className="p-4">
              <div className="flex">
                <span className="text-[var(--color-terminal-green)] mr-2 shrink-0">$</span>
                <pre className="text-[var(--color-terminal-text)] whitespace-pre-wrap text-xs sm:text-sm overflow-x-auto">
                  {demo.prompt}
                </pre>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Side */}
        <motion.div
          className={`space-y-6 ${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}
          initial={{ opacity: 0, x: isEven ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {/* Title */}
          <div>
            {demo.subtitle && (
              <span className="text-purple-400 text-sm font-medium">{demo.subtitle}</span>
            )}
            <h3 className="text-2xl font-bold text-white mt-1">{demo.title}</h3>
          </div>

          {/* I / AI breakdown */}
          <div className="space-y-4">
            <div className="glass rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👤</span>
                <div>
                  <span className="text-blue-400 font-semibold text-sm">I do:</span>
                  <p className="text-slate-300 mt-1">{demo.youDid}</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <span className="text-purple-400 font-semibold text-sm">AI does:</span>
                  <ul className="mt-1 space-y-1">
                    {demo.claudeDid.map((item, i) => (
                      <motion.li
                        key={i}
                        className="text-slate-300 flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className="text-purple-400">→</span> {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Value */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
            <span className="text-green-400 font-semibold text-sm">Value delivered:</span>
            <p className="text-white mt-1">{demo.ctoValue}</p>
          </div>

          {/* Key Learning */}
          {demo.keyLearning && (
            <blockquote className="border-l-4 border-amber-500/50 pl-4 italic text-amber-200/80">
              "{demo.keyLearning}"
            </blockquote>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
