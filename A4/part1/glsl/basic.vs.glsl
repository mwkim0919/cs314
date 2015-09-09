// uniform sampler2D textOct;
varying vec2 vUv;
varying vec4 texColor;

void main() {
    // interpolatedNormal = normal;
	
	vUv = uv;

	// texColor = texture2D(textOct, vUv);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}