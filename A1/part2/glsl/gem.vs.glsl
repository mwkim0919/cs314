// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 gemPosition;
uniform float gemRadius;
uniform float time;

void main() {
	/* HINT: WORK WITH gemPosition and gemRadius HERE! */

    // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position

    vec3 v = position;
    v.x = v.x + sin(6.0*time + v.y);
    //v.y = v.y*sin(6.0*time + v.z);// * sin(4.0*time + v.z));
    //v.z += sin(4.0*time + v.x);// + sin(4.0*time + v.y));

    gl_Position = projectionMatrix * modelViewMatrix * vec4((gemRadius * v + gemPosition), 1.0);
}
