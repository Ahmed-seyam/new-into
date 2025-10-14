import React, {useRef, useState} from 'react';
import {
  Canvas,
  useFrame,
  useThree,
  useLoader,
  extend,
} from '@react-three/fiber';
import {Svg, shaderMaterial, useTexture} from '@react-three/drei';
import * as THREE from 'three';
import {Suspense} from 'react';
import '../../materials/WaveMaterial';
import fragment from '../../shaders/fragment.glsl?raw';
import vertex from '../../shaders/vertex.glsl?raw';
import {useControls} from 'leva';
import {Mesh} from 'three';
// import {WaveShaderMaterial} from '../../materials/WaveMaterial';

// const SphereShaderMaterial = {
//   uniforms: {
//     time: {value: 0},
//     colorStart: {value: new THREE.Color('hotpink')},
//     colorEnd: {value: new THREE.Color('white')},
//   },
//   vertexShader: glsl`
//       varying vec2 vUv;
//       void main() {
//         vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//         vec4 viewPosition = viewMatrix * modelPosition;
//         vec4 projectionPosition = projectionMatrix * viewPosition;
//         gl_Position = projectionPosition;
//         vUv = uv;
//       }`,
//   fragmentShader: glsl`
//       #pragma glslify: cnoise3 = require(glsl-noise/classic/3d.glsl)
//       uniform float time;
//       uniform vec3 colorStart;
//       uniform vec3 colorEnd;
//       varying vec2 vUv;
//       void main() {
//         vec2 displacedUv = vUv + cnoise3(vec3(vUv * 10.0, time * 0.1));
//         float strength = cnoise3(vec3(displacedUv * 10.0, time * 0.2));
//         float outerGlow = distance(vUv, vec2(0.5)) * 2.0 - 0.5;
//         strength += outerGlow;
//         strength += step(-0.2, strength) * 0.6;
//         strength = clamp(strength, 0.0, 1.0);
//         vec3 color = mix(colorStart, colorEnd, strength);
//         gl_FragColor = vec4(color, 1.0);
//       }`,
// };

function Logo() {
  const {viewport} = useThree();
  const ref = useRef();
  const {width, height} = useThree((state) => state.viewport);
  useFrame((state, delta) => (ref.current.time += delta));
  const logoUrl = '/into.svg';
  //   <Svg src={logoUrl} scale={0.0338} position={[-23, 3.8, 0]} />;
  if (typeof window) {
    return (
      <mesh ref={ref}>
        <planeGeometry args={[1, 1, 16, 16]} />
        <shaderMaterial attach="material" args={[SphereShaderMaterial]} />
        {/* <waveMaterial
        ref={ref}
        key={WaveMaterial.key}
        colorStart="pink"
        colorEnd="white"
      /> */}
      </mesh>
    );
  } else {
    return <></>;
  }
}
const Plane = () => {
  const {viewport} = useThree();
  const material = useRef();
  const [texture] = useLoader(THREE.TextureLoader, ['/into.svg']);

  useFrame(({clock}) => {
    if (material.current) {
      material.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });
  return (
    <mesh>
      <planeGeometry
        args={[viewport.width, viewport.width * 0.1669, 10, 100]}
      />
      <waveMaterial ref={material} attach="material" map={texture} />
    </mesh>
  );
};

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
extend({ColorMaterial});

function useShaderControls() {
  const {speed, border} = useControls({
    speed: {
      value: 0.2,
      min: 0.05,
      max: 1.0,
      step: 0.05,
      label: 'speed',
    },
    border: {
      value: 0.15,
      min: 0.01,
      max: 0.4,
      step: 0.05,
    },
  });
  return {speed, border};
}

function GetMesh() {
  const [gopherTexture, noiseTexture] = useTexture(['/into.svg', '/noise.png']);
  const speed = 0.2;
  const border = 0;
  const {viewport} = useThree();

  const ref = useRef();
  useFrame((state, delta) => {
    if (!ref.current) return;
    // @ts-ignore
    ref.current.material.uTime = Math.sin(state.clock.elapsedTime) * 3.125;
    // ref.current.rotation.y = Math.sin(state.clock.elapsedTime) / 4;
  });

  return (
    <mesh ref={ref} rotation={[0, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry
        attach="geometry"
        args={[viewport.width, viewport.width * 0.1669, 10, 10]}
      />
      {/*@ts-ignore                */}
      <colorMaterial
        key={ColorMaterial.key}
        uFreq={speed}
        uBorder={border}
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
          {/* <Plane /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}
