// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 gemPosition;
uniform float gemRadius;

void main() {
	/* HINT: WORK WITH gemPosition and gemRadius HERE! */

    // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position


    gl_Position = projectionMatrix * modelViewMatrix * vec4((position * gemRadius + gemPosition), 1.0);
}
