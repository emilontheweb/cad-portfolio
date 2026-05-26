import { Suspense, Component } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, useProgress, Html, Environment } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { useRef } from 'react'

// ── Loading indicator ─────────────────────────────────────────────────────────

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div style={{ color: '#4f8ef7', fontSize: '12px', fontFamily: 'monospace', textAlign: 'center' }}>
        <div style={{ width: 120, height: 2, background: '#2a2a3a', borderRadius: 1, marginBottom: 8, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#4f8ef7', transition: 'width 0.2s' }} />
        </div>
        {Math.round(progress)}%
      </div>
    </Html>
  )
}

// ── Placeholder shown when model file is missing ──────────────────────────────

function PlaceholderModel() {
  const mesh = useRef()
  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * 0.4
  })
  return (
    <group>
      <mesh ref={mesh} castShadow>
        <torusKnotGeometry args={[0.8, 0.25, 128, 32]} />
        <meshStandardMaterial color="#3a5a8a" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}

// ── Model loaders ─────────────────────────────────────────────────────────────

function GltfModel({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

function StlModel({ url }) {
  const geometry = useLoader(STLLoader, url)
  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial color="#6b8cba" metalness={0.4} roughness={0.5} />
    </mesh>
  )
}

function Model({ url }) {
  const ext = url.split('.').pop().toLowerCase()
  if (ext === 'stl') return <StlModel url={url} />
  return <GltfModel url={url} />
}

// ── Error boundary for inside the Canvas ─────────────────────────────────────

class ModelErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <Suspense fallback={null}>
          <PlaceholderModel />
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 5, 3]} intensity={1} />
        </Suspense>
      )
    }
    return this.props.children
  }
}

// ── Scene contents ────────────────────────────────────────────────────────────

function Scene({ url, interactive }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-4, 2, -4]} intensity={0.3} color="#a0c0ff" />

      <Suspense fallback={<Loader />}>
        <ModelErrorBoundary>
          <Model url={url} />
        </ModelErrorBoundary>
        <Environment preset="studio" />
      </Suspense>

      <OrbitControls
        enablePan={interactive}
        enableZoom={interactive}
        enableRotate={true}
        autoRotate={!interactive}
        autoRotateSpeed={1.5}
        minDistance={1}
        maxDistance={12}
      />
    </>
  )
}

// ── Public component ──────────────────────────────────────────────────────────

/**
 * ModelViewer
 * @param {string}  url          - path to .glb or .stl file
 * @param {boolean} interactive  - full controls vs auto-rotate thumbnail
 */
export default function ModelViewer({ url, interactive = false }) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 4], fov: 45 }}
      shadows
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
      }}
    >
      <Scene url={url} interactive={interactive} />
    </Canvas>
  )
}
