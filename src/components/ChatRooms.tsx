import React, { useState } from 'react';
import { MessageSquare, Search, Users, Plus, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ChatRoomModal } from './ChatRoomModal';
import { WaitingRoomModal } from './WaitingRoomModal';
import { PasswordModal } from './PasswordModal';

interface ChatRoom {
  id: number;
  name: string;
  participants: number;
  description: string;
  image: string;
  hasPassword: boolean;
  creator: {
    name: string;
    email: string;
    avatar: string;
  };
}

const chatRooms: ChatRoom[] = [
  { 
    id: 1, 
    name: '일반 대화', 
    participants: 15,
    description: '다양한 주제로 자유롭게 대화를 나눠보세요',
    image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=100&h=100&fit=crop',
    hasPassword: false,
    creator: {
      name: '김민수',
      email: 'minsu.kim@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    }
  },
  { 
    id: 2, 
    name: '게임 토론', 
    participants: 8,
    description: '게임에 대한 이야기를 나눠보세요',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=100&h=100&fit=crop',
    hasPassword: true,
    creator: {
      name: '이지영',
      email: 'jiyoung.lee@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    }
  },
  { 
    id: 3, 
    name: '음악 감상과 아티스트 이야기 나누기 🎵 🎸', 
    participants: 12,
    description: '좋아하는 음악을 공유해보세요',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop',
    hasPassword: true,
    creator: {
      name: '박준호',
      email: 'junho.park@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    }
  },
];

export function ChatRooms() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showWaitingRoom, setShowWaitingRoom] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const { t } = useTranslation();

  const filteredRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    if (room.hasPassword) {
      setShowPasswordModal(true);
    } else {
      setShowWaitingRoom(true);
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    // Simulate password verification
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (password === '1234') { // 실제 구현에서는 서버에서 검증
          resolve(true);
        } else {
          reject(new Error('Incorrect password'));
        }
      }, 1000);
    });

    setShowPasswordModal(false);
    setShowWaitingRoom(true);
  };

  const handleCreateRoom = async (name: string, password?: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Creating room:', { name, password });
  };

  const ChatRoomItem = ({ room }: { room: ChatRoom }) => (
    <div key={room.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
      <div className="flex items-center space-x-3">
        <img
          src={room.creator.avatar}
          alt={room.creator.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900 dark:text-white">{room.name}</p>
            {room.hasPassword && (
              <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{room.creator.name}</p>
        </div>
      </div>
      <button
        onClick={() => handleJoinRoom(room)}
        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        title={t('common.chat.join')}
      >
        <MessageSquare className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <MessageSquare className="w-5 h-5" />
          {t('common.chat.title')}
        </h2>
        <button
          onClick={() => setShowCreateRoom(true)}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">{t('common.chat.create')}</span>
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('common.search.chat')}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-1">
        {filteredRooms.length > 0 ? (
          filteredRooms.map(room => (
            <ChatRoomItem key={room.id} room={room} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {t('common.chat.noResults')}
          </div>
        )}
      </div>

      {showCreateRoom && (
        <ChatRoomModal
          onClose={() => setShowCreateRoom(false)}
          onSubmit={handleCreateRoom}
        />
      )}

      {showPasswordModal && selectedRoom && (
        <PasswordModal
          onClose={() => {
            setShowPasswordModal(false);
            setSelectedRoom(null);
          }}
          onSubmit={handlePasswordSubmit}
          roomName={selectedRoom.name}
        />
      )}

      {showWaitingRoom && selectedRoom && (
        <WaitingRoomModal
          onClose={() => {
            setShowWaitingRoom(false);
            setSelectedRoom(null);
          }}
          roomName={selectedRoom.name}
        />
      )}
    </div>
  );
}