/* global ColorPicker */

function Load(){
	var colorPickerCount = 3, colorPickerArr = [];

	for(var x = 0; x < colorPickerCount; ++x){
		colorPickerArr[x] = ColorPicker.create(x > 0 ? ColorPicker.randomColor() : null);

		document.body.appendChild(colorPickerArr[x]);
	}

	function pointerDown(evt){
		if(evt.which === 2 || evt.which === 3 || !evt.cancelable) return;

		if(evt.target.id === 'logColors'){
			evt.preventDefault();

			for(var x = 0; x < colorPickerCount; ++x){
				console.log(x, colorPickerArr[x], colorPickerArr[x].value);
			}
		}

		else ColorPicker.onPointerDown(evt);
	}

	document.addEventListener('mousedown', pointerDown);
	document.addEventListener('touchstart', pointerDown);
}

document.addEventListener('DOMContentLoaded', Load);