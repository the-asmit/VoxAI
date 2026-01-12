
/**
 * VoxAI API Utility
 * Centralizes all backend communication logic.
 */

// Use Vite environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface OutboundCallRequest {
  phoneNumber: string;
  openingMessage: string;
}

export interface OutboundCallResponse {
  status: string;
  vapi_response?: {
    id: string;
    status: string;
  };
  detail?: string;
}

export interface SystemStats {
  totalCalls: number;
  activeSessions: number;
  complaintsDetected: number;
  successRate: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  phoneNumber: string;
  status: 'Active' | 'Draft' | 'Archived';
  lastModified: string;
}

export const voxApi = {
  /**
   * Health check
   * GET /
   */
  checkHealth: async (): Promise<{ status: string; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Backend unreachable');
      const data = await response.json();
      return { status: 'online', message: data.status || 'VoxAI backend running' };
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'offline', message: 'Backend disconnected' };
    }
  },

  /**
   * Trigger outbound call
   * POST /outbound/start
   */
  startOutboundCall: async (payload: OutboundCallRequest): Promise<OutboundCallResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/outbound/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Failed to start call');
      }
      
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error - could not reach backend');
    }
  },

  /**
   * Fetch Dashboard Stats
   * GET /stats
   */
  getStats: async (): Promise<SystemStats> => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      
      throw new Error('Stats endpoint not available');
    } catch (error) {
      console.warn('Stats endpoint unavailable, using mock data');
      // Return mock data if backend is not available
      return {
        totalCalls: 1284,
        activeSessions: 3,
        complaintsDetected: 14,
        successRate: '94.2%'
      };
    }
  },

  /**
   * Fetch Agent Profiles
   * GET /profiles
   */
  getProfiles: async (): Promise<AgentProfile[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      
      throw new Error('Profiles endpoint not available');
    } catch (error) {
      console.warn('Profiles endpoint unavailable, using mock data');
      // Return mock data if backend is not available
      return [
        { id: 'p1', name: 'Alpha Core v2.4', phoneNumber: '+1 (800) 555-0199', status: 'Active', lastModified: '2024-03-14' },
        { id: 'p2', name: 'Citizen Support Beta', phoneNumber: '+1 (800) 555-0122', status: 'Draft', lastModified: '2024-03-12' },
        { id: 'p3', name: 'Emergency Routing', phoneNumber: '+1 (800) 555-9999', status: 'Active', lastModified: '2024-03-10' }
      ];
    }
  }
};
