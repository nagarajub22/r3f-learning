import { useRef } from "react";
import { DoubleSide, Uint16BufferAttribute } from "three";

export default function BufferGeometryShaders(props: any) {
    // Geometry Values
    const positions = new Float32Array([
        // x,   y,  z               
        -0.5, 0.5, 0,
        0.5, 0.5, 0,
        -0.5, -0.5, 0,
        0.5, -0.5, 0
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



    const uniforms = {
        time: { value: 1.0 }
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

        uniform float time;

        varying vec4 fragColor;

        void main() {
            vec4 newcolor = vec4(fragColor);
            gl_FragColor = vec4(newcolor);
        }
    `;

    // React Logics 
    const ref = useRef();

    return (
        <mesh ref={ref} position={props?.position} rotation={props?.rotation}>
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