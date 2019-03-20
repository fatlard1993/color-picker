# color-picker

A simple no-frills js color picker

## Methods on the global ColorPicker object

### create (color)

Returns a colorPicker element
 * color :: "#666" | Overwrites the default color, uses colorPicker.set (see below)


### randomColor ()

Returns a random hex-formatted color


## Methods on a colorPicker element

### set (color)

Sets the colorPicker color to the provided value
 * color | Accepted formats: rgb, rgba (ignores alpha), hsl, and hex