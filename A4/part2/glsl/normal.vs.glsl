varying vec2 vUv;
varying float noise;
varying vec3 interpolatedNormal;
uniform sampler2D texture1;
uniform float scale;

void main() {

    vUv = uv;
    interpolatedNormal = normal;

    vec4 noiseTex = texture2D( texture1, vUv );

    noise = noiseTex.r;

    vec3 newPosition = position + normal * noise * scale;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}