
import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OrganizationType } from '../types';
import { 
  Link as LinkIcon, 
  Search, 
  Filter, 
  AlertCircle,
  FileSpreadsheet,
  FileText,
  ChevronRight,
  X,
  Database,
  Globe,
  Download,
  Phone,
  User as UserIcon,
  Clock,
  ExternalLink,
  ShieldAlert,
  ArrowUpRight,
  TableProperties,
  CheckCircle2,
  PhoneOutgoing
} from 'lucide-react';

interface DatasetRow {
  [key: string]: string;
}

type SourceType = 'CSV' | 'Excel' | 'Google Sheets';

const Users: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const terminology = user?.orgType === OrganizationType.GOVERNMENT ? 'Citizen' : 'Customer';
  
  // Core State
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<DatasetRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterComplaints, setFilterComplaints] = useState(false);
  const [filterRecent, setFilterRecent] = useState(false);
  
  // Modals
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DatasetRow | null>(null);
  
  // Link Source Modal State
  const [sourceName, setSourceName] = useState('');
  const [sourceType, setSourceType] = useState<SourceType>('CSV');
  const [sourceUrl, setSourceUrl] = useState('');
  const [isLinking, setIsLinking] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const handleLinkSource = () => {
    setIsLinking(true);
    // Simulation of establishing external connection
    setTimeout(() => {
      const mockHeaders = ['id', 'full_name', 'phone_number', 'region', 'last_contacted', 'complaint_count', 'status'];
      const mockData = [
        { id: '1001', full_name: 'Marcus Thorne', phone_number: '+1 (555) 012-4492', region: 'North District', last_contacted: '2024-03-14', complaint_count: '2', status: 'Active' },
        { id: '1002', full_name: 'Sarah Jenkins', phone_number: '+1 (555) 443-8821', region: 'South District', last_contacted: '2024-03-12', complaint_count: '0', status: 'Pending' },
        { id: '1003', full_name: 'David Wilson', phone_number: '+1 (555) 221-0092', region: 'Central Hub', last_contacted: '2024-03-15', complaint_count: '1', status: 'Active' },
        { id: '1004', full_name: 'Elena Rodriguez', phone_number: '+1 (555) 887-1123', region: 'West side', last_contacted: '2024-03-10', complaint_count: '0', status: 'Inactive' },
        { id: '1005', full_name: 'Beatrice Vance', phone_number: '+1 (555) 200-3344', region: 'North District', last_contacted: '2024-03-16', complaint_count: '5', status: 'Active' },
      ];
      setHeaders(mockHeaders);
      setData(mockData);
      setIsLinking(false);
      setIsLinkModalOpen(false);
    }, 1200);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      if (lines.length > 0) {
        const newHeaders = lines[0].split(',').map(h => h.trim());
        const newRows = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const row: DatasetRow = {};
          newHeaders.forEach((h, i) => {
            row[h] = values[i] || '';
          });
          return row;
        });
        setHeaders(newHeaders);
        setData(newRows);
      }
    };
    reader.readAsText(file);
    setIsLinkModalOpen(false);
  };

  const handleExport = () => {
    if (data.length === 0) return;
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => row[h]).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `voxai_registry_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredData = useMemo(() => {
    return data.filter(row => {
      const matchesSearch = Object.values(row).some(val => 
        val.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const complaintKey = headers.find(h => h.toLowerCase().includes('complaint')) || '';
      const hasComplaints = filterComplaints 
        ? (parseInt(row[complaintKey] || '0') > 0) 
        : true;

      // Mock "recently contacted" filter (logic based on string comparison for demo)
      const recentKey = headers.find(h => h.toLowerCase().includes('contacted')) || '';
      const isRecent = filterRecent
        ? (row[recentKey] && row[recentKey] >= '2024-03-14')
        : true;

      return matchesSearch && hasComplaints && isRecent;
    });
  }, [data, searchTerm, filterComplaints, filterRecent, headers]);

  const isEmpty = data.length === 0;

  return (
    <div className="space-y-4 text-left">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight uppercase tracking-widest">{terminology} Registry</h1>
          <p className="text-[11px] text-slate-500 font-medium">Operational database management and external data source synchronization.</p>
        </div>
        <div className="flex items-center gap-2">
          {!isEmpty && (
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 text-[10px] font-bold text-slate-600 rounded hover:bg-slate-50 transition-all uppercase tracking-tight shadow-sm"
            >
              <Download size={14} />
              Export Dataset
            </button>
          )}
          <button 
            onClick={() => setIsLinkModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded hover:bg-indigo-700 transition-all uppercase tracking-tight shadow-sm"
          >
            <LinkIcon size={14} />
            Link Data Source
          </button>
        </div>
      </div>

      {/* OPERATIONAL FILTERS */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-2 border border-slate-200">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
          <input 
            type="text" 
            placeholder={`Filter by name, phone or record identifier...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-200 text-[11px] focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium"
          />
        </div>
        
        <div className="flex items-center gap-3 pr-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div 
              onClick={() => setFilterComplaints(!filterComplaints)}
              className={`w-3.5 h-3.5 rounded-sm border transition-colors flex items-center justify-center ${filterComplaints ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300 group-hover:border-indigo-400'}`}
            >
              {filterComplaints && <CheckCircle2 size={10} className="text-white" />}
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Active Complaints</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <div 
              onClick={() => setFilterRecent(!filterRecent)}
              className={`w-3.5 h-3.5 rounded-sm border transition-colors flex items-center justify-center ${filterRecent ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300 group-hover:border-indigo-400'}`}
            >
              {filterRecent && <CheckCircle2 size={10} className="text-white" />}
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Recently Contacted</span>
          </label>
          <div className="h-4 w-px bg-slate-200" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {filteredData.length} records
          </span>
        </div>
      </div>

      {/* REGISTRY TABLE */}
      <div className="bg-white border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="px-4 py-2 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {header.replace(/_/g, ' ')}
                  </th>
                ))}
                <th className="relative px-4 py-2 w-10">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isEmpty ? (
                <tr>
                  <td colSpan={headers.length + 1} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <TableProperties size={40} className="text-slate-200 mb-4" />
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">No Active Registry Connected</h3>
                      <p className="text-[11px] text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                        Operational data must be linked from external spreadsheets (CSV, Excel, or Google Sheets) to enable outreach campaigns.
                      </p>
                      <button 
                        onClick={() => setIsLinkModalOpen(true)}
                        className="mt-6 px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors rounded shadow-sm"
                      >
                        Link Data Source
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={headers.length + 1} className="px-6 py-10 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No records matching selected criteria</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedUser(row)}
                  >
                    {headers.map((header) => {
                      const isComplaint = header.toLowerCase().includes('complaint');
                      const complaintCount = parseInt(row[header] || '0');
                      
                      return (
                        <td key={header} className="px-4 py-1.5 whitespace-nowrap">
                          {isComplaint && complaintCount > 0 ? (
                            <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 border border-rose-100 bg-rose-50 text-rose-600 text-[9px] font-black uppercase tracking-tighter">
                              {complaintCount} Active
                            </span>
                          ) : (
                            <span className={`text-[11px] font-medium ${header === 'id' ? 'font-mono text-slate-400' : 'text-slate-700'}`}>
                              {row[header] || '-'}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-1.5 whitespace-nowrap text-right">
                      <ChevronRight size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER DETAIL MODAL (INSPECTION) */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <div className="relative bg-white w-full max-w-2xl flex flex-col shadow-2xl rounded border border-slate-200 overflow-hidden animate-in slide-in-from-right-10 duration-200">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 text-slate-600 rounded">
                  <UserIcon size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Record Inspection</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {selectedUser['id'] || 'N/A'}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-8 overflow-y-auto max-h-[70vh]">
              {/* Identity & Core Info */}
              <section className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-1.5">Profile Attributes</h3>
                  <div className="space-y-3">
                    {Object.entries(selectedUser).slice(0, 4).map(([key, val]) => (
                      <div key={key}>
                        <p className="text-[9px] font-black text-slate-400 uppercase">{key.replace(/_/g, ' ')}</p>
                        <p className="text-xs font-bold text-slate-900">{val || '-'}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-1.5">Operational Status</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">Last Contacted</p>
                      <p className="text-xs font-bold text-slate-900">{selectedUser['last_contacted'] || 'Never'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">Active Complaints</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-black uppercase tracking-widest ${parseInt(selectedUser['complaint_count'] || '0') > 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                          {selectedUser['complaint_count'] || '0'} Detected
                        </span>
                        {parseInt(selectedUser['complaint_count'] || '0') > 0 && (
                          <button 
                            onClick={() => navigate('/complaints')}
                            className="text-[9px] font-bold text-indigo-600 hover:underline uppercase"
                          >
                            View Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Interaction History (Mock) */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-1.5">Interaction Log</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded">
                    <div className="flex items-center gap-3">
                      <Phone size={14} className="text-slate-400" />
                      <div>
                        <p className="text-[11px] font-bold text-slate-800">Inbound Call - ID: VOX-7712</p>
                        <p className="text-[10px] text-slate-500 font-medium">Outcome: Complaint Logged &bull; 04m 12s</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">2 days ago</span>
                  </div>
                </div>
              </section>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button 
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors"
              >
                Exit Inspection
              </button>
              <button 
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase rounded shadow hover:bg-indigo-700 transition-all active:scale-95"
              >
                <PhoneOutgoing size={14} />
                Initiate Outbound Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LINK DATA SOURCE MODAL */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isLinking && setIsLinkModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md flex flex-col shadow-2xl rounded border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded">
                  <Database size={16} />
                </div>
                <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Link Operational Source</h2>
              </div>
              <button 
                onClick={() => setIsLinkModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                disabled={isLinking}
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Dataset Identifier</label>
                <input 
                  type="text" 
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="e.g. Q1 Citizen Database"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Source Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['CSV', 'Excel', 'Google Sheets'] as SourceType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSourceType(type)}
                      className={`p-2 border rounded flex flex-col items-center gap-1 transition-all ${
                        sourceType === type 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                          : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {type === 'CSV' && <FileText size={16} />}
                      {type === 'Excel' && <FileSpreadsheet size={16} />}
                      {type === 'Google Sheets' && <Globe size={16} />}
                      <span className="text-[8px] font-black uppercase tracking-tighter">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {sourceType === 'Google Sheets' ? (
                <div className="space-y-1 animate-in slide-in-from-top-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Public Sharing Link</label>
                  <input 
                    type="url" 
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight">Requires public read access for synchronization.</p>
                </div>
              ) : (
                <div className="space-y-1 animate-in slide-in-from-top-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Select Dataset File</label>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 border border-dashed border-slate-200 flex flex-col items-center gap-1 hover:bg-slate-50 transition-all group"
                  >
                    <LinkIcon size={18} className="text-slate-300" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Browse local {sourceType}</span>
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept={sourceType === 'CSV' ? '.csv' : '.xlsx'} />
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button 
                onClick={() => setIsLinkModalOpen(false)}
                className="px-4 py-2 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors"
                disabled={isLinking}
              >
                Cancel
              </button>
              <button 
                onClick={handleLinkSource}
                disabled={isLinking || !sourceName || (sourceType === 'Google Sheets' && !sourceUrl)}
                className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white text-[9px] font-black uppercase rounded shadow hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {isLinking ? (
                  <>
                    <div className="w-2.5 h-2.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Establishing Connection...
                  </>
                ) : (
                  'Connect Source'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
