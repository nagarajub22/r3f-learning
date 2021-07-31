import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DoubleSide, Uint16BufferAttribute } from "three";

export default function BufferGeometryShadersInteraction(props: any) {
    // Geometry Values
    const positions = new Float32Array([
        // x,   y,  z               
        -5,  5, 0,
         5,  5, 0,
        -5, -5, 0,
         5, -5, 0
    ]);

    const colors = new Float32Array([
        //R, G, B, A
        0, 1, 0, 1.0,
        1, 1, 0, 1.0,
        0, 1, 1, 1.0,
        1, 0, 1, 1.0
    ]);

    const indices = new Uint16BufferAttribute([
        0, 1, 2,
        1, 2, 3
    ], 1);

    const canvasEl = document.getElementsByTagName('canvas')[0];
    const uniforms = {
        u_resolution: { value: { x: canvasEl.width, y: canvasEl.height } },
        u_time: { value: 0.0 },
        u_mouse: { value: { x: 1, y: 1 } }
    };
    const vertexShader = `
        precision mediump float;

        attribute vec3 position;
        attribute vec4 color;

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

        varying vec4 fragColor;

        void main() {
            fragColor = color;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
        }
    `;
    const fragmentShader = `
        precision mediump float;

        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;

        varying vec4 fragColor;

        void main() {
            float r = u_mouse.x / u_resolution.x;
            float g = u_mouse.y / u_resolution.y;
            float b = u_time;
            gl_FragColor = vec4(r, sin(g), sin(b), 1);
        }
    `;

    // React Logics 
    const ref = useRef();

    useFrame(({ clock }) => {
        uniforms.u_time.value = clock.getElapsedTime();
    });

    return (
        <mesh 
            ref={ref} 
            position={props?.position} 
            rotation={props?.rotation}
            onPointerMove={(evt) => {
                uniforms.u_mouse.value.x = evt.x;
                uniforms.u_mouse.value.y = evt.y;
            }}
        >
            <bufferGeometry attach="geometry" index={indices}>
                <bufferAttribute
                    attachObject={["attributes", "position"]}
                    array={positions}
                    itemSize={3}
                    count={positions.length / 3}

                />
                <bufferAttribute
                    attachObject={["attributes", "color"]}
                    array={colors}
                    itemSize={4}
                    normalized={true}
                    count={colors.length / 4}
                />

            </bufferGeometry>
            <rawShaderMaterial
                attach="material"
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                side={DoubleSide}
                transparent={true}
            />
        </mesh>
    );
}

// https://github.com/sessamekesh/IndigoCS-webgl-tutorials/blob/master/02%20-%20Rotating%20Cube/app.js
// https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_rawshader.html