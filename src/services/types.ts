import { User, Friend, ChatRoom, FriendInvite, ChatHistory, Subscription } from '../types';

export interface IService {
  // Auth
  login(email: string, password: string): Promise<User>;
  register(email: string, password: string, name: string): Promise<void>;
  resetPassword(email: string): Promise<void>;

  // Friends
  getFriends(): Promise<Friend[]>;
  getSentInvites(): Promise<FriendInvite[]>;
  getReceivedInvites(): Promise<FriendInvite[]>;
  addFriend(email: string): Promise<void>;
  acceptInvite(inviteId: string): Promise<void>;
  declineInvite(inviteId: string): Promise<void>;
  cancelInvite(inviteId: string): Promise<void>;

  // Chat Rooms
  getChatRooms(): Promise<ChatRoom[]>;
  createChatRoom(name: string, password?: string): Promise<void>;
  joinChatRoom(roomId: string, password?: string): Promise<void>;

  // Chat History
  getChatHistory(): Promise<ChatHistory[]>;
  deleteChatHistory(ids: string[]): Promise<void>;

  // Subscriptions
  getSubscriptions(): Promise<Subscription[]>;
  purchaseSubscription(planId: string): Promise<void>;
  requestRefund(subscriptionId: string): Promise<void>;
  deleteSubscriptionHistory(id: string): Promise<void>;

  // Profile
  updateProfile(name: string): Promise<void>;
  updateAvatar(file: File): Promise<string>;
}