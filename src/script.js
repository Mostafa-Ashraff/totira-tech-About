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



var position = 0;
const scroller = new VirtualScroll();
scroller.on(event => {
        // wrapper.style.transform = 'translateY(f'
        position = event.y / 2000;
        console.log(position);
    })
    /**
     * Base
     */
    // Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/8.png')

/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        // Material
        const material = new THREE.MeshBasicMaterial({ color: 'white' })
            // new THREE.ShaderMaterial({
            //     side: DoubleSide,
            //     transparent: true,
            //     defines: {
            //         IS_SMALL: false,
            //     },
            //     extensions: {
            //         derivatives: true,
            //     },
            //     uniforms: {
            //         // Common
            //         ...uniforms.common,

        //         // Rendering
        //         ...uniforms.rendering,

        //         // Strokes
        //         ...uniforms.strokes,
        //     },
        //     vertexShader: `
        //         // Attribute
        //         #include <three_msdf_attributes>

        //         // Varyings
        //         #include <three_msdf_varyings>

        //         void main() {
        //             #include <three_msdf_vertex>
        //         }
        //     `,
        //     fragmentShader: `
        //         // Varyings
        //         #include <three_msdf_varyings>

        //         // Uniforms
        //         #include <three_msdf_common_uniforms>
        //         #include <three_msdf_strokes_uniforms>

        //         // Utils
        //         #include <three_msdf_median>

        //         void main() {
        //             // Common
        //             #include <three_msdf_common>

        //             // Strokes
        //             #include <three_msdf_strokes>

        //             // Alpha Test
        //             #include <three_msdf_alpha_test>

        //             // Outputs
        //             #include <three_msdf_strokes_output>
        //         }
        //     `,
        // });
        // material.uniforms.uMap.value = atlas;
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
        texts.forEach((txt, i) => {
                const textGeometry = new TextGeometry(
                    txt, {
                        font: font,
                        size: 0.2,
                        height: 0.1,
                        curveSegments: 12,
                        bevelEnabled: false,
                        bevelThickness: 0,
                        bevelSize: 0,
                        bevelOffset: 0,
                        bevelSegments: 0
                    }
                )
                textGeometry.center()

                const text = new THREE.Mesh(textGeometry, material)
                text.position.y = (0.5 * i)
                text.rotation.y = Math.PI * 0.12
                    // text.position.x = 1


                scene.add(text)
            })
            // const textGeometry = new TextGeometry(
            //     'Hello Three.js',
            //     {
            //         font: font,
            //         size: 0.5,
            //         height: 0.2,
            //         curveSegments: 12,
            //         bevelEnabled: true,
            //         bevelThickness: 0,
            //         bevelSize: 0.02,
            //         bevelOffset: 0,
            //         bevelSegments: 5
            //     }
            // )
            // textGeometry.center()




    }
)

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
    antialias: true
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
    materialObj.uniforms.uTexture.value = textures[index];
}

// render
function render() {
    updateTexture();
    plane.position.y = 1;
    plane.rotation.y = -position * 2 * Math.PI;
    requestAnimationFrame(render);
    // console.log(plane.rotation.y);
}
render();