import React from 'react';
import { NeonWord } from './NeonWord';
import { DevParticleSystem } from './DevParticleSystem';
import { SceneAtmosphere } from './SceneAtmosphere';
import NeonTrails from './NeonTrails';

const NeonScene = () => {
    return (
        <>
            <NeonWord
                text="DEVS"
                position={[-2.5, 0, 0]}
                color={0x00ffff}
                wordMix={0}
            />
            <NeonWord
                text="AURA"
                position={[0.3, 0, 0]}
                color={0x00ffff}
                wordMix={1}
            />
            <DevParticleSystem />
            <SceneAtmosphere />
            <NeonTrails />
        </>
    );
};

export default NeonScene;