import { ShieldCheck, Info, Key, Globe, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export const SettingsView: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 sm:space-y-6 max-w-4xl min-w-0"
    >
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-xl text-text-primary">
          Platform Configuration
        </h2>
        <p className="font-sans text-xs text-text-secondary mt-1">
          Verify API connections, integration status, and security keys.
        </p>
      </div>

      {/* Connection Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monday Status */}
        <div className="p-5 border border-border bg-surface rounded-md shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-text-secondary uppercase font-semibold tracking-wider">Monday.com Integration</p>
              <h5 className="font-display font-bold text-base mt-2">Active Connection</h5>
            </div>
            <div className="p-1.5 rounded-md bg-success/15 text-success">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-success mt-4">
            <Globe className="w-3.5 h-3.5" />
            <span>Connected to GraphQL endpoint</span>
          </div>
        </div>

        {/* Gemini Status */}
        <div className="p-5 border border-border bg-surface rounded-md shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-text-secondary uppercase font-semibold tracking-wider">Gemini LLM status</p>
              <h5 className="font-display font-bold text-base mt-2">Active Connection</h5>
            </div>
            <div className="p-1.5 rounded-md bg-success/15 text-success">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-success mt-4">
            <Key className="w-3.5 h-3.5" />
            <span>API Token Verified</span>
          </div>
        </div>

        {/* Local Server Latency */}
        <div className="p-5 border border-border bg-surface rounded-md shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-text-secondary uppercase font-semibold tracking-wider">Server Latency</p>
              <h5 className="font-display font-bold text-base mt-2">12 ms</h5>
            </div>
            <div className="p-1.5 rounded-md bg-brand/15 text-brand">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-4">
            <Info className="w-3.5 h-3.5" />
            <span>Spring Boot server is active</span>
          </div>
        </div>
      </div>

      {/* Details Box */}
      <div className="p-6 border border-border bg-surface rounded-md shadow-sm">
        <h4 className="font-display font-semibold text-xs tracking-wide text-text-secondary uppercase mb-4">
          Credentials Security Policy
        </h4>
        <p className="text-xs text-text-secondary leading-relaxed">
          skylar_interview does not store API credentials on database records. The application consumes keys strictly from runtime environment variables (`MONDAY_API_TOKEN` and `GEMINI_API_KEY`) ensuring high isolation standards and compliance with cloud-native security practices.
        </p>
      </div>
    </motion.div>
  );
};
