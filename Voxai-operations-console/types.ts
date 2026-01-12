import React from 'react';

export enum OrganizationType {
  GOVERNMENT = 'GOVERNMENT',
  COMPANY = 'COMPANY',
  CUSTOM = 'CUSTOM'
}

export interface User {
  id: string;
  name: string;
  role: string;
  orgType: OrganizationType;
}

export interface AuthContextType {
  user: User | null;
  login: (type: OrganizationType) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

export interface NavItem {
  name: string;
  path: string;
  // Fix: Imported React to resolve the React namespace for ElementType
  icon: React.ElementType;
}