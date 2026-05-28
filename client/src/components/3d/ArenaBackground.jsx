import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

const ParticleField = () => {
    const count = 500;
    const mesh = useRef();
    const light = useRef();

    // Generate random positions
    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            // Distribute particles in a large cylinder/sphere volume
            const distance = 5 + Math.random() * 20;
            const theta = THREE.MathUtils.randFloatSpread(360); 
            const phi = THREE.MathUtils.randFloatSpread(360); 

            positions[i * 3] = distance * Math.sin(theta) * Math.cos(phi);
            positions[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi);
            positions[i * 3 + 2] = distance * Math.cos(theta);
        }
        
        return positions;
    }, [count]);

    // Animate particles slowly
    useFrame((state) => {
        const time = state.clock.elapsedTime;
        if (mesh.current) {
            mesh.current.rotation.y = time * 0.05;
            mesh.current.rotation.x = Math.sin(time * 0.1) * 0.1;
        }
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particlesPosition.length / 3}
                    array={particlesPosition}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.05} color="#ff4655" transparent opacity={0.6} sizeAttenuation />
        </points>
    );
};

const GlowingGrid = ({ theme }) => {
    return (
        <group position={[0, -2, 0]}>
            <Grid 
                infiniteGrid 
                fadeDistance={30}
                sectionColor="#ff4655"
                sectionThickness={1.5}
                cellColor={theme === 'dark' ? "#1f2326" : "#e4e4e7"}
                cellThickness={0.6}
            />
        </group>
    );
};

const MovingLights = () => {
    const lightRef = useRef();

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        lightRef.current.position.x = Math.sin(t * 0.5) * 10;
        lightRef.current.position.z = Math.cos(t * 0.5) * 10;
    });

    return (
        <pointLight 
            ref={lightRef}
            color="#00f0ff"
            intensity={20}
            distance={50}
        />
    );
};

export default function ArenaBackground() {
    const { theme } = useTheme();
    const bgColor = theme === 'dark' ? '#0f1923' : '#fafafa';

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden' }}>
            <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
                <color attach="background" args={[bgColor]} />
                <fog attach="fog" args={[bgColor, 5, 30]} />
                
                <ambientLight intensity={theme === 'dark' ? 0.2 : 0.8} />
                <directionalLight position={[10, 10, 10]} intensity={1} color="#ff4655" />
                
                <MovingLights />
                
                <GlowingGrid theme={theme} />
            </Canvas>
        </div>
    );
}
