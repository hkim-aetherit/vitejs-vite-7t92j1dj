import { IService } from './types';
import { User, Friend, ChatRoom, FriendInvite, ChatHistory, Subscription, ErrorCode } from '../types';
import { ServiceError } from '../mocks/service';

class ServerService implements IService {
  private baseUrl = 'http://localhost:8089';

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 409) {
        if (errorData.message.includes('email')) {
          throw new ServiceError('Email already exists', ErrorCode.EMAIL_EXISTS);
        }
        if (errorData.message.includes('name')) {
          throw new ServiceError('Name already exists', ErrorCode.NAME_EXISTS);
        }
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string): Promise<User> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string): Promise<void> {
    await this.request('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        nickname: name,
        role: ['user']
      }),
    });
  }

  async resetPassword(email: string): Promise<void> {
    await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Friends
  async getFriends(): Promise<Friend[]> {
    return this.request('/friends');
  }

  async getSentInvites(): Promise<FriendInvite[]> {
    return this.request('/friends/invites/sent');
  }

  async getReceivedInvites(): Promise<FriendInvite[]> {
    return this.request('/friends/invites/received');
  }

  async addFriend(email: string): Promise<void> {
    await this.request('/friends/add', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async acceptInvite(inviteId: string): Promise<void> {
    await this.request(`/friends/invites/${inviteId}/accept`, {
      method: 'POST',
    });
  }

  async declineInvite(inviteId: string): Promise<void> {
    await this.request(`/friends/invites/${inviteId}/decline`, {
      method: 'POST',
    });
  }

  async cancelInvite(inviteId: string): Promise<void> {
    await this.request(`/friends/invites/${inviteId}`, {
      method: 'DELETE',
    });
  }

  // Chat Rooms
  async getChatRooms(): Promise<ChatRoom[]> {
    return this.request('/chat/rooms');
  }

  async createChatRoom(name: string, password?: string): Promise<void> {
    await this.request('/chat/rooms', {
      method: 'POST',
      body: JSON.stringify({ name, password }),
    });
  }

  async joinChatRoom(roomId: string, password?: string): Promise<void> {
    await this.request(`/chat/rooms/${roomId}/join`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  // Chat History
  async getChatHistory(): Promise<ChatHistory[]> {
    return this.request('/chat/history');
  }

  async deleteChatHistory(ids: string[]): Promise<void> {
    await this.request('/chat/history', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  }

  // Subscriptions
  async getSubscriptions(): Promise<Subscription[]> {
    return this.request('/subscriptions');
  }

  async purchaseSubscription(planId: string): Promise<void> {
    await this.request('/subscriptions/purchase', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  }

  async requestRefund(subscriptionId: string): Promise<void> {
    await this.request(`/subscriptions/${subscriptionId}/refund`, {
      method: 'POST',
    });
  }

  async deleteSubscriptionHistory(id: string): Promise<void> {
    await this.request(`/subscriptions/${id}`, {
      method: 'DELETE',
    });
  }

  // Profile
  async updateProfile(name: string): Promise<void> {
    await this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async updateAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${this.baseUrl}/profile/avatar`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.url;
  }
}

export const serverService = new ServerService();