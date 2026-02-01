# 🤵 Alfred - AI Holographic Portfolio

> *"Master Hanlin, Alfred is at your service."*

Alfred is an immersive, voice-activated 3D portfolio assistant. Unlike static websites, Alfred uses a **local Large Language Model (Llama 3)** to hold natural conversations, answer questions about my skills, and project holographic data cards in real-time.

![Alfred AI Preview](https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop)
*(Replace this link with a real screenshot of your specific purple orb later)*

## ✨ Key Features

* **🧠 Local Intelligence:** Powered by **Llama 3 (8B)** running locally via **Ollama**. No API fees, complete privacy.
* **🗣️ Voice Interaction:** Full duplex voice-to-voice conversation. Alfred listens to Mandarin/English commands and replies with a synthesized voice.
* **🔮 3D Liquid UI:** A reactive "Fluid Orb" built with **Three.js** and **React Three Fiber** that changes color and shape based on AI states (Idle, Listening, Speaking).
* **📂 Holographic Data Cards:** Dynamic glassmorphism UI cards appear when specific topics (Projects, Contact) are triggered.
* **⚡ Modern Stack:** Built with Vite, React, Zustand, and Framer Motion.

## 🛠️ Tech Stack

**Frontend:**
* **React 18** (Vite)
* **Three.js / React Three Fiber** (3D Rendering)
* **Framer Motion** (UI Animations)
* **Zustand** (State Management)
* **Web Speech API** (TTS & STT)

**AI / Backend:**
* **Ollama** (Local LLM Server)
* **Llama 3 (8B)** (The Brain)
* **OpenAI SDK** (Connection Bridge)

## 🚀 Getting Started

### Prerequisites
1.  **Node.js** (v18+)
2.  **Ollama** installed on your machine ([Download Here](https://ollama.com/))
3.  **Llama 3 Model** pulled locally

### 1. Setup the AI (Ollama)
Alfred requires a local AI server to function.

1.  Install Ollama and run:
    ```bash
    ollama pull llama3:8b
    ```
2.  **Crucial:** Allow the browser to talk to Ollama (CORS Fix).
    * **Windows (PowerShell):**
        ```powershell
        [Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")
        ```
    * **Mac/Linux:**
        ```bash
        launchctl setenv OLLAMA_ORIGINS "*"
        ```
3.  Start the server:
    ```bash
    ollama serve
    ```

### 2. Install & Run the Frontend
1.  Clone the repository:
    ```bash
    git clone [https://github.com/SuperGokou/myportfolio.git](https://github.com/SuperGokou/myportfolio.git)
    cd myportfolio
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 🎮 How to Interact
1.  Click **"CONNECT TO ALFRED"** to initialize the audio engine.
2.  **Speak (in Mandarin or English):**
    * *"你是谁？"* (Who are you?) -> Alfred introduces himself.
    * *"看看项目"* (Show projects) -> Triggers the Holographic Project Card.
    * *"联系方式"* (Contact info) -> Triggers the QR Code Card.
3.  **Visual Feedback:**
    * 🟣 **Purple:** Idle / Waiting.
    * 🔴 **Red Glow:** Listening to microphone.
    * 🔵 **Cyan Pulse:** Thinking / Speaking.

## 🔧 Configuration
You can customize Alfred's personality in `src/utils/ollama.js`:

```javascript
const SYSTEM_PROMPT = `
You are Alfred, a loyal and witty butler for Master Hanlin.
Always answer in Mandarin Chinese.
Keep responses concise and elegant.
`;
