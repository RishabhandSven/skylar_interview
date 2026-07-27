import { ChevronDown, CircleHelp, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import type { DecisionStatus, ExecutiveDecision } from '../types';

interface DecisionCardProps { decision: ExecutiveDecision; onStatusChange: (id: string, status: DecisionStatus) => void; }

export function DecisionCard({ decision, onStatusChange }: DecisionCardProps) {
  const [priorityClass] = [decision.priority === 'critical' ? 'text-danger bg-danger/10' : decision.priority === 'high' ? 'text-warning bg-warning/10' : 'text-brand bg-brand/10'];
  return (
    <article className="p-4 border border-border bg-surface rounded-md shadow-sm space-y-3">
      <div className="flex gap-3 justify-between"><div className="min-w-0"><span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${priorityClass}`}>{decision.priority}</span><h3 className="font-display font-semibold text-sm mt-2 break-words">{decision.title}</h3></div><select value={decision.status} onChange={(event) => onStatusChange(decision.id, event.target.value as DecisionStatus)} className="text-xs border border-border bg-background rounded-md px-2 h-8"><option value="pending">Pending</option><option value="assigned">Assigned</option><option value="resolved">Resolved</option></select></div>
      <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary"><span className="flex items-center gap-1"><UserRound className="w-3 h-3" />{decision.owner}</span><span>{decision.deadline}</span><span className="col-span-2">Impact: {decision.impact}</span></div>
      <details className="group border-t border-border pt-3"><summary className="cursor-pointer list-none flex items-center justify-between text-xs font-semibold text-brand">Why this decision?<ChevronDown className="w-4 h-4 group-open:rotate-180" /></summary><div className="mt-3 text-xs text-text-secondary space-y-2"><p>{decision.rationale}</p><p><CircleHelp className="inline w-3 h-3 mr-1" />Confidence: {decision.confidence}</p><p>Supporting data: {decision.sourceMetrics.join(' · ') || 'No source metrics detected.'}</p></div></details>
      <div className="flex flex-wrap gap-2"><motion.button whileTap={{ scale: 0.97 }} onClick={() => onStatusChange(decision.id, 'assigned')} className="text-xs px-3 py-1.5 bg-brand text-white rounded-md">Assign</motion.button><button onClick={() => onStatusChange(decision.id, 'resolved')} className="text-xs px-3 py-1.5 border border-border rounded-md">Mark resolved</button></div>
    </article>
  );
}
