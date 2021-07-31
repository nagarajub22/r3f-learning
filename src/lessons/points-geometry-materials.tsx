import { Euler, Vector3 } from '@react-three/fiber';
import { useRef } from "react";

export interface IMeshProps {
    position?: Vector3;
    scale?: Vector3;
    rotation?: Euler;
}

export default function PointsGeometryExample(props: IMeshProps) {

    const ref = useRef();
    const n = 50, n2 = n / 2; // particles spread in the cube

    const points = [];
    const pointsColor = [];

    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * n - n2;
        const y = Math.random() * n - n2;
        const z = Math.random() * n - n2;

        points.push(x, y, z);

        pointsColor.push(Math.random(), Math.random(), Math.random());
    }

    const positions = new Float32Array(points);
    const colors = new Float32Array(pointsColor);

    return (
        <points ref={ref} rotation={props.rotation}>
            <bufferGeometry 
                attach="geometry"
                onUpdate={(self) => self.computeVertexNormals()}
            >
                <bufferAttribute 
                    attachObject={["attributes", "position"]}
                    array={positions}
                    itemSize={3}
                    count={positions.length / 3}
                />
                <bufferAttribute 
                    attachObject={["attributes", "color"]}
                    array={colors}
                    itemSize={3}
                    count={positions.length / 3}
                />
            </bufferGeometry>
            <pointsMaterial
                attach="material"
                vertexColors={true}
                size={10}
            />
        </points>
    );
}