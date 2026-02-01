import { create } from 'zustand';
import { processInput } from './utils/brain';

export const useStore = create((set) => ({
    status: 'idle',
    transcript: '',
    response: '',
    visualContent: null,
    action: null,
    data: null,

    setStatus: (status) => set({ status }),
    setTranscript: (text) => set({ transcript: text }),

    processCommand: async (command) => {
        set({
            status: 'processing',
            transcript: command,
            response: '',
            action: null,  // <--- CRITICAL RESET
            data: null,    // <--- CRITICAL RESET
            visualContent: null
        });

        try {
            const result = await processInput(command);

            // 👇 FIX: Only show HoloCard window for specific actions
            const shouldShowCard = result.action === 'SHOW_PROJECT' || result.action === 'SHOW_CONTACT';

            set({
                status: 'speaking',
                response: result.text,

                // Only set visualContent if it's a Card action (otherwise null)
                visualContent: shouldShowCard ? result.data : null,

                action: result.action,
                data: result.data
            });

        } catch (error) {
            console.error(error);

            set({
                status: 'speaking',
                response: "系统遇到错误。",
                action: null, // <--- SAFETY RESET
                data: null
            });
        }
    },

    triggerGreeting: () => {
        set({
            status: 'speaking',
            response: "Greetings, Master Hanlin. Alfred is online. How may I be of service?",
            action: null,
            data: null,
            visualContent: null
        });
    },

    closeVisual: () => set({ visualContent: null })
}));