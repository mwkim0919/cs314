Minwoo Kim
66294083
b1j8

Part 1

1a)
Since the position in gl_Position represents all vectors towards all vertices of the gem from 
the origin, multiplying by gemRadius will scale the vector by a factor of the gemRadius as well 
meaning the gem size can increase or decrease depending on the value of gemRadius. In order to 
move the gem, position must be added by gemPosition which represents the center of the gem. 
Adding by gemPosition will allow all vectors of the gem to be translated by the value of 
gemPosition.

1b)
In order to use the position of the current vertex to set the surface color, position which 
represents all vertices of the armadillo, must be passed to gl_FragColor.

1c)
In order to deform the armadillo to the surface of the gem, first, we need to check if the 
vertices of armadillo is within the gem. This can be done by first checking if the the 
distance between the vertices of armadillo and the center of the gem are within the gemRadius.
If it is, the armadillo must be deformed. Otherwise, armadillo just remains the same. In order
to deform armadillo, the vector of gemPosition must be subtracted by the vectors of armadillo.
The order here is important because the resulting vector may face towards the opposite side. 
In order to make the deformed vertices of armadillo to be at the same position as the vertices 
of the gem, the subtracted vector must be normalized, multipled by gemRadius and added 
(translated) by gemPosition.
