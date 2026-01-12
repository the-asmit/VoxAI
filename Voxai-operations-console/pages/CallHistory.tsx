
import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  Filter, 
  Search, 
  Phone, 
  X, 
  ExternalLink, 
  ShieldAlert, 
  User as UserIcon, 
  Cpu, 
  Clock,
  ArrowRight,
  Maximize2,
  Database
} from 'lucide-react';

// --- Mock Data Types ---

type CallStatus = 'live' | 'completed' | 'escalated';

interface TranscriptEntry {
  speaker: 'user' | 'ai';
  text: string;
  time: string;
}

interface Call {
  id: string;
  caller_name: string;
  phone: string;
  status: CallStatus;
  duration: string;
  timestamp: string;
  summary: string;
  transcript: TranscriptEntry[];
}

// --- Live Conversation Simulation Data ---

const LIVE_DIALOGUE_SEQUENCE: TranscriptEntry[] = [
  { speaker: 'user', text: "Hello, I'm calling to check the status of my business permit application, reference #4492.", time: "10:22:05 AM" },
  { speaker: 'ai', text: "One moment while I access the registry. I see application 4492 is currently in 'Initial Review' by the Planning Department.", time: "10:22:12 AM" },
  { speaker: 'user', text: "It's been in that status for over two weeks. The website said it would take five business days.", time: "10:22:20 AM" },
  { speaker: 'ai', text: "I apologize for the delay. There appears to be a high volume of applications this quarter. Would you like me to flag this for manual follow-up or provide the direct extension for Planning?", time: "10:22:28 AM" },
  { speaker: 'user', text: "Can you just put me through to a person? This is getting urgent.", time: "10:22:35 AM" },
  { speaker: 'ai', text: "I can certainly arrange that. Preparing a handover to a human representative now. Please stay on the line.", time: "10:22:42 AM" },
];

const MOCK_CALLS: Call[] = [
  {
    id: 'VOX-7721',
    caller_name: 'Marcus Thorne',
    phone: '+1 (555) 012-4492',
    status: 'live',
    duration: '02:45',
    timestamp: 'Today, 10:22 AM',
    summary: '',
    transcript: [] 
  },
  {
    id: 'VOX-7718',
    caller_name: 'Unknown Caller',
    phone: '+1 (555) 982-1103',
    status: 'completed',
    duration: '04:12',
    timestamp: 'Today, 09:45 AM',
    summary: 'The caller inquired about property tax relief eligibility for seniors. AI successfully provided the criteria and emailed the application link to the verified address on file. No grievances detected.',
    transcript: [
      { speaker: 'user', text: "Hi, I'm calling to see if I qualify for the senior tax relief program.", time: "09:45:10 AM" },
      { speaker: 'ai', text: "I can help with that. To qualify for the Senior Citizens Real Estate Tax Deferral, you must be 65 or older by December 31st. May I verify your birth year?", time: "09:45:18 AM" },
      { speaker: 'user', text: "Yes, 1958.", time: "09:45:22 AM" },
      { speaker: 'ai', text: "Thank you. You meet the age requirement. Your household income must also be below $65,000. Does your current filing reflect that?", time: "09:45:30 AM" }
    ]
  },
  {
    id: 'VOX-7712',
    caller_name: 'Sarah Jenkins',
    phone: '+1 (555) 443-8821',
    status: 'escalated',
    duration: '01:30',
    timestamp: 'Today, 08:12 AM',
    summary: 'Caller was highly distressed regarding a utility shut-off notice. AI detected sentiment threshold breach and initiated a priority handover to the Crisis Management team.',
    transcript: [
      { speaker: 'user', text: "I just got a shut-off notice and I have children in the house! This is a mistake, I paid my bill!", time: "08:12:05 AM" },
      { speaker: 'ai', text: "I understand this is a stressful situation. I am prioritizing your call for a human supervisor who can override the automated system. One moment.", time: "08:12:15 AM" }
    ]
  }
];

// --- Sub-components ---

