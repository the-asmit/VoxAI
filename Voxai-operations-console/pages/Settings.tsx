
import React from 'react';
import { Save } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase tracking-widest">System Configuration</h1>
          <p className="text-sm text-slate-500 mt-1">Global parameters, security rules, and agent identity settings.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700 transition-colors shadow-sm">
          <Save size={14} />
          COMMIT CHANGES
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Workspace Identity</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Identity attributes used by the AI agent during caller introductions and verification steps.</p>
        </div>
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Organization Name</label>
            <input type="text" defaultValue="VoxAI Regional Operations" className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-900 focus:outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Timezone</label>
            <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-900">
              <option>UTC - Coordinated Universal Time</option>
              <option>EST - Eastern Standard Time</option>
            </select>
          </div>
        </div>

        <div className="lg:col-span-12 border-t border-slate-200" />

        <div className="lg:col-span-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Escalation Handlers</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Designated endpoints and personnel for high-distress or complex query handovers.</p>
        </div>
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operator Name</th>
                <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="relative px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="text-xs">
                <td className="px-4 py-3 font-bold text-slate-700">admin.primary@voxai.internal</td>
                <td className="px-4 py-3 text-emerald-600 font-bold uppercase tracking-tighter">Verified</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase">Revoke</button>
                </td>
              </tr>
              <tr className="text-xs">
                <td className="px-4 py-3 font-bold text-slate-700">ops.lead@voxai.internal</td>
                <td className="px-4 py-3 text-emerald-600 font-bold uppercase tracking-tighter">Verified</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase">Revoke</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="p-3 bg-slate-50/50 border-t border-slate-100">
            <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">+ Register New Handler</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
