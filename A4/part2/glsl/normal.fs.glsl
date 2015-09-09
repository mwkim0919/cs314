varying vec2 vUv;
varying float noise;
varying vec3 interpolatedNormal;

void main() {

// compose the colour using the normals then 
// whatever is heightened by the noise is lighter
gl_FragColor = vec4(interpolatedNormal * noise, 1.0);

}