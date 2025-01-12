import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import NeonScene from './components/neon/NeonScene';
import { LoadingScreen } from './components/neon/LoadingScreen';
import CodeButton from './components/neon/CodeButton';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 200);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <CodeButton />
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
        {isLoading ? (
          <LoadingScreen progress={loadingProgress} />
        ) : (
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
        )}
        <ambientLight intensity={0.3} />
      </Canvas>
    </div>
  );
};

export default App;