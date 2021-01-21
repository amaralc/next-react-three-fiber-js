import * as THREE from 'three'
import React, {
  Fragment,
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
  useMemo
} from 'react'

function Line({ defaultStart, defaultEnd, defaultMiddle }) {
  const [start, setStart] = useState(defaultStart)
  const [end, setEnd] = useState(defaultEnd)
  const [middle, setMiddle] = useState(defaultMiddle)
  const vertices = useMemo(
    () => [start, end].map(v => new THREE.Vector3(...v)),
    [start, end]
  )
  const update = useCallback(self => {
    self.verticesNeedUpdate = true
    self.computeBoundingSphere()
  }, [])

  return (
    <Fragment>
      <line>
        <geometry vertices={vertices} onUpdate={update} />
        <lineBasicMaterial color="white" />
      </line>
    </Fragment>
  )
}

export default Line

// const camContext = React.createContext()
// function Controls({ children }) {
//   const { gl, camera } = useThree()
//   const api = useState(true)
//   return (
//     <Fragment>
//       <OrbitControls
//         args={[camera, gl.domElement]}
//         enableDamping
//         enabled={api[0]}
//       />
//       <camContext.Provider value={api}>{children}</camContext.Provider>
//     </Fragment>
//   )
// }

// function App() {
//   return (
//     <Canvas invalidateFrameloop orthographic camera={{ position: [0, 0, 500] }}>
//       <Controls>
//         <Line defaultStart={[-100, -100, 0]} defaultEnd={[0, 100, 0]} />
//         <Line defaultStart={[0, 100, 0]} defaultEnd={[100, -100, 0]} />
//       </Controls>
//     </Canvas>
//   )
// }
