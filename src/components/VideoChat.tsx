import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Settings, PhoneOff, Phone, AlertTriangle, X, Video, VideoOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DeviceSettingsModal } from './DeviceSettingsModal';
import { mockFriends } from '../mocks/data';

export function VideoChat() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(true); // Start muted
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; isMine: boolean }[]>([]);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [currentAudioDevice, setCurrentAudioDevice] = useState<string>();
  const [currentVideoDevice, setCurrentVideoDevice] = useState<string>();
  const { t } = useTranslation();

  // Find friend by ID
  const friend = mockFriends.find(f => f.id === id);

  useEffect(() => {
    // Start 5-second timer when component mounts
    const timer = setTimeout(() => {
      setIsCallStarted(true);
      setIsMuted(false); // Unmute after 5 seconds
      if (audioStreamRef.current) {
        const audioTrack = audioStreamRef.current.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = true;
        }
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const setupStreams = async (audioDeviceId?: string, videoDeviceId?: string) => {
    try {
      // Stop existing streams
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }

      // Reset error states
      setVideoError(false);
      setAudioError(false);

      // Create a new MediaStream for combining available tracks
      const combinedStream = new MediaStream();

      // Try to get video stream
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ 
          video: videoDeviceId ? { deviceId: { exact: videoDeviceId } } : true,
          audio: false
        });
        videoStreamRef.current = videoStream;
        const videoTrack = videoStream.getVideoTracks()[0];
        if (videoTrack) {
          combinedStream.addTrack(videoTrack);
          setCurrentVideoDevice(videoTrack.getSettings().deviceId);
        }
      } catch (err) {
        console.error('Error accessing video:', err);
        setVideoError(true);
      }

      // Try to get audio stream
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true
        });
        audioStreamRef.current = audioStream;
        const audioTrack = audioStream.getAudioTracks()[0];
        if (audioTrack) {
          combinedStream.addTrack(audioTrack);
          audioTrack.enabled = !isMuted;
          setCurrentAudioDevice(audioTrack.getSettings().deviceId);
        }
      } catch (err) {
        console.error('Error accessing audio:', err);
        setAudioError(true);
        setIsMuted(true);
      }

      // Set the combined stream to the video element if we have any tracks
      if (combinedStream.getTracks().length > 0 && localVideoRef.current) {
        localVideoRef.current.srcObject = combinedStream;
      }
    } catch (err) {
      console.error('Error setting up media streams:', err);
    }
  };

  useEffect(() => {
    setupStreams();

    // Cleanup function
    return () => {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [id]); // Add id as dependency to reconnect when id changes

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { text: message, isMine: true }]);
      setMessage('');
    }
  };

  const toggleMute = () => {
    if (audioError) return;
    setIsMuted(!isMuted);
    if (audioStreamRef.current) {
      const audioTrack = audioStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
      }
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleDeviceChange = async (deviceType: 'audio' | 'video', deviceId: string) => {
    if (deviceType === 'audio') {
      await setupStreams(deviceId, currentVideoDevice);
    } else {
      await setupStreams(currentAudioDevice, deviceId);
    }
  };

  const handleEndCall = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
    }
    navigate('/main');
  };

  return (
    <div className="fixed inset-0 bg-gray-900 dark:bg-black flex">
      {/* 메인 비디오 영역 */}
      <div className="flex-1 relative">
        {/* 비디오 컨테이너 */}
        <div className="absolute inset-0">
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />
        </div>
        
        {/* 오버레이 레이어 - 컨트롤과 정보를 위한 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none" />
        
        {/* 로컬 비디오 */}
        <div className="absolute bottom-6 right-6 w-64 h-48 bg-black rounded-lg overflow-hidden shadow-lg z-10">
          {videoError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 dark:bg-gray-900 text-white">
              <div className="text-center p-4">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm">카메라를 사용할 수 없습니다</p>
              </div>
            </div>
          ) : (
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover mirror"
              autoPlay
              playsInline
              muted
            />
          )}
        </div>

        {/* 컨트롤 버튼 */}
        <div className="absolute flex flex-col space-y-4 space-x-0 left-4 bottom-4 md:flex-row md:space-x-4 md:space-y-0 md:left-1/2 md:-translate-x-1/2 items-center bg-gray-800/90 dark:bg-gray-900/90 px-3 md:px-6 py-3 rounded-full z-20 shadow-lg">
          <button
            onClick={toggleSettings}
            className={`p-3 rounded-full ${
              showSettings ? 'bg-blue-500 dark:bg-blue-600' : 'bg-gray-600 dark:bg-gray-700'
            } hover:bg-opacity-80 transition-colors`}
          >
            <Settings className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={toggleMute}
            className={`p-3 rounded-full ${
              isMuted || audioError ? 'bg-red-500 dark:bg-red-600' : 'bg-gray-600 dark:bg-gray-700'
            } hover:bg-opacity-80 transition-colors ${
              audioError ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={audioError}
            title={audioError ? '마이크를 사용할 수 없습니다' : undefined}
          >
            {isMuted || audioError ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>
          
          <button
            onClick={handleEndCall}
            className={`p-3 rounded-full ${
              isCallStarted ? 'bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700' : 'bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700'
            } transition-colors`}
          >
            {isCallStarted ? (
              <PhoneOff className="w-6 h-6 text-white" />
            ) : (
              <Phone className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* 사용자 이름과 장치 상태 */}
        <div className="absolute top-4 left-4 bg-gray-800/90 dark:bg-gray-900/90 px-4 py-2 rounded-lg z-20 flex items-center gap-3">
          <p className="text-white font-medium">{friend?.name || '알 수 없는 사용자'}</p>
          <div className="flex items-center gap-2 border-l border-gray-600 pl-3">
            {videoError ? (
              <VideoOff className="w-5 h-5 text-red-500" />
            ) : (
              <Video className="w-5 h-5 text-green-500" />
            )}
            {audioError ? (
              <MicOff className="w-5 h-5 text-red-500" />
            ) : isMuted ? (
              <MicOff className="w-5 h-5 text-yellow-500" />
            ) : (
              <Mic className="w-5 h-5 text-green-500" />
            )}
          </div>
        </div>

        {/* 오류 알림 */}
        {(videoError || audioError) && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500/90 dark:bg-yellow-600/90 px-4 py-2 rounded-lg z-20 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-white" />
            <p className="text-white">
              {videoError && audioError
                ? '카메라와 마이크를 사용할 수 없습니다'
                : videoError
                ? '카메라를 사용할 수 없습니다'
                : '마이크를 사용할 수 없습니다'}
            </p>
          </div>
        )}

        {/* 설정 모달 */}
        {showSettings && (
          <DeviceSettingsModal
            onClose={() => setShowSettings(false)}
            onDeviceChange={handleDeviceChange}
            currentAudioDevice={currentAudioDevice}
            currentVideoDevice={currentVideoDevice}
          />
        )}
      </div>

      {/* 채팅 사이드바 */}
      {showChat && (
        <div className="w-80 bg-white dark:bg-gray-800 flex flex-col shadow-xl z-30">
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('common.chat.title')}
            </h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    msg.isMine
                      ? 'bg-blue-500 dark:bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('common.chat.typeMessage')}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              >
                {t('common.chat.send')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}