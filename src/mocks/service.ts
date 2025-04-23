import { 
  mockFriends,
  mockChatRooms,
  mockSentInvites,
  mockReceivedInvites,
  mockChatHistory,
  mockSubscriptions,
  currentUser
} from './data';
import { Friend, ChatRoom, FriendInvite, ChatHistory, Subscription, User, ErrorCode } from '../types';
import { IService } from '../services/types';
import i18next from 'i18next';

// Custom error class to include error code
export class ServiceError extends Error {
  constructor(message: string, public code: ErrorCode) {
    super(message);
    this.name = 'ServiceError';
  }
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockService implements IService {
  // Auth
  async login(email: string, password: string): Promise<User> {
    await delay(1500);
    if (email && password === '1234') {
      return currentUser;
    }
    throw new ServiceError(i18next.t('common.error.invalidCredentials'), ErrorCode.INVALID_CREDENTIALS);
  }

  async register(email: string, password: string, name: string): Promise<void> {
    await delay(2000);
    if (email === 'hkim@onthelive.kr') {
      throw new ServiceError(i18next.t('common.error.emailExists'), ErrorCode.EMAIL_EXISTS);
    }
    if (name === 'hkim') {
      throw new ServiceError(i18next.t('common.error.nameExists'), ErrorCode.NAME_EXISTS);
    }
    if (password === '12341234') {
      throw new ServiceError(i18next.t('common.error.unknown'), ErrorCode.UNKNOWN);
    }
    if (email && password && name) {
      return;
    }
    throw new Error(i18next.t('common.error.registrationFailed'));
  }

  async resetPassword(email: string): Promise<void> {
    await delay(1500);
    if (email) {
      return;
    }
    throw new Error(i18next.t('common.error.passwordResetFailed'));
  }

  // Friends
  async getFriends(): Promise<Friend[]> {
    await delay(800);
    return mockFriends;
  }

  async getSentInvites(): Promise<FriendInvite[]> {
    await delay(800);
    return mockSentInvites;
  }

  async getReceivedInvites(): Promise<FriendInvite[]> {
    await delay(800);
    return mockReceivedInvites;
  }

  async addFriend(email: string): Promise<void> {
    await delay(1500);
    if (email) {
      return;
    }
    throw new Error(i18next.t('common.error.addFriendFailed'));
  }

  async acceptInvite(inviteId: string): Promise<void> {
    await delay(1000);
    return;
  }

  async declineInvite(inviteId: string): Promise<void> {
    await delay(1000);
    return;
  }

  async cancelInvite(inviteId: string): Promise<void> {
    await delay(1000);
    return;
  }

  // Chat Rooms
  async getChatRooms(): Promise<ChatRoom[]> {
    await delay(800);
    return mockChatRooms;
  }

  async createChatRoom(name: string, password?: string): Promise<void> {
    await delay(1500);
    if (name) {
      return;
    }
    throw new Error(i18next.t('common.error.createRoomFailed'));
  }

  async joinChatRoom(roomId: string, password?: string): Promise<void> {
    await delay(1000);
    if (roomId) {
      return;
    }
    throw new Error(i18next.t('common.error.joinRoomFailed'));
  }

  // Chat History
  async getChatHistory(): Promise<ChatHistory[]> {
    await delay(800);
    return mockChatHistory;
  }

  async deleteChatHistory(ids: string[]): Promise<void> {
    await delay(1500);
    return;
  }

  // Subscriptions
  async getSubscriptions(): Promise<Subscription[]> {
    await delay(800);
    return mockSubscriptions;
  }

  async purchaseSubscription(planId: string): Promise<void> {
    await delay(2000);
    if (planId) {
      return;
    }
    throw new Error(i18next.t('common.error.purchaseFailed'));
  }

  async requestRefund(subscriptionId: string): Promise<void> {
    await delay(1500);
    if (subscriptionId) {
      return;
    }
    throw new Error(i18next.t('common.error.refundFailed'));
  }

  async deleteSubscriptionHistory(id: string): Promise<void> {
    await delay(1000);
    return;
  }

  // Profile
  async updateProfile(name: string): Promise<void> {
    await delay(1500);
    if (name) {
      return;
    }
    throw new Error(i18next.t('common.error.updateProfileFailed'));
  }

  async updateAvatar(file: File): Promise<string> {
    await delay(2000);
    return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop';
  }
}

export const mockService = new MockService();