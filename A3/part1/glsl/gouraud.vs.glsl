varying vec3 interpolatedNormal;
varying vec3 color;

uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform vec3 ambientColor;


void main() {
	// shininess exponent for specular model
	float shininess = 20.0;

	// diffuse component
	interpolatedNormal = normal;

	// getting viewing vector 
	vec4 temp_pos = modelViewMatrix * vec4(position, 1.0);
	vec3 vertPos = vec3(temp_pos) / temp_pos.w;
	vec3 V = normalize(-vertPos);

	// getting normal vector
	vec3 N = normalMatrix * interpolatedNormal;

	// getting light vector from each vertex
	vec3 L = normalize(lightPosition - vertPos);

	// getting bouncing vector
	vec3 B = reflect(-L, N);

	// calculating the diffuse model
	float kd = max(dot(L, N), 0.0);
	vec3 diff = kd * lightColor;

	// calculating the specular model
	float ks = pow(max(dot(B, V), 0.0), shininess);

	// spec = ks * lightColor;
	vec3 spec = ks * lightColor;

	// setting shading for each vertex
	color = diff + spec + 0.1*ambientColor;

	// gl_Position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}