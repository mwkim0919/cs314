Minwoo Kim
66294083
b1j8

Part 2 Description:

For Part 2, the gem has been modified to have a wave motion. 
All x vectors that forms the gem has been added by sin(frequency * time + y vectors of the gem).
Freqeuncy is just a float value and time represents the elasped time of the program.
time is passed to vertex shader from A1.js and it was created by declaring the variable as an uniform variable to gemMaterial variable. clock object was created in A1.js in order to pass the
elasped time to the uniform variable, time, and the elaspse time was obtained by calling
getElaspedTime() method from clock object. 