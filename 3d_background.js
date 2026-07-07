// 3D Background with Three.js
const container = document.getElementById('canvas-container');

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.001);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Particles
const particleCount = 2000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);

const colorWhite = new THREE.Color(0xffffff);
const colorPurple = new THREE.Color(0xa855f7);

for (let i = 0; i < particleCount; i++) {
    // Random positions in a sphere-like volume
    const x = (Math.random() - 0.5) * 400;
    const y = (Math.random() - 0.5) * 400;
    const z = (Math.random() - 0.5) * 400;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // 95% small white stars, 5% glowing purple stars
    const isPurple = Math.random() > 0.95;
    
    if (isPurple) {
        colors[i * 3] = colorPurple.r;
        colors[i * 3 + 1] = colorPurple.g;
        colors[i * 3 + 2] = colorPurple.b;
        sizes[i] = Math.random() * 2 + 1; // Larger size
    } else {
        const shade = 0.5 + Math.random() * 0.5; // subtle variations in white
        colors[i * 3] = colorWhite.r * shade;
        colors[i * 3 + 1] = colorWhite.g * shade;
        colors[i * 3 + 2] = colorWhite.b * shade;
        sizes[i] = Math.random() * 0.5 + 0.1; // Smaller size
    }
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

// Custom shader material for pulsing effect
const material = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0.0 }
    },
    vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            
            // Pulse effect based on position and time
            float pulse = sin(position.x * 0.05 + time) * 0.5 + 0.5;
            float currentSize = size * (1.0 + pulse * 0.5);
            
            gl_PointSize = currentSize * (100.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        varying vec3 vColor;
        void main() {
            // Create circular particles with soft edges
            vec2 xy = gl_PointCoord.xy - vec2(0.5);
            float ll = length(xy);
            if (ll > 0.5) discard;
            
            float alpha = (0.5 - ll) * 2.0;
            gl_FragColor = vec4(vColor, alpha);
        }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
});

// Scroll interaction
let scrollY = 0;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    material.uniforms.time.value = elapsedTime;

    targetX = mouseX * 0.1;
    targetY = mouseY * 0.1;

    // Smooth camera movement based on mouse
    particles.rotation.y += 0.05 * (targetX - particles.rotation.y);
    particles.rotation.x += 0.05 * (targetY - particles.rotation.x);
    
    // Slow continuous rotation
    particles.rotation.y += 0.0005;
    
    // Move particles based on scroll
    particles.position.y = scrollY * 0.05;

    renderer.render(scene, camera);
}

animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
