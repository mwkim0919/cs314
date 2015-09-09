Minwoo Kim
66294083
b1j8

I have implemented anistropic shading which includes tangent 
vector in the model. Since GLSL does not have built-in tangent 
vector attribute, the tangent vector was calculated by cross
multiplying the normal vector with vec3(0.0, 1.0, 0.0) or 
vec3(0.0, 0.0, 1.0) and choosing whichever has a longer length.
Diffuse part of the model is still the same as other models but
anistropic part of the model uses the tangent vector and halfway
vector. The shaders has been referred to the textbook.
