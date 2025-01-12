export const nebulaVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const nebulaFragmentShader = `
uniform float time;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;

varying vec2 vUv;
varying vec3 vPosition;

// Optimized noise function
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float voronoi(vec2 x) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    float min_dist = 1.0;
    
    for(int i = -1; i <= 1; i++) {
        for(int j = -1; j <= 1; j++) {
            vec2 b = vec2(float(i), float(j));
            vec2 r = b - f + hash(p + b);
            float d = dot(r, r);
            min_dist = min(min_dist, d);
        }
    }
    return sqrt(min_dist);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    // Use 5 octaves for better detail
    for (int i = 0; i < 5; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.17; // Non-integer scale for more natural look
        amplitude *= 0.5;
        p += value * 0.1; // Domain warping for swirling effect
    }
    return value;
}

vec3 nebulaNoise(vec2 p) {
    float n1 = fbm(p * 1.5 + time * 0.05);
    float n2 = fbm(p * 2.0 - time * 0.07 + n1 * 2.0);
    float n3 = fbm(p * 3.0 + time * 0.02 - n2 * 1.5);
    
    // Create different layers for depth
    vec3 color = mix(color1, color2, n1);
    color = mix(color, color3, smoothstep(0.2, 0.8, n2));
    color = mix(color, color4, smoothstep(0.4, 0.9, n3));
    
    // Add voronoi cellular patterns for dust clouds
    float cells = voronoi(p * 4.0 + n2);
    color *= 1.0 + cells * 0.3;
    
    return color;
}

vec3 addStars(vec2 p, vec3 color) {
    float stars = 0.0;
    
    // Multiple star layers
    stars += step(0.98, noise(p * 50.0));
    stars += step(0.95, noise(p * 150.0)) * 0.5;
    
    // Twinkle effect
    float twinkle = sin(time * 2.0 + noise(p * 20.0) * 10.0) * 0.5 + 0.5;
    stars *= twinkle;
    
    return color + stars * vec3(0.8, 0.9, 1.0);
}

void main() {
    vec2 uv = vUv;
    
    // Create base nebula
    vec3 color = nebulaNoise(uv);
    
    // Add depth variation based on position
    float depth = length(vPosition.xy);
    color *= 1.0 - depth * 0.2;
    
    // Add stars
    color = addStars(uv, color);
    
    // Enhanced vignette
    float vignette = smoothstep(1.2, 0.3, length(uv - 0.5) * 1.8);
    color *= vignette;
    
    // Add subtle color variations
    color += color * sin(time * 0.2) * 0.1;
    
    gl_FragColor = vec4(color, 0.95);
}
`;