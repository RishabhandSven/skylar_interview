import { memo, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, ListTodo, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInsights } from '../../../hooks/useInsights';
import { getErrorMessage, getErrorTitle } from '../../../services/api';
import { EmptyState } from '../../dashboard/components/EmptyState';
import { ErrorState } from '../../dashboard/components/ErrorState';
import { LoadingSkeleton } from '../../dashboard/components/LoadingSkeleton';
import { AdvisorConversation } from '../components/AdvisorConversation';
import { DecisionCard } from '../components/DecisionCard';
import type { DecisionStatus } from '../types';
import { createExecutiveWorkspaceData } from '../utils/createExecutiveWorkspace';

export const ExecutiveAdvisorView = memo(function ExecutiveAdvisorView() {
  const { parsed, isLoading, isError, error, refetch } = useInsights();
  const workspace = useMemo(() => (parsed ? createExecutiveWorkspaceData(parsed) : null), [parsed]);
  const [decisionStatuses, setDecisionStatuses] = useState<Record<string, DecisionStatus>>({});

  if (isLoading) return <div className="space-y-4"><LoadingSkeleton variant="summary" /><LoadingSkeleton variant="list" /></div>;
  if (isError) return <ErrorState title={getErrorTitle(error)} message={getErrorMessage(error)} onRetry={() => refetch()} />;
  if (!parsed || parsed.isEmpty || !workspace) return <EmptyState title="Executive workspace is waiting for insights" message="Sync dashboard insights to prepare the AI advisor and executive brief." actionLabel="Retry" onAction={() => refetch()} />;

  const decisions = workspace.decisions.map((decision) => ({ ...decision, status: decisionStatuses[decision.id] ?? decision.status }));
  const pending = decisions.filter((decision) => decision.status === 'pending').length;
  const changeStatus = (id: string, status: DecisionStatus) => setDecisionStatuses((current) => ({ ...current, [id]: status }));

  return <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4 sm:space-y-6 min-w-0">
    <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-brand">Executive operating system</p><h1 className="font-display font-bold text-xl sm:text-2xl">Executive AI Advisor</h1><p className="text-xs text-text-secondary mt-1">Collaborate with AI, convert insight into decisions, and prepare the next leadership conversation.</p></div><div className="flex gap-2 text-xs"><span className="px-2.5 py-1.5 rounded-md bg-danger/10 text-danger"><ShieldAlert className="inline w-3.5 h-3.5 mr-1" />{parsed.risks.length} risks</span><span className="px-2.5 py-1.5 rounded-md bg-brand/10 text-brand"><ListTodo className="inline w-3.5 h-3.5 mr-1" />{pending} pending decisions</span></div></header>
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 items-start"><div className="xl:col-span-2"><AdvisorConversation context={parsed} suggestedPrompts={workspace.suggestedPrompts} /></div><aside className="space-y-4"><section className="p-4 border border-border bg-surface rounded-md shadow-sm"><h2 className="font-display font-semibold text-sm flex items-center gap-2"><Clock3 className="w-4 h-4 text-brand" />Executive timeline</h2><ol className="mt-4 space-y-3">{workspace.events.map((event) => <li key={event.id} className="border-l-2 border-brand/30 pl-3"><p className="text-xs font-semibold">{event.title}</p><p className="text-xs text-text-secondary mt-0.5 break-words">{event.detail}</p></li>)}</ol></section><section className="p-4 border border-border bg-surface rounded-md shadow-sm"><h2 className="font-display font-semibold text-sm flex items-center gap-2"><CalendarDays className="w-4 h-4 text-brand" />Action center</h2><div className="grid grid-cols-2 gap-2 mt-3 text-xs"><span className="p-2 rounded bg-danger/5 text-danger">Critical actions<br /><strong>{parsed.risks.filter((risk) => risk.level === 'critical').length}</strong></span><span className="p-2 rounded bg-brand/5 text-brand">Pending decisions<br /><strong>{pending}</strong></span><span className="p-2 rounded bg-warning/5 text-warning">Upcoming reviews<br /><strong>{decisions.length}</strong></span><span className="p-2 rounded bg-success/5 text-success">Assigned reviews<br /><strong>{decisions.filter((d) => d.status === 'assigned').length}</strong></span></div></section></aside></div>
    <section><div className="flex items-center gap-2 mb-3"><CheckCircle2 className="w-4 h-4 text-brand" /><h2 className="font-display font-semibold text-base">Decision workspace</h2></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{decisions.length ? decisions.map((decision) => <DecisionCard key={decision.id} decision={decision} onStatusChange={changeStatus} />) : <EmptyState title="No decisions generated" message="Recommendations will appear here when the next insight response is available." />}</div></section>
    <section className="p-4 sm:p-6 border border-border bg-surface rounded-md shadow-sm"><h2 className="font-display font-semibold text-base">Board meeting brief</h2><p className="text-xs text-text-secondary mt-1">A structured briefing prepared from the current executive insight response.</p><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">{workspace.brief.map((section) => <article key={section.title} className="p-4 rounded-md bg-background border border-border"><h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">{section.title}</h3><ul className="mt-2 space-y-1.5">{section.content.length ? section.content.map((item, index) => <li key={index} className="text-xs leading-relaxed break-words">{item}</li>) : <li className="text-xs text-text-secondary">No items available.</li>}</ul></article>)}</div></section>
  </motion.div>;
});
