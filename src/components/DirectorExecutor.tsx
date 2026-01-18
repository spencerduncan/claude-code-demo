import { motion } from 'framer-motion';
import { directorExecutorPairs } from '../data/demos';

export function DirectorExecutor() {
  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-2 bg-slate-800/50">
        <div className="px-6 py-4 border-r border-white/10">
          <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
            <span className="text-2xl">👤</span>
            I Direct
          </h3>
        </div>
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            AI Executes
          </h3>
        </div>
      </div>

      {/* Rows */}
      {directorExecutorPairs.map((pair, index) => (
        <motion.div
          key={index}
          className="grid grid-cols-2 border-t border-white/5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="px-6 py-4 border-r border-white/10 hover:bg-blue-500/5 transition-colors">
            <p className="text-slate-300">{pair.director}</p>
          </div>
          <div className="px-6 py-4 hover:bg-purple-500/5 transition-colors">
            <p className="text-slate-300">{pair.executor}</p>
          </div>
        </motion.div>
      ))}

      {/* Key Insight */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-t border-white/10">
        <p className="text-slate-400 text-sm italic">
          <span className="text-slate-200 font-medium">Key insight:</span> I don't explain <em>how</em> to code.
          I state <em>what</em> I want and <em>when</em> to pivot. The AI handles the execution complexity.
        </p>
      </div>
    </div>
  );
}
