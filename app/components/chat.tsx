'use client';
import React, { useState, useEffect, useRef } from 'react';

// ... (все константы остаются те же)

const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [preloading, setPreloading] = useState(true);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ text: string, sender: string, files?: File[], audio?: Blob }[]>([]);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string|null>(null);
  const [botProgress, setBotProgress] = useState('');
  const [isMobile, setIsMobile] = useState(true);
  const [focused, setFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout>();

  // ... (все остальные useEffect остаются те же)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        handleAudioRecorded(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      alert('Не удалось получить доступ к микрофону');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const handleAudioRecorded = (audioBlob: Blob) => {
    const text = `🎙️ Голосовое сообщение (${recordingTime}с)`;
    sendMessageWithFiles(text, selectedFiles, audioBlob);
    setSelectedFiles([]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessageWithFiles = async (
    text: string,
    files: File[],
    audioBlob?: Blob
  ) => {
    if (!text.trim() && files.length === 0 && !audioBlob) return;

    const displayText = text || (files.length > 0 ? '📎 Отправлены файлы' : '🎙️ Голосовое сообщение');
    const newHistory = [...chatHistory, { text: displayText, sender: 'user', files, audio: audioBlob }];
    setChatHistory(newHistory);
    setBotProgress('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('text', displayText);
      formData.append('thread_id', threadId || '');

      files.forEach((file) => {
        formData.append('files', file);
      });

      if (audioBlob) {
        formData.append('audio', audioBlob, 'recording.webm');
      }

      const res = await fetch('/api/gpt', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.thread_id) {
        setThreadId(data.thread_id);
        window.localStorage.setItem(THREAD_KEY, data.thread_id);
      }

      let botReply = data.reply || 'Ошибка: нет ответа от ассистента.';

      let i = 0;
      setBotProgress('');
      const interval = setInterval(() => {
        setBotProgress(botReply.slice(0, i));
        i++;
        if (i > botReply.length) {
          clearInterval(interval);
          setChatHistory((prev) => [...prev, { text: botReply, sender: 'bot' }]);
          setBotProgress('');
          setLoading(false);
        }
      }, 18);
    } catch (error) {
      setChatHistory((prev) => [...prev, { text: 'Ошибка: не удалось получить ответ.', sender: 'bot' }]);
      setLoading(false);
      setBotProgress('');
    }
  };

  const handleSendMessage = () => {
    if ((message.trim() || selectedFiles.length > 0) && !loading && !botProgress) {
      sendMessageWithFiles(message.trim(), selectedFiles);
      setMessage('');
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // ... (остальной код остается идентичен)

  return (
    <div style={{
      background: '#f8fdff',
      width: '100vw',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* ... (header остается тем же) */}

      {/* Файлы и индикатор записи */}
      <div style={{
        width: '100%',
        maxWidth: maxWidth,
        margin: '0 auto',
        padding: '15px 20px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
        {isRecording && (
          <div style={{
            background: '#ffe6e6',
            color: '#d32f2f',
            padding: '10px 15px',
            borderRadius: 12,
            fontWeight: 'bold',
            textAlign: 'center',
            animation: 'pulse 1s infinite'
          }}>
            🔴 Запись: {formatTime(recordingTime)}
          </div>
        )}

        {selectedFiles.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8
          }}>
            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                style={{
                  background: '#e3f2fd',
                  color: '#1976d2',
                  padding: '6px 10px',
                  borderRadius: 20,
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                📎 {file.name}
                <button
                  onClick={() => removeFile(idx)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1976d2',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: 16
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ... (chat messages остаются теми же) */}

      {/* Input bar с кнопками файла и голоса */}
      <div style={{
        width: 'calc(100% - 40px)',
        margin: '0 20px',
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        maxWidth: maxWidth,
        height: 'auto',
        minHeight: INPUT_BAR_HEIGHT,
        position: 'fixed',
        left: 0,
        bottom: 25,
        background: 'transparent',
        borderRadius: borderRadius,
        zIndex: 20,
        gap: 8,
        flexWrap: 'wrap'
      }}>
        {/* Кнопка файла */}
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: 48,
            height: 48,
            background: '#fff',
            border: '1px solid #e5e8ed',
            borderRadius: 16,
            cursor: 'pointer',
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          disabled={loading || !!botProgress}
        >
          📎
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />

        {/* Кнопка голоса */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          style={{
            width: 48,
            height: 48,
            background: isRecording ? '#ff5252' : '#fff',
            color: isRecording ? '#fff' : '#2e2e2e',
            border: isRecording ? 'none' : '1px solid #e5e8ed',
            borderRadius: 16,
            cursor: 'pointer',
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: isRecording ? 'pulse 1s infinite' : 'none'
          }}
          disabled={loading || !!botProgress}
        >
          {isRecording ? '⏹️' : '🎙️'}
        </button>

        {/* Input поле */}
        <input
          type="text"
          value={message}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение..."
          style={{
            flex: 1,
            minWidth: 150,
            height: 48,
            fontSize: '16px',
            borderRadius: borderRadius,
            borderWidth: focused ? 2 : 1,
            borderStyle: 'solid',
            borderColor: focused ? '#667eea' : '#e5e8ed',
            padding: '0 18px',
            background: '#fff',
            color: NORA_COLOR,
            boxSizing: 'border-box',
            transition: 'border 0.22s'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isRecording) {
              handleSendMessage();
            }
          }}
          disabled={loading || !!botProgress || isRecording}
        />

        {/* Кнопка отправки */}
        <button
          style={{
            width: 48,
            height: 48,
            background: BABY_GRADIENT,
            color: '#fff',
            border: 'none',
            borderRadius: borderRadius,
            cursor: (loading || !!botProgress) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: (loading || !!botProgress) ? 0.6 : 1
          }}
          onClick={handleSendMessage}
          disabled={loading || !!botProgress || isRecording}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {ICONS.arrowRight}
          </span>
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Chat;
