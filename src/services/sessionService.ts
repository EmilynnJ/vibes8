// Simplified Session Service for React Native
import WebRTCService from './webrtcService';

export interface SessionRequest {
  sessionId: string;
  clientId: string;
  readerId: string;
  sessionType: 'chat' | 'phone' | 'video';
  ratePerMinute: number;
}

export interface ChatMessage {
  id: string;
  message: string;
  senderType: 'client' | 'reader' | 'system';
  timestamp: Date;
  type: 'text' | 'system';
}

export interface SessionState {
  sessionId: string;
  status: 'pending' | 'active' | 'ended' | 'connecting' | 'paused';
  participants: {
    client: { id: string; name: string; };
    reader: { id: string; name: string; };
  };
  sessionType: 'chat' | 'phone' | 'video';
  startTime?: Date;
  endTime?: Date;
  duration: number;
  cost: number;
  totalCost: number;
  ratePerMinute: number;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
}

export class SessionService {
  private static instance: SessionService;
  private webrtc: typeof WebRTCService;
  private currentSession: SessionState | null = null;
  private messages: ChatMessage[] = [];
  private stateChangeHandlers: ((state: SessionState) => void)[] = [];
  private messageHandlers: ((message: ChatMessage) => void)[] = [];
  private billingHandlers: ((event: any) => void)[] = [];
  private errorHandlers: ((error: string) => void)[] = [];

  constructor() {
    this.webrtc = WebRTCService;
  }

  static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  // Request session
  async requestSession(readerId: string, sessionType: 'chat' | 'phone' | 'video', ratePerMinute: number, clientInfo: any): Promise<SessionState> {
    const session: SessionState = {
      sessionId: `session_${Date.now()}`,
      status: 'connecting',
      participants: {
        client: { id: clientInfo.id, name: clientInfo.name },
        reader: { id: readerId, name: 'Reader' }
      },
      sessionType,
      duration: 0,
      cost: 0,
      totalCost: 0,
      ratePerMinute,
      connectionQuality: 'disconnected'
    };

    this.currentSession = session;
    return session;
  }

  // Start session
  async startSession(): Promise<void> {
    if (this.currentSession) {
      this.currentSession.status = 'active';
      this.currentSession.startTime = new Date();
      this.currentSession.connectionQuality = 'excellent';
      this.notifyStateChange();
    }
  }

  // End session
  async endSession(): Promise<void> {
    if (this.currentSession) {
      this.currentSession.status = 'ended';
      this.currentSession.endTime = new Date();
      this.notifyStateChange();
    }
  }

  // Pause session
  pauseSession(): void {
    if (this.currentSession) {
      this.currentSession.status = 'paused';
      this.notifyStateChange();
    }
  }

  // Resume session
  resumeSession(): void {
    if (this.currentSession) {
      this.currentSession.status = 'active';
      this.notifyStateChange();
    }
  }

  // Get current session
  getCurrentSession(): SessionState | null {
    return this.currentSession;
  }

  // Check if session is active
  isSessionActive(): boolean {
    return this.currentSession?.status === 'active';
  }

  // Event handlers
  onStateChange(handler: (state: SessionState) => void): void {
    this.stateChangeHandlers.push(handler);
  }

  onChatMessage(handler: (message: ChatMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  onBillingEvent(handler: (event: any) => void): void {
    this.billingHandlers.push(handler);
  }

  onError(handler: (error: string) => void): void {
    this.errorHandlers.push(handler);
  }

  // Send chat message
  sendChatMessage(text: string): void {
    if (!this.currentSession) return;

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      message: text,
      senderType: 'client',
      timestamp: new Date(),
      type: 'text'
    };

    this.messages.push(message);
    this.messageHandlers.forEach(handler => handler(message));
  }

  // Media controls
  toggleVideo(): boolean {
    return true; // Simplified for now
  }

  toggleAudio(): boolean {
    return true; // Simplified for now
  }

  getLocalStream(): MediaStream | null {
    return null; // Simplified for now
  }

  getRemoteStream(): MediaStream | null {
    return null; // Simplified for now
  }

  // Cleanup
  cleanup(): void {
    this.stateChangeHandlers = [];
    this.messageHandlers = [];
    this.billingHandlers = [];
    this.errorHandlers = [];
  }

  private notifyStateChange(): void {
    if (this.currentSession) {
      this.stateChangeHandlers.forEach(handler => handler(this.currentSession!));
    }
  }
}

export default SessionService;