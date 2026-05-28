import { Suspense, Component, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, useProgress, Html, Environment } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import * as THREE from 'three'

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

// ── Placeholder when model file is missing ────────────────────────────────────

function PlaceholderModel() {
  const mesh = useRef()
  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * 0.4
  })
  return (
    <mesh ref={mesh} castShadow>
      <torusKnotGeometry args={[0.8, 0.25, 128, 32]} />
      <meshStandardMaterial color="#3a5a8a" metalness={0.6} roughness={0.3} />
    </mesh>
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

// ── Error boundary for Canvas crashes ────────────────────────────────────────

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

// ── Scene ─────────────────────────────────────────────────────────────────────

const ORIGIN = new THREE.Vector3(0, 0, 0)

/**
 * panResetSignal: increments each time a pan-reset should be triggered.
 * useEffect compares it to the previous value so every increment fires once.
 */
function Scene({ url, interactive, autoRotate, panResetSignal }) {
  const controlsRef = useRef()
  const shouldResetPan = useRef(false)

  useEffect(() => {
    if (panResetSignal > 0) shouldResetPan.current = true
  }, [panResetSignal])

  // Smoothly lerp the orbit target back to the origin after a pan
  useFrame(() => {
    const ctrl = controlsRef.current
    if (!ctrl || !shouldResetPan.current) return
    ctrl.target.lerp(ORIGIN, 0.06)
    ctrl.update()
    if (ctrl.target.distanceTo(ORIGIN) < 0.01) {
      ctrl.target.copy(ORIGIN)
      ctrl.update()
      shouldResetPan.current = false
    }
  })

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
        ref={controlsRef}
        enablePan={interactive}
        enableZoom={interactive}
        enableRotate={true}
        autoRotate={autoRotate}
        autoRotateSpeed={1.5}
        minDistance={1}
        maxDistance={12}
      />
    </>
  )
}

// ── Public component ──────────────────────────────────────────────────────────

const ROTATE_RESUME_DELAY = 2000  // ms before auto-rotate resumes after release
const PAN_RESET_DELAY     = 2000  // ms before panned view snaps back to centre

export default function ModelViewer({ url, interactive = false }) {
  const [autoRotate, setAutoRotate] = useState(!interactive)
  const [panResetSignal, setPanResetSignal] = useState(0)
  const rotateTimer = useRef(null)
  const panTimer = useRef(null)

  const clearTimers = () => {
    clearTimeout(rotateTimer.current)
    clearTimeout(panTimer.current)
  }

  const handleMouseDown = () => {
    if (!interactive) return
    clearTimers()
    setAutoRotate(false)
  }

  const handleMouseUp = (e) => {
    if (!interactive) return

    // Resume auto-rotation after delay
    rotateTimer.current = setTimeout(() => setAutoRotate(true), ROTATE_RESUME_DELAY)

    // Right-click (button 2) = pan — schedule a target reset
    if (e.button === 2) {
      panTimer.current = setTimeout(
        () => setPanResetSignal((s) => s + 1),
        PAN_RESET_DELAY
      )
    }
  }

  // If the user drags outside the canvas and releases there, still resume
  const handleMouseLeave = () => {
    if (!interactive || !rotateTimer.current) return
    rotateTimer.current = setTimeout(() => setAutoRotate(true), ROTATE_RESUME_DELAY)
  }

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        shadows
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene
          url={url}
          interactive={interactive}
          autoRotate={autoRotate}
          panResetSignal={panResetSignal}
        />
      </Canvas>
    </div>
  )
}
