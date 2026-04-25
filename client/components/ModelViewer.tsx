import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

interface ModelViewerProps {
  modelUrl: string;
  title?: string;
}

function Model({ url }: { url: string }) {
  try {
    const { scene } = useGLTF(url);

    // Make a copy to avoid issues
    const clonedScene = scene.clone();

    // Calculate bounds and center the model
    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1 / (maxDim / 2);

    clonedScene.position.multiplyScalar(-scale);
    clonedScene.position.sub(center.multiplyScalar(scale));
    clonedScene.scale.multiplyScalar(scale);

    return <primitive object={clonedScene} />;
  } catch (error) {
    console.error("Error loading model:", error);
    return (
      <group>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8884d8" />
        </mesh>
      </group>
    );
  }
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
    </>
  );
}

export function ModelViewer({ modelUrl, title }: ModelViewerProps) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 relative group">
      <Canvas
        camera={{
          position: [0, 0, 2.5],
          fov: 75,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 2.5]} fov={75} />
        <Lights />
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#e0e7ff" />
            </mesh>
          }
        >
          <Model url={modelUrl} />
        </Suspense>
        <OrbitControls
          autoRotate
          autoRotateSpeed={3}
          enableZoom={true}
          enablePan={true}
          maxDistance={5}
          minDistance={0.5}
        />
      </Canvas>

      {/* Loading Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-black/50 rounded-lg px-4 py-2">
          <p className="text-white text-sm font-medium">
            Используйте мышь для вращения, скролл для масштабирования
          </p>
        </div>
      </div>

      {title && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
          <p className="font-semibold text-foreground">{title}</p>
        </div>
      )}
    </div>
  );
}
