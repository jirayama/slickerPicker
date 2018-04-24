function slickerPicker(opt) {
  opt = opt || {};
  var width = opt.width || 200,
      cp_pos = {
        x:0,
        y:0
      },
      palette = [
        [140,45,55,1],
        [40,120,24,1],
        [255,45,255,1],
        [14,255,55,1],
        [140,45,55,1],
        [40,120,24,1],
        [255,45,255,1],
        [40,120,24,1],
        [255,45,255,1],
        [14,255,55,1],
        [140,45,55,1],
        [40,120,24,1],
        [255,45,255,1]
      ];

  var target = document.getElementById(opt.target);
    // wrap = new El('div'),
    // wrapTop = new El('div'),
    // wrapBottom = new El('div'),
    // canvas = new El('canvas'),
    // ctx = canvas.getContext('2d'),
    // hueBar = new El('canvas'),
    // HBctx = hueBar.getContext('2d'),
    // cursorOuter = new El('div'),
    // cursorInner = new El('div'),
    // readout = new El('table'),
    // r_value = new El('div'),
    // g_value = new El('div'),
    // b_value = new El('div'),
    // h_value = new El('div'),
    // s_value = new El('div'),
    // l_value = new El('div'),
    // mouseDownHue = 0,
    // mouseDownPicker = 0,
    // mouseOffsetX = 15,
    // mouseOffsetY = -24,
    // color,
    // lum = 50,
    // x = 0,
    // y = 0;

  // COMPONENTS

  // start -- plugin module
  var module = new El('div').addClass('module'),
      componentHolder = new El('div').addClass('componentHolder');
  module.appendChild(componentHolder);
  componentHolder.style.maxWidth = width + "px";
  // end -- plugin module

  // start -- main picker
  function SP_mainPicker(){
    var component = new El('div').addClass('component'),
        colorPicker = new El('canvas').addClass('colorPicker flexCol'),
        colorPicker_ctx = colorPicker.getContext('2d'),
        cp_knob = new El('div').addClass('knob'),
        hp_knob = new El('div').addClass('knob'),
        ap_knob = new El('div').addClass('knob'),
        huePicker = new El('canvas').addClass('huePicker flexCol'),
        huePicker_ctx = huePicker.getContext('2d'),
        alphaPicker = new El('canvas').addClass('alphaPicker flexCol'),
        alphaPicker_ctx = alphaPicker.getContext('2d'),
        hue = 200;

    colorPicker.setAttribute('width', width);
    colorPicker.setAttribute('height', width);
    colorPicker_ctx.scale(width/100,width/100);

    huePicker.setAttribute('width', width);
    huePicker.setAttribute('height', width/10);
    huePicker_ctx.scale(width/100,width/100);

    alphaPicker.setAttribute('width', width);
    alphaPicker.setAttribute('height', width/10);
    alphaPicker_ctx.scale(width/100,width/100);



    component.appendMany(cp_knob, colorPicker, huePicker, alphaPicker);

    draw_colorPicker = function() {
      var s = 0,
        h = hue,
        l = 100,
        endL = 50,
        startL = l,
        startS = s,
        endS = 100;

      colorPicker_ctx.clearRect(0, 0, width, width);

      for (var y = 0; y <= 100; y++) {
        for (var x = 0; x <= 100; x++) {
          color = hsl2rbg(hue, s, l);
          colorPicker_ctx.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
          colorPicker_ctx.fillRect(x, y, 1, 1);
          s = s + (endS / 100);
          l = l - (startL - endL) / 100;
        }
        s = 0;
        endL = endL - .5;
        startL--;
        l = startL;
      }
      // colorPicker_ctx.beginPath();
      // colorPicker_ctx.arc(cp_pos.x,cp_pos.y, 5, 0, 2*Math.PI);
      // colorPicker_ctx.stroke();      
    }

    draw_huePicker = function() {
      var h = 1;      
      for (var x = 0; x <= 100; x++) {
        color = hsl2rbg(h, 100, 50);
        huePicker_ctx.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
        huePicker_ctx.fillRect(x, 0, 1, width/10);
        h = h + (360 / 100);
      }
    }

    draw_alphaPicker = function(rbg) {
      var h = 1,
          y = 0,
          heightIncrement = (width/10)/4;
      for (var x = 0; x <= 100; x++) {
          y = 0
        if(x % 6 < 3){
          alphaPicker_ctx.fillStyle = "grey";
          alphaPicker_ctx.fillRect(x, y, 1, heightIncrement);
          alphaPicker_ctx.fillStyle = "white";
          alphaPicker_ctx.fillRect(x, y + heightIncrement, 1, heightIncrement);
          alphaPicker_ctx.fillStyle = "grey";
          alphaPicker_ctx.fillRect(x, y + (heightIncrement*2), 1, heightIncrement);
          alphaPicker_ctx.fillStyle = "white";
          alphaPicker_ctx.fillRect(x, y + (heightIncrement*3), 1, heightIncrement);
        } else {
          alphaPicker_ctx.fillStyle = "white";
          alphaPicker_ctx.fillRect(x, y, 1, 2);
          alphaPicker_ctx.fillStyle = "grey";
          alphaPicker_ctx.fillRect(x, y + heightIncrement, 1, heightIncrement);
          alphaPicker_ctx.fillStyle = "white";
          alphaPicker_ctx.fillRect(x, y + (heightIncrement*2), 1, heightIncrement);
          alphaPicker_ctx.fillStyle = "grey";
          alphaPicker_ctx.fillRect(x, y + (heightIncrement*3), 1, heightIncrement);
        }        
      }

      for (var x = 0; x <= 100; x++) {
        alphaPicker_ctx.fillStyle = "rgba(" + rbg[0] + "," + rbg[1] + "," + rbg[2] + "," + (x/100) +")";
        alphaPicker_ctx.fillRect(x, 0, 1, width/10);
        h = h + (360 / 100);
      }
    }
    colorPicker.addEventListener('click',function(e){      
      cp_pos.x = e.offsetX;
      cp_pos.y = e.offsetY;
       console.log(getPixelColor(this,e), cp_pos);
    })
    huePicker.addEventListener('click',function(e){      
      cp_pos.x = e.offsetX;
      cp_pos.y = e.offsetY;
      var color = getPixelColor(this,e);
      hue = color.hsl[0];
    })
    component.addEventListener('mousemove',function(e){     
      cp_pos.x = e.offsetX;
      cp_pos.y = e.offsetY;
      cp_knob.style.transform = "translate(" + e.offsetX + "px, " + e.offsetY + "px)"
      console.log(cp_pos)
    })

    cp_knob.addEventListener('mousemove',function(e){
      e.preventDefault();
      e.stopPropagation();
    })

    draw_colorPicker();
    draw_huePicker();
    draw_alphaPicker(hsl2rbg(hue, 100, 50));
    component.addEventListener('click', function(e){
      e.stopPropagation();
    })
    colorPicker.addEventListener('click', function(e){
      e.stopPropagation();
    })
    huePicker.addEventListener('click', function(e){
      e.stopPropagation();
    })
    alphaPicker.addEventListener('click', function(e){
      e.stopPropagation();
    })
    componentHolder.appendChild(component);
  }
  // end -- main picker

  // start -- pallete
  function SP_palette(){
    var component = new El('div').addClass('component'),
        paletteHolder = new El('div').addClass('paletteHolder');

    for (var i = 0; i < palette.length; i++){
      paletteHolder.appendChild(new El('div').addClass('paletteTile flexRow').addBackground(rgba2String(palette[i])));
    }

    component.style.maxWidth = componentHolder.width;
    console.log(componentHolder.width, componentHolder.style.width)

    component.appendChild(paletteHolder);
    componentHolder.appendChild(component);
  }
  // end -- palette

  function open() {
    console.log('opened')
    if (target) {
      target.style.position = 'relative';
      // target.appendChild(wrap);
      target.appendChild(module);
    } else {
      console.log("no target element assigned")
    }
  }

  function close() {
    wrap.remove();
  }

  // even listeners

  target.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    open();
  })

  // init
  new SP_mainPicker();
  // new SP_palette();
}

  // updateValues(0, 0);
  // readout.style.width = "100%";
  // readout.appendChild(DOM_tableHeader('R', 'G', 'B'));
  // readout.appendChild(DOM_tableRow(r_value, g_value, b_value));
  // readout.appendChild(DOM_tableHeader('H', 'S', 'L'));
  // readout.appendChild(DOM_tableRow(h_value, s_value, l_value));
  // wrapTop.appendMany(canvas, hueBar);
  // wrapBottom.appendMany(readout, cursorOuter);
  // wrap.appendMany(wrapTop, wrapBottom);
  // wrapTop.className = "pickerInnerTop";
  // wrapBottom.className = "pickerInnerBottom";
  // document.addEventListener('click', function(e) {
  //   close();
  // })
  // target.addEventListener('click', function(e) {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   open();
  // })
  // wrap.addEventListener('click', function(e) {
  //   e.preventDefault();
  // })
  // function updateValues(rgb, hsl) {
  //   r_value.innerHTML = (rgb[0] ? rgb[0] : 0);
  //   g_value.innerHTML = (rgb[1] ? rgb[1] : 0);
  //   b_value.innerHTML = (rgb[2] ? rgb[2] : 0);
  //   h_value.innerHTML = (hsl[0] ? hsl[0] : 0);
  //   s_value.innerHTML = (hsl[1] ? hsl[1] : 0);
  //   l_value.innerHTML = (hsl[2] ? hsl[2] : 0);
  //   cursorInner.style.background = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
  // }
  // wrap.className = "colorPicker";
  // cursorInner.className = 'cursorInner';
  // cursorOuter.className = 'cursorOuter';
  // cursorOuter.appendChild(cursorInner);
  // canvas.setAttribute('width', 200);
  // canvas.setAttribute('height', 200);
  // canvas.style.display ='block';
  // ctx.scale(2, 2);
  // hueBar.setAttribute('width', 200);
  // hueBar.setAttribute('height', 30);
  // hueBar.style.marginTop = "10px";
  // HBctx.scale(2, 2);

  // canvas.addEventListener('click', function(e) {
  //   e.preventDefault();
  // })
  // canvas.addEventListener('contextmenu', function(e) {
  //   e.preventDefault();
  // })
  // canvas.addEventListener('mousedown', function(e) {
  //   mouseDownPicker = 1;
  //   var context = this.getContext('2d');
  //   var X = (e.offsetX < 0 ? 0 : e.offsetX);
  //   var Y = (e.offsetY < 0 ? 0 : e.offsetY);
  //   var data = context.getImageData(X, Y, 1, 1).data;
  //   var hsl = rgb2hsl(data);
  //   cursorOuter.style.borderColor = "#FF5722";
  //   updateValues(data, hsl);
  // })
  // canvas.addEventListener('mousemove', function(e) {
  //   if(mouseDownPicker === 1){
  //     var X = (e.offsetX < 0 ? 0 : e.offsetX);
  //     var Y = (e.offsetY < 0 ? 0 : e.offsetY);
  //     var context = this.getContext('2d');
  //     var data = context.getImageData(X, Y, 1, 1).data;
  //     var hsl = rgb2hsl(data);
  //     updateValues(data, hsl);
  //   }    
  // })
  // canvas.addEventListener('mouseup', function(e) {
  //   mouseDownPicker = 0;
  //   cursorOuter.style.borderColor = "#a9a3a3";
  //   // close();
  // })

  // wrapTop.addEventListener("mouseenter", function() {
  //   cursorOuter.style.display = "inline-block";
  //   wrapTop.style.cursor = 'none';
  // })
  // wrapTop.addEventListener("mouseleave", function() {
  //   wrapTop.style.cursor = 'default';
  // })
  // wrapTop.addEventListener('mousemove', function(e) {
  //   cursorOuter.style.transform = "translate(" + (e.clientX) + "px," + (e.clientY) + "px)";
  //   console.log('wrap', e.offsetX, e.offsetY)
  // })

  // hueBar.addEventListener('mousedown', function(e) {
  //   mouseDownHue = 1;
  //   var context = this.getContext('2d');
  //   var data = context.getImageData(e.offsetX, e.offsetY, 1, 1).data;
  //   var hsl = rgb2hsl(data);
  //   if (hsl) {
  //     draw(hsl[0]);
  //     updateValues(data, hsl);
  //   };
  // })
  // hueBar.addEventListener('mousemove', function(e) {
  //   e.preventDefault();
  //   if (mouseDownHue === 1) {
  //     var context = this.getContext('2d');
  //     var data = context.getImageData(e.offsetX, e.offsetY, 1, 1).data;
  //     var hsl = rgb2hsl(data);
  //     if (hsl) {
  //       draw(hsl[0]);
  //       updateValues(data, hsl);
  //     };
  //   }
  // })
  // hueBar.addEventListener('mouseup', function(e) {
  //   mouseDownHue = 0;
  // })

