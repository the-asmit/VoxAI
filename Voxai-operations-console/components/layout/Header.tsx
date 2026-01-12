
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { OrganizationType } from '../../types';
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarCollapsed }) => {
  const { user, logout } = useAuth();

  const getLabel = (type?: OrganizationType) => {
    switch (type) {
      case OrganizationType.GOVERNMENT: return 'Government Mode';
      case OrganizationType.COMPANY: return 'Corporate Mode';
      default: return 'Standard Mode';
    }
  };

  return (
    <header className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-colors"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
        
        <div className="h-4 w-px bg-slate-200 mx-1" />
        
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold tracking-tight text-slate-900 uppercase">VoxAI</h2>
          <span className="text-[10px] font-bold py-0.5 px-2 rounded border border-slate-200 bg-slate-50 text-slate-600 uppercase tracking-wider">
            {getLabel(user?.orgType)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right leading-tight">
          <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
          <p className="text-[10px] text-slate-500 uppercase font-medium">{user?.role}</p>
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <button 
          onClick={logout}
          className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors uppercase tracking-tight"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
