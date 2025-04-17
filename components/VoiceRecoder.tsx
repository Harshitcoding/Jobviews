// app/components/VoiceRecorder.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { initialVoiceRecorderState, requestMicrophonePermission, createSpeechRecognition } from '../app/utils/voiceUtils';

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscriptionComplete }) => {
  const [state, setState] = useState(initialVoiceRecorderState);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const speechRecognitionRef = useRef<any>(null);

  useEffect(() => {
    // Clean up on unmount
    return () => {
      stopRecording();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const requestPermission = async () => {
    try {
      await requestMicrophonePermission();
      setPermissionGranted(true);
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      alert('Microphone access is required for voice recording');
    }
  };

  const startRecording = async () => {
    if (!permissionGranted) {
      await requestPermission();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up the MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioURL = URL.createObjectURL(audioBlob);
        
        setState((prev: any) => ({
          ...prev,
          isRecording: false,
          audioURL,
          audioBlob,
          isTranscribing: true
        }));
        
        // Get the transcript from the speech recognition
        const transcript = await speechRecognitionRef.current?.getTranscript() || '';
        
        setState((prev: any) => ({
          ...prev,
          transcription: transcript,
          isTranscribing: false
        }));
        
        onTranscriptionComplete(transcript);
      };
      
      // Set up Speech Recognition
      const { recognition, getTranscript } = createSpeechRecognition();
      speechRecognitionRef.current = { recognition, getTranscript };
      
      if (recognition) {
        recognition.start();
      }
      
      // Start recording
      mediaRecorder.start();
      
      setState((prev: any) => ({
        ...prev,
        isRecording: true,
        audioURL: null,
        audioBlob: null,
        transcription: ''
      }));
      
      // Start timer
      setTimeElapsed(0);
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // Stop speech recognition
      if (speechRecognitionRef.current?.recognition) {
        speechRecognitionRef.current.recognition.stop();
      }
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-2">
        {state.isRecording ? (
          <>
            <span className="text-red-500 animate-pulse">● Recording</span>
            <span className="text-gray-600">{formatTime(timeElapsed)}</span>
            <button
              onClick={stopRecording}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Stop Recording
            </button>
          </>
        ) : (
          <button
            onClick={startRecording}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            <span>Record Answer</span>
          </button>
        )}
      </div>
      
      {state.isTranscribing && (
        <div className="text-gray-600">
          Transcribing audio...
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full w-full animate-pulse"></div>
          </div>
        </div>
      )}
      
      {state.audioURL && (
        <div className="w-full p-4 bg-gray-100 rounded-lg">
          <p className="font-semibold mb-2">Your Recording:</p>
          <audio controls src={state.audioURL} className="w-full"></audio>
        </div>
      )}
      
      {state.transcription && (
        <div className="w-full p-4 bg-gray-100 rounded-lg">
          <p className="font-semibold mb-2">Transcription:</p>
          <p>{state.transcription}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;