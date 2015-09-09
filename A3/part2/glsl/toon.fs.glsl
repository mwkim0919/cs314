varying vec3 interpolatedNormal;
varying vec3 vertPos;

uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform vec3 ambientColor;

// varying float kd;

void main() {
	// shiniess exponent used for specular intensity
	float shininess = 10.0;

	// getting normal vector
	vec3 N = normalize(interpolatedNormal);

	// getting light vector
	vec3 L = normalize(lightPosition - vertPos);
	
	float kd = max(dot(L, N), 0.0);

	vec3 color = vec3(0.0, 0.0, 0.0);
	
	// quantizing and assigning color for each level
	if (kd >= 0.90) {
		color = vec3(1.0, 1.0, 1.0);
	} else if (kd >= 0.20 && kd < 0.90) {
		color = vec3(0.5, 0.5, 1.0);
	} else {
		color = vec3(0.2, 0.2, 1.0);
	}

	// gl_FragColor
	gl_FragColor = vec4(color, 1.0);
}
