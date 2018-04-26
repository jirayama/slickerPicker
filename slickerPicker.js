


function slickerPicker(opt) {
  opt = opt || {};
  var width = opt.width || 200,
      cp_pos = {
        x:0,
        y:0
      },
      hue = 160,
      currentAlpha = 1,
      activeKnob = {},
      activeKnob_w = 0,
      activeKnob_h = 0,
      currentRGB = hsl2rbg(hue,100,50),
      currentPos = {x:154,y:34},
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
  var mouseDown = 0;

  document.addEventListener('mousedown',function() { mouseDown = 1;  });
  document.addEventListener('mouseup',function() { mouseDown = 0; activeKnob = {}; });

  function moveKnob(el,x,y, lock){
    if(!el)return;
    lock = lock || false;
    if(lock){
      el.style.transform = "translate(" + x + "px, 0px)";
    } else {
      el.style.transform = "translate(" + x + "px, " + y + "px)";
    }
  }

  function calcOffset(posX, posY, w, h){
    var padding = 20,
        x = 0,
        y = 0;
    if ( posX - padding < 0 ) {
      x =  padding;
    } else if(posX - padding > w){
      x = w + padding ;
    } else {
      x = posX;
    }
    if ( posY - padding< 0 ) {
      y = padding;
    } else if(posY - padding> h){
      y = h + padding;
    } else {
      y = posY;
    }

    return {x: x - padding , y: y - padding};
  }

  // COMPONENTS

  // start -- plugin module
  var module = new El('div').addClass('module'),
      componentHolder = new El('div').addClass('componentHolder');
  module.appendChild(componentHolder);
  module.ondragstart = function() { return false; };

  // end -- plugin module

  // start -- main picker
  function SP_mainPicker(){
    var component = new El('div').addClass('component'),
        colorPicker_wrapper = new El('div').addClass('componentWrapper'),
        colorPicker = new El('canvas').addClass('colorPicker flexCol'),
        colorPicker_ctx = colorPicker.getContext('2d'),
        cp_knob = new El('div').addClass('knob cp_knob'),
        hp_knob = new El('div').addClass('knob knobLock hp_knob'),
        ap_knob = new El('div').addClass('knob knobLock ap_knob'),
        huePicker_wrapper = new El('div').addClass('componentWrapper'),
        huePicker = new El('canvas').addClass('huePicker flexCol'),
        huePicker_ctx = huePicker.getContext('2d'),
        alphaPicker_wrapper = new El('div').addClass('componentWrapper'),
        alphaPicker = new El('canvas').addClass('alphaPicker flexCol'),
        alphaPicker_ctx = alphaPicker.getContext('2d'),
        lowerWrapper = new El('div').addClass('componentWrapper'),
        black = new El('div').addClass('blackSelect'),
        white = new El('div').addClass('whiteSelect'),
        preview = new El('div').addClass('preview'),
        previewWrap = new El('div').addClass('previewWrap'),
        previewInner = new El('div').addClass('previewInner'),
        pluginName = new El('div').addClass('pluginName').addText('slicker picker');



    colorPicker.setAttribute('width', width);
    colorPicker.setAttribute('height', width);
    colorPicker_ctx.scale(width/100,width/100);

    huePicker.setAttribute('width', width);
    huePicker.setAttribute('height', width/10);
    huePicker_ctx.scale(width/100,width/100);

    alphaPicker.setAttribute('width', width);
    alphaPicker.setAttribute('height', width/10);
    alphaPicker_ctx.scale(width/100,width/100);

    // cp_knob.style.display = 'none';

    moveKnob(hp_knob, hue/360*width , 0);
    moveKnob(ap_knob, width , 0);
    ap_knob.style.transform = 'translate()';


    preview.appendChild(previewInner);
    previewWrap.appendChild(preview)

    colorPicker_wrapper.appendMany(cp_knob,colorPicker);
    huePicker_wrapper.appendMany(hp_knob,huePicker);
    alphaPicker_wrapper.appendMany(ap_knob,alphaPicker);
    lowerWrapper.appendMany(black, white, previewWrap, pluginName);
    component.appendMany(colorPicker_wrapper, huePicker_wrapper, alphaPicker_wrapper,lowerWrapper);

    function updatePreview(rgb){
      currentRGB = rgb;
      previewInner.addBackground(rgba2String([currentRGB[0],currentRGB[1],currentRGB[2],currentAlpha]));
      draw_alphaPicker([currentRGB[0],currentRGB[1],currentRGB[2],currentAlpha]);
      console.log(currentRGB, currentAlpha)
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

    module.addEventListener('mousedown', function(e){
      // use only this for Element for all events
      e.target.draggable = false;
      activeKnob_w = e.target.width;
      activeKnob_h = e.target.height;
      var color = getPixelColor(colorPicker,e.offsetX,e.offsetY);
      // updatePreview(color.rgba);

      if(e.target.className.includes('colorPicker')){
        activeKnob = cp_knob;
        var pos = calcOffset(e.x,e.y,activeKnob_w, activeKnob_h);
        moveKnob(activeKnob,pos.x ,pos.y );
      } else if(e.target.className.includes('huePicker')){
        activeKnob = hp_knob;
        var pos = calcOffset(e.x,e.y,activeKnob_w, activeKnob_h);
        moveKnob(activeKnob,pos.x ,pos.y ,true);
      } else if(e.target.className.includes('alphaPicker')){
        activeKnob = ap_knob;
        var pos = calcOffset(e.x,e.y,activeKnob_w, activeKnob_h);
        moveKnob(activeKnob,pos.x ,pos.y ,true);
      }
    });

    module.addEventListener('mouseup', function(e){
      activeKnob = null;
      e.target.draggable = false;
    });

    module.addEventListener('mousemove', function(e){
      if(!activeKnob.className) return;

      if(mouseDown === 1){
        var pos = calcOffset(e.x,e.y,activeKnob_w, activeKnob_h);
        if(activeKnob.className.includes('cp_knob')){
          currentPos = {x: pos.x , y: pos.y};
        }

         if(activeKnob.className.includes('knobLock')){
          moveKnob(activeKnob, pos.x ,pos.y ,true);
        } else {
          moveKnob(activeKnob,pos.x ,pos.y);
        }
      }
    });

    black.addEventListener('click', function(){
      currentPos.x = width;
      currentPos.y = width;
      updatePreview([0,0,0,1]);
      moveKnob(cp_knob,currentPos.x,currentPos.y);
    });

    white.addEventListener('click', function(){
      currentPos.x = 0;
      currentPos.y = 0;
      updatePreview([255,255,255,1]);
      moveKnob(cp_knob,currentPos.x,currentPos.y);
    });

    colorPicker_wrapper.addEventListener('mousedown',function(e){
      var color = getPixelColor(colorPicker,e.offsetX,e.offsetY);
      cp_knob.style.display = "inline-block";
      currentPos.x = e.offsetX;
      currentPos.y = e.offsetY;
      updatePreview(color.rgba);
    })
    colorPicker_wrapper.addEventListener('mousemove',function(e){
        if(mouseDown === 1 && activeKnob.className.includes('cp_knob')){
        var color = getPixelColor(colorPicker,e.offsetX,e.offsetY);
        currentPos.x = e.offsetX;
        currentPos.y = e.offsetY;
        updatePreview(color.rgba);
      }
    })
    colorPicker.addEventListener('mouseup', function(e){
      currentPos.x = e.offsetX;
      currentPos.y = e.offsetY;
    })


    huePicker_wrapper.addEventListener('mousedown',function(e){
      var color = getPixelColor(huePicker,e.offsetX,e.offsetY);
      hue = color.hsl[0];
      draw_colorPicker();
      var colorPreview = getPixelColor(colorPicker,currentPos.x,currentPos.y);
      updatePreview(colorPreview.rgba);
      moveKnob(hp_knob,e.offsetX,e.offsetY, true);
    })

    huePicker_wrapper.addEventListener('mousemove',function(e){
      if(mouseDown === 1 && activeKnob.className.includes('hp_knob')){
        console.log("test")
        var color = getPixelColor(huePicker,e.offsetX,e.offsetY);
        hue = color.hsl[0];
        moveKnob(hp_knob,e.offsetX,e.offsetY, true);
        draw_colorPicker();
        var colorPreview = getPixelColor(colorPicker,currentPos.x,currentPos.y);
         updatePreview(colorPreview.rgba);
      }
    })

    alphaPicker_wrapper.addEventListener('mousedown',function(e){
      var alpha = e.offsetX/width;
      if (alpha > 1){
        alpha = 1;
      } else if (alpha < 0){
        alpha = 0;
      }
      currentAlpha = alpha;
       updatePreview(currentRGB);
    })

    alphaPicker_wrapper.addEventListener('mousemove',function(e){
      if(mouseDown === 1 && activeKnob.className.includes('ap_knob')){
        var alpha = e.offsetX/width;
      if (alpha > .96){
        alpha = 1;
      } else if (alpha < .05){
        alpha = 0;
      }
        currentAlpha = alpha;
       updatePreview(currentRGB);
      }
    })

    // cp_knob.addEventListener('mousemove',function(e){
    //   e.preventDefault();
    //   e.stopPropagation();
    // })

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
    moveKnob(cp_knob,currentPos.x,currentPos.y)

    updatePreview(getPixelColor(colorPicker,currentPos.x,currentPos.y).rgba);
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
    // e.stopPropagation();
    e.preventDefault();
    open();
  })



  // init
  new SP_mainPicker();
  // new SP_palette();
}

function getPixelColor(canvas, posX,posY){
  var context = canvas.getContext('2d'),
      X = (posX < 0 ? 0 : posX),
      Y = (posY < 0 ? 0 : posY),
      rgba = context.getImageData(X, Y, 1, 1).data,
      hsl = rgba2hsl(rgba);
  return {rgba:rgba, hsl:hsl};
}


// color conversions
function rgba2String(rbga){
  var alpha = rbga[3] || 1;
  return "rgba(" + rbga[0] + "," + rbga[1] + "," + rbga[2] + "," + alpha +")";
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
