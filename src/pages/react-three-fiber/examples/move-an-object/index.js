/**
 *
 *
 *
 * References:
 *
 * Move straight from point A to point B with a given speed
 * https://bradwoods.io/guides/react-three-fiber/move-object
 *
 * Use package for importing orbit controls without error
 * https://stackoverflow.com/questions/58363166/errors-cannot-use-import-statement-outside-a-module-three-orbitcontrol
 * https://codesandbox.io/s/41zwr?file=/src/index.js
 */

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import { Container } from './styles'

extend({ OrbitControls })
const HEAD_DIRECTION = [0, 0, 1]
const ORIGIN_COORDS = [0, 0, 0]
const TARGET_COORDS = [0, 3, 1]
const SPEED = 0.02

const MyCube = ({
  originCoords = ORIGIN_COORDS,
  targetCoords = TARGET_COORDS,
  headDirection = HEAD_DIRECTION,
  speed = SPEED
}) => {
  const mesh = useRef()
  const direction = new THREE.Vector3()
  const targetVector = new THREE.Vector3(...targetCoords)
  const headDirectionVector = new THREE.Vector3(...headDirection)

  useEffect(() => mesh.current.lookAt(headDirectionVector), [
    headDirectionVector
  ])

  useFrame(() => {
    const { position } = mesh.current
    if (position !== targetVector) {
      direction.subVectors(targetVector, position).normalize()
      const vector = direction.multiplyScalar(speed)

      mesh.current.position.x += vector.x
      mesh.current.position.y += vector.y
      mesh.current.position.z += vector.z
    }
  })

  return (
    <mesh position={originCoords} ref={mesh}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  )
}

const Scene = () => {
  const {
    camera,
    gl: { domElement }
  } = useThree()

  return (
    <>
      <orbitControls args={[camera, domElement]} />
      <gridHelper args={[10, 10, 'white', 'gray']} />
      <axesHelper />
      <MyCube />
    </>
  )
}

const MyCanvas = () => {
  return (
    <Container>
      <Canvas
        pixelRatio={1}
        camera={{
          position: [10, 10, 10]
        }}
      >
        <Scene />
      </Canvas>
    </Container>
  )
}

export default MyCanvas
