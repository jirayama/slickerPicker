function sp(opt) {
  // state
  opt = opt || {};
  var readout = 0,
    current_a = opt.opacity || 1,
    current_h = opt.hue || 198,
    current_s = 100,
    current_l = 50,
    current_rgb = opt.rbga || hsl2rbg(current_h, current_s, current_l),
    current_pos = {
      x: 198,
      y: 0
    },
    current_pos_h = current_h / 360 * 200,
    current_pos_a = current_a * 200,
    current_shade = 2,
    shades = new Array(5).fill(""),
    lightnessOffset = 0,
    pointer_status = 0,
    pointer_start = "";
  // set up DOM structure
  var sp_btn = new El('div').addClass('slickerPickerWrap'),
    sp_btnInner = new El('div').addClass('slickerPicker'),
    module = new El('div').addClass('module').addId('sp_module'),
    module_top = new El('div').addClass('module_top').addId('sp_module_top'),
    module_left = new El('div').addClass('module_left').addId('sp_module_left'),
    module_right = new El('div').addClass('module_right').addId('sp_module_right'),
    module_bottom = new El('div').addClass('module_bottom').addId('sp_module_bottom'),
    colorPicker = new El('div').addClass('colorPicker pickerWrap').addId('sp_colorPicker'),
    colorPicker_can = new El('canvas').addId('colorPicker'),
    colorPicker_ctx = colorPicker_can.getContext('2d'),
    huePicker = new El('div').addClass('huePicker pickerWrap').addId('sp_huePicker'),
    huePicker_can = new El('canvas').addId('huePicker'),
    huePicker_ctx = huePicker_can.getContext('2d'),
    alphaPicker = new El('div').addClass('alphaPicker pickerWrap').addId('sp_alphaPicker'),
    alphaPicker_can = new El('canvas').addId('alphaPicker'),
    alphaPicker_ctx = alphaPicker_can.getContext('2d'),
    shadesPicker = new El('ul').addClass('shadesPicker').addId('shadesPicker'),
    shade_lighter = new El('li').addId('sp_shade_lighter'),
    shade_light = new El('li').addId('sp_shade_light'),
    shade_primary = new El('li').addId('sp_shade_primary').addClass('shade_selected'),
    shade_dark = new El('li').addId('sp_shade_dark'),
    shade_darker = new El('li').addId('sp_shade_darker'),
    clearfix = new El('div').addClass('clearfix'),
    readout_change = new El('div').addClass('readout_change').addId('readout_change'),
    readout_rgba = new El('table').addClass('readoutTable').addId('readout_rgba'),
    readout_hsl = new El('table').addClass('readoutTable').addId('readout_hsl'),
    readout_hex = new El('table').addClass('readoutTable').addId('readout_hex'),
    input_r = new El('input').addType('number'),
    input_g = new El('input').addType('number'),
    input_b = new El('input').addType('number'),
    input_a = new El('input').addType('number'),
    input_h = new El('input').addType('number'),
    input_s = new El('input').addType('text'),
    input_l = new El('input').addType('text'),
    input_hex = new El('input').addType('text'),
    knob_cp = new El('div').addClass('knob knob_cp'),
    knob_hp = new El('div').addClass('knob knob_hp'),
    knob_ap = new El('div').addClass('knob knob_ap');
  colorPicker_can.draggable = false;
  huePicker_can.draggable = false;
  alphaPicker_can.draggable = false;
  knob_ap.style.transform = "translateX(198px)";
  knob_cp.style.transform = "translateX(198px)";
  readout_rgba.appendMany(DOM_tableRow(input_r, input_g, input_b, input_a));
  readout_rgba.appendMany(DOM_tableHeader("r", "g", "b", "a"));
  readout_hsl.appendMany(DOM_tableRow(input_h, input_s, input_l));
  readout_hsl.appendMany(DOM_tableHeader("h", "s", "l"));
  readout_hex.appendMany(DOM_tableRow(input_hex));
  readout_hex.appendMany(DOM_tableHeader("hex"));
  var svg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	style="fill: #918c8c; width: 20px; height: 35px; margin-left: 2px;" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve">	<path d="M22.948,10.05c0.147,0.18,0.179,0.428,0.079,0.639c-0.1,0.21-0.312,0.344-0.544,0.344H7.518	c-0.233,0-0.444-0.134-0.544-0.344c-0.099-0.21-0.068-0.459,0.079-0.639l7.015-8.54c0.229-0.279,0.572-0.441,0.934-0.441	s0.704,0.162,0.934,0.441L22.948,10.05z"/>	<path d="M7.052,19.951c-0.147-0.18-0.178-0.429-0.079-0.639c0.1-0.211,0.311-0.345,0.543-0.345h14.966	c0.232,0,0.444,0.134,0.544,0.345c0.1,0.21,0.068,0.459-0.079,0.639l-7.014,8.538c-0.229,0.279-0.572,0.441-0.934,0.441	s-0.704-0.162-0.934-0.441L7.052,19.951z"	/>	</svg>';
  readout_change.innerHTML = svg;
  sp_btn.appendMany(sp_btnInner)
  shadesPicker.appendMany(shade_lighter, shade_light, shade_primary, shade_dark, shade_darker);
  module_right.appendMany(shadesPicker);
  colorPicker_can.width = 200;
  colorPicker_can.height = 130;
  huePicker_can.width = 200;
  huePicker_can.height = 20;
  alphaPicker_can.width = 200;
  alphaPicker_can.height = 20;
  colorPicker.appendMany(knob_cp, colorPicker_can);
  huePicker.appendMany(knob_hp, huePicker_can);
  alphaPicker.appendMany(knob_ap, alphaPicker_can);
  module_left.appendMany(colorPicker, huePicker, alphaPicker);
  module_top.appendMany(module_left, module_right, clearfix);
  module_bottom.appendMany(readout_change, readout_rgba, readout_hsl, readout_hex);
  module.appendMany(module_top, module_bottom);
  //helpers
  function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  function set_color_HSL(h, s, l) {
    current_rgb = hsl2rbg(h, s, l);
    current_h = h;
    current_s = s;
    current_l = l;
  }

  function set_color_RGB(rgb) {
    var hsl = rgba2hsl(rgb),
      hex;
    if (!hsl) {
      hsl = [0, 0, 0];
      hex = "#000000";
    } else {
      hex = rgbToHex(current_rgb);
    }
    current_rgb = rgb;
    // current_h = hsl[0];
    current_s = hsl[1];
    current_l = hsl[2];
    input_h.value = current_h;
    input_s.value = current_s + "%";
    input_l.value = current_l + "%";
    input_r.value = current_rgb[0];
    input_g.value = current_rgb[1];
    input_b.value = current_rgb[2];
    input_a.value = current_a;
    input_hex.value = hex;
  }

  function update_readout_shade() {
    var hex,
      temp_rgb = hsl2rbg(current_h, current_s, current_l + lightnessOffset),
      hsl = rgba2hsl([temp_rgb[0], temp_rgb[1], temp_rgb[2], current_a]);
    if (!hsl) {
      hsl = [0, 0, 0];
      hex = "#000000";
    } else {
      hex = rgbToHex(temp_rgb);
    }
    // console.log(current_shade)
    input_h.value = current_h;
    input_s.value = current_s + "%";
    input_l.value = (current_l + lightnessOffset) + "%";
    input_r.value = temp_rgb[0];
    input_g.value = temp_rgb[1];
    input_b.value = temp_rgb[2];
    input_a.value = current_a;
    // console.log(current_l, lightnessOffset, temp_rgb, shades[current_shade])
    input_hex.value = hex;
  }

  function set_color_pos(pos) {
    pos = pos || current_pos;
    var rgb = colorPicker_ctx.getImageData(pos.x, pos.y, 1, 1).data;
    var hsl = rgba2hsl(rgb);
    current_rgb = rgb;
    // current_h = hsl[0];
    current_s = hsl[1];
    current_l = hsl[2];
    input_h.value = current_h;
    input_s.value = current_s;
    input_l.value = current_l;
    input_r.value = current_rgb[0];
    input_g.value = current_rgb[1];
    input_b.value = current_rgb[2];
    input_a.value = current_a;
    input_hex.value = rgbToHex(current_rgb);
  }

  function set_bgc_HSL(el, l) {
    // el.style.background = "hsl(" + current_h + "," + current_s + "%, " + l + "%)";
    var color = hsl2rbg(current_h, current_s, l);
    el.style.backgroundColor = "rgba(" + color[0] + "," + color[1] + ", " + color[2] + ", " + current_a + ")";
  }

  function set_bgc_RGBA(el, color) {
    //rgb and current alpha
    el.style.backgroundColor = "rgba(" + color[0] + "," + color[1] + ", " + color[2] + ", " + current_a + ")";
  }

  function shade(color, percent) {
    // rgb
    var hsl = rgba2hsl(color),
      rgb;
    hsl[2] = hsl[2] + percent;
    if (hsl[2] < 0) {
      hsl[2] = 0;
    } else if (hsl[2] > 100) {
      hsl[2] = 100;
    }
    rgb = hsl2rbg(hsl[0], hsl[1], hsl[2]);
    return rgb;
  }
  //easing
  Math.easeInQuad = function(t, b, c, d) {
    t /= d;
    return c * t * t + b;
  };
  Math.easeOutQuad = function(t, b, c, d) {
    t /= d;
    return -c * t * (t - 2) + b;
  };
  Math.easeInOutQuad = function(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };
  Math.easeOutExpo = function(t, b, c, d) {
    return c * (-Math.pow(2, -10 * t / d) + 1) + b;
  };
  Math.easeOutExpoSuper = function(t, b, c, d) {
    return c * (-Math.pow(10, -3 * t / d) + 1) + b;
  };
  Math.linearTween = function(t, b, c, d) {
    return c * t / d + b;
  };
  // actions
  function draw_colorPicker(h) {
    h = h || current_h;
    var s = 0,
      l = 100,
      endL = 50,
      startL = 100,
      startS = 100,
      endS = 100,
      x = 0,
      y = 0,
      width = 200,
      height = 130;;
    var imageData = colorPicker_ctx.getImageData(0, 0, width, height);
    var buf = new ArrayBuffer(imageData.data.length);
    var buf8 = new Uint8ClampedArray(buf);
    var data = new Uint32Array(buf);
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        s = Math.easeInQuad(x, startS, (100 - startS), width);
        l = Math.easeOutQuad(x, startL, -(startL - endL), width);
        var rgb = hsl2rbg(h, s, l);
        data[y * width + x] = (255 << 24) | // alpha
          (rgb[2] << 16) | // blue
          (rgb[1] << 8) | // green
          rgb[0]; // red
      }
      startS = Math.easeOutExpo(y, 100, -100, height);
      startL = Math.linearTween(y, 100, -100, height);
      endL = Math.easeInQuad(y, 50, -50, height);
    }
    imageData.data.set(buf8);
    colorPicker_ctx.putImageData(imageData, 0, 0);
  }

  function draw_huePicker() {
    var width = 198,
      height = 18,
      h = 1,
      color;
    for (var x = 0; x < width; x++) {
      color = hsl2rbg(h, 100, 50);
      huePicker_ctx.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
      huePicker_ctx.fillRect(x, 0, 1, height);
      h = h + (360 / width);
    }
  }

  function draw_alphaPicker() {
    var width = 200,
      height = 20,
      y = 0,
      x = 0;
    var imageData = alphaPicker_ctx.getImageData(0, 0, width, height);
    var buf = new ArrayBuffer(imageData.data.length);
    var buf8 = new Uint8ClampedArray(buf);
    var data = new Uint32Array(buf);
    alphaPicker_ctx.clearRect(0, 0, width, height);
    var a = 0;
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        data[y * width + x] = (x / width * 255 << 24) | // alpha
          (current_rgb[2] << 16) | // blue
          (current_rgb[1] << 8) | // green
          current_rgb[0]; // red
      }
    }
    imageData.data.set(buf8);
    alphaPicker_ctx.putImageData(imageData, 0, 0);
  }

  function draw_shades() {
    set_bgc_HSL(shade_lighter, current_l + 20);
    set_bgc_HSL(shade_light, current_l + 10);
    set_bgc_HSL(shade_primary, current_l);
    set_bgc_HSL(shade_dark, current_l - 10);
    set_bgc_HSL(shade_darker, current_l - 20);
    shades[0] = hsl2rbg(current_h, current_s, current_l + 20);
    shades[1] = hsl2rbg(current_h, current_s, current_l + 10);
    shades[2] = hsl2rbg(current_h, current_s, current_l);
    shades[3] = hsl2rbg(current_h, current_s, current_l - 10);
    shades[4] = hsl2rbg(current_h, current_s, current_l - 20);
    // console.log(shades)
  }

  function update_readout_display() {
    if (readout === 0) {
      readout_rgba.style.display = "block";
      readout_hsl.style.display = "none";
      readout_hex.style.display = "none";
    } else if (readout === 1) {
      readout_rgba.style.display = "none";
      readout_hsl.style.display = "block";
      readout_hex.style.display = "none";
    } else if (readout === 2) {
      readout_rgba.style.display = "none";
      readout_hsl.style.display = "none";
      readout_hex.style.display = "block";
    }
  }

  function update_hue_change(h) {
    draw_colorPicker(h);
    current_h = h;
    set_color_RGB(colorPicker_ctx.getImageData(current_pos.x, current_pos.y, 1, 1).data);
    draw_shades();
    draw_alphaPicker();
  }

  function update_alpha_change() {
    set_color_pos();
    update_readout_display();
    draw_shades();
  }

  function update_selected(pos) {
    current_pos.x = pos.x;
    current_pos.y = pos.y;
    draw_shades();
    update_readout_display();
    draw_alphaPicker();
    draw_shades();
  }
  // event listeners
  readout_change.addEventListener('click', function() {
    readout++;
    if (readout > 2) readout = 0;
    update_readout_display();
  });
  // log click status
  document.addEventListener('pointerdown', function(e) {
    //do I stil need this?
  });
  document.addEventListener('pointerup', function() {
    pointer_status = 0;
    pointer_start = "";
  });
  document.addEventListener('pointerup', function(e) {
    e.stopPropagation();
    var modCheck = document.getElementById('sp_module');
    console.log(modCheck)
    if (modCheck) {
      modCheck.remove();
    }
  });
  sp_btn.addEventListener('pointerdown', function(e) {
    var modCheck = document.getElementById('sp_module');
    e.stopPropagation();
    if (modCheck) {
      modCheck.remove();
    }
    sp_btnInner.appendMany(module);
  })

  function processInteract(e) {
    var mod = module.getBoundingClientRect(),
      x = e.x - mod.left,
      y = e.y - mod.top,
      offsetX = 0,
      offsetY = 0;
    if (pointer_start === "colorPicker") {
      offsetX = offsetY = 5;
    } else if (pointer_start === "huePicker") {
      offsetX = 5;
      offsetY = 140;
    } else if (pointer_start === "alphaPicker") {
      offsetX = 5;
      offsetY = 165;
    }
    x -= offsetX;
    y -= offsetY;
    if (pointer_start === "colorPicker" && pointer_status === 1) {
      if (y > 130) y = 130;
      if (x > 199) x = 199;
      if (y < 0) y = 0;
      if (x < 0) x = 0;
      knob_cp.style.transform = "translate(" + x + "px," + y + "px)";
      set_color_RGB(colorPicker_ctx.getImageData(x, y, 1, 1).data);
      update_selected({
        x: x,
        y: y
      });
      set_bgc_RGBA(sp_btnInner, shades[current_shade]);
    } else if (pointer_start === "huePicker" && pointer_status === 1) {
      if (y > 18) y = 18;
      if (x > 200) x = 200;
      if (y < 0) y = 0;
      if (x < 0) x = 0;
      knob_hp.style.transform = "translateX(" + x + "px)";
      // console.log(current_h, Math.round(x*(360/200)))
      update_hue_change(Math.round(x * (360 / 200)));
      set_bgc_RGBA(sp_btnInner, shades[current_shade]);
    } else if (pointer_start === "alphaPicker" && pointer_status === 1) {
      var temp_a = precisionRound(x / 2 / 95, 3);
      if (temp_a > 1) temp_a = 1;
      if (temp_a < 0) temp_a = 0;
      current_a = temp_a;
      if (y > 18) y = 18;
      if (x > 200) x = 200;
      if (y < 0) y = 0;
      if (x < 0) x = 0;
      knob_ap.style.transform = "translateX(" + x + "px)";
      update_alpha_change();
      set_bgc_RGBA(sp_btnInner, shades[current_shade]);
    }
  }
  module.addEventListener('pointerdown', function(e) {
    e.preventDefault();
    e.stopPropagation();
    pointer_status = 1;
    pointer_start = e.target.id;
    if (e.target.draggable) e.target.draggable = false;
    processInteract(e);
  });
  module.addEventListener('pointerup', function(e) {
    e.preventDefault();
    e.stopPropagation();
    pointer_status = 0;
    pointer_start = "";
    if (e.target.draggable) e.target.draggable = false;
  })
  module.addEventListener('pointermove', function(e) {
    // get pos within module
    if (e.target.draggable) e.target.draggable = false;
    processInteract(e);
  });
  shadesPicker.addEventListener('pointerdown', function(e) {
    if (e.target.id === "sp_shade_primary") {
      shade_primary.className = "shade_selected";
      current_shade = 2;
      lightnessOffset = 0;
      update_readout_shade();
    } else {
      shade_primary.className = "";
    }
    if (e.target.id === "sp_shade_light") {
      shade_light.className = "shade_selected";
      current_shade = 1;
      lightnessOffset = 10;
      update_readout_shade();
    } else {
      shade_light.className = "";
    }
    if (e.target.id === "sp_shade_lighter") {
      shade_lighter.className = "shade_selected";
      current_shade = 0;
      lightnessOffset = 20;
      update_readout_shade();
    } else {
      shade_lighter.className = "";
    }
    if (e.target.id === "sp_shade_dark") {
      shade_dark.className = "shade_selected";
      current_shade = 3;
      lightnessOffset = -10;
      update_readout_shade();
    } else {
      shade_dark.className = "";
    }
    if (e.target.id === "sp_shade_darker") {
      shade_darker.className = "shade_selected";
      current_shade = 4;
      lightnessOffset = -20;
      update_readout_shade();
    } else {
      shade_darker.className = "";
    }
    set_bgc_RGBA(sp_btnInner, shades[current_shade]);
  })
  // init
  function init() {
    update_readout_display();
    draw_colorPicker();
    draw_huePicker();
    draw_alphaPicker();
    draw_shades();
    set_color_pos();
    draw_colorPicker();
    set_color_RGB(current_rgb);
    knob_cp.style.transform = "translate(" + current_pos.x + "px," + current_pos.y + "px)";
    knob_hp.style.transform = "translateX(" + current_pos_h + "px)";
    knob_ap.style.transform = "translateX(" + current_pos_a + "px)";
  }
  // mount module	
  if (opt.id) {
    var modCheck = document.getElementById('sp_module');
    if (modCheck) {
      modCheck.remove();
    }
    document.getElementById(opt.id).parentNode.appendMany(sp_btn);
    set_bgc_RGBA(sp_btnInner, current_rgb);
    console.log(document.getElementById(opt.id).tagName);
  }
  init();
  // set_color_RGB([12,120,50]);
}