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

  const box = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 0.2, 1), 
  new THREE.MeshBasicMaterial({
  color: '#3BF7FF',
  opacity: 0.7,
  transparent: true
})
)

  const latitude = (lat / 180) * Math.PI
  const longitude = (long / 180) * Math.PI
  const radius = 5
  
  const x = radius * Math.cos(latitude) * Math.sin(longitude)
  const y = radius * Math.sin(latitude) 
  const z = radius * Math.cos(latitude) * Math.cos(longitude)
  
  box.position.x = x
  box.position.y = y
  box.position.z = z
  
  box.lookAt(0,0,0)
  box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.4 ))

  group.add(box)

  gsap.to(box.scale, {
      z: 1.4,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'linear',
      delay: Math.random()
  })
 
}

createPoint(52.3676, 4.9041)
createPoint(40.7128, 74.0060)


sphere.rotation.y = -Math.PI / 2

const mouse = {
  x: undefined,
  y: undefined
}

 const raycaster = new THREE.Raycaster()
// console.log(raycaster)
// console.log(group.children)

const popUp = document.querySelector('#popUp')


function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene,camera)
  group.rotation.y += 0.003 

  
  // if(mouse.x){
  // gsap.to(group.rotation, {
  //   x: -mouse.y * 0.3,
  //   y: mouse.x * 0.5,
  //   duration: 1
  // })
  // }

  raycaster.setFromCamera(mouse, camera)

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects(
    group.children.filter((mesh) => {
      return mesh.geometry.type === 'BoxGeometry'
      }) 
    )

  group.children.forEach((mesh) => {
    mesh.material.opacity = 0.4
  } )    

	for(let i = 0; i < intersects.length; i++ ){
  intersects[i].object.material.opacity = 1
	}

	renderer.render( scene, camera )

 
}

animate()

addEventListener('mousemove', (event) => {
  mouse.x = ((event.clientX - innerWidth / 2) / ( innerWidth/2 )) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1

  gsap.set(popUp, {
    x: event.clientX,
    y: event.clientY
  })

})


