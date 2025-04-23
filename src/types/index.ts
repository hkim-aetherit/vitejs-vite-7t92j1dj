export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  availableTime: number;
}

export interface Friend {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'offline';
  avatar: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: number;
  description: string;
  image: string;
  hasPassword: boolean;
  creator: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
}

export interface FriendInvite {
  id: string;
  name: string;
  email: string;
  avatar: string;
  date: string;
}

export interface ChatHistory {
  id: string;
  type: 'video' | 'chat';
  participant: string;
  date: string;
  duration: string;
}

export interface Subscription {
  id: string;
  plan: string;
  time: string;
  price: string;
  date: string;
  status: 'active' | 'unused' | 'expired' | 'refunding' | 'refunded';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  time: string;
  features: string[];
  originalPrice?: string;
  discount?: string;
  popular?: boolean;
}

export enum ErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_EXISTS = 'EMAIL_EXISTS',
  NAME_EXISTS = 'NAME_EXISTS',
  UNKNOWN = 'UNKNOWN'
}