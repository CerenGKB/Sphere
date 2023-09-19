import * as THREE from 'three'
import gsap from 'gsap'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'


const canvasContainer = document.querySelector('#canvasContainer')

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  canvasContainer.offsetWidth/ canvasContainer.offsetHeight,
  0.1,
  1000
)

const renderer = new THREE.WebGLRenderer({
  antialias : true,
  canvas : document.querySelector('canvas')
})

renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight)
renderer.setPixelRatio(window.devicePixelRatio)



const sphere = new THREE.Mesh(new THREE.SphereGeometry(5,50,50), 
new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    globeTexture : {
      value: new THREE.TextureLoader().load('./img/uvearthdark.jpg')
    }
  }
})
)

scene.add(sphere)

const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(5,50,50), 
new THREE.ShaderMaterial({
  vertexShader : atmosphereVertexShader,
  fragmentShader : atmosphereFragmentShader,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide
})
)

atmosphere.scale.set(1.1, 1.1, 1.1)

scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

const starVertices = []
for( let i = 0; i< 10000 ; i++){
  const x = (Math.random() - 0.5) * 2000
  const y = (Math.random() - 0.5) * 2000
  const z = -(Math.random()) * 2000
  starVertices.push(x,y,z)
}

const starGeometry = new THREE.BufferGeometry()
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(
  starVertices, 3
))

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff
})

const stars = new THREE.Points(starGeometry, starMaterial)

scene.add(stars)


camera.position.z = 15




function createPoint(lat , long){

  const point = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,1), 
  new THREE.MeshBasicMaterial({
  color: '#ff0000'
})
)

  const latitude = (lat / 180) * Math.PI
  const longitude = (long / 180) * Math.PI
  const radius = 5
  
  const x = radius * Math.cos(latitude) * Math.sin(longitude)
  const y = radius * Math.sin(latitude) 
  const z = radius * Math.cos(latitude) * Math.cos(longitude)
  
  point.position.x = x
  point.position.y = y
  point.position.z = z
  
  point.lookAt(0,0,0)

  group.add(point)
}

createPoint(52.3676, 4.9041)

sphere.rotation.y = -Math.PI / 2

const mouse = {
  x: undefined,
  y: undefined
}

function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene,camera)
 /* sphere.rotation.y += 0.003 */

  if(mouse.x){
  gsap.to(group.rotation, {
    x: -mouse.y * 0.3,
    y: mouse.x * 0.5,
    duration: 1
  })
  }
}

animate()




addEventListener('mousemove', () => {
  mouse.x = (event.clientX / innerWidth)
   * 2 - 1
  mouse.y = -(event.clientY / innerHeight)
  * 2 - 1
})

