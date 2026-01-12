
import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Search, 
  Filter, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Send, 
  Phone,
  FileText,
  ShieldAlert,
  ChevronRight,
  Mail,
  History,
  CheckCircle
} from 'lucide-react';

// --- Types ---

type ComplaintStatus = 'Open' | 'In Progress' | 'Escalated' | 'Resolved';

interface Complaint {
  id: string;
  caller_name: string;
  phone: string;
  call_id: string;
  call_timestamp: string;
  summary: string;
  status: ComplaintStatus;
  created_at: string;
  last_notified_at?: string;
}

// --- Mock Data ---

const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-9044',
    caller_name: 'Marcus Thorne',
    phone: '+1 (555) 012-4492',
    call_id: 'VOX-7721',
    call_timestamp: '2024-03-14 10:22 AM',
    summary: 'The citizen expressed frustration regarding a two-week delay in business permit #4492 processing. Contradictory information provided via online portal.',
    status: 'Open',
    created_at: '2024-03-14 10:25 AM',
  },
  {
    id: 'CMP-9041',
    caller_name: 'Sarah Jenkins',
    phone: '+1 (555) 443-8821',
    call_id: 'VOX-7712',
    call_timestamp: '2024-03-14 08:12 AM',
    summary: 'High distress detected regarding utility disconnection. Claims payment was submitted on 03/10. Automated system failed to reflect updated balance.',
    status: 'Escalated',
    created_at: '2024-03-14 08:15 AM',
    last_notified_at: '2024-03-14 08:20 AM'
  },
  {
    id: 'CMP-8992',
    caller_name: 'David Wilson',
    phone: '+1 (555) 221-0092',
    call_id: 'VOX-7650',
    call_timestamp: '2024-03-13 03:45 PM',
    summary: 'Minor grievance regarding signage at North District center. Clarification requested for holiday hours.',
    status: 'Resolved',
    created_at: '2024-03-13 04:00 PM',
  },
  {
    id: 'CMP-8985',
    caller_name: 'Elena Rodriguez',
    phone: '+1 (555) 887-1123',
    call_id: 'VOX-7642',
    call_timestamp: '2024-03-13 01:10 PM',
    summary: 'Sanitation collection missed for current week. Requesting department callback for resolution.',
    status: 'In Progress',
    created_at: '2024-03-13 01:20 PM',
  },
];

// --- Status Styles ---

