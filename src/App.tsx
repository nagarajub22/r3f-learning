import { Canvas } from '@react-three/fiber';
import './App.css';
import GizmoHelperComp from './common/helpers/GizmoHelperComp';
import BufferGeometryShaders from './lessons/buffer-geometry-shaders';

function App() {
  return (
    <Canvas camera={{ position: [0, 5, 5], fov: 45 }}>
      <gridHelper/>
      <ambientLight />
      <GizmoHelperComp/>
      <BufferGeometryShaders rotation={[-Math.PI/2, 0, 0]}/>
    </Canvas>
  );
}

export default App;
