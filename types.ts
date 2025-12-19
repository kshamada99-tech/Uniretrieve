
export enum ItemType {
  LOST = 'LOST',
  FOUND = 'FOUND'
}

export enum ReportStatus {
  ACTIVE = 'ACTIVE',
  MATCHED = 'MATCHED',
  RESOLVED = 'RESOLVED',
  EXPIRED = 'EXPIRED'
}

export enum PortalView {
  LANDING = 'LANDING',
  LOST_FORM = 'LOST_FORM',
  FOUND_FORM = 'FOUND_FORM',
  SUCCESS = 'SUCCESS',
  MATCHES = 'MATCHES',
  CHAT = 'CHAT',
  TECH_SPECS = 'TECH_SPECS'
}

/** 
 * Formal Database Schema Interfaces 
 */
export interface UserSchema {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  lastLogin: string;
}

export interface ItemReport {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  category: string;
  date: string;
  locationName: string;
  coordinates?: { lat: number; lng: number };
  contactName: string;
  contactEmail: string;
  status: ReportStatus;
  images?: string[]; // base64 or URLs
  reporterId: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface ChatSession {
  id: string;
  reportId: string; // The original report
  matchId: string;  // The matched report
  participants: string[]; // User IDs
  messages: ChatMessage[];
  lastActivity: string;
}

/** 
 * UI & Requirement Types
 */
export interface Requirement {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  portal: 'Lost' | 'Found' | 'Both';
}

export interface FlowNode {
  id: string;
  label: string;
  type: 'process' | 'decision' | 'start' | 'end';
}

export interface FlowLink {
  source: string;
  target: string;
  label?: string;
}

export interface Match {
  id: string;
  reportId: string;
  matchId: string;
  score: number;
  reason: string;
}
