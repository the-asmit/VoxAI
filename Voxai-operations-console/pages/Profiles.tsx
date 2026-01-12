
import React, { useState, useEffect } from 'react';
import { voxApi, AgentProfile } from '../lib/api';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Cpu, 
  MoreVertical, 
  Search, 
  Activity, 
  Database,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

const Profiles: React.FC = () => {
  const [profiles, setProfiles] = useState<AgentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      const data = await voxApi.getProfiles();
      setProfiles(data);
      setIsLoading(false);
    };
    fetchProfiles();
  }, []);

  return (
    <div className="space-y-6 text-left">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase tracking-widest italic">Agent Profiles</h1>
          <p className="text-sm text-slate-500 mt-1">Configure and manage AI voice identities for specific use cases.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase rounded shadow-lg hover:bg-indigo-700 transition-all">
          <Plus size={16} />
          Create New Profile
        </button>
      </div>

      {/* BACKEND INTEGRATION NOTICE */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-4">
        <div className="p-2 bg-amber-100 rounded text-amber-600">
          <AlertCircle size={18} />
        </div>
        <div>
          <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Backend Integration Pending</h4>
          <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
            The profile management module is prepped to consume the <code className="bg-amber-100 px-1 font-mono">/profiles</code> API. Currently displaying demonstration records.
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text" 
            placeholder="Filter profiles..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="h-4 w-px bg-slate-200 ml-auto" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">
          {profiles.length} Profiles Registered
        </span>
      </div>

      {/* PROFILES TABLE */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Agent Persona</th>
              <th className="px-6 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone Identification</th>
              <th className="px-6 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Operational Status</th>
              <th className="px-6 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Commited</th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {profiles.map((profile) => (
              <tr key={profile.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all`}>
                      <Cpu size={16} />
                    </div>
                    <span className="text-[12px] font-bold text-slate-900 uppercase tracking-tight">{profile.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[11px] font-mono font-bold text-indigo-700">{profile.phoneNumber}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${profile.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{profile.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold uppercase">{profile.lastModified}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-slate-200 rounded text-slate-500 transition-colors" title="Edit Profile">
                      <Edit3 size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-rose-100 rounded text-rose-500 transition-colors" title="Delete Profile">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SYSTEM INFRA FOOTER */}
      <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Database size={14} className="text-slate-300" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Registry Sync: Ready</p>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-slate-300" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Handover Protocol: E2EE</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profiles;
