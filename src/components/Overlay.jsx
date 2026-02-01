import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import useVoice from '../hooks/useVoice';
import HoloCard from './HoloCard';
import Typewriter from './Typewriter';

export default function Overlay() {
    const { status, transcript, response, action, data, setStatus, processCommand, triggerGreeting } = useStore();
    const { isListening, transcript: voiceText, startListening, stopListening, setTranscript } = useVoice();

    const [hasStarted, setHasStarted] = useState(false);
    const [audioDuration, setAudioDuration] = useState(0);
    const [isSinging, setIsSinging] = useState(false);

    // 🎵 SHARED REF: Controls BOTH Singing and TTS so we can stop either instantly
    const audioRef = useRef(null);


    // ---------------------------------------------------------
    // 1. MIC LOGIC (With "Selective Hearing" Fix)
    // ---------------------------------------------------------
    useEffect(() => {
        if (!isListening && voiceText) {

            // 🛑 FIX: If Singing, IGNORE everything unless it is a "Stop" command
            if (isSinging) {
                const t = voiceText.toLowerCase();

                const isStopCommand =
                    t.includes('stop') ||
                    t.includes('quiet') ||
                    t.includes('shut up') ||
                    t.includes('停') ||
                    t.includes('别唱') ||
                    t.includes('安静');

                if (isStopCommand) {
                    console.log("🛑 Voice Command Detected during song:", voiceText);
                    processCommand("stop"); // Force the stop
                } else {
                    console.log("🙉 Ignoring lyrics/noise:", voiceText);
                    // Do nothing! Let the music play.
                }
            }
            // ✅ If NOT singing, process commands normally
            else {
                console.log("🚀 User said:", voiceText);
                processCommand(voiceText);
            }

            setTranscript('');
        }
    }, [isListening, voiceText, processCommand, setTranscript, isSinging]);

    useEffect(() => {
        // A. If TTS is talking, stop mic (to prevent echo)
        //    (Unless we are singing, then we MUST listen for "Stop")
        if (status === 'speaking' && !isSinging) {
            stopListening();
        }

        // B. If Idle OR Singing, keep the mic active
        if ((status === 'idle' || isSinging) && hasStarted) {
            // Only start if not already listening
            if (!isListening) {
                const timer = setTimeout(() => startListening(), 200);
                return () => clearTimeout(timer);
            }
        }
    }, [status, hasStarted, isSinging, isListening, startListening, stopListening]);

    // ---------------------------------------------------------
    // 2. AUDIO LOGIC (Handles Talk, Sing, AND STOP)
    // ---------------------------------------------------------
    useEffect(() => {
        // 🛑 PRIORITY: STOP COMMAND
        if (action === 'STOP_AUDIO') {
            console.log("🛑 STOP COMMAND RECEIVED");
            if (audioRef.current) {
                audioRef.current.pause(); // Kill audio immediately
                audioRef.current.currentTime = 0;
            }
            setIsSinging(false);
            setStatus('idle');
            return; // Exit immediately
        }

        // ▶️ PLAYBACK SEQUENCE
        if (status === 'speaking' && response) {

            if (action !== 'SING_SONG') {
                setIsSinging(false);
                if (audioRef.current) audioRef.current.pause(); // Kill any lingering music
            }

            const runSequence = async () => {
                // 1. Play TTS (Waits for voice to finish)
                await playTTS(response);

                // 2. Play Song (Only if action matches)
                if (action === 'SING_SONG') {
                    console.log("🎵 ACTION RECEIVED: Sing", data?.query);
                    setIsSinging(true);

                    const songName = data?.query || 'random';
                    const songUrl = `http://localhost:8000/api/sing/${songName}`;

                    // Use the shared Ref so we can stop it later
                    if (audioRef.current) audioRef.current.pause();
                    audioRef.current = new Audio(songUrl);

                    audioRef.current.onended = () => {
                        setIsSinging(false);
                        setStatus('idle');
                    };

                    try {
                        await audioRef.current.play();
                        console.log("▶️ Song Playing...");
                    } catch (e) {
                        console.error("❌ Autoplay Blocked:", e);
                        setIsSinging(false);
                        setStatus('idle');
                    }
                } else {
                    setStatus('idle');
                }
            };

            runSequence();
        }
    }, [status, response, action, data, setStatus]);

    // ---------------------------------------------------------
    // 3. TTS HELPER (Now uses audioRef for stopping power)
    // ---------------------------------------------------------
    const playTTS = (text) => {
        return new Promise(async (resolve) => {
            try {
                const res = await fetch('http://localhost:8000/api/tts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, voice: "en-GB-RyanNeural" })
                });
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);

                // Assign to global ref so "STOP_AUDIO" can kill it too
                if (audioRef.current) audioRef.current.pause();
                audioRef.current = new Audio(url);

                audioRef.current.onloadedmetadata = () => {
                    setAudioDuration(audioRef.current.duration);
                    audioRef.current.play();
                };

                audioRef.current.onended = () => {
                    setAudioDuration(0);
                    resolve();
                };
            } catch (e) {
                console.error("TTS Error", e);
                setTimeout(resolve, 1000);
            }
        });
    };

    // ---------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------
    const handleStart = () => { setHasStarted(true); triggerGreeting(); };

    if (!hasStarted) {
        return (
            <div className="overlay" style={{background: 'rgba(0,0,0,0.9)', pointerEvents: 'auto'}}>
                <div className="center-display">
                    <motion.button
                        initial={{opacity: 0, scale: 0.9}}
                        animate={{opacity: 1, scale: 1}}
                        whileHover={{scale: 1.05, boxShadow: "0 0 20px #7B2CBF"}}
                        onClick={handleStart}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            padding: '20px 40px',
                            fontSize: '1.2rem',
                            fontFamily: "'Inter', sans-serif",
                            letterSpacing: '3px',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        {/* 👇 UPDATED TEXT */}
                        CONNECT TO ALFRED
                    </motion.button>
                </div>
            </div>
        );
    }
    return (
        <div className="overlay" onClick={() => startListening()}>
            <div className="header">
                <div className="status">{isSinging ? 'SINGING (LISTENING FOR STOP) 🎵' : status.toUpperCase()}</div>
            </div>

            <AnimatePresence><HoloCard /></AnimatePresence>

            <div className="center-display">
                {isSinging && <div style={{fontSize: '2rem', color: 'cyan'}}>🎵 Now Playing... 🎵</div>}

                {!isSinging && response && (
                    <div className="ai-text ai-text-container">
                        <Typewriter text={response} audioDuration={audioDuration} isActive={status === 'speaking'} />
                    </div>
                )}
            </div>
        </div>
    );
}