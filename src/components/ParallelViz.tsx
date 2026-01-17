import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Worker {
  id: number;
  issue: string;
  branch: string;
  status: 'waiting' | 'running' | 'pushing' | 'done';
  progress: number;
}

export function ParallelViz() {
  const [workers, setWorkers] = useState<Worker[]>([
    { id: 1, issue: '#574', branch: 'claude/settings-parser-a1b2c3', status: 'waiting', progress: 0 },
    { id: 2, issue: '#575', branch: 'claude/location-tracking-d4e5f6', status: 'waiting', progress: 0 },
    { id: 3, issue: '#576', branch: 'claude/item-collection-g7h8i9', status: 'waiting', progress: 0 },
    { id: 4, issue: '#577', branch: 'claude/dungeon-state-j0k1l2', status: 'waiting', progress: 0 },
    { id: 5, issue: '#578', branch: 'claude/event-flags-m3n4o5', status: 'waiting', progress: 0 },
  ]);

  const [isAnimating, setIsAnimating] = useState(false);

  const runAnimation = () => {
    setIsAnimating(true);
    setWorkers(workers.map(w => ({ ...w, status: 'waiting', progress: 0 })));

    // Stagger start
    workers.forEach((_, i) => {
      setTimeout(() => {
        setWorkers(prev => prev.map((w, j) =>
          j === i ? { ...w, status: 'running' } : w
        ));
      }, i * 200);
    });

    // Simulate progress
    const progressInterval = setInterval(() => {
      setWorkers(prev => prev.map(w => {
        if (w.status === 'running') {
          const newProgress = Math.min(100, w.progress + Math.random() * 15);
          if (newProgress >= 100) {
            return { ...w, status: 'pushing', progress: 100 };
          }
          return { ...w, progress: newProgress };
        }
        return w;
      }));
    }, 300);

    // Complete workers at different times
    workers.forEach((_, i) => {
      const delay = 2000 + i * 500 + Math.random() * 1000;
      setTimeout(() => {
        setWorkers(prev => prev.map((w, j) =>
          j === i ? { ...w, status: 'done', progress: 100 } : w
        ));
      }, delay);
    });

    // Cleanup
    setTimeout(() => {
      clearInterval(progressInterval);
      setIsAnimating(false);
    }, 5000);
  };

  useEffect(() => {
    // Auto-run animation once on mount
    const timeout = setTimeout(runAnimation, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const getStatusColor = (status: Worker['status']) => {
    switch (status) {
      case 'waiting': return 'bg-slate-600';
      case 'running': return 'bg-blue-500';
      case 'pushing': return 'bg-yellow-500';
      case 'done': return 'bg-green-500';
    }
  };

  const getStatusText = (status: Worker['status']) => {
    switch (status) {
      case 'waiting': return 'Waiting';
      case 'running': return 'Implementing...';
      case 'pushing': return 'Pushing...';
      case 'done': return 'Merged!';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with replay button */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-200">
          5 Parallel Workers Running
        </h4>
        <button
          onClick={runAnimation}
          disabled={isAnimating}
          className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-300 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnimating ? 'Running...' : '↻ Replay'}
        </button>
      </div>

      {/* Worker cards */}
      <div className="space-y-3">
        {workers.map((worker, i) => (
          <motion.div
            key={worker.id}
            className="glass rounded-lg p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-4">
              {/* Status indicator */}
              <motion.div
                className={`w-3 h-3 rounded-full ${getStatusColor(worker.status)}`}
                animate={{
                  scale: worker.status === 'running' ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  repeat: worker.status === 'running' ? Infinity : 0,
                  duration: 1,
                }}
              />

              {/* Worker info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-mono font-semibold">{worker.issue}</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-purple-400 font-mono text-sm truncate">{worker.branch}</span>
                </div>

                {/* Progress bar */}
                <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getStatusColor(worker.status)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${worker.progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Status text */}
              <span className={`text-sm font-medium ${
                worker.status === 'done' ? 'text-green-400' :
                worker.status === 'running' ? 'text-blue-400' :
                worker.status === 'pushing' ? 'text-yellow-400' :
                'text-slate-500'
              }`}>
                {getStatusText(worker.status)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="text-center text-slate-400 text-sm">
        <span className="text-green-400 font-semibold">
          {workers.filter(w => w.status === 'done').length}
        </span>
        {' / 5 workers completed'}
      </div>
    </div>
  );
}
