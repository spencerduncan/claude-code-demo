import { motion } from 'framer-motion';
import { logisticsApplications, keyTakeaways } from '../data/demos';

export function LogisticsSection() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">What I Bring to Your Project</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          These patterns apply directly to building software for logistics operators—or any domain with tight deadlines.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {logisticsApplications.map((item, i) => (
          <motion.div
            key={i}
            className="glass rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-purple-400 mb-2">{item.pattern}</h3>
            <p className="text-slate-300 text-sm">{item.application}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function KeyTakeaways() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">What You Get</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {keyTakeaways.map((item, i) => (
          <motion.div
            key={i}
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="glass rounded-xl p-6 h-full">
              <div className="flex items-start gap-4">
                <span className="text-4xl font-bold text-slate-700">{i + 1}</span>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Final CTA */}
      <motion.div
        className="text-center pt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="glass rounded-xl p-8 max-w-2xl mx-auto">
          <p className="text-2xl font-bold text-white mb-4">
            One senior engineer who knows how to direct AI
          </p>
          <p className="text-xl text-purple-400 font-medium">
            ships like a full team—without the coordination overhead.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
