import React, { useState, useEffect, useRef } from 'react';
import { X, Video, Mic, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DeviceSettingsModalProps {
  onClose: () => void;
  onDeviceChange: (deviceType: 'audio' | 'video', deviceId: string) => void;
  currentAudioDevice?: string;
  currentVideoDevice?: string;
}

interface MediaDevice {
  deviceId: string;
  label: string;
}

export function DeviceSettingsModal({
  onClose,
  onDeviceChange,
  currentAudioDevice,
  currentVideoDevice,
}: DeviceSettingsModalProps) {
  const [audioDevices, setAudioDevices] = useState<MediaDevice[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState(currentAudioDevice);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState(currentVideoDevice);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useTranslation();

  const setupVideoPreview = async (deviceId?: string) => {
    try {
      // Stop previous stream if it exists
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
      videoStreamRef.current = stream;
    } catch (error) {
      console.error('Error setting up video preview:', error);
    }
  };

  const setupAudioMeter = async (deviceId?: string) => {
    try {
      // Stop previous stream if it exists
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }

      // Clean up previous audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        await audioContextRef.current.close();
        audioContextRef.current = null;
      }

      const constraints = {
        audio: deviceId ? { deviceId: { exact: deviceId } } : true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      audioStreamRef.current = stream;

      // Set up audio context and analyser
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Start drawing the meter
      drawAudioMeter();
    } catch (error) {
      console.error('Error setting up audio meter:', error);
    }
  };

  const drawAudioMeter = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;

    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Calculate average volume
      const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
      const volume = average / 255; // Normalize to 0-1

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      ctx.fillStyle = '#1f2937'; // dark:bg-gray-800
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw meter
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#22c55e'); // green-500
      gradient.addColorStop(0.5, '#eab308'); // yellow-500
      gradient.addColorStop(1, '#ef4444'); // red-500

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width * volume, canvas.height);
    };

    draw();
  };

  useEffect(() => {
    const loadDevices = async () => {
      try {
        // Request permission to access devices
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        const audioInputs = devices
          .filter(device => device.kind === 'audioinput')
          .map(device => ({
            deviceId: device.deviceId,
            label: device.label || `Microphone ${device.deviceId.slice(0, 5)}...`,
          }));

        const videoInputs = devices
          .filter(device => device.kind === 'videoinput')
          .map(device => ({
            deviceId: device.deviceId,
            label: device.label || `Camera ${device.deviceId.slice(0, 5)}...`,
          }));

        setAudioDevices(audioInputs);
        setVideoDevices(videoInputs);

        // Set initial devices
        const initialVideoDevice = currentVideoDevice || videoInputs[0]?.deviceId;
        const initialAudioDevice = currentAudioDevice || audioInputs[0]?.deviceId;

        setSelectedVideoDevice(initialVideoDevice);
        setSelectedAudioDevice(initialAudioDevice);

        // Set up initial previews
        if (initialVideoDevice) {
          await setupVideoPreview(initialVideoDevice);
        }
        if (initialAudioDevice) {
          await setupAudioMeter(initialAudioDevice);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading devices:', error);
        setIsLoading(false);
      }
    };

    loadDevices();

    // Cleanup function
    return () => {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentVideoDevice, currentAudioDevice]);

  const handleVideoDeviceChange = async (deviceId: string) => {
    await setupVideoPreview(deviceId);
    setSelectedVideoDevice(deviceId);
  };

  const handleAudioDeviceChange = async (deviceId: string) => {
    await setupAudioMeter(deviceId);
    setSelectedAudioDevice(deviceId);
  };

  const handleConfirm = () => {
    if (selectedVideoDevice) {
      onDeviceChange('video', selectedVideoDevice);
    }
    if (selectedAudioDevice) {
      onDeviceChange('audio', selectedAudioDevice);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('common.settings.devices')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Camera Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Video className="w-4 h-4" />
                  {t('common.settings.camera')}
                </label>
                <div className="space-y-2">
                  <select
                    value={selectedVideoDevice}
                    onChange={(e) => handleVideoDeviceChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  >
                    {videoDevices.map((device) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </option>
                    ))}
                  </select>
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    <video
                      ref={videoPreviewRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover mirror"
                    />
                  </div>
                </div>
              </div>

              {/* Microphone Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mic className="w-4 h-4" />
                  {t('common.settings.microphone')}
                </label>
                <div className="space-y-2">
                  <select
                    value={selectedAudioDevice}
                    onChange={(e) => handleAudioDeviceChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  >
                    {audioDevices.map((device) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </option>
                    ))}
                  </select>
                  <div className="h-4 bg-gray-900 rounded-lg overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width="300"
                      height="16"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              disabled={isLoading}
            >
              {t('common.confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}