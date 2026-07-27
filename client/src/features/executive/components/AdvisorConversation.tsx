import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowUp, Bot, Sparkles, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { advisorService } from '../services/advisorService';
import type { AdvisorContext, AdvisorMessage } from '../types';

interface AdvisorConversationProps {
  context: AdvisorContext;
  suggestedPrompts: string[];
}

function renderInlineMarkdown(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part,
  );
}

function AdvisorMessageContent({ content }: { content: string }) {
  return (
    <div className="space-y-1.5 break-words">
      {content.split('\n').filter(Boolean).map((line, index) => {
        const heading = line.match(/^#{1,6}\s+(.*)$/);
        const bullet = line.match(/^[-*]\s+(.*)$/);
        const cleanLine = heading?.[1] ?? bullet?.[1] ?? line.replace(/^_([^_]+)_$/, '$1');
        return heading ? (
          <p key={index} className="font-display font-semibold text-sm">{renderInlineMarkdown(cleanLine)}</p>
        ) : (
          <p key={index} className={bullet ? 'pl-3 relative before:content-[\'•\'] before:absolute before:left-0' : ''}>
            {renderInlineMarkdown(cleanLine)}
          </p>
        );
      })}
    </div>
  );
}

export function AdvisorConversation({ context, suggestedPrompts }: AdvisorConversationProps) {
  const [messages, setMessages] = useState<AdvisorMessage[]>([{ id: 'welcome', role: 'assistant', content: '### Executive AI Advisor\n\nI have the latest dashboard context. Ask me to prioritize, explain a risk, or prepare a decision.' }]);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const submit = async (prompt: string) => {
    const question = prompt.trim();
    if (!question || isTyping) return;

    setMessages((current) => [...current, { id: `user-${Date.now()}`, role: 'user', content: question }]);
    setDraft('');
    setIsTyping(true);
    try {
      const response = await advisorService.answer(question, context);
      setMessages((current) => [...current, { id: `assistant-${Date.now()}`, role: 'assistant', content: response }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit(draft);
  };

  return (
    <section className="border border-border bg-surface rounded-md shadow-sm flex flex-col min-h-[560px]">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <div className="p-1.5 rounded-md bg-brand/10 text-brand"><Sparkles className="w-4 h-4" /></div>
        <div><h2 className="font-display font-semibold text-sm">Executive AI Advisor</h2><p className="text-xs text-text-secondary">Context-aware strategy conversation</p></div>
      </div>

      <div className="flex-1 min-h-0 max-h-[470px] overflow-y-auto p-4 space-y-4" aria-live="polite">
        {messages.map((message) => (
          <motion.div key={message.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : ''}`}>
            {message.role === 'assistant' && <div className="w-7 h-7 rounded-full bg-brand text-white grid place-items-center shrink-0"><Bot className="w-4 h-4" /></div>}
            <div className={`max-w-[88%] rounded-md px-3 py-2.5 text-xs leading-relaxed ${message.role === 'user' ? 'bg-brand text-white' : 'bg-background text-text-primary border border-border'}`}>
              <AdvisorMessageContent content={message.content} />
            </div>
            {message.role === 'user' && <div className="w-7 h-7 rounded-full bg-surface-hover text-text-secondary grid place-items-center shrink-0"><User className="w-4 h-4" /></div>}
          </motion.div>
        ))}
        {isTyping && <div className="flex items-center gap-2 text-xs text-text-secondary"><Bot className="w-4 h-4 text-brand" /><span className="animate-pulse">Advisor is preparing a response…</span></div>}
        <div ref={historyEndRef} />
      </div>

      <div className="p-4 border-t border-border space-y-3">
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt) => <button key={prompt} onClick={() => void submit(prompt)} disabled={isTyping} className="text-[11px] text-brand border border-brand/20 bg-brand/5 rounded-full px-2.5 py-1 hover:bg-brand/10 disabled:opacity-50">{prompt}</button>)}
        </div>
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <label className="sr-only" htmlFor="advisor-prompt">Ask the Executive AI Advisor</label>
          <textarea id="advisor-prompt" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask about today’s business…" rows={2} className="flex-1 resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand" />
          <button type="submit" disabled={!draft.trim() || isTyping} className="p-2.5 rounded-md bg-brand text-white disabled:opacity-50" aria-label="Send question"><ArrowUp className="w-4 h-4" /></button>
        </form>
      </div>
    </section>
  );
}
