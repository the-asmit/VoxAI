
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { OrganizationType } from '../types';
import { 
  Plus, 
  FileText, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Upload, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  BookOpen,
  Info,
  Database,
  AlertCircle
} from 'lucide-react';

// --- Types ---

interface KnowledgeDoc {
  id: string;
  name: string;
  type: 'PDF' | 'TXT';
  uploadDate: string;
  status: 'Indexed' | 'Pending';
}

interface KnowledgeCategory {
  id: string;
  profile: OrganizationType;
  name: string;
  description: string;
  docs: KnowledgeDoc[];
  usage: {
    inbound: boolean;
    outbound: boolean;
  };
}

// --- Mock Data ---

const INITIAL_CATEGORIES: KnowledgeCategory[] = [
  {
    id: 'cat-1',
    profile: OrganizationType.GOVERNMENT,
    name: 'Pension Services & Eligibility',
    description: 'Documentation regarding senior citizen pension schemes, income thresholds, and document requirements for application.',
    docs: [
      { id: 'doc-1', name: 'Standard_Pension_Protocol_2024.pdf', type: 'PDF', uploadDate: '2024-03-01', status: 'Indexed' },
      { id: 'doc-2', name: 'Eligibility_Checklist_v2.txt', type: 'TXT', uploadDate: '2024-03-05', status: 'Indexed' }
    ],
    usage: { inbound: true, outbound: true }
  },
  {
    id: 'cat-2',
    profile: OrganizationType.GOVERNMENT,
    name: 'Municipal Traffic Regulations',
    description: 'Traffic violation codes, fine structures, and parking permit regulations for the North District.',
    docs: [
      { id: 'doc-3', name: 'Traffic_Codes_Master_v4.pdf', type: 'PDF', uploadDate: '2024-02-15', status: 'Indexed' }
    ],
    usage: { inbound: true, outbound: false }
  },
  {
    id: 'cat-3',
    profile: OrganizationType.COMPANY,
    name: 'Billing & Invoice FAQ',
    description: 'Guidelines for resolving billing discrepancies, payment cycles, and corporate discount eligibility.',
    docs: [
      { id: 'doc-4', name: 'Corporate_Billing_Logic.pdf', type: 'PDF', uploadDate: '2024-03-10', status: 'Indexed' }
    ],
    usage: { inbound: true, outbound: true }
  },
  {
    id: 'cat-4',
    profile: OrganizationType.CUSTOM,
    name: 'Organization Protocol - NGO',
    description: 'Standard operating procedures for volunteer coordination and donor relationship management.',
    docs: [
      { id: 'doc-5', name: 'Volunteer_Manual_2025.pdf', type: 'PDF', uploadDate: '2024-01-20', status: 'Indexed' }
    ],
    usage: { inbound: false, outbound: true }
  }
];

