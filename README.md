# color-picker
a simple no-frills pure js color picker

# useage
```
var picker = ColorPicker.create();
picker.set('#BADA55');// accepts rgb, rgba (ignores alpha), hsl, and hex

document.body.appendChild(picker.elem);

function pointerDown(evt){
  if(evt.which === 2 || evt.which === 3 || !evt.cancelable) return;

  if(evt.ctrlKey) alert(picker.get());
  else ColorPicker.onPointerDown(evt);
}

document.addEventListener('mousedown', pointerDown);
document.addEventListener('touchstart', pointerDown);


<h1>A simple js color picker demo</h1>


body{
  width: 400px;
  padding: 10px;
  border: 2px outset #c3c3c3;
  border-radius: 3px;
  
  h1{
    font-size: 22px;
    text-align: center;
    margin: 0 0 10px;
  }
}
```