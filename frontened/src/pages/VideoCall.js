import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { getCurrentUser } from '../utils/auth';
import { getAgoraToken } from '../services/api';

// Agora App ID configured for project
const APP_ID = process.env.REACT_APP_AGORA_APP_ID || '745dbc4d909e4d6893d1dc7c39d4ad83';

function VideoCall() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const user = useMemo(() => getCurrentUser(), []);

  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [duration, setDuration] = useState(0);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Connecting...');

  const clientRef = useRef(null);
  const localVideoRef = useRef(null);
  const localTracksRef = useRef([]);
  const timerRef = useRef(null);
  const isJoiningRef = useRef(false);

  const PRICE_PER_MINUTE = 10;

  const leaveCall = useCallback(async () => {
    clearInterval(timerRef.current);
    localTracksRef.current.forEach(track => {
      try {
        track?.stop();
        track?.close();
      } catch (e) {}
    });
    localTracksRef.current = [];

    if (clientRef.current) {
      try {
        if (clientRef.current.connectionState !== 'DISCONNECTED') {
          await clientRef.current.leave();
        }
      } catch (e) {
        console.warn('Agora leave error:', e);
      }
    }
    setJoined(false);
  }, []);

  const joinCall = useCallback(async () => {
    if (isJoiningRef.current) return;
    if (clientRef.current && (clientRef.current.connectionState === 'CONNECTING' || clientRef.current.connectionState === 'CONNECTED')) {
      return;
    }
    isJoiningRef.current = true;

    try {
      if (!clientRef.current) {
        setStatus('Creating client...');
        clientRef.current = AgoraRTC.createClient({
          mode: 'rtc',
          codec: 'vp8'
        });

        clientRef.current.on('user-published', async (remoteUser, mediaType) => {
          await clientRef.current.subscribe(remoteUser, mediaType);
          if (mediaType === 'video') {
            setRemoteUsers(prev => {
              const exists = prev.find(u => u.uid === remoteUser.uid);
              if (!exists) return [...prev, remoteUser];
              return prev;
            });
            setTimeout(() => {
              remoteUser.videoTrack?.play(`remote-${remoteUser.uid}`);
            }, 500);
          }
          if (mediaType === 'audio') {
            remoteUser.audioTrack?.play();
          }
        });

        clientRef.current.on('user-unpublished', (remoteUser) => {
          setRemoteUsers(prev =>
            prev.filter(u => u.uid !== remoteUser.uid)
          );
        });
      }

      const numericUid = Number(user?.id) > 0 ? Number(user?.id) : Math.floor(Math.random() * 100000) + 1;

      setStatus('Generating token...');
      let token = null;
      let effectiveAppId = APP_ID;
      try {
        const tokenRes = await getAgoraToken(roomId, numericUid);
        token = tokenRes.data?.token || null;
        if (tokenRes.data?.appId) {
          effectiveAppId = tokenRes.data.appId;
        }
      } catch (e) {
        console.warn('Agora token warning:', e);
      }

      if (clientRef.current.connectionState !== 'CONNECTED' && clientRef.current.connectionState !== 'CONNECTING') {
        setStatus('Joining channel...');
        await clientRef.current.join(
          effectiveAppId,
          roomId,
          token,
          numericUid
        );
      }

      setStatus('Getting camera/mic...');
      // Clean up any stale tracks first
      localTracksRef.current.forEach(t => {
        try { t?.stop(); t?.close(); } catch (e) {}
      });
      localTracksRef.current = [];

      let micTrack = null;
      let camTrack = null;

      try {
        micTrack = await AgoraRTC.createMicrophoneAudioTrack();
      } catch (e) {
        setError('⚠️ Microphone access denied');
      }

      try {
        camTrack = await AgoraRTC.createCameraVideoTrack();
      } catch (e) {
        setError('⚠️ Camera access denied');
      }

      const tracks = [micTrack, camTrack].filter(Boolean);
      localTracksRef.current = tracks;

      if (camTrack && localVideoRef.current) {
        camTrack.play(localVideoRef.current);
      }

      if (tracks.length > 0 && clientRef.current?.connectionState === 'CONNECTED') {
        await clientRef.current.publish(tracks);
      }

      setJoined(true);
      setStatus('Connected ✅');

      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      if (err?.message?.includes('already in connecting/connected') || err?.code === 'INVALID_OPERATION') {
        // Harmless StrictMode / duplicate trigger - ignore and keep active state
        setJoined(true);
        setStatus('Connected ✅');
        return;
      }
      console.error('Full error:', err);
      setError(`Error: ${err.message}`);
      setStatus('Failed ❌');
    } finally {
      isJoiningRef.current = false;
    }
  }, [roomId, user?.id]);

  const handleLeave = async () => {
    await leaveCall();
    navigate(user?.role === 'MENTOR'
      ? '/mentor-dashboard'
      : '/user-dashboard'
    );
  };

  useEffect(() => {
    joinCall();
    return () => {
      leaveCall();
    };
  }, [joinCall, leaveCall]);

  const toggleMic = () => {
    const micTrack = localTracksRef.current.find(
      t => t.trackMediaType === 'audio'
    );
    if (micTrack) {
      micTrack.setEnabled(!micOn);
      setMicOn(!micOn);
    }
  };

  const toggleCam = () => {
    const camTrack = localTracksRef.current.find(
      t => t.trackMediaType === 'video'
    );
    if (camTrack) {
      camTrack.setEnabled(!camOn);
      setCamOn(!camOn);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center px-8 py-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="text-xl font-bold text-indigo-400">
            Dev<span className="text-white">Mentor</span>
          </div>
          {joined && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              ● LIVE
            </span>
          )}
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 font-mono">
              {formatTime(duration)}
            </div>
            <div className="text-xs text-slate-500">Duration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              ₹{Math.floor(duration / 60) * PRICE_PER_MINUTE}
            </div>
            <div className="text-xs text-slate-500">Cost</div>
          </div>
        </div>

        <div className="text-slate-500 text-xs">{status}</div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/20 border-b border-red-500/30 px-8 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Video Area */}
      <div className="flex-1 flex gap-4 p-6">

        {/* Remote */}
        <div className="flex-1 bg-slate-800 rounded-2xl overflow-hidden relative">
          {remoteUsers.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">👤</div>
                <p className="text-slate-400 text-lg">
                  Waiting for other person...
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Share this link with them to join
                </p>
                <div className="mt-4 bg-slate-900 px-4 py-2 rounded-lg text-xs text-slate-400 font-mono break-all max-w-sm">
                  {window.location.href}
                </div>
              </div>
            </div>
          ) : (
            remoteUsers.map(ru => (
              <div
                key={ru.uid}
                id={`remote-${ru.uid}`}
                className="w-full h-full"
              />
            ))
          )}
        </div>

        {/* Local */}
        <div className="w-72 bg-slate-800 rounded-2xl overflow-hidden relative">
          <div ref={localVideoRef} className="w-full h-full" />
          {!camOn && (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-slate-400 text-sm">Camera Off</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded-lg text-xs">
            You ({user?.name})
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-6 py-6 bg-slate-900 border-t border-slate-800">
        <button
          onClick={toggleMic}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition ${
            micOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600'
          }`}>
          {micOn ? '🎤' : '🔇'}
        </button>

        <button
          onClick={handleLeave}
          className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-3xl transition">
          📵
        </button>

        <button
          onClick={toggleCam}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition ${
            camOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600'
          }`}>
          {camOn ? '📹' : '🚫'}
        </button>
      </div>
    </div>
  );
}

export default VideoCall;
