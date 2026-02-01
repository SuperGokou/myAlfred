import React, { useState, useEffect, useRef } from 'react';

const Typewriter = ({ text, audioDuration = 0, isActive = false }) => {
    const [displayedText, setDisplayedText] = useState('');
    const indexRef = useRef(0);
    const bottomRef = useRef(null);

    useEffect(() => {
        // 1. If audio hasn't loaded or started yet, don't type
        if (!isActive || audioDuration === 0) {
            setDisplayedText('');
            indexRef.current = 0;
            return;
        }

        // 2. CALCULATE SYNC SPEED
        // Convert duration to milliseconds (e.g., 5.5s -> 5500ms)
        // Divide by character count to get "ms per letter"
        const totalTimeMs = audioDuration * 1000;

        // Safety: If text is huge but audio is short, don't go below 10ms (too fast)
        // If text is short, don't go above 100ms (too slow)
        let charDelay = totalTimeMs / text.length;

        // Tweak: Make it slightly faster (0.9x) so text finishes just before voice
        charDelay = charDelay * 0.9;

        console.log(`Typing Speed: ${charDelay.toFixed(0)}ms per char`);

        const timerId = setInterval(() => {
            if (indexRef.current < text.length) {
                setDisplayedText((prev) => prev + text.charAt(indexRef.current));
                indexRef.current += 1;

                if (bottomRef.current) {
                    bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
                }
            } else {
                clearInterval(timerId);
            }
        }, charDelay);

        return () => clearInterval(timerId);
    }, [text, audioDuration, isActive]);

    return (
        <div className="typewriter-container">
            {displayedText}
            {/*<span className="cursor">|</span>*/}
            <div ref={bottomRef} style={{ float: 'left', clear: 'both' }} />
        </div>
    );
};

export default Typewriter;