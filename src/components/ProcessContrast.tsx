import { motion } from 'framer-motion';

const processApproach = [
  { label: "Design review before code", icon: "📋" },
  { label: "Test gates define done", icon: "✓" },
  { label: "Small reviewable commits", icon: "📦" },
  { label: "Objective pass/fail criteria", icon: "🎯" },
  { label: "Knowledge compounds", icon: "📈" },
];

const vibeApproach = [
  { label: "Start typing, hope it works", icon: "🤞" },
  { label: '"It works on my machine"', icon: "💻" },
  { label: "3000-line PRs", icon: "📜" },
  { label: '"Looks good to me"', icon: "👀" },
  { label: "Rediscover same bugs", icon: "🔄" },
];

export function ProcessContrast() {
  return (
    <div className="space-y-8">
      {/* Tagline */}
      <div className="text-center">
        <p className="text-xl md:text-2xl text-slate-300 italic">
          "Software engineering is programming integrated over time."
        </p>
        <p className="text-slate-500 text-sm mt-2">— Titus Winters, Google SWE Book</p>
        <p className="text-slate-600 text-xs mt-4">
          (This site was obviously vibecoded—but it's a fancy PowerPoint, not a webservice.)
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
      {/* Process-Oriented */}
      <motion.div
        className="glass rounded-xl p-6"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
          <span className="text-2xl">🔬</span>
          Process-Oriented
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          Google-style development: greenfield requires design review beforehand,
          full test coverage, one class + tests per commit.
        </p>
        <div className="space-y-3">
          {processApproach.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-slate-300">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Vibe-Oriented */}
      <motion.div
        className="glass rounded-xl p-6 opacity-60"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 0.6, x: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
          <span className="text-2xl">🎲</span>
          Vibe-Oriented
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          Start typing, prompt until it compiles, ship it,
          deal with bugs when customers report them.
        </p>
        <div className="space-y-3">
          {vibeApproach.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-slate-400">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
      </div>
    </div>
  );
}
