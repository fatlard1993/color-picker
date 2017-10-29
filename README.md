# color-picker
A simple no-frills js color picker

## Setup for dev
 * ``` npm i ```
 * ``` npm i -g gulp ```

## Live dev demo
``` gulp dev ```

## Include in your project
Everything you need to get started is in src/js/ColorPicker.js and src/scss/ColorPicker.scss
Feel free to hack and slash this into whatever you want it to be

## Methods on ColorPicker

### create (color)
Returns a colorPicker element
 * color::"#666" | Overwrites the default color, uses colorPicker.set (see below)

### randomColor ()
Returns a random hex-formatted color

### onPointerDown (evt)
Intended to be placed inside an existing pointerDown function like so: (reduces total event listener count)
```
function pointerDown(evt){
    ...

    ColorPicker.onPointerDown(evt);
}

document.addEventListener('mousedown', pointerDown);
document.addEventListener('touchstart', pointerDown);
```

But can just as easily be added in like this:
```
document.addEventListener('mousedown', ColorPicker.onPointerDown);
document.addEventListener('touchstart', ColorPicker.onPointerDown);
```

## Methods on colorPicker element

### set (color)
Sets the colorPicker color to the provided value
 * color | Accepted formats: rgb, rgba (ignores alpha), hsl, and hex