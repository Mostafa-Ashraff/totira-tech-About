import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import vertex from './shaders/test/vertex.glsl'
import fragment from './shaders/test/fragment.glsl'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import VirtualScroll from 'virtual-scroll'
import { Plane } from 'three'
import { Text } from 'troika-three-text'



let position = 0;
let speed = 0;
const scroller = new VirtualScroll()
scroller.on(event => {
        //wrapper.style.transform = `translateY(${event.y}px)`
        position = event.y / 2000;
        speed = event.deltaY / 1000
        console.log(position)
    })
    /**
     * Base
     */
    // Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();
const sceneCopy = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/8.png')

/**
 * Fonts
 */
// Text
const texts = ['LOREMMMM',
    'LOREMMMM',
    'LOREMMMM',
    'LOREMMMM',
    'LOREMMMM',
    'LOREMMMM',
    'LOREMMMM',
    'LOREMMMM',
    'LOREMMMM',
]
let textsGroup = new THREE.Group();

texts.forEach((txt, i) => {
    // scene.add(text)
    const myText = new Text()
    textsGroup.add(myText);
    // textsGroup.position.y = 1.5;

    // Set properties to configure:
    myText.text = txt + i
    myText.font = 'https://fonts.gstatic.com/s/monoton/v9/5h1aiZUrOngCibe4fkU.woff'
    myText.fontSize = 0.3
    let size = 0.4 * i
    myText.position.y = size
    myText.position.x = 0
    myText.color = 0xFFCE07
    scene.add(textsGroup)
        // Update the rendering:
    myText.sync()
})



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    // controls.update()

    // Render
    textsGroup.position.y = -position * 0.4
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick();

// ================================================================

// Textures (change imgs)
var textures = [...document.querySelectorAll('.js_texture')];

textures = textures.map((t) => {

    return new THREE.TextureLoader().load(t.src)
})



// =================================================
var plane, materialObj;
// object
function addObjects() {
    materialObj = new THREE.ShaderMaterial({
        extensions: {
            derivatives: "#extension GL_OES_standard_derivatives : enable"
        },
        side: THREE.DoubleSide,
        uniforms: {
            time: { value: 0 },
            uTexture: { value: textures[0] },
            resolution: { value: new THREE.Vector4() },
        },
        vertexShader: vertex,
        fragmentShader: fragment
    });
    const geometry = new THREE.PlaneGeometry(1.77, 1, 30, 30).translate(0, 0, 1);
    let pos = geometry.attributes.position;
    // let newPos = [];
    // for (let i = 0; i < pos.length; i += 3) {
    //     let x = pos[i];
    //     let y = pos[i + 1];
    //     let z = pos[i + 3];
    //     newPos.push(x, y, z);
    // }
    // geometry.setAttribute('position', new THREE.Float32BufferAttribute(newPos, 3));
    plane = new THREE.Mesh(geometry, materialObj);

    scene.add(plane);
}
addObjects();

// update texture
function updateTexture() {
    console.log(Math.round(position));
    let index = -(Math.round(position) % textures.length);
    materialObj.uniforms.uTexture.value = textures[Math.abs(index)];
}

// render
function render() {
    updateTexture();
    plane.position.y = 1;
    plane.position.x = 1;
    plane.rotation.y = -position * 2 * Math.PI;
    requestAnimationFrame(render);
    // console.log(plane.rotation.y);
}
render();