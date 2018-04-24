function slickerPicker(opt) {
  opt = opt || {};
  var width = opt.width || 200,
      cp_pos = {
        x:0,
        y:0
      },
      hue = 160,
      currentRGBA = hsl2rbg(hue,100,50),
      cp_click = 0,
      hp_click = 0,
      ap_click = 0,
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

  function moveKnob(el,x,y, lock){
    lock = lock || false;
    if(lock){
      el.style.transform = "translate(" + x + "px, 0px)";
    } else {
      el.style.transform = "translate(" + x + "px, " + y + "px)";
    }

  }
  // COMPONENTS

  // start -- plugin module
  var module = new El('div').addClass('module'),
      componentHolder = new El('div').addClass('componentHolder');
  module.appendChild(componentHolder);
  // componentHolder.style.maxWidth = width + "px";
  // end -- plugin module

  // start -- main picker
  function SP_mainPicker(){
    var component = new El('div').addClass('component'),
        colorPicker_wrapper = new El('div').addClass('componentWrapper'),
        colorPicker = new El('canvas').addClass('colorPicker flexCol'),
        colorPicker_ctx = colorPicker.getContext('2d'),
        cp_knob = new El('div').addClass('knob'),
        hp_knob = new El('div').addClass('knob knobLock'),
        ap_knob = new El('div').addClass('knob knobLock'),
        huePicker_wrapper = new El('div').addClass('componentWrapper'),
        huePicker = new El('canvas').addClass('huePicker flexCol'),
        huePicker_ctx = huePicker.getContext('2d'),
        alphaPicker_wrapper = new El('div').addClass('componentWrapper'),
        alphaPicker = new El('canvas').addClass('alphaPicker flexCol'),
        alphaPicker_ctx = alphaPicker.getContext('2d'),
        lowerWrapper = new El('div').addClass('componentWrapper previewWrap'),
        black = new El('div').addClass('blackSelect'),
        white = new El('div').addClass('whiteSelect'),
        preview = new El('div').addClass('preview');


    colorPicker.setAttribute('width', width);
    colorPicker.setAttribute('height', width);
    colorPicker_ctx.scale(width/100,width/100);

    huePicker.setAttribute('width', width);
    huePicker.setAttribute('height', width/10);
    huePicker_ctx.scale(width/100,width/100);

    alphaPicker.setAttribute('width', width);
    alphaPicker.setAttribute('height', width/10);
    alphaPicker_ctx.scale(width/100,width/100);

    cp_knob.style.display = 'none';

    moveKnob(hp_knob, hue/360*width , 0);
    moveKnob(ap_knob, width , 0);
    ap_knob.style.transform = 'translate()';


    colorPicker_wrapper.appendMany(cp_knob,colorPicker);
    huePicker_wrapper.appendMany(hp_knob,huePicker);
    alphaPicker_wrapper.appendMany(ap_knob,alphaPicker);
    lowerWrapper.appendMany(black, white, preview);
    component.appendMany(colorPicker_wrapper, huePicker_wrapper, alphaPicker_wrapper,lowerWrapper);

    function udpatePreview(rgba){
      currentRGBA = rgba;
      preview.addBackground(rgba2String(currentRGBA));
      draw_alphaPicker(currentRGBA);
    }

    draw_colorPicker = function(h) {
      h = h || hue;
      var s = 0,
        l = 100,
        endL = 50,
        startL = l,
        startS = s,
        endS = 100,
        x = 0,
        y = 0;

      colorPicker_ctx.clearRect(0, 0, width, width);

      for (y = 0; y <= 100; y++) {
        for (x = 0; x <= 100; x++) {
          color = hsl2rbg(h, s, l);
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

      alphaPicker_ctx.clearRect(0, 0, width, width/10);

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

      var alp = 0;
      for (var x = 0; x <= 90; x++) {
        alphaPicker_ctx.fillStyle = "rgba(" + rbg[0] + "," + rbg[1] + "," + rbg[2] + "," + alp/100 +")";
        alphaPicker_ctx.fillRect(x, 0, 1, width/10);
        alp = alp + (100 / 90);
      }
      for (var x = 90; x <= 100; x++) {
        alphaPicker_ctx.fillStyle = "rgba(" + rbg[0] + "," + rbg[1] + "," + rbg[2] + ",255)";
        alphaPicker_ctx.fillRect(x, 0, 1, width/10);
      }
    }


    colorPicker_wrapper.addEventListener('mousedown',function(e){
      cp_click = 1;
      var color = getPixelColor(colorPicker,e);
      udpatePreview(color.rgba);
      moveKnob(cp_knob,e.offsetX,e.offsetY);
      cp_knob.style.display = "inline-block";
    })
    colorPicker_wrapper.addEventListener('mouseup',function(e){
      cp_click = 0;
    })
    colorPicker_wrapper.addEventListener('mouseleave',function(e){
      cp_click = 0;
    })
    colorPicker_wrapper.addEventListener('mousemove',function(e){
      if(cp_click === 1) {
        var color = getPixelColor(colorPicker,e);
        udpatePreview(color.rgba);
        moveKnob(cp_knob,e.offsetX,e.offsetY);
      }
    })

    huePicker_wrapper.addEventListener('mousedown',function(e){
      hp_click = 1;
      var color = getPixelColor(huePicker,e);
      hue = color.hsl[0];
      draw_colorPicker();
      moveKnob(hp_knob,e.offsetX,e.offsetY, true);
    })
    huePicker_wrapper.addEventListener('mouseup',function(e){
      hp_click = 0;
    })
    huePicker_wrapper.addEventListener('mouseleave',function(e){
      hp_click = 0;
    })
    huePicker_wrapper.addEventListener('mousemove',function(e){
      if(hp_click === 1){
        var color = getPixelColor(huePicker,e);
        hue = color.hsl[0];
         moveKnob(hp_knob,e.offsetX,e.offsetY, true);
        draw_colorPicker();
      }
    })

    alphaPicker_wrapper.addEventListener('mousedown',function(e){
      ap_click = 1;
      moveKnob(ap_knob,e.offsetX,e.offsetY, true);
    })
    alphaPicker_wrapper.addEventListener('mouseup',function(e){
      ap_click = 0;
    })
    alphaPicker_wrapper.addEventListener('mousemove',function(e){
      if(ap_click === 1)moveKnob(ap_knob,e.offsetX,e.offsetY, true);
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

    // component.style.maxWidth = componentHolder.width;
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
  //   var hsl = rgba2hsl(data);
  //   cursorOuter.style.borderColor = "#FF5722";
  //   updateValues(data, hsl);
  // })
  // canvas.addEventListener('mousemove', function(e) {
  //   if(mouseDownPicker === 1){
  //     var X = (e.offsetX < 0 ? 0 : e.offsetX);
  //     var Y = (e.offsetY < 0 ? 0 : e.offsetY);
  //     var context = this.getContext('2d');
  //     var data = context.getImageData(X, Y, 1, 1).data;
  //     var hsl = rgba2hsl(data);
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
  //   var hsl = rgba2hsl(data);
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
  //     var hsl = rgba2hsl(data);
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
      hsl = rgba2hsl(rgba);
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
    return [Math.round(l * 255), Math.round(l * 255), Math.round(l * 255), Math.round(l * 255)];
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
  return [r, g, b, 255];
}

function rgba2hsl(rbg) {
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
