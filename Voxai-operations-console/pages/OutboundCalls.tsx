
import React, { useState } from 'react';
import { voxApi, OutboundCallResponse } from '../lib/api';
import { 
  Play, 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Settings2,
  PhoneOutgoing,
  MessageSquare,
  Hash,
  Activity,
  XCircle
} from 'lucide-react';

const OutboundCalls: React.FC = () => {
  // --- Form State ---
  const [phoneNumber, setPhoneNumber] = useState('');
  const [openingMessage, setOpeningMessage] = useState('Hello, this is VoxAI calling regarding your recent inquiry. How are you today?');
  
  // --- Request State ---
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<OutboundCallResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartCall = async () => {
    if (!phoneNumber || !openingMessage) {
      setError('Please provide both a phone number and an opening message.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLastResult(null);

    try {
      const response = await voxApi.startOutboundCall({
        phoneNumber,
        openingMessage
      });
      
      // Check if the call was successfully started
      if (response.status === 'started' || response.status === 'success') {
        setLastResult(response);
      } else if (response.status === 'failed' || response.status === 'error') {
        throw new Error(response.detail || 'Call failed to initiate');
      } else {
        setLastResult(response);
      }
    } catch (err: any) {
      console.error('Call initiation error:', err);
      setError(err.message || 'An unexpected error occurred while initiating the call.');
      setLastResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden space-y-4 text-left">
      {/* HEADER */}
      <div className="flex items-end justify-between px-1">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight uppercase tracking-widest italic">Outbound Gateway</h1>
          <p className="text-[11px] text-slate-500 font-medium tracking-tight">Direct interaction terminal linked to backend Vapi core.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded border border-slate-200 shadow-inner">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Gateway Ready</span>
           </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        
        {/* LEFT PANEL: DIRECT CALL TRIGGER */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-1">
          
          <div className="bg-white border border-slate-200 rounded p-6 space-y-6 shadow-sm">
            <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-3 flex items-center gap-2">
              <Settings2 size={14} className="text-indigo-600" />
              Direct Call Configuration
            </h2>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Hash size={12} className="text-indigo-500" /> Target Phone Number
                </label>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-indigo-700 focus:bg-white focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <MessageSquare size={12} className="text-indigo-500" /> Opening Message (TTS Prompt)
                </label>
                <textarea 
                  value={openingMessage}
                  onChange={(e) => setOpeningMessage(e.target.value)}
                  placeholder="Greeting script used for initial handshake..."
                  className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:bg-white focus:border-indigo-600 outline-none resize-none leading-relaxed transition-all"
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
                  <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-rose-600 leading-relaxed uppercase tracking-tight">{error}</p>
                </div>
              )}

              {lastResult && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg space-y-2 animate-in fade-in slide-in-from-bottom-2">
                   <div className="flex items-center gap-2 text-emerald-700">
                     <CheckCircle2 size={16} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Call Dispatched Successfully</span>
                   </div>
                   <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="p-2 bg-white rounded border border-emerald-100">
                         <p className="text-[8px] font-black text-slate-400 uppercase">Call ID</p>
                         <p className="text-[10px] font-mono font-bold text-slate-700 truncate">{lastResult.vapi_response?.id || 'N/A'}</p>
                      </div>
                      <div className="p-2 bg-white rounded border border-emerald-100">
                         <p className="text-[8px] font-black text-slate-400 uppercase">Remote Status</p>
                         <p className="text-[10px] font-bold text-emerald-600 uppercase">{lastResult.vapi_response?.status || 'Active'}</p>
                      </div>
                   </div>
                </div>
              )}

              <button 
                onClick={handleStartCall}
                disabled={isLoading}
                className="w-full py-4 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.98]"
              >
                {isLoading ? (
                  <Activity size={18} className="animate-spin" />
                ) : (
                  <PhoneOutgoing size={18} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                )}
                {isLoading ? 'Establishing Link...' : 'Initiate Outbound Call'}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-4 flex gap-4 shadow-sm italic">
            <AlertCircle size={20} className="text-slate-300 shrink-0" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
              * Calls are initiated via the Vapi backend endpoint. Ensure the target number is in E.164 format for optimal routing.
            </p>
          </div>

        </div>

        {/* RIGHT PANEL: SESSION LOGS & CONTEXT */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded flex flex-col shadow-sm overflow-hidden min-h-0">
          
          <div className="px-4 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-100">
                <Activity size={18} />
              </div>
              <div>
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Operational Session Stream</h3>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">Active Handshake Monitoring</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
              <Phone size={32} className="text-slate-200" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">No Active Handshake</h4>
              <p className="text-[11px] text-slate-400 font-medium max-w-[280px] leading-relaxed mx-auto">
                Trigger an outbound call using the terminal to view live session identifiers and response payloads.
              </p>
            </div>
          </div>

          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">API v1.2</span>
                </div>
                <div className="h-3 w-px bg-slate-200"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol: JSON/REST</span>
             </div>
             <p className="text-[9px] text-slate-300 font-bold uppercase tracking-tight italic">
               VoxAI Engine: Core Interaction v4.2
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OutboundCalls;
