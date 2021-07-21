import { useHelper } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { PointLightHelper } from 'three';
import './App.css';
import GizmoHelperComp from './common/helpers/GizmoHelperComp';
import PointsGeometryExample from './lessons/points-geometry-materials';
import ShaderAnimation from './lessons/shader-example-1';

export function CameraComponent() {
  useFrame(({ camera, clock }) => {
    // camera.position.z = 600 + Math.sin(clock.getElapsedTime()) * 250;
    // camera.position.x = 0 + Math.sin(clock.getElapsedTime()) * 1;
    // camera.position.y = 10 + Math.sin(clock.getElapsedTime());
  });

  return null;
}

export function PointLightHelperComponent() {
  const ref = useRef();

  useHelper(ref, PointLightHelper, 1);

  return (
    <>
      <pointLight ref={ref} position={[2, 3, 4]} args={["#FFFFFF", 2]} />
    </>
  )
}

function App() {


  return (
    // position: [0, 0, 2750], fov: 100, near: 1, far: 1000
    <Canvas
      camera={{ fov: 15, near: 5, far: 2000, aspect: window.innerWidth / window.innerHeight, position: [0, 10, 10] }}
    >
      <CameraComponent />
      {/* <gridHelper /> */}
      <GizmoHelperComp />
      {/* <BufferGeometryShaders />
      <BufferGeometryShadersInteraction rotation={[-Math.PI/2, 0, 0]}/> 
      <ShaderAnimation rotation={[-Math.PI / 2, 0, 0]} />
      <PointsGeometryExample/> */}

      {/* For Displacement shader */}
      <ambientLight />
      <color attach="background" args={["#00000F"]} />
      <ShaderAnimation rotation={[-Math.PI / 2, 0, 0]} />
      <PointLightHelperComponent />

    </Canvas>
  );
}

export default App;
