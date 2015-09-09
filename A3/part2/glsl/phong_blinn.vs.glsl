varying vec3 interpolatedNormal;
varying vec3 vertPos;
// varying vec3 N;

void main() {
	interpolatedNormal = normal;

	// for viewing vector
	vec4 temp_pos = normalize(modelViewMatrix * vec4(position, 1.0));
	vertPos = vec3(temp_pos) / temp_pos.w;

	// for normal vector 
	interpolatedNormal = vec3(modelViewMatrix * vec4(interpolatedNormal, 0.0));

	// gl_Position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}


