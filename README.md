# color-picker
a simple no-frills pure js color picker

# useage
```
var picker = ColorPicker.create();

document.body.appendChild(picker.elem);

function pointerDown(evt){
	if(evt.ctrlKey) alert(picker.get());
  else ColorPicker.onPointerDown(evt);
}

document.addEventListener('mousedown', pointerDown);
document.addEventListener('touchstart', pointerDown);
```
