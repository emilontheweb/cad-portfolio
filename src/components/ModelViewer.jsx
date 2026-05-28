import { Suspense, Component, useRef, useEffect } from 'react'
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
const ROTATE_RESUME_DELAY = 2000  // ms
const PAN_RESET_DELAY     = 2000  // ms

function Scene({ url, interactive }) {
  const controlsRef    = useRef()
  const rotateTimer    = useRef(null)
  const panTimer       = useRef(null)
  const isResettingPan = useRef(false)

  useEffect(() => {
    const ctrl = controlsRef.current
    if (!ctrl || !interactive) return

    const clearTimers = () => {
      clearTimeout(rotateTimer.current)
      clearTimeout(panTimer.current)
    }

    const onStart = () => {
      clearTimers()
      isResettingPan.current = false
      // Write directly to the controls object — no React re-render needed.
      // This takes effect on the very next frame inside drei's own useFrame.
      ctrl.autoRotate = false
    }

    const onEnd = () => {
      rotateTimer.current = setTimeout(() => {
        ctrl.autoRotate = true
      }, ROTATE_RESUME_DELAY)

      // If the orbit target has drifted (user panned), schedule a re-centre.
      // OrbitControls fires 'end' at the document level, so this works even
      // when the mouse is released outside the modal.
      if (ctrl.target.distanceTo(ORIGIN) > 0.05) {
        panTimer.current = setTimeout(() => {
          isResettingPan.current = true
        }, PAN_RESET_DELAY)
      }
    }

    ctrl.addEventListener('start', onStart)
    ctrl.addEventListener('end', onEnd)
    return () => {
      ctrl.removeEventListener('start', onStart)
      ctrl.removeEventListener('end', onEnd)
      clearTimers()
    }
  }, [interactive])

  useFrame(() => {
    const ctrl = controlsRef.current
    if (!ctrl || !isResettingPan.current) return

    const prevTarget = ctrl.target.clone()
    ctrl.target.lerp(ORIGIN, 0.06)

    // Translate the camera by the exact same delta as the target.
    // This keeps the orbit radius constant — without this, OrbitControls
    // recomputes a wrong radius on the next update() and the model shrinks.
    const delta = new THREE.Vector3().subVectors(ctrl.target, prevTarget)
    ctrl.object.position.add(delta)

    if (ctrl.target.distanceTo(ORIGIN) < 0.01) {
      // Final snap: close the remaining gap for both target and camera
      const snap = new THREE.Vector3().subVectors(ORIGIN, ctrl.target)
      ctrl.object.position.add(snap)
      ctrl.target.copy(ORIGIN)
      isResettingPan.current = false
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
        autoRotate={true}
        autoRotateSpeed={1.5}
        minDistance={1}
        maxDistance={12}
      />
    </>
  )
}

// ── Public component ──────────────────────────────────────────────────────────

export default function ModelViewer({ url, interactive = false }) {
  return (
    <div
      style={{ width: '100%', height: '100%' }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        shadows
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene url={url} interactive={interactive} />
      </Canvas>
    </div>
  )
}
