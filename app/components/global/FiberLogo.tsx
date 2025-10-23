// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/no-unknown-property */
import {Suspense, useRef} from 'react';
import {Canvas, useFrame, useThree, extend} from '@react-three/fiber';
import {shaderMaterial, useTexture} from '@react-three/drei';
import * as THREE from 'three';
import fragment from '~/shaders/fragment.glsl?raw';
import vertex from '~/shaders/vertex.glsl?raw';

const ColorMaterial = shaderMaterial(
  {
    uTime: 0,
    uFreq: 100.0,
    uBorder: 0.05,
    uTexture: null,
    uNoiseTexture: null,
  },
  vertex,
  fragment,
);

// Extend THREE with custom material
extend({ColorMaterial});

// Add TypeScript declaration
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      colorMaterial: any;
    }
  }
}

function GetMesh() {
  const [gopherTexture, noiseTexture] = useTexture(['/into.svg', '/noise.png']);
  const {viewport} = useThree();
  const ref = useRef<any>();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.material.uTime = Math.sin(state.clock.elapsedTime) * 3.125;
  });

  return (
    <mesh ref={ref} rotation={[0, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry
        attach="geometry"
        args={[viewport.width, viewport.width * 0.1669, 10, 10]}
      />
      <colorMaterial
        key={ColorMaterial.key}
        uFreq={0.2}
        uBorder={0}
        flat={true}
        uTexture={gopherTexture}
        uNoiseTexture={noiseTexture}
      />
    </mesh>
  );
}

export default function FiberLogo() {
  return (
    <div className="aspect-[1360/227]">
      <Canvas>
        <Suspense fallback={null}>
          <GetMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}
