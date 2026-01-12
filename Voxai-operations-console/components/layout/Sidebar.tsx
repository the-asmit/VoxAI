
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users as UsersIcon,
  PhoneOutgoing, 
  History, 
  AlertCircle, 
  BookOpen, 
  Settings,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', path: '/users', icon: UsersIcon },
  { name: 'Agent Profiles', path: '/profiles', icon: Cpu },
  { name: 'Outbound Calls', path: '/outbound', icon: PhoneOutgoing },
  { name: 'Call History', path: '/history', icon: History },
  { name: 'Complaints', path: '/complaints', icon: AlertCircle },
  { name: 'Knowledge Base', path: '/knowledge', icon: BookOpen },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-60'} bg-slate-900 border-r border-slate-800 flex flex-col sticky top-0 h-screen transition-all duration-200 z-30`}>
      <div className="h-12 px-4 flex items-center border-b border-slate-800 shrink-0">
        <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center shrink-0">
          <span className="text-white font-black text-xs">V</span>
        </div>
        {!isCollapsed && (
          <h1 className="ml-3 text-sm font-bold text-slate-100 uppercase tracking-widest overflow-hidden whitespace-nowrap">
            VoxAI Operations
          </h1>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={isCollapsed ? item.name : ""}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 text-sm font-medium rounded transition-colors
              ${isActive 
                ? 'bg-slate-800 text-white shadow-sm' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
            `}
          >
            <item.icon size={18} className="shrink-0" />
            {!isCollapsed && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System</span>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">v1.0.0-PROD</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
