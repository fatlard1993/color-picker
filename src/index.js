// includes dom log
// babel
/* global dom log */

var colorPicker = {
	saturationSVG: '<svg width="100%" height="100%"><defs><linearGradient id="gradient-black" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stop-color="#000000" stop-opacity="1"></stop><stop offset="100%" stop-color="#CC9A81" stop-opacity="0"></stop></linearGradient><linearGradient id="gradient-white" x1="0%" y1="100%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FFFFFF" stop-opacity="1"></stop><stop offset="100%" stop-color="#CC9A81" stop-opacity="0"></stop></linearGradient></defs><rect x="0" y="0" width="100%" height="100%" fill="url(#gradient-white)"></rect><rect x="0" y="0" width="100%" height="100%" fill="url(#gradient-black)"></rect></svg>',
	hueSVG: '<svg width="100%" height="100%"><defs><linearGradient id="gradient-hue" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#FF0000" stop-opacity="1"></stop><stop offset="13%" stop-color="#FF00FF" stop-opacity="1"></stop><stop offset="25%" stop-color="#8000FF" stop-opacity="1"></stop><stop offset="38%" stop-color="#0040FF" stop-opacity="1"></stop><stop offset="50%" stop-color="#00FFFF" stop-opacity="1"></stop><stop offset="63%" stop-color="#00FF40" stop-opacity="1"></stop><stop offset="75%" stop-color="#0BED00" stop-opacity="1"></stop><stop offset="88%" stop-color="#FFFF00" stop-opacity="1"></stop><stop offset="100%" stop-color="#FF0000" stop-opacity="1"></stop></linearGradient></defs><rect x="0" y="0" width="100%" height="100%" fill="url(#gradient-hue)"></rect></svg>',
	create: function(defaultColor){
		var pickerIndicator = document.createElement('div');
		pickerIndicator.className = 'indicator';

		var pickerArea = document.createElement('div');
		pickerArea.className = 'pickerArea';
		pickerArea.innerHTML = colorPicker.saturationSVG;
		pickerArea.appendChild(pickerIndicator);

		var hueIndicator = document.createElement('div');
		hueIndicator.className = 'indicator';

		var hueArea = document.createElement('div');
		hueArea.className = 'hueArea';
		hueArea.innerHTML = colorPicker.hueSVG;
		hueArea.appendChild(hueIndicator);

		var elem = document.createElement('div');
		elem.className = 'colorPicker';
		elem.appendChild(pickerArea);
		elem.appendChild(hueArea);

		elem.color = {};

		elem.set = function(color){
			log()('[colorPicker] set', color);
			if(!color) return;

			elem.style.backgroundColor = elem.value = color;

			color = elem.color = colorPicker.HSVfromString(color);

			pickerArea.style.backgroundColor = 'hsl('+ color.h +', 100%, 50%)';
		};

		elem.set(defaultColor || '#666');

		return elem;
	},
	addAnimation: function(func){
		(window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(cb) { return setTimeout(cb, 16); })(func);
	},
	setTransform: function setTransform(elem, value){
		elem.style.transform = elem.style.webkitTransform = elem.style.MozTransform = elem.style.msTransform = elem.style.OTransform = value;
	},
	randomColor: function(){
		return '#'+ Math.floor(Math.random() * 16777215).toString(16);
	},
	HSVtoRGBString: function(hue, sat, value){
		log()('[colorPicker] HSVtoRGBString', hue, sat, value);
		var R, G, B, X, C;
		var h = (hue % 360) / 60;

		C = value * sat;
		X = C * (1 - Math.abs(h % 2 - 1));
		R = G = B = value - C;

		h = ~~h;
		R += [C, X, 0, 0, X, C][h];
		G += [X, C, C, X, 0, 0][h];
		B += [0, 0, X, C, C, X][h];

		return 'rgb('+ Math.floor(R * 255) +','+ Math.floor(G * 255) +','+ Math.floor(B * 255) +')';
	},
	HSVfromString: function(color){
		log()('[colorPicker] HSVfromString', color);

		if(color[0] === '#' && (color.length === 4 || color.length === 7)){
			if(color.length === 4){
				color = '#'+ color.substr(1, 1) + color.substr(1, 1) + color.substr(2, 2) + color.substr(2, 2) + color.substr(3, 3) + color.substr(3, 3);
			}

			return colorPicker.rgb_hsv(parseInt(color.substr(1, 2), 16), parseInt(color.substr(3, 2), 16), parseInt(color.substr(5, 2), 16));
		}
		else{
			color = color.split(/a?\(|\)|,\s?/gi);

			var type = color.shift().toLowerCase();

			color.length = 3;

			for(var x = 0; x < color.length; ++x) color[x] = parseInt(color[x]) || 0;

			log()('[colorPicker] HSVfromString', type, color);

			if(!colorPicker[type +'_hsv']) log()('[colorPicker] HSVfromString', type, ' is an unsupported color type');
			else return colorPicker[type +'_hsv'].apply(null, color);
		}
	},
	hsl_hsv: function(hue, sat, light){
		log()('[colorPicker] hsl_hsv', hue, sat, light);

		sat /= 100;
		light /= 100;

		sat *= light < 0.5 ? light : 1 - light;

		var hsv = { h: hue, s: 2 * sat / (light + sat), v: light + sat };

		log()('[colorPicker] hsl_hsv', hsv);

		return hsv;
	},
	rgb_hsv: function(red, green, blue){
		log()('[colorPicker] rgb_hsv', red, green, blue);

		red /= 255;
		green /= 255;
		blue /= 255;

		var hue, sat, value, C;

		value = Math.max(red, green, blue);
		C = value - Math.min(red, green, blue);

		hue = (C === 0 ? null : value === red ? (green - blue) / C + (green < blue ? 6 : 0) : value === green ? (blue - red) / C + 2 : (red - green) / C + 4);
		hue = (hue % 6) * 60;
		sat = C === 0 ? 0 : C / value;

		var hsv = { h: hue, s: sat, v: value };

		log()('[colorPicker] rgb_hsv', hsv);

		return hsv;
	},
	normalizePosition: function(evt, parent){
		var position = {}, offsetParent = parent;

		position.x = (evt.targetTouches) ? evt.targetTouches[0].pageX : evt.clientX;
		position.y = (evt.targetTouches) ? evt.targetTouches[0].pageY : evt.clientY;

		while(offsetParent.offsetParent){
			position.x -= offsetParent.offsetLeft - offsetParent.scrollLeft;
			position.y -= offsetParent.offsetTop - offsetParent.scrollTop;

			offsetParent = offsetParent.offsetParent;
		}

		position.x = Math.min(Math.max(0, position.x), parent.clientWidth);
		position.y = Math.min(Math.max(0, position.y), parent.clientHeight);

		return position;
	},
	pickerMove: function(evt){
		evt.preventDefault();

		if(colorPicker.runningAnim) return;
		colorPicker.runningAnim = true;

		var elem = this;
		var pickerArea = elem.getElementsByClassName('pickerArea')[0];
		var indicator = pickerArea.getElementsByClassName('indicator')[0];
		var position = colorPicker.normalizePosition(evt, pickerArea);
		var pickerAreaWidth = pickerArea.clientWidth;
		var pickerAreaHeight = pickerArea.clientHeight;
		var indicatorOffsetX = indicator.offsetWidth / 2;
		var indicatorOffsetY = indicator.offsetHeight / 2;

		elem.color.s = position.x / pickerAreaWidth;
		elem.color.v = (pickerAreaHeight - position.y) / pickerAreaHeight;

		elem.value = colorPicker.HSVtoRGBString(elem.color.h, elem.color.s, elem.color.v);

		colorPicker.addAnimation(function hueAnim(){
			colorPicker.setTransform(indicator, 'translate3d('+ (position.x - indicatorOffsetX) +'px, '+ (position.y - indicatorOffsetY) +'px, 0)');

			elem.style.backgroundColor = elem.value;

			colorPicker.runningAnim = false;
		});
	},
	hueMove: function(evt){
		evt.preventDefault();

		if(colorPicker.runningAnim) return;
		colorPicker.runningAnim = true;

		var elem = this;
		var pickerArea = elem.getElementsByClassName('pickerArea')[0];
		var hueArea = elem.getElementsByClassName('hueArea')[0];
		var indicator = hueArea.getElementsByClassName('indicator')[0];
		var position = colorPicker.normalizePosition(evt, hueArea);
		var hueAreaWidth = hueArea.clientWidth;
		var indicatorOffset = indicator.offsetWidth / 2;

		elem.color.h = (position.x / hueAreaWidth) * 360;

		elem.value = colorPicker.HSVtoRGBString(elem.color.h, elem.color.s, elem.color.v);

		colorPicker.addAnimation(function hueAnim(){
			colorPicker.setTransform(indicator, 'translate3d('+ (position.x - indicatorOffset) +'px, 0, 0)');

			elem.style.backgroundColor = elem.value;

			pickerArea.style.backgroundColor = 'hsl('+ elem.color.h +', 100%, 50%)';

			colorPicker.runningAnim = false;
		});
	},
	onPointerDown: function(evt){
		if(dom.isMobile && !evt.targetTouches) return;

		if(['pickerArea', 'hueArea'].includes(evt.target.className)){
			var moveFunc = colorPicker[evt.target.className.replace('Area', '') +'Move'].bind(evt.target.parentElement);

			var dropFunc = function(){
				document.removeEventListener('mouseup', dropFunc);
				document.removeEventListener('mousemove', moveFunc);
				document.removeEventListener('touchend', dropFunc);
				document.removeEventListener('touchcancel', dropFunc);
				document.removeEventListener('touchmove', moveFunc);
			};

			document.addEventListener('mouseup', dropFunc);
			document.addEventListener('mousemove', moveFunc);
			document.addEventListener('touchend', dropFunc);
			document.addEventListener('touchcancel', dropFunc);
			document.addEventListener('touchmove', moveFunc);

			moveFunc(evt);
		}
	}
};

document.addEventListener('mousedown', colorPicker.onPointerDown);
document.addEventListener('touchstart', colorPicker.onPointerDown);