uniform vec3 lightColor;
uniform vec3 lightPosition;

varying vec3 interpolatedNormal;
varying vec3 vertPos;

void main() {
  // initializing tangent vector
  vec3 T = vec3(0.0, 0.0, 0.0);

  // setting color of gem
  vec3 diffuseColor = vec3(0.0, 0.5, 1.0);

  // light vector
  vec3 L = normalize(lightPosition - vertPos);

  // viewing vector
  vec3 V = normalize(-vertPos);

  // halfway vector
  vec3 H = normalize(L + V);

  // normal vector
  vec3 N = normalize(interpolatedNormal);

  // getting tangent vector from normal vector
  vec3 tang1 = cross(N, vec3(0.0, 0.0, 1.0));
  vec3 tang2 = cross(N, vec3(0.0, 1.0, 0.0));
  if (length(tang1) > length(tang2)) {
    T = tang1;
  } else {
    T = tang2;
  }
  T = normalize(T);
  vec3 B = normalize(cross(N, T));

  // diffuse model
  float kd1 = dot(N, L);
  float dif = max(0.0, 0.75*kd1+0.25);

  // anisotropic model
  float kv = dot(B, H);
  kv = pow(1.0 - kv*kv, 20.0);

  // assigning color red, green, and blue
  float r = diffuseColor.r * dif + 0.3 * kv;
  float g = diffuseColor.g * dif + 0.3 * kv;
  float b = diffuseColor.b * dif + 0.3 * kv;

  // gl_FragColor
  gl_FragColor = vec4(r, g, b, 1.0);
}