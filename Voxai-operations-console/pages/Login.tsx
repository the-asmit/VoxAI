
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { OrganizationType } from '../types';
import { 
  Shield, 
  Briefcase, 
  Zap, 
  ArrowRight, 
  Lock, 
  Cpu,
  Server,
  Terminal,
  ChevronRight
} from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();

  const options = [
    {
      type: OrganizationType.GOVERNMENT,
      title: 'Government Operations',
      subtitle: 'Citizen-Centric Interface',
      description: 'Environment for public sector workflows, municipal hotline management, and citizen outreach.',
      capabilities: ['Public Records Link', 'Emergency Routing', 'Municipal KB'],
      icon: Shield,
      accent: 'indigo'
    },
    {
      type: OrganizationType.COMPANY,
      title: 'Corporate Operations',
      subtitle: 'Enterprise Engagement',
      description: 'Optimized for high-volume customer support, B2B account recovery, and sales automation.',
      capabilities: ['CRM Synchronization', 'Billing Verification', 'SLA Monitoring'],
      icon: Briefcase,
      accent: 'slate'
    },
    {
      type: OrganizationType.CUSTOM,
      title: 'Custom Deployment',
      subtitle: 'Modular Configuration',
      description: 'Specialized context for NGOs or unique organizational structures with custom logic requirements.',
      capabilities: ['API Integration', 'Custom Flow Logic', 'Modular Schemas'],
      icon: Zap,
      accent: 'amber'
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden font-sans">
      
      {/* Structural Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* TOP COMMAND SECTION */}
      <div className="bg-slate-900 w-full pt-12 pb-24 px-6 relative z-10 border-b border-indigo-500/20 shadow-xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded mb-6">
              <Terminal size={12} className="text-indigo-400" />
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">System Gate: X-771</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">
              VOX<span className="text-indigo-500 font-black">AI</span> <span className="text-slate-500 font-light">OPERATIONS</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest opacity-60">
              Select Operational Workspace to Initialize Terminal
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-6">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Status</p>
                <p className="text-xs font-bold text-white uppercase tracking-tight">E2EE Protocol Active</p>
             </div>
             <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-indigo-400 border border-slate-700">
                <Server size={20} />
             </div>
          </div>
        </div>
      </div>

      {/* HORIZONTAL WORKSPACE CARDS */}
      <div className="max-w-6xl w-full mx-auto px-6 -mt-12 relative z-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((opt) => (
            <button
              key={opt.type}
              onClick={() => login(opt.type)}
              className="group flex flex-col bg-white border border-slate-200 rounded-lg text-left hover:border-indigo-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Header Visual */}
              <div className="p-6 bg-slate-50 border-b border-slate-100 group-hover:bg-indigo-50/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded bg-white flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm border border-slate-200 group-hover:border-indigo-500">
                    <opt.icon size={24} strokeWidth={2} />
                  </div>
                  <Lock size={14} className="text-slate-200 group-hover:text-indigo-300" />
                </div>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{opt.subtitle}</p>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{opt.title}</h3>
              </div>

              {/* Functional Content */}
              <div className="p-6 flex-1 space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed min-h-[48px]">
                  {opt.description}
                </p>
                
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Capabilities</p>
                  {opt.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <ChevronRight size={10} className="text-indigo-400" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-6 border-t border-slate-50 mt-auto bg-slate-50 group-hover:bg-indigo-600 transition-all flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-400 group-hover:text-white uppercase tracking-[0.15em]">
                  Initialize Session
                </span>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>

        {/* REFINED SYSTEM INFO FOOTER */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Cpu size={14} className="text-slate-300" />
              <div>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Architecture</p>
                <p className="text-[11px] text-slate-700 font-bold uppercase tracking-tight">VoxAI Core v1.0.0-PROD</p>
              </div>
            </div>
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <Shield size={14} className="text-slate-300" />
              <div>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Authorization</p>
                <p className="text-[11px] text-slate-700 font-bold uppercase tracking-tight">Role-Based Access Control</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded border border-emerald-100">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <p className="text-[10px] text-emerald-700 font-black uppercase tracking-[0.1em]">Verified Operations Environment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
