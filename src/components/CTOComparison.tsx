import { motion } from 'framer-motion';
import { ctoComparison, adjutantPatterns } from '../data/demos';

export function CTOComparison() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Traditional */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-red-400 flex items-center gap-2">
          <span className="text-2xl">🏢</span>
          Hire a Team
        </h3>
        <div className="space-y-3">
          {ctoComparison.traditional.map((item, i) => (
            <motion.div
              key={i}
              className="space-y-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">{item.label}</span>
                <span className="text-red-400">{item.value}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.value}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  viewport={{ once: true }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hire Me */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-green-400 flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          Hire Me
        </h3>
        <div className="space-y-3">
          {ctoComparison.withClaude.map((item, i) => (
            <motion.div
              key={i}
              className="space-y-1"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">{item.label}</span>
                <span className="text-green-400">{item.value}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.value}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  viewport={{ once: true }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdjutantTable() {
  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-3 bg-slate-800/50">
        <div className="px-4 py-3 border-r border-white/10">
          <span className="text-slate-400 font-medium text-sm">Phase</span>
        </div>
        <div className="px-4 py-3 border-r border-white/10">
          <span className="text-blue-400 font-medium text-sm">I say</span>
        </div>
        <div className="px-4 py-3">
          <span className="text-purple-400 font-medium text-sm">AI delivers</span>
        </div>
      </div>

      {/* Rows */}
      {adjutantPatterns.map((pattern: { phase: string; you: string; claude: string }, i: number) => (
        <motion.div
          key={i}
          className="grid grid-cols-3 border-t border-white/5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="px-4 py-3 border-r border-white/10 bg-slate-800/30">
            <span className="text-slate-200 font-medium text-sm">{pattern.phase}</span>
          </div>
          <div className="px-4 py-3 border-r border-white/10">
            <span className="text-slate-400 text-sm font-mono">{pattern.you}</span>
          </div>
          <div className="px-4 py-3">
            <span className="text-slate-300 text-sm">{pattern.claude}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
