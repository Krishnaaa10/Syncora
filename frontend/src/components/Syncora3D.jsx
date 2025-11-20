import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text3D, Center } from '@react-three/drei'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import * as THREE from 'three'

const Syncora3DText = ({ mousePosition }) => {
  const meshRef = useRef()
  const [font, setFont] = useState(null)

  useEffect(() => {
    try {
      const loader = new FontLoader()
      loader.load(
        'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
        (loadedFont) => {
          setFont(loadedFont)
        },
        undefined,
        (error) => {
          console.error('Error loading font:', error)
        }
      )
    } catch (error) {
      console.error('Error initializing FontLoader:', error)
    }
  }, [])

  useFrame(() => {
    if (meshRef.current && mousePosition) {
      const { x, y } = mousePosition
      const rotationX = (y - 0.5) * 0.8
      const rotationY = (x - 0.5) * 0.8
      
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        rotationX,
        0.1
      )
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        rotationY,
        0.1
      )
    } else if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
    }
  })

  if (!font) {
    return (
      <Center>
        <mesh>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#c2185b" />
        </mesh>
      </Center>
    )
  }

  return (
    <Center ref={meshRef}>
      <Text3D
        font={font}
        size={2.5}
        height={0.6}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.15}
        bevelSize={0.08}
        bevelOffset={0}
        bevelSegments={5}
      >
        Syncora
        <meshStandardMaterial
          color="#c2185b"
          metalness={0.9}
          roughness={0.1}
          emissive="#c2185b"
          emissiveIntensity={0.4}
        />
      </Text3D>
    </Center>
  )
}

const Syncora3D = ({ mousePosition }) => {
  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <pointLight position={[-10, -10, -5]} intensity={0.6} color="#c2185b" />
          <pointLight position={[10, 10, 10]} intensity={0.4} color="#ffffff" />
          <Syncora3DText mousePosition={mousePosition} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Syncora3D

