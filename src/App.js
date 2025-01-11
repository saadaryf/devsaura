// App.js
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import NeonScene from './components/NeonScene';

const App = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{
          background: 'radial-gradient(circle at center, #000428 0%, #000000 100%)',
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <NeonScene />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 2.5}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
        <ambientLight intensity={0.3} />
      </Canvas>
    </div>
  );
};

export default App;