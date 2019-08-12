This is a simple single-page "app" that plots julia and mandelbrot sets without
needing to set up a remote server to perform the escape-time computations. 
Everything is done in the browser with simple double-precision floating-point
arithmetic.

The goal is to eventually extend this with the ability to continue diving down 
to arbitrary precision, undo/redo style navigation, and to link the Mandelbrot
plot with the corresponding Julia sets.