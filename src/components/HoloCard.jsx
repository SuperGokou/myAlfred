import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';

export default function HoloCard() {
    const { visualContent, closeVisual } = useStore();

    if (!visualContent) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            style={{
                position: 'absolute',
                top: '20%',
                right: '10%', // Positioned to the right side
                width: '300px',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.05)', // Glass background
                backdropFilter: 'blur(20px)',           // Blur effect
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                boxShadow: '0 0 50px rgba(123, 44, 191, 0.3)', // Purple glow
                zIndex: 20,
                color: 'white',
                fontFamily: "'Inter', sans-serif"
            }}
        >
            {/* Close Button */}
            <button
                onClick={closeVisual}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                }}
            >
                ×
            </button>

            {/* Image / Content */}
            {visualContent.image && (
                <div style={{ marginBottom: '15px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img
                        src={visualContent.image}
                        alt="Visual Data"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                </div>
            )}

            {/* Text Info */}
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', textShadow: '0 0 10px rgba(123,44,191,0.5)' }}>
                {visualContent.title}
            </h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.4' }}>
                {visualContent.description}
            </p>

            {/* Link Button */}
            {visualContent.link && (
                <a
                    href={visualContent.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        display: 'block',
                        marginTop: '15px',
                        textAlign: 'center',
                        padding: '10px',
                        background: 'linear-gradient(90deg, #7B2CBF, #9D4EDD)',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                    }}
                >
                    OPEN SECURE LINK
                </a>
            )}
        </motion.div>
    );
}