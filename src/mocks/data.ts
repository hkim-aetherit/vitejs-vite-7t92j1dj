import { User, Friend, ChatRoom, FriendInvite, ChatHistory, Subscription } from '../types';

// Mock user data
export const currentUser: User = {
  id: '1',
  name: '김민수',
  email: 'minsu.kim@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  availableTime: 720 // 12시간 (분 단위)
};

// Mock friends data
export const mockFriends: Friend[] = [
  { 
    id: '1',
    name: '김민수',
    email: 'minsu.kim@example.com',
    status: 'online',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
  },
  { 
    id: '2',
    name: '이지영',
    email: 'jiyoung.lee@example.com',
    status: 'offline',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
  },
  { 
    id: '3',
    name: '박준호',
    email: 'junho.park@example.com',
    status: 'online',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
  },
];

// Mock chat rooms data
export const mockChatRooms: ChatRoom[] = [
  { 
    id: '1', 
    name: '일반 대화', 
    participants: 15,
    description: '다양한 주제로 자유롭게 대화를 나눠보세요',
    image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=100&h=100&fit=crop',
    hasPassword: false,
    creator: {
      id: '1',
      name: '김민수',
      email: 'minsu.kim@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    }
  },
  { 
    id: '2', 
    name: '게임 토론', 
    participants: 8,
    description: '게임에 대한 이야기를 나눠보세요',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=100&h=100&fit=crop',
    hasPassword: true,
    creator: {
      id: '2',
      name: '이지영',
      email: 'jiyoung.lee@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    }
  },
  { 
    id: '3', 
    name: '음악 감상과 아티스트 이야기 나누기 🎵 🎸', 
    participants: 12,
    description: '좋아하는 음악을 공유해보세요',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop',
    hasPassword: true,
    creator: {
      id: '3',
      name: '박준호',
      email: 'junho.park@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    }
  },
];

// Mock friend invites data
export const mockSentInvites: FriendInvite[] = [
  { 
    id: '1',
    name: '홍길동',
    email: 'hong@example.com',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    date: '2024-03-15'
  },
  { 
    id: '2',
    name: '김철수',
    email: 'kim@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    date: '2024-03-14'
  },
];

export const mockReceivedInvites: FriendInvite[] = [
  { 
    id: '1',
    name: '이영희',
    email: 'lee@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    date: '2024-03-15'
  },
  { 
    id: '2',
    name: '최민지',
    email: 'choi@example.com',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    date: '2024-03-13'
  },
];

// Mock chat history data
export const mockChatHistory: ChatHistory[] = [
  {
    id: '1',
    type: 'video',
    participant: '김철수',
    date: '2024-03-15 14:30',
    duration: '32분'
  },
  {
    id: '2',
    type: 'chat',
    participant: '일반 대화방',
    date: '2024-03-14 15:20',
    duration: '97분'
  }
];

// Mock subscription data
export const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    plan: '프리미엄 30시간',
    time: '30시간',
    price: '9,900원',
    date: '2024-03-15',
    status: 'unused',
  },
  {
    id: '2',
    plan: '프리미엄 30시간',
    time: '12시간',
    price: '9,900원',
    date: '2024-03-15',
    status: 'active',
  },
  {
    id: '3',
    plan: '프리미엄 30시간',
    time: '0시간',
    price: '9,900원',
    date: '2024-02-15',
    status: 'expired',
  },
  {
    id: '4',
    plan: '프리미엄 100시간',
    time: '100시간',
    price: '178,200원',
    date: '2024-03-16',
    status: 'refunding',
  },
  {
    id: '5',
    plan: '프리미엄 30시간',
    time: '30시간',
    price: '56,430원',
    date: '2024-03-10',
    status: 'refunded',
  },
];