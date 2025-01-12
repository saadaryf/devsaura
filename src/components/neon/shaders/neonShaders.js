export const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vDistanceFromCenter;

void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vDistanceFromCenter = length(position.xy);
    gl_Position = projectionMatrix * mvPosition;
}
`;

export const fragmentShader = `
uniform float time;
uniform vec3 color;
uniform vec3 secondaryColor;
uniform float wordMix;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vDistanceFromCenter;

vec3 plasma(vec2 uv, float time) {
    float v = 0.0;
    vec2 c = uv * 2.0 - 1.0;
    v += sin((c.x + time) * 10.0) * 0.5;
    v += sin((c.y + time) * 10.0) * 0.5;
    v += sin((c.x + c.y + time) * 10.0) * 0.5;
    return vec3(
        sin(v * 3.14159 * 2.0) * 0.5 + 0.5,
        sin(v * 3.14159 * 2.0 + 2.094) * 0.5 + 0.5,
        sin(v * 3.14159 * 2.0 + 4.188) * 0.5 + 0.5
    );
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);
    float res = mix(
        mix(dot(vec2(1.0), u), dot(vec2(-1.0, 1.0), u - vec2(1.0, 0.0)), u.x),
        mix(dot(vec2(1.0, -1.0), u - vec2(0.0, 1.0)), dot(vec2(-1.0), u - vec2(1.0)), u.x),
        u.y
    );
    return res * 0.5 + 0.5;
}

void main() {
    float glow = 2.0 - length(vUv * 2.0 - 1.0);
    glow = pow(glow, 1.2);
    
    vec3 baseColor = mix(color, secondaryColor, wordMix);
    vec3 plasmaColor = plasma(vUv, time * 0.5);
    float noiseVal = noise(vUv * 10.0 + time * 0.5);
    
    float pulse1 = sin(time * 1.5) * 0.1 + 0.9;
    float pulse2 = sin(time * 2.3 + vDistanceFromCenter) * 0.1 + 0.9;
    float pulse3 = sin(time * 3.7 - vDistanceFromCenter) * 0.1 + 0.9;
    float compositePulse = (pulse1 + pulse2 + pulse3) / 3.0;
    
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - max(0.0, dot(normalize(vNormal), viewDir)), 2.0);
    vec3 fresnelColor = vec3(fresnel * 1.2, fresnel, fresnel * 0.8);
    
    float energyFlow = sin(vDistanceFromCenter * 10.0 - time * 3.0) * 0.5 + 0.5;
    
    vec3 finalColor = baseColor * (glow * compositePulse * 1.5);
    finalColor += plasmaColor * 0.2 * energyFlow;
    finalColor += fresnelColor * 0.5;
    finalColor += vec3(noiseVal * 0.1);
    
    finalColor = max(finalColor, baseColor * 0.5);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;