const getStatusStyle = (status: ComplaintStatus) => {
  switch (status) {
    case 'Open': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'In Progress': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'Escalated': return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
};

const Complaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNotifying, setIsNotifying] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState(false);

  const selectedComplaint = complaints.find(c => c.id === selectedComplaintId);

  useEffect(() => {
    if (selectedComplaintId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedComplaintId]);

  const handleUpdateStatus = (id: string, newStatus: ComplaintStatus) => {
    setComplaints(prev => prev.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    ));
  };

  const handleSendFollowUp = () => {
    setIsNotifying(true);
    setTimeout(() => {
      setIsNotifying(false);
      setNotificationSuccess(true);
      setComplaints(prev => prev.map(c => 
        c.id === selectedComplaintId ? { ...c, last_notified_at: new Date().toLocaleString() } : c
      ));
      setTimeout(() => setNotificationSuccess(false), 3000);
    }, 1500);
  };

  const filteredComplaints = complaints.filter(c => 
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.caller_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 text-left">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight uppercase tracking-widest">Incident Grievances</h1>
          <p className="text-[11px] text-slate-500 font-medium">Review and manage citizen complaints detected during automated voice interactions.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {}}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 text-[10px] font-bold text-slate-600 rounded hover:bg-slate-50 transition-all uppercase tracking-tight shadow-sm"
          >
            <Download size={14} /> Export Dataset
          </button>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex items-center gap-3 bg-white p-2 border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
          <input 
            type="text" 
            placeholder="Search by ID or Citizen name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium"
          />
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pr-2">
          {filteredComplaints.length} Records Found
        </span>
      </div>

      {/* MAIN TABLE */}
      <div className="bg-white border border-slate-200 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-4 py-2 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Reference ID</th>
                <th className="px-4 py-2 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Citizen Details</th>
                <th className="px-4 py-2 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Source Call</th>
                <th className="px-4 py-2 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Incident Summary</th>
                <th className="px-4 py-2 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Operational Status</th>
                <th className="px-4 py-2 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Logged Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.map((c) => (
                <tr 
                  key={c.id} 
                  onClick={() => setSelectedComplaintId(c.id)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3 text-[11px] font-mono font-bold text-slate-900">{c.id}</td>
                  <td className="px-4 py-3">
                    <div className="text-[11px] font-bold text-slate-900">{c.caller_name}</div>
                    <div className="text-[9px] text-slate-500 font-mono tracking-tighter">{c.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-[10px] font-mono text-slate-400">{c.call_id}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-[11px] text-slate-600 truncate">{c.summary}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                    {c.created_at.split(' ')[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPLAINT DETAIL PANEL (MODAL) */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedComplaintId(null)} />
          
          <div className="relative bg-white w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl rounded border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-slate-100 text-slate-600 rounded">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Operational Review: {selectedComplaint.id}</h2>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Source: {selectedComplaint.call_id} &bull; Logged {selectedComplaint.created_at}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedComplaintId(null)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/20">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: Content & Context */}
                <div className="lg:col-span-8 space-y-6">
                  <section className="space-y-2">
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <FileText size={12} /> Detected Grievance Summary
                    </h3>
                    <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
                      <p className="text-[13px] text-slate-700 leading-relaxed font-medium italic">
                        "{selectedComplaint.summary}"
                      </p>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4">
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Citizen</p>
                          <p className="text-[11px] font-bold text-slate-900">{selectedComplaint.caller_name}</p>
                        </div>
                        <div className="w-px h-6 bg-slate-100" />
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Contact</p>
                          <p className="text-[11px] font-mono font-bold text-slate-900">{selectedComplaint.phone}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <History size={12} /> Notification Audit Trail
                    </h3>
                    <div className="bg-white border border-slate-200 rounded p-3 text-[10px]">
                      {selectedComplaint.last_notified_at ? (
                        <div className="flex items-center justify-between text-emerald-600 font-bold">
                          <span className="flex items-center gap-2">
                            <CheckCircle size={12} /> Last Follow-up Dispatched
                          </span>
                          <span className="font-mono text-[9px]">{selectedComplaint.last_notified_at}</span>
                        </div>
                      ) : (
                        <p className="text-slate-400 font-medium italic text-center py-2">No follow-up notifications dispatched for this record.</p>
                      )}
                    </div>
                  </section>
                </div>

                {/* Right: Operational Controls */}
                <div className="lg:col-span-4 space-y-6">
                  <section className="space-y-3">
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Management Protocol</h3>
                    
                    <div className="space-y-4 bg-white border border-slate-200 rounded p-4 shadow-sm">
                      {/* Status Update */}
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Set Current Status</label>
                        <div className="grid grid-cols-1 gap-1.5">
                          {(['Open', 'In Progress', 'Escalated', 'Resolved'] as ComplaintStatus[]).map((st) => (
                            <button
                              key={st}
                              onClick={() => handleUpdateStatus(selectedComplaint.id, st)}
                              className={`text-left px-3 py-1.5 border rounded text-[10px] font-black uppercase tracking-tight transition-all ${
                                selectedComplaint.status === st 
                                  ? 'border-slate-900 bg-slate-900 text-white' 
                                  : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-px bg-slate-100" />

                      {/* Follow-up Action */}
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Communication Channel</label>
                        <button 
                          onClick={handleSendFollowUp}
                          disabled={isNotifying}
                          className={`w-full flex items-center justify-center gap-2 py-3 rounded text-[10px] font-black uppercase tracking-widest shadow transition-all ${
                            notificationSuccess 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                          } disabled:opacity-50`}
                        >
                          {isNotifying ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Dispatching...
                            </>
                          ) : notificationSuccess ? (
                            <>
                              <CheckCircle2 size={14} /> Sent Successfully
                            </>
                          ) : (
                            <>
                              <Send size={14} /> Send Follow-up Message
                            </>
                          )}
                        </button>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight text-center">
                          * Dispatch based on current status: <span className="text-slate-600">{selectedComplaint.status}</span>
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="p-4 border border-dashed border-slate-200 rounded">
                    <p className="text-[9px] text-slate-400 font-bold uppercase text-center leading-relaxed">
                      Follow-up messages are strictly mapped to the Operational Status. Ensure status is accurate before dispatch.
                    </p>
                  </section>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-white flex justify-end shrink-0">
              <button 
                onClick={() => setSelectedComplaintId(null)}
                className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;
