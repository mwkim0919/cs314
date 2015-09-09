// Create shared variable. The value is given as the interpolation between normals computed in the vertex shader
varying vec3 interpolatedNormal;
varying vec3 shared;

/* HINT: YOU WILL NEED A DIFFERENT SHARED VARIABLE TO COLOR ACCORDING TO POSITION */

void main() {
  // Set final rendered color according to the surface normal
  
  gl_FragColor = vec4(shared, 1.0); // REPLACE ME
}
