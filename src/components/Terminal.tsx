import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TerminalProps {
  prompt: string;
  typingSpeed?: number;
  onComplete?: () => void;
  autoStart?: boolean;
  className?: string;
}

export function Terminal({
  prompt,
  typingSpeed = 30,
  onComplete,
  autoStart = true,
  className = ""
}: TerminalProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!autoStart) return;

    setIsTyping(true);
    indexRef.current = 0;
    setDisplayedText('');

    const interval = setInterval(() => {
      if (indexRef.current < prompt.length) {
        setDisplayedText(prompt.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        onComplete?.();
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [prompt, typingSpeed, autoStart, onComplete]);

  return (
    <motion.div
      className={`bg-[var(--color-terminal-bg)] rounded-lg overflow-hidden font-mono text-sm ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
      <div className="p-4 min-h-[120px]">
        <div className="flex">
          <span className="text-[var(--color-terminal-green)] mr-2">$</span>
          <div className="flex-1">
            <span className="text-[var(--color-terminal-text)] whitespace-pre-wrap">
              {displayedText}
            </span>
            {showCursor && (
              <span className={`inline-block w-2 h-4 bg-[var(--color-terminal-text)] ml-0.5 ${isTyping ? '' : 'cursor-blink'}`} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface TerminalWithResponseProps {
  prompt: string;
  response: string[];
  typingSpeed?: number;
  className?: string;
}

export function TerminalWithResponse({
  prompt,
  response,
  typingSpeed = 20,
  className = ""
}: TerminalWithResponseProps) {
  const [phase, setPhase] = useState<'prompt' | 'response' | 'done'>('prompt');
  const [displayedPrompt, setDisplayedPrompt] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState<string[]>([]);
  const promptIndexRef = useRef(0);
  const responseIndexRef = useRef(0);

  useEffect(() => {
    // Type prompt
    promptIndexRef.current = 0;
    const promptInterval = setInterval(() => {
      if (promptIndexRef.current < prompt.length) {
        setDisplayedPrompt(prompt.slice(0, promptIndexRef.current + 1));
        promptIndexRef.current++;
      } else {
        clearInterval(promptInterval);
        setTimeout(() => setPhase('response'), 500);
      }
    }, typingSpeed);

    return () => clearInterval(promptInterval);
  }, [prompt, typingSpeed]);

  useEffect(() => {
    if (phase !== 'response') return;

    responseIndexRef.current = 0;
    const responseInterval = setInterval(() => {
      if (responseIndexRef.current < response.length) {
        setDisplayedResponse(response.slice(0, responseIndexRef.current + 1));
        responseIndexRef.current++;
      } else {
        clearInterval(responseInterval);
        setPhase('done');
      }
    }, 150);

    return () => clearInterval(responseInterval);
  }, [phase, response]);

  return (
    <motion.div
      className={`bg-[var(--color-terminal-bg)] rounded-lg overflow-hidden font-mono text-sm ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
      <div className="p-4 space-y-3">
        {/* Prompt */}
        <div className="flex">
          <span className="text-[var(--color-terminal-green)] mr-2">$</span>
          <span className="text-[var(--color-terminal-text)] whitespace-pre-wrap">
            {displayedPrompt}
            {phase === 'prompt' && (
              <span className="inline-block w-2 h-4 bg-[var(--color-terminal-text)] ml-0.5" />
            )}
          </span>
        </div>

        {/* Response */}
        {displayedResponse.length > 0 && (
          <div className="pl-4 border-l-2 border-[var(--color-terminal-purple)]/30">
            {displayedResponse.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[var(--color-terminal-purple)]"
              >
                → {line}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