function getPixelColor(canvas, e){
  var context = canvas.getContext('2d'),
      X = (e.offsetX < 0 ? 0 : e.offsetX),
      Y = (e.offsetY < 0 ? 0 : e.offsetY),
      rgba = context.getImageData(X, Y, 1, 1).data,
      hsl = rgb2hsl(rgba);
  return {rgba:rgba, hsl:hsl};
}


// color conversions
function rgba2String(rbga){
  return "rgba(" + rbga[0] + "," + rbga[1] + "," + rbga[2] + "," + rbga[3] +")";
}
function rgbToHex(rgb) {
    return '#' + ((rgb[0] << 16) | (rgb[1] << 8) | rgb[2]).toString(16);
}
function hsl2rbg(h, s, l) {
  //hsl param as %
  var r = 0,
    g = 0,
    b = 0,
    t1 = 0,
    t2 = 0,
    tR = 0,
    tG = 0,
    tB = 0;
  //convert to floating point between 0-1
  s = s / 100;
  l = l / 100;
  //no saturation
  if (s === 0) {
    return [Math.round(l * 255), Math.round(l * 255), Math.round(l * 255)];
  }
  //there is saturation
  t1 = (l < .5 ? t1 = l * (1.0 + s) : t1 = l + s - l * s);
  t2 = 2 * l - t1;
  //hue
  h = h / 360;
  tR = h + 0.333;
  tB = h;
  tG = h - 0.333;

  function convertColor(color) {
    var result;
    if (color < 0) {
      color = color + 1;
    } else if (color > 1) {
      color = color - 1;
    }
    if (6 * color < 1) {
      result = t2 + (t1 - t2) * 6 * color;
    } else if (2 * color < 1) {
      result = t1;
    } else if (3 * color < 2) {
      result = t2 + (t1 - t2) * (0.666 - color) * 6;
    } else {
      result = t2;
    }
    return Math.round(result * 255);
  }
  r = convertColor(tR);
  g = convertColor(tB);
  b = convertColor(tG);
  return [r, g, b];
}

function rgb2hsl(rbg) {
  var r = rbg[0] / 255,
    g = rbg[1] / 255,
    b = rbg[2] / 255,
    max,
    min,
    h,
    s,
    l;
  max = Math.max(r, g, b);
  min = Math.min(r, g, b);
  l = (max + min) / 2;
  if (min == max) {
    s = 0;
  } else {
    s = (l < .5 ? s = (max - min) / (max + min) : (max - min) / (2.0 - max - min));
  }
  if (r == max) {
    h = (g - b) / (max - min);
  } else if (g == max) {
    h = 2.0 + (b - r) / (max - min);
  } else if (b == max) {
    h = 4.0 + (r - g) / (max - min);
  }
  h = h * 60;
  if (h < 0) {
    h = h + 360;
  }
  h = Math.round(h);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  if (isNaN(h)) return false;
  if (isNaN(s)) return false;
  if (isNaN(l)) return false;
  return [h, s, l];
}