const StatusBadge: React.FC<{ status: CallStatus }> = ({ status }) => {
  const styles = {
    live: 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    escalated: 'bg-orange-50 text-orange-700 border-orange-200'
  };
  
  return (
    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-widest ${styles[status]}`}>
      {status === 'live' && <span className="inline-block w-1.5 h-1.5 bg-indigo-600 rounded-full mr-1.5 mb-0.5" />}
      {status}
    </span>
  );
};

const CallHistory: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>(MOCK_CALLS);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [liveIndex, setLiveIndex] = useState(0);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedCall = calls.find(c => c.id === selectedCallId);

  // --- Live Simulation Logic ---
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveIndex((prev) => {
        if (prev < LIVE_DIALOGUE_SEQUENCE.length) {
          const nextIndex = prev + 1;
          if (LIVE_DIALOGUE_SEQUENCE[prev].speaker === 'user') {
            setIsAiResponding(true);
            setTimeout(() => setIsAiResponding(false), 2000);
          }
          return nextIndex;
        }
        return prev;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setCalls(prevCalls => prevCalls.map(call => {
      if (call.status === 'live') {
        return {
          ...call,
          transcript: LIVE_DIALOGUE_SEQUENCE.slice(0, liveIndex)
        };
      }
      return call;
    }));
  }, [liveIndex]);

  // Auto-scroll transcript in modal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedCall?.transcript.length]);

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase tracking-widest italic">Operational Logs</h1>
          <p className="text-sm text-slate-500 mt-1">Review call outcome data. <span className="font-bold text-indigo-500">Backend Integration Pending</span></p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded text-[10px] font-black text-indigo-700 uppercase">
             <Database size={12} />
             Consuming Mock API
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 text-xs font-bold text-slate-700 rounded hover:bg-slate-50 shadow-sm transition-all">
            <Download size={14} />
            EXPORT
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Filter archives..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-auto">
            Historical Audit
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {calls.map((call) => (
            <div 
              key={call.id} 
              className="flex items-center px-6 py-4 cursor-pointer hover:bg-slate-50/80 transition-all group"
              onClick={() => setSelectedCallId(call.id)}
            >
              <div className="flex items-center gap-4 w-1/3">
                <div className={`p-2 rounded-full ${call.status === 'live' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                  <Phone size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{call.caller_name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{call.phone}</p>
                </div>
              </div>

              <div className="w-1/6">
                <StatusBadge status={call.status} />
              </div>

              <div className="w-1/6 flex items-center gap-2 text-slate-500">
                <Clock size={12} />
                <span className="text-[10px] font-bold tracking-tight">{call.duration}</span>
              </div>

              <div className="w-1/4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{call.timestamp}</p>
              </div>

              <div className="ml-auto flex items-center gap-4">
                <button className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold uppercase tracking-widest hover:underline whitespace-nowrap flex items-center gap-1.5">
                  Inspect <Maximize2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Call Details Modal --- */}
      {selectedCall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            onClick={() => setSelectedCallId(null)} 
          />
          <div className="relative bg-white w-full max-w-5xl max-h-full overflow-hidden flex flex-col shadow-2xl rounded-xl border border-slate-200 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100 rounded text-slate-600">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Handshake {selectedCall.id}</h2>
                    <StatusBadge status={selectedCall.status} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{selectedCall.caller_name} &bull; {selectedCall.phone}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCallId(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Transcript Column */}
                <div className="lg:col-span-8 flex flex-col h-[500px]">
                  <div className="flex items-center justify-between mb-3 shrink-0">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      Interaction Sequence (Mocked)
                    </h3>
                  </div>

                  <div 
                    ref={scrollRef}
                    className="flex-1 bg-white border border-slate-200 rounded p-4 font-mono text-[11px] leading-relaxed overflow-y-auto shadow-inner space-y-3"
                  >
                    {selectedCall.transcript.map((entry, idx) => (
                      <div key={idx} className="flex gap-4 border-b border-slate-50 pb-2 last:border-0 group animate-in fade-in slide-in-from-bottom-1">
                        <span className="text-slate-300 shrink-0 w-16 uppercase tracking-tighter font-medium">{entry.time.split(' ')[0]}</span>
                        <div className="flex-1">
                          <span className={`font-bold uppercase tracking-tighter mr-2 ${entry.speaker === 'ai' ? 'text-indigo-600' : 'text-slate-900'}`}>
                            {entry.speaker === 'ai' ? 'VoxAI' : 'User'}:
                          </span>
                          <span className="text-slate-700">{entry.text}</span>
                        </div>
                      </div>
                    ))}

                    {selectedCall.status === 'live' && (
                      <div className="pt-2 flex items-center gap-2 text-indigo-500 font-bold italic animate-pulse">
                        {isAiResponding ? (
                          <><Cpu size={12} /> <span>VoxAI thinking...</span></>
                        ) : (
                          <><UserIcon size={12} /> <span>Citizen speaking...</span></>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary & Actions Column */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="bg-white border border-slate-200 rounded p-5 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-50 pb-2">Analysis</h3>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded border border-slate-100 shadow-inner">
                      {selectedCall.summary || 'Summary generation active...'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Procedures</h3>
                    <button className="w-full flex items-center justify-between px-3 py-2.5 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded shadow-sm hover:bg-indigo-700 transition-colors">
                      Human Escalation
                      <ArrowRight size={12} />
                    </button>
                    <button className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold uppercase rounded shadow-sm hover:bg-slate-50 transition-colors">
                      Log Formal Complaint
                      <ShieldAlert size={12} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallHistory;
