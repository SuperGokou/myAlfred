import React from 'react';
import { Canvas } from '@react-three/fiber';
import Experience from './components/Experience';
import Overlay from './components/Overlay';

function App() {

    return (
        <div className="main-container">
            <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
                <Experience />
            </Canvas>
            <Overlay />
        </div>
    );
}

export default App
