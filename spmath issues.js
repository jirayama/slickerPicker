function sp(opt) {
	// state
	opt = opt || {};

	var readout = 0,
			current_rgba = opt.rbga || [],
			current_a = 1,
			shades = {
				lighter: [],
				light: [],
				primary: [],
				dark: [],
				darker: []
			};

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

	//easing
	Math.easeOutCubic = function (t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	};

	Math.easeInOutSine = function (t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	};
Math.easeInExpo = function (t, b, c, d) {
	return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
};

Math.easeOutExpo = function (t, b, c, d) {
	return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
};


	// actions
	function draw_colorPicker(h) {
      h = h || hue;
      var s = 0,
          l = 100,
          endL = 50,
          startL = 100,
          startS = 0,
          endS = 100,
          x = 0,
          y = 0,
          color;

      colorPicker_ctx.clearRect(0, 0, 200, 130);

      for (y = 0; y <= 130; y++) {
        for (x = 0; x <= 200; x++) {
          color = hsl2rbg(h, s, l);
          colorPicker_ctx.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
          if(l>25 && l<26 || l>50 && l<51 || l>75 && l<76) {
          	colorPicker_ctx.fillStyle = "yellow";
          } else if(s>25 && s<26 || s>50 && s<51 || s>75 && s<76){
          	colorPicker_ctx.fillStyle = "red";
          }
          colorPicker_ctx.fillRect(x, y, 1, 1);
          s = s + ((endS - startS)/200);
          l = l - ((startL - endL)/200);
        }
        
        endL = endL - (50/130);
        startL = startL - (100/130);
        l = startL;
        console.log(l); 
        s = 0;
      }
    }
	function draw_huePicker() {
    var h = 1,
        color;
    for (var x = 0; x <= 200; x++) {
      color = hsl2rbg(h, 100, 50);
      huePicker_ctx.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
      huePicker_ctx.fillRect(x, 0, 1, 18);
      h = h + (360 / 200);
    }
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
	update_readout_display();
	draw_colorPicker(320);
	draw_huePicker();

	// test output
	document.getElementById('test1').appendMany(module);
	console.log(module);
}


