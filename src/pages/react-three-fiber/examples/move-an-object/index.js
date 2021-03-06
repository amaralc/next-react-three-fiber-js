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

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import { Container } from '../../../../styles/pages/react-three-fiber/examples/move-an-object/styles'

extend({ OrbitControls })
const HEAD_DIRECTION = [0, 5, 0]
const ORIGIN_COORDS = [0, 5, 0]

/** Generate code randomly */
// const code = []

// let thisTargetCoordinates
// let thisX
// let thisY
// let thisZ
// let thisS

// for (let i = 0; i < 100; i++) {
//   thisX = Math.floor(Math.random() * 150) + 1
//   thisY = 5
//   thisZ = Math.floor(Math.random() * 150) + 1
//   thisS = Math.floor(Math.random() * 10) + 1
//   thisTargetCoordinates = [thisX, thisY, thisZ]
//   code.push({
//     targetCoordinates: thisTargetCoordinates,
//     speed: thisS
//   })
// }

// const GCODE = code

const GCODE = [
  {
    targetCoordinates: [100, 5, 0],
    speed: 1
  },
  {
    targetCoordinates: [75, 5, 100],
    speed: 1
  },
  {
    targetCoordinates: [50, 5, 100],
    speed: 0.5
  },
  {
    targetCoordinates: [173, 5, 20],
    speed: 0.7
  },
  {
    targetCoordinates: [100, 5, 100],
    speed: 0.7
  }
]

const VERTICES = GCODE.map(row => row.targetCoordinates)

const MyCube = ({
  originCoords = ORIGIN_COORDS,
  headDirection = HEAD_DIRECTION,
  gcode = GCODE,
  vertices = VERTICES
}) => {
  /** Control row state */
  const [gcodeRow, setGcodeRow] = useState(0)
  const [myVertices, setMyVertices] = useState([originCoords, ...vertices])

  const mesh = useRef()
  const line = useRef()

  const direction = new THREE.Vector3()
  const distanceVector = new THREE.Vector3()
  const refPosition = new THREE.Vector3()
  const targetVector = new THREE.Vector3()
  const headDirectionVector = new THREE.Vector3(...headDirection)
  let i = 0
  const j = 0

  useEffect(() => {
    /** Set orientation of cube */
    mesh.current.lookAt(headDirectionVector)
  }, [myVertices])

  useFrame(() => {
    if (i === j) {
      // setMyVertices(newVertices)

      line.current.geometry.vertices = myVertices.map(
        v => new THREE.Vector3(...v)
      )

      console.log(line.current.geometry.vertices)
      update(line.current.geometry)

      console.log({
        position: {
          x: mesh.current.position.x,
          y: mesh.current.position.y,
          z: mesh.current.position.z
        },
        target: targetVector
      })
      i += 1
    }
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
      const speedVector = direction.multiplyScalar(gcode[gcodeRow].speed)

      /** Update position */
      if (speedVector.length() < distanceVector.length()) {
        mesh.current.position.x += speedVector.x
        mesh.current.position.y += speedVector.y
        mesh.current.position.z += speedVector.z
      } else {
        mesh.current.position.x += distanceVector.x
        mesh.current.position.y += distanceVector.y
        mesh.current.position.z += distanceVector.z
      }
    } else {
      if (gcodeRow < gcode.length - 1) {
        i = j
        setGcodeRow(gcodeRow + 1)
      }
    }
  })

  const update = useCallback(
    self => {
      self.verticesNeedUpdate = true
      self.computeBoundingSphere()
    },
    [myVertices]
  )

  const thisVertices = useMemo(() => {
    console.log({ myVertices })
    return myVertices.map(v => new THREE.Vector3(...v))
  }, [myVertices])

  return (
    <>
      <mesh position={originCoords} ref={mesh}>
        <boxBufferGeometry args={[5, 5, 5]} />
        <meshNormalMaterial />
      </mesh>
      <line ref={line}>
        <geometry />
        <lineBasicMaterial color="red" linewidth={2} />
      </line>
    </>
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
      <gridHelper args={[300, 300, 'white', 'gray']} />
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
          position: [100, 100, 100]
        }}
      >
        <Scene />
      </Canvas>
    </Container>
  )
}

export default MyCanvas
