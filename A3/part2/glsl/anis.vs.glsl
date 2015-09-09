varying vec3 interpolatedNormal;
varying vec3 vertPos;

void main() {
	interpolatedNormal = normal;
	// tang = tangent;

	// for viewing vector
	vec4 temp_pos = modelViewMatrix * vec4(position, 1.0);
	vertPos = vec3(temp_pos) / temp_pos.w;

	// for normal vector
	interpolatedNormal = vec3(modelViewMatrix * vec4(interpolatedNormal, 0.0));

	// gl_Position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}