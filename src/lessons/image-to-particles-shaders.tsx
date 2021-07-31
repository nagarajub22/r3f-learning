import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { DoubleSide, LinearFilter, RGBFormat, Texture, TextureLoader, Uint16BufferAttribute, Vector2 } from "three";

export function ImageToParticlesTemplate(props: any) {

    const ref = useRef();
    const [positions, setPositions] = useState<Float32Array>(new Float32Array([
        -0.5, 0.5, 0.0,
        0.5, 0.5, 0.0,
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0
    ]));
    const colors = new Float32Array([
        //R, G, B, A
        1, 0, 1, 1.0,
        1, 1, 1, 1.0,
        1, 1, 0, 1.0,
        1, 0, 1, 1.0
    ]);
    const indices = new Uint16BufferAttribute([
        0, 2, 1,
        2, 1, 3
    ], 1);

    const vertexShaders = `
        precision highp float;

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform vec2 uTextureSize;
        uniform sampler2D uTexture;

        attribute vec3 position;
        attribute vec3 offset;
        attribute vec4 color;

        varying vec2 vPUv;

        
        void main() {
        
            vec2 puv = offset.xy / uTextureSize;
            vPUv = puv;

            // REF: https://stackoverflow.com/questions/13901119/how-does-vectors-multiply-act-in-shader-language

            vec3 displaced = offset;
            displaced.xy -= uTextureSize * 0.5;

            vec4 mvPosition = modelViewMatrix * vec4(displaced, 1);
            mvPosition.xyz += position * 2.0;
            gl_Position = projectionMatrix * mvPosition;
        }
    `;
    const fragmentShaders = `
        precision highp float;

        uniform sampler2D uTexture;
        uniform vec2 u_resolution;
        uniform vec2 uTextureSize;
        
        varying vec2 vPUv;

        void main() {

            vec2 puv = vPUv;
            vec4 color = texture2D(uTexture,puv);
            gl_FragColor = color;
        }
    `;

    useFrame(() => {
        
    });

    return (
        <mesh ref={ref} >
            <instancedBufferGeometry
                attach="geometry"
                index={indices}
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
                    itemSize={4}
                    normalized={true}
                    count={colors.length / 4}
                />

                <instancedBufferAttribute
                    attachObject={["attributes", "offset"]}
                    array={props.offset}
                    itemSize={3}
                    count={props.offset.length / 3}
                />

            </instancedBufferGeometry>
            <rawShaderMaterial
                attach="material"
                uniforms={props.uniforms}
                vertexShader={vertexShaders}
                fragmentShader={fragmentShaders}
                side={DoubleSide}
                transparent={true}
            />
        </mesh>
    )
}

export function ImageToParticlesShaders(props: any) {

    const [offset, setOffset] = useState<Float32Array>();
    const [uniforms, setUniforms] = useState<any>();

    useEffect(() => {
        const myImgUrl = '/sample-03.png';
        (new TextureLoader()).load(myImgUrl, (texture: Texture) => {
            if (!texture) {
                return;
            }

            const threshold = 34;
            const tempCanvEl = document.createElement('canvas');
            const ctx = tempCanvEl.getContext('2d');
            const textureImage = texture.image;
            const totalPixels = textureImage.width * textureImage.height;

            tempCanvEl.width = textureImage.width;
            tempCanvEl.height = textureImage.height;

            if (ctx) {
                let totalVisiblePixels = 0;

                ctx?.scale(1, -1);
                ctx?.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);

                const imgData = ctx.getImageData(0, 0, tempCanvEl.width, tempCanvEl.height);

                const offsets = new Float32Array(totalPixels * 3);
                const offsetsIndices = [];
                for (let i = 0; i < totalPixels; i++) {
                    offsets[i * 3 + 0] = i % textureImage.width;
                    offsets[i * 3 + 1] = Math.floor(i / textureImage.width);

                    offsetsIndices.push(i);
                }

                texture.minFilter = LinearFilter;
                texture.magFilter = LinearFilter;
                texture.format = RGBFormat;

                setUniforms({
                    uTexture: texture,
                    uTextureSize: { value: new Vector2(textureImage.width, textureImage.height) }
                });
                setOffset(offsets);
            }
        })
    }, []);

    return (
        <>
            {offset && <ImageToParticlesTemplate offset={offset} uniforms={uniforms} />}
        </>
    )
}