const KnowledgeBase: React.FC = () => {
  const { user } = useAuth();
  
  // Terminology based on Login Profile
  const terminology = user?.orgType === OrganizationType.GOVERNMENT ? 'Citizen' : 'Customer';
  const profileLabel = user?.orgType === OrganizationType.GOVERNMENT ? 'Government' : user?.orgType === OrganizationType.COMPANY ? 'Company' : 'Organization';

  // --- State ---
  const [categories, setCategories] = useState<KnowledgeCategory[]>(INITIAL_CATEGORIES);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(['cat-1', 'cat-4']));
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // --- Modal Form State ---
  const [newDocCategory, setNewDocCategory] = useState('');
  const [newDocFile, setNewDocFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // --- Handlers ---

  const toggleCategory = (id: string) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const removeDoc = (catId: string, docId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === catId) {
        return { ...cat, docs: cat.docs.filter(d => d.id !== docId) };
      }
      return cat;
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type === 'text/plain')) {
      setNewDocFile(file);
    } else {
      alert("Only PDF or TXT files are permitted.");
    }
  };

  const submitUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsUploadModalOpen(false);
      setNewDocFile(null);
      setNewDocCategory('');
    }, 1500);
  };

  const filteredCategories = categories.filter(c => c.profile === user?.orgType);

  return (
    <div className="space-y-6 text-left">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight uppercase tracking-widest">Knowledge Registry</h1>
          <p className="text-[11px] text-slate-500 font-medium">Managing truth sources for the <span className="text-indigo-600 font-bold">{profileLabel}</span> agent profile.</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-[10px] font-black rounded hover:bg-indigo-700 transition-all uppercase tracking-widest shadow-sm"
        >
          <Plus size={14} />
          Upload New Knowledge
        </button>
      </div>

      {/* ACTIVE PROFILE BADGE (Non-switchable as per Login context) */}
      <div className="flex items-center gap-4 py-2 px-4 bg-white border border-slate-200 rounded">
        <div className="p-1.5 bg-slate-100 rounded text-slate-500">
          <Database size={16} />
        </div>
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Workspace Context</p>
          <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{profileLabel} Mode</p>
        </div>
        <div className="h-6 w-px bg-slate-200 mx-2" />
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">AI Retrieval Synchronized</p>
        </div>
      </div>

      {/* CATEGORIES LIST */}
      <div className="space-y-4">
        {filteredCategories.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-16 text-center">
            <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">No Knowledge Found</h3>
            <p className="text-[11px] text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
              No domain-specific documentation has been indexed for the {profileLabel} profile yet.
            </p>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div key={cat.id} className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
              {/* Category Header */}
              <div 
                className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-all"
                onClick={() => toggleCategory(cat.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{cat.name}</h2>
                    <span className="text-[9px] font-bold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                      {cat.docs.length} Sources
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 truncate max-w-2xl">{cat.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {cat.usage.inbound && (
                      <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-sm">
                        Inbound
                      </span>
                    )}
                    {cat.usage.outbound && (
                      <span className="text-[8px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-sm">
                        Outbound
                      </span>
                    )}
                  </div>
                  <div className="h-6 w-px bg-slate-100 mx-2" />
                  {expandedCats.has(cat.id) ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                </div>
              </div>

              {/* Expandable Body */}
              {expandedCats.has(cat.id) && (
                <div className="border-t border-slate-100 px-6 pb-6 bg-slate-50/20">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-100 mt-4">
                      <thead>
                        <tr>
                          <th className="py-2 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Knowledge Source</th>
                          <th className="py-2 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Format</th>
                          <th className="py-2 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Index Date</th>
                          <th className="py-2 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">AI Status</th>
                          <th className="relative py-2">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {cat.docs.map((doc) => (
                          <tr key={doc.id} className="group">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <FileText size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                <span className="text-[11px] font-bold text-slate-700">{doc.name}</span>
                              </div>
                            </td>
                            <td className="py-3 text-[10px] font-mono text-slate-400">{doc.type}</td>
                            <td className="py-3 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{doc.uploadDate}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase">
                                <CheckCircle2 size={12} />
                                {doc.status}
                              </div>
                            </td>
                            <td className="py-3 text-right">
                              <button 
                                onClick={(e) => { e.stopPropagation(); removeDoc(cat.id, doc.id); }}
                                className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                title="De-index source"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* OPERATIONAL NOTICE */}
      <div className="flex items-center gap-4 bg-indigo-50/50 border border-indigo-100 rounded p-4">
        <div className="p-2 bg-indigo-100 rounded text-indigo-600 shrink-0">
          <Info size={18} />
        </div>
        <div>
          <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Retrieval Policy ({profileLabel})</h4>
          <p className="text-[11px] text-indigo-700/80 leading-relaxed max-w-4xl font-medium">
            AI agents in <span className="font-bold underline">{profileLabel} Mode</span> will only reference documentation explicitly indexed within this registry. 
            Cross-profile data leakage is prevented by operational isolation at the core level.
          </p>
        </div>
      </div>

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isUploading && setIsUploadModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md flex flex-col shadow-2xl rounded border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded">
                  <Upload size={16} />
                </div>
                <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">New {profileLabel} Knowledge</h2>
              </div>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                disabled={isUploading}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Category Selector */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Target Use Case Category</label>
                <select 
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-[11px] font-bold text-slate-700 outline-none focus:border-indigo-600"
                >
                  <option value="">-- Choose Category --</option>
                  {filteredCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                  <option value="NEW">+ Create New Use Case Category</option>
                </select>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Source Document (PDF / TXT Only)</label>
                <div 
                  className={`w-full py-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    newDocFile ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40'
                  }`}
                  onClick={() => document.getElementById('kb-upload')?.click()}
                >
                  <Upload size={24} className={newDocFile ? 'text-emerald-500' : 'text-slate-300'} />
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {newDocFile ? newDocFile.name : 'Select PDF or Plain Text'}
                    </p>
                    {!newDocFile && <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight mt-1 leading-tight">Max size 25MB &bull; Automated indexing enabled</p>}
                  </div>
                  <input 
                    id="kb-upload"
                    type="file" 
                    className="hidden" 
                    onChange={handleFileUpload} 
                    accept=".pdf,.txt" 
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-3 rounded flex gap-3 shadow-inner">
                <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[9px] text-amber-700 font-bold leading-relaxed uppercase tracking-tight">
                  This document will be bound strictly to the {profileLabel} operational context. It will not be accessible to other organization profiles.
                </p>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors"
                disabled={isUploading}
              >
                Discard
              </button>
              <button 
                onClick={submitUpload}
                disabled={isUploading || !newDocFile || !newDocCategory}
                className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded shadow hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <div className="w-2.5 h-2.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Indexing...
                  </>
                ) : (
                  'Confirm Upload'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
