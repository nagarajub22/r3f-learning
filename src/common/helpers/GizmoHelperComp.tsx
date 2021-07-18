
import { GizmoHelper, GizmoViewport, OrbitControls } from "@react-three/drei";
import { useRef } from "react";

function GizmoHelperComp(props: any) {
    const controlRef = useRef<any>();

    return (
        <>
            <GizmoHelper
                alignment="bottom-right" // widget alignment within scene
                onTarget={() => controlRef?.current?.target}
                onUpdate={() => controlRef.current?.update()}
            >
                <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
            </GizmoHelper>
            <OrbitControls ref={controlRef} />
        </>
    )
}

export default GizmoHelperComp;