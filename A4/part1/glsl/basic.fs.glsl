uniform sampler2D textOct;
varying vec2 vUv;
// varying vec4 texColor;

void main() {
	vec4 texColor = texture2D(textOct, vUv);
	gl_FragColor = vec4(texColor.rgb, 1.0);
}