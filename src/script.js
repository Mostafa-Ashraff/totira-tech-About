import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'

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
    (font) =>
    {
        // Material
        const material = new THREE.MeshBasicMaterial({ color: 'white', wireframe: true })
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
        const textGeometry = new TextGeometry(
            'Hello Three.js',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()

        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()