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

import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import { Container } from './styles'

extend({ OrbitControls })
const HEAD_DIRECTION = [0, 0, 1]
const ORIGIN_COORDS = [0, 0, 0]
const TARGET_COORDS = [0, 3, 1]
const SPEED = 0.02

const GCODE = [
  {
    targetCoordinates: [0, 3, 1],
    speed: 0.02
  },
  {
    targetCoordinates: [2, 5, 1],
    speed: 0.01
  },
  {
    targetCoordinates: [3, 2, 3],
    speed: 0.01
  },
  {
    targetCoordinates: [0, 0, 0],
    speed: 0.01
  }
]

const MyCube = ({
  originCoords = ORIGIN_COORDS,
  headDirection = HEAD_DIRECTION,
  gcode = GCODE
}) => {
  const [gcodeRow, setGcodeRow] = useState(0)

  const mesh = useRef()
  const direction = new THREE.Vector3()
  const distanceVector = new THREE.Vector3()
  const refPosition = new THREE.Vector3()
  const targetVector = new THREE.Vector3()
  const headDirectionVector = new THREE.Vector3(...headDirection)
  let i = 0

  useEffect(() => {
    /** Set orientation of cube */
    mesh.current.lookAt(headDirectionVector)
    console.log(mesh.current.position)
  }, [])

  useFrame(() => {
    /** Set target */
    targetVector.set(
      gcode[gcodeRow].targetCoordinates[0],
      gcode[gcodeRow].targetCoordinates[1],
      gcode[gcodeRow].targetCoordinates[2]
    )

    const { position } = mesh.current
    /** Copy current position to variable */
    refPosition.copy(position)

    /** Calculates distance to target point */
    distanceVector.addVectors(targetVector, refPosition.multiplyScalar(-1))

    /** If distance greater than zero */
    if (distanceVector.length() > 0) {
      /** Calculate unit vector */
      direction.subVectors(targetVector, position).normalize()

      /** Multiply unit vector by speed */
      const vector = direction.multiplyScalar(gcode[gcodeRow].speed)
      const a = gcodeRow
      if (a !== i) {
        console.log({ vector })
        i = a
      }

      /** Update position */
      mesh.current.position.x += Math.min(vector.x, distanceVector.x)
      mesh.current.position.y += Math.min(vector.y, distanceVector.y)
      mesh.current.position.z += Math.min(vector.z, distanceVector.z)
    } else {
      console.log(mesh.current.position)
      if (gcodeRow < gcode.length - 1) {
        setGcodeRow(gcodeRow + 1)
      }
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
