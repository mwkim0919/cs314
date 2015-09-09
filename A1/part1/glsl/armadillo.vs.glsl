// Create shared variable for the vertex and fragment shaders
varying vec3 interpolatedNormal;
varying vec3 shared;
uniform vec3 gemPosition;
uniform float gemRadius;

/* HINT: YOU WILL NEED A DIFFERENT SHARED VARIABLE TO COLOR ACCORDING TO POSITION */

void main() {
    // Set shared variable to vertex normal
    interpolatedNormal = normal;
    shared = position;

    // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
    if (distance(position, gemPosition) < gemRadius) {
	    gl_Position = projectionMatrix * modelViewMatrix * vec4(normalize(position - gemPosition) * gemRadius + gemPosition, 1.0);
    } else {
	    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
}
