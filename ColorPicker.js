var ColorPicker = {
  saturationSVG: '<svg width="100%" height="100%"><defs><linearGradient id="gradient-black" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stop-color="#000000" stop-opacity="1"></stop><stop offset="100%" stop-color="#CC9A81" stop-opacity="0"></stop></linearGradient><linearGradient id="gradient-white" x1="0%" y1="100%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FFFFFF" stop-opacity="1"></stop><stop offset="100%" stop-color="#CC9A81" stop-opacity="0"></stop></linearGradient></defs><rect x="0" y="0" width="100%" height="100%" fill="url(#gradient-white)"></rect><rect x="0" y="0" width="100%" height="100%" fill="url(#gradient-black)"></rect></svg>',
  hueSVG: '<svg width="100%" height="100%"><defs><linearGradient id="gradient-hue" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#FF0000" stop-opacity="1"></stop><stop offset="13%" stop-color="#FF00FF" stop-opacity="1"></stop><stop offset="25%" stop-color="#8000FF" stop-opacity="1"></stop><stop offset="38%" stop-color="#0040FF" stop-opacity="1"></stop><stop offset="50%" stop-color="#00FFFF" stop-opacity="1"></stop><stop offset="63%" stop-color="#00FF40" stop-opacity="1"></stop><stop offset="75%" stop-color="#0BED00" stop-opacity="1"></stop><stop offset="88%" stop-color="#FFFF00" stop-opacity="1"></stop><stop offset="100%" stop-color="#FF0000" stop-opacity="1"></stop></linearGradient></defs><rect x="0" y="0" width="100%" height="100%" fill="url(#gradient-hue)"></rect></svg>',
  log: function(){
    if(ColorPicker.debug) console.log.apply(null, arguments);
  },
  normalizePosition: function(evt){
    var position = {};

    if(evt.targetTouches){
      position.x = evt.targetTouches[0].pageX;
      position.y = evt.targetTouches[0].pageY;

      var parent = evt.target;
      while(parent.offsetParent){
        position.x -= parent.offsetLeft;
        position.y -= parent.offsetTop;

        parent = parent.offsetParent;
      }
    }
    else{
      position.x = evt.offsetX;
      position.y = evt.offsetY;
    }

    return position;
  },
  create: function(){
    var pickerIndicator = document.createElement('div');
    pickerIndicator.className = 'indicator';

    var pickerArea = document.createElement('div');
    pickerArea.className = 'pickerArea';
    pickerArea.innerHTML = ColorPicker.saturationSVG;
    pickerArea.appendChild(pickerIndicator);

    var hueIndicator = document.createElement('div');
    hueIndicator.className = 'indicator';

    var hueSlide = document.createElement('div');
    hueSlide.className = 'hueSlide';
    hueSlide.innerHTML = ColorPicker.hueSVG;
    hueSlide.appendChild(hueIndicator);

    var element = document.createElement('div');
    element.className = 'colorPicker';
    element.appendChild(pickerArea);
    element.appendChild(hueSlide);

    var _colorPicker = {
      elem: element,
      set: function(color){
        ColorPicker.log('ColorPicker', 'set', color);
        if(!color) return;

        element.style.backgroundColor = color;

        color = ColorPicker.HSVfromString(color);

        element.setAttribute('data-color-h', color.h);
        element.setAttribute('data-color-s', color.s);
        element.setAttribute('data-color-v', color.v);

        pickerArea.style.backgroundColor = 'hsl('+ color.h +', 100%, 50%)';

        hueIndicator.style.left = Math.round((color.h * 150) / 360) +'px';
      },
      get: function(){ return element.style.backgroundColor; }
    };

    return _colorPicker;
  },
  HSVtoRGBString: function(hue, sat, value){
    ColorPicker.log('ColorPicker', 'HSVtoRGBString', hue, sat, value);
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
    ColorPicker.log('ColorPicker', 'HSVfromString', color);
    
    if(color[0] === '#'){
      return ColorPicker.rgb_hsv(parseInt(color.substr(1, 2), 16), parseInt(color.substr(3, 2), 16), parseInt(color.substr(5, 2), 16));
    }
    else{
      color = color.split(/a?\(|\)|,\s?/gi);

      var type = color.shift().toLowerCase();

      color.length = 3;

      for(var i = 0; i < color.length; i++) color[i] = parseInt(color[i]) || 0;

      ColorPicker.log('ColorPicker', 'HSVfromString', type, color);

      if(!ColorPicker[type +'_hsv']) ColorPicker.log('ColorPicker', 'HSVfromString', type, ' is an unsupported color type');
      else return ColorPicker[type +'_hsv'].apply(null, color);
    }
  },
  hsl_hsv: function(hue, sat, light){
    ColorPicker.log('ColorPicker', 'hsl_hsv', hue, sat, light);

    sat /= 100;
    light /= 100;

    sat *= light < 0.5 ? light : 1 - light;

    var hsv = { h: hue, s: 2 * sat / (light + sat), v: light + sat };

    ColorPicker.log('ColorPicker', 'hsl_hsv', hsv);

    return hsv;
  },
  rgb_hsv: function(red, green, blue){
    ColorPicker.log('ColorPicker', 'rgb_hsv', red, green, blue);
    
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
    
    ColorPicker.log('ColorPicker', 'rgb_hsv', hsv);

    return hsv;
  },
  movePicker: function(evt){
    if(evt.target.className !== 'pickerArea') return;
    evt.preventDefault();

    var position = ColorPicker.normalizePosition(evt);
    var indicator = evt.target.getElementsByClassName('indicator')[0];

    position.y = Math.min(Math.max(0, position.y), 150);
    position.x = Math.min(Math.max(0, position.x), 150); 

    indicator.style.top = (position.y - 3) +'px';
    indicator.style.left = (position.x - 3) +'px';

    var h = evt.target.parentElement.getAttribute('data-color-h');
    var s = position.x / 150;
    var v = (150 - position.y) / 150;

    evt.target.parentElement.setAttribute('data-color-s', s);
    evt.target.parentElement.setAttribute('data-color-v', v);

    evt.target.parentElement.style.backgroundColor = ColorPicker.HSVtoRGBString(h, s, v);    
  },
  dropPicker: function(evt){
    document.removeEventListener('mouseup', ColorPicker.dropPicker);
    document.removeEventListener('mousemove', ColorPicker.movePicker);
    evt.target.removeEventListener('touchend', ColorPicker.dropPicker);
    evt.target.removeEventListener('touchmove', ColorPicker.movePicker);
  },
  moveHueSlider: function(evt){
    if(evt.target.className !== 'hueSlide') return;
    evt.preventDefault();

    var position = ColorPicker.normalizePosition(evt);
    var indicator = evt.target.getElementsByClassName('indicator')[0];

    position.y = Math.min(Math.max(0, position.y), 150);
    position.x = Math.min(Math.max(0, position.x), 150); 
    
    indicator.style.top = (position.y - 9) +'px';

    var h = (position.y / 150) * 360;
    var s = evt.target.parentElement.getAttribute('data-color-s');
    var v = evt.target.parentElement.getAttribute('data-color-v');

    evt.target.parentElement.setAttribute('data-color-h', h);

    evt.target.parentElement.style.backgroundColor = ColorPicker.HSVtoRGBString(h, s, v);

    evt.target.parentElement.getElementsByClassName('pickerArea')[0].style.backgroundColor = 'hsl('+ h +', 100%, 50%)';
  },
  dropHueSlider: function(evt){
    document.removeEventListener('mouseup', ColorPicker.dropHueSlider);
    document.removeEventListener('mousemove', ColorPicker.moveHueSlider);
    evt.target.removeEventListener('touchend', ColorPicker.dropHueSlider);
    evt.target.removeEventListener('touchmove', ColorPicker.moveHueSlider);
  },
  onPointerDown: function(evt){
    if(evt.target.className === 'pickerArea'){
      ColorPicker.movePicker(evt);
      
      document.addEventListener('mouseup', ColorPicker.dropPicker);
      document.addEventListener('mousemove', ColorPicker.movePicker);
      evt.target.addEventListener('touchend', ColorPicker.dropPicker);
      evt.target.addEventListener('touchmove', ColorPicker.movePicker);
    }

    else if(evt.target.className === 'hueSlide'){
      ColorPicker.moveHueSlider(evt);

      document.addEventListener('mouseup', ColorPicker.dropHueSlider);
      document.addEventListener('mousemove', ColorPicker.moveHueSlider);
      evt.target.addEventListener('touchend', ColorPicker.dropHueSlider);
      evt.target.addEventListener('touchmove', ColorPicker.moveHueSlider);
    }
  }
};
