uniform mat4 viewMat;
uniform mat4 projMat;

varying vec4 vTexCoord;

void main() {
	vec4 aVertex = vec4(position, 1.0);
	vTexCoord = projMat * modelMatrix * viewMat * aVertex;
	// vTexCoord = projMat * viewMat * aVertex;
    gl_Position = projectionMatrix * modelViewMatrix * aVertex;
}
