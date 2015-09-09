uniform sampler2D textProj;

varying vec4 vTexCoord;

void main() { 
  vec2 tex2;
  tex2.x = vTexCoord.x / vTexCoord.w / 2.0 + 0.5;
  tex2.y = vTexCoord.y / vTexCoord.w / 2.0 + 0.5;
  vec4 texColor = texture2D(textProj, tex2);
  gl_FragColor = vec4(texColor.rgb, 1.0);
}
