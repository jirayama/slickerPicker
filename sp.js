function sp(opt) {
	// state
	opt = opt || {};

	var readout = 0,			
			current_a = 1,
			current_h = 240,
			current_s = 100,
			current_l = 50,
			current_rgb = opt.rbga || hsl2rbg(current_h, current_s, current_l),
			shades = {
				lighter: [],
				light: [],
				primary: [],
				dark: [],
				darker: []
			};

			console.log(current_rgb)

	// set up DOM structure
	var module = new El('div').addClass('module').addId('module'),
			module_top = new El('div').addClass('module_top').addId('module_top'),
			module_left = new El('div').addClass('module_left').addId('module_left'),
			module_right = new El('div').addClass('module_right').addId('module_right'),
			module_bottom = new El('div').addClass('module_bottom').addId('module_bottom'),
			colorPicker = new El('div').addClass('colorPicker'),
			colorPicker_can = new El('canvas').addId('colorPicker'),
			colorPicker_ctx = colorPicker_can.getContext('2d'),
			huePicker = new El('div').addClass('huePicker'),
			huePicker_can = new El('canvas').addId('huePicker'),
			huePicker_ctx = huePicker_can.getContext('2d'),
			alphaPicker = new El('div').addClass('alphaPicker'),
			alphaPicker_can = new El('canvas').addId('alphaPicker'),
			alphaPicker_ctx = alphaPicker_can.getContext('2d'),
			shadesPicker = new El('ul').addClass('shadesPicker').addId('shadesPicker'),
			shade_lighter = new El('li').addId('shade_lighter'),
			shade_light = new El('li').addId('shade_light'),
			shade_primary = new El('li').addId('shade_primary'),
			shade_dark = new El('li').addId('shade_dark'),
			shade_darker = new El('li').addId('shade_darker'),
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
			input_s = new El('input').addType('number'),
			input_l = new El('input').addType('number'),
			input_hex = new El('input').addType('text');


	readout_rgba.appendMany(DOM_tableRow(input_r, input_g, input_b, input_a));
	readout_rgba.appendMany(DOM_tableHeader("r", "g", "b", "a"));

	readout_hsl.appendMany(DOM_tableRow(input_h, input_s, input_l));
	readout_hsl.appendMany(DOM_tableHeader("h", "s", "l"));

	readout_hex.appendMany(DOM_tableRow(input_hex,));
	readout_hex.appendMany(DOM_tableHeader("hex"));

	shadesPicker.appendMany(shade_lighter,	shade_light, shade_primary,	shade_dark,	shade_darker);
	module_right.appendMany(shadesPicker);

	colorPicker_can.width = 200;
	colorPicker_can.height = 130;

	huePicker_can.width = 200;
	huePicker_can.height = 20;

	alphaPicker_can.width = 200;
	alphaPicker_can.height = 20;

	colorPicker.appendMany(colorPicker_can);
	huePicker.appendMany(huePicker_can);
	alphaPicker.appendMany(alphaPicker_can);
	module_left.appendMany(colorPicker, huePicker, alphaPicker);

	module_top.appendMany(module_left, module_right, clearfix);
	module_bottom.appendMany(readout_change,	readout_rgba,	readout_hsl,	readout_hex);

	module.appendMany(module_top,	module_bottom);

	//helpers
	function set_color_HSL(h,s,l){
	  current_rgb = hsl2rbg(h,s,l);
	  current_h = h;
	  current_s = s;
	  current_l = l;
	}

	function set_color_RGB(rgb){
	  var hsl = rgba2hsl(rgb);
	  current_rgb = rgb;
	  current_h = hsl[0];
	  current_s = hsl[1];
	  current_l = hsl[2];
	}

	function set_bgc_HSL(el,color){
		el.style.background = "hsl(" + color[0] + "," + color[1] + "%, " + color[2] + "%)";
	}

	function set_bgc_RGBA(el,color){
		//rgb and current alpha
		el.style.background = "rgba(" + color[0] + "," + color[1] + ", " + color[2] + ", " + current_a +")";
	}

	function shade(color, percent){
		// rgb
		var hsl = rgba2hsl(color),
				rgb;
		hsl[2] = hsl[2] + percent;
		if(hsl[2] < 0 ){
			hsl[2] = 0;
		} else if(hsl[2] > 100 ){
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
	Math.easeOutExpo = function (t, b, c, d) {
		return c * ( -Math.pow(2, -10 * t/d ) + 1 ) + b;
	};
	Math.easeOutExpoSuper = function (t, b, c, d) {
		return c * ( -Math.pow( 10, -3 * t/d ) + 1 ) + b;
	};
	Math.linearTween = function (t, b, c, d) {
		return c*t/d + b;
	};


	// actions
	function draw_colorPicker(h) {
      h = h || hue;
      var s = 0,
          l = 100,
          endL = 50,
          startL = 100,
          startS = 100,
          endS = 100,
          x = 0,
          y = 0,
          color,
          width = 198,
          height = 128,
          rate = 200,          
          dist = (endS - startS)/width,
          incr = (endS - startS)/width/130;

      colorPicker_ctx.clearRect(0, 0, width, 130);

      for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {       
          s = Math.easeInQuad(x, startS, (100 - startS ), width);
          l = Math.easeOutQuad(x, startL, -(startL - endL), width); 
          colorPicker_ctx.fillStyle = "hsl(" + h + "," + s + "%," + l + "%)";
          // if(l>25 && l<26 || l>50 && l<51 || l>75 && l<76 || l > 99 || l < 1) {
          // 	colorPicker_ctx.fillStyle = "pink";
          // } 
          // if(s>25 && s < 26 || s>50 && s < 51 ||s>75 && s < 76 || s>99 || s < 1){
          // 	colorPicker_ctx.fillStyle = "red";
          // }
          colorPicker_ctx.fillRect(x, y, 1, 1);             
        }
      	startS = Math.easeOutExpo(y, 100, -100, height);
      	startL = Math.linearTween(y, 100, -100, height);
      	endL = Math.easeInQuad(y, 50, -50, height); 
      }
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
    var width = 198,
  		height = 18;

    alphaPicker_ctx.clearRect(0, 0, width, height);

    var current_a = 0;
    for (var x = 0; x < width; x++) {
      alphaPicker_ctx.fillStyle = "rgba(" + current_rgb[0] + "," + current_rgb[1] + "," + current_rgb[2] + "," + current_a/100 +")";
      alphaPicker_ctx.fillRect(x, 0, 1, height);
      current_a = current_a + (100 / width);
    }
  }

  function draw_shades(){
  	set_bgc_RGBA(shade_lighter, shade(current_rgb, 35));
  	set_bgc_RGBA(shade_light, shade(current_rgb, 25));
  	set_bgc_RGBA(shade_primary, current_rgb);
  	set_bgc_RGBA(shade_dark, shade(current_rgb, -8));
  	set_bgc_RGBA(shade_darker, shade(current_rgb, -15));  	
  }

	function update_readout_display(){
		if(readout === 0 ){
			readout_rgba.style.display = "block";
			readout_hsl.style.display = "none";
			readout_hex.style.display = "none";
		} else if(readout === 1 ){
			readout_rgba.style.display = "none";
			readout_hsl.style.display = "block";
			readout_hex.style.display = "none";
		} else if(readout === 2 ){
			readout_rgba.style.display = "none";
			readout_hsl.style.display = "none";
			readout_hex.style.display = "block";
		}
	}

	// event listeners 
	readout_change.addEventListener('click', function(){
		readout++;
		if(readout>2)readout=0;
		update_readout_display();
	});


	// init
	function init(){
		update_readout_display();
		draw_colorPicker(current_h);
		draw_huePicker();
		draw_alphaPicker();
		draw_shades();
	}
	

	module.addEventListener('wheel', function(e){
		if(e.deltaY === -100 ){
			current_h = current_h  - 10;
		} 
		if(e.deltaY === 100 ){
			current_h = current_h  + 10;
		}

		if(current_h<=0){
			current_h = 1;
		}
		if(current_h>360){
			current_h = 360;
		}
		set_color_HSL(current_h, current_s, current_l);
		init();
	})

	function loop(){
		current_h = current_h  + 5;
		set_color_HSL(current_h, current_s, current_l);
		if(current_h>360){
			current_h = 1;
		}
		init();
		requestAnimationFrame(loop);
	}

	// test output
	document.getElementById('test1').appendMany(module);
	console.log(module);

	init();

	// loop();
}


