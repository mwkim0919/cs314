varying vec3 interpolatedNormal;
varying vec3 vertPos;

uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform vec3 ambientColor;

void main() {
	// shiniess exponent used for specular intensity
	float shininess = 20.0;

	// getting normal vector
	vec3 N = normalize(interpolatedNormal);

	// getting light vector
	vec3 L = normalize(lightPosition - vertPos);

	// calculating diffuse model
	float kd = max(dot(L, N), 0.0);
	vec3 diff = kd * lightColor;

	// getting viewing vector
	vec3 V = normalize(-vertPos);

	// getting halfway vector
	vec3 H = normalize(L + V);

	// calculating specular model
	float ks = pow(max(dot(H, N), 0.0), shininess);
	vec3 spec = ks * lightColor;

	// setting shading per fragment
	vec3 color = diff + spec + 0.1*ambientColor;

	// gl_FragColor
	gl_FragColor = vec4(color, 1.0);
}

