
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { voxApi, SystemStats } from '../lib/api';
import { 
  PhoneIncoming, 
  PhoneOutgoing, 
  CheckCircle2, 
  Save, 
  ShieldCheck,
  Cpu,
  Brain,
  MessageSquare,
  AlertCircle,
  Activity,
  UserCheck,
  Zap,
  Hash,
  Wifi,
  WifiOff,
  BarChart3,
  Users
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- Backend State ---
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [backendMessage, setBackendMessage] = useState('');
  const [stats, setStats] = useState<SystemStats | null>(null);

  // --- Configuration State ---
  const [agentName, setAgentName] = useState('Alpha Core v2.4');
  const [agentPhone, setAgentPhone] = useState('+1 (800) 555-0199');
  const [deptName, setDeptName] = useState(user?.orgType === 'GOVERNMENT' ? 'Department of Public Works' : 'Customer Success Division');
  const [roleDescription, setRoleDescription] = useState("This agent acts as a first-line support representative. It is authorized to verify identity and provide status updates on existing service requests.");
  const [callPurpose, setCallPurpose] = useState("The primary goal is to resolve basic status inquiries and accurately log grievances for review.");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Check Backend Health (GET /)
        const health = await voxApi.checkHealth();
        setBackendStatus(health.status as any);
        setBackendMessage(health.message);

        // 2. Fetch Stats (GET /stats)
        const data = await voxApi.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setBackendStatus('offline');
        setBackendMessage('Failed to connect to backend');
      }
    };
    fetchData();
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* 1. CALL CONTROLS & STATUS BAR */}
      <section className="bg-slate-900 rounded-xl p-4 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg transition-colors ${
            backendStatus === 'online' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
            backendStatus === 'offline' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
            'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
          }`}>
            {backendStatus === 'online' ? <Wifi size={14} className="animate-pulse" /> : 
             backendStatus === 'offline' ? <WifiOff size={14} /> : 
             <Activity size={14} className="animate-pulse" />}
            <span className="text-[10px] font-black uppercase tracking-widest">
              {backendMessage || 'Initializing Backend...'}
            </span>
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white uppercase tracking-tight">Agent Overview</h1>
            <p className="text-xs text-slate-400 font-medium tracking-tight">System control for automated voice operations.</p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <button className="flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white text-sm font-bold uppercase tracking-widest rounded-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95 group">
            <PhoneIncoming size={18} strokeWidth={3} />
            Receive Calls
          </button>
          <button 
            onClick={() => navigate('/outbound')}
            className="flex items-center gap-3 px-6 py-3 bg-slate-800 text-slate-100 border border-slate-700 text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-slate-700 transition-all"
          >
            <PhoneOutgoing size={18} strokeWidth={2} />
            Start Outreach
          </button>
        </div>
      </section>

      {/* 2. STATS SECTION (Prepped for GET /stats) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Calls', value: stats?.totalCalls || '...', icon: BarChart3, color: 'indigo' },
          { label: 'Active Sessions', value: stats?.activeSessions || '...', icon: Activity, color: 'emerald' },
          { label: 'Complaints Detected', value: stats?.complaintsDetected || '...', icon: AlertCircle, color: 'amber' },
          { label: 'Success Rate', value: stats?.successRate || '...', icon: UserCheck, color: 'blue' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm group hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 bg-${item.color}-50 text-${item.color}-600 rounded-lg`}>
                <item.icon size={16} />
              </div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Demo Data</span>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
            <p className="text-xl font-black text-slate-900">{item.value}</p>
          </div>
        ))}
      </section>

      {/* MAIN OPERATIONAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: AGENT CONFIGURATION */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600">
                <Brain size={18} strokeWidth={2.5} />
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-900">Agent Persona Settings</h2>
              </div>
              <Zap size={14} className="text-slate-300" />
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  Operational Guidelines
                  <AlertCircle size={12} className="text-slate-300" />
                </label>
                <textarea 
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 outline-none transition-all resize-none h-32 leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Core Objectives</label>
                <textarea 
                  value={callPurpose}
                  onChange={(e) => setCallPurpose(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 outline-none transition-all resize-none h-24 leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: IDENTITY & SYSTEM STATUS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <Cpu size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase">Agent Identity</h3>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">System Profile v1</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Display Name</label>
                <input 
                  type="text" 
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Hash size={10} /> Caller ID
                </label>
                <input 
                  type="text" 
                  value={agentPhone}
                  onChange={(e) => setAgentPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-mono font-bold text-indigo-700"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-4">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white text-xs font-black uppercase rounded-lg shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              <Save size={18} />
              {isSaving ? 'Updating...' : 'Commit Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
