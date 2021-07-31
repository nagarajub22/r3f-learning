import { useMemo, useRef } from "react";
import { Euler, Vector3 } from '@react-three/fiber';
import { DoubleSide, Texture, TextureLoader } from "three";

export interface IMeshProps {
    position?: Vector3;
    scale?: Vector3;
    rotation?: Euler;
}

export default function ShaderAnimation(props: IMeshProps) {

    const ref = useRef();
    const textureMap = useMemo(() => {
        return new TextureLoader().load('/texture1.jpeg');
    }, []);

    const dMap = useMemo(() => {
        return new TextureLoader().load('/dmap.png');
    }, []);

    return (
        <mesh ref={ref} rotation={props.rotation}>
            <planeBufferGeometry attach="geometry" args={[10,10,64,64]}/>
            <meshStandardMaterial 
                attach="material"
                color="grey"
                map={textureMap}
                displacementMap={dMap}    
                displacementScale={2}
                side={DoubleSide}
                transparent={true}
            />
        </mesh>
    );
}