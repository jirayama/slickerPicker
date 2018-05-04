
function El(type){
	return document.createElement(type);
}

function Els(items){
	var wrap = new El('div');
	Object.keys(arguments).forEach((key)=>{
		wrap.appendChild(arguments[key]);
	})
	return wrap;
}

Object.prototype.addClass = function(x){
	this.className = x;
	return this;
}

Object.prototype.addId = function(x){
	this.id = x;
	return this;
}

Object.prototype.addType = function(x){
	this.type = x;
	return this;
}

Object.prototype.addValue = function(x){
	this.value = x;
	return this;
}

Object.prototype.addPlaceholder = function(x){
	this.placeholder = x;
	return this;
}

Object.prototype.addName = function(x){
	this.name = x
	return this;
}

Object.prototype.addText = function(x){
	var t = document.createTextNode(x);
	this.appendChild(t);
	return this;
}

Object.prototype.addBackground = function(x){
	this.style.background = x;
	return this;
}

Object.prototype.appendMany = function(){
	Object.keys(arguments).forEach((key)=>{
		this.appendChild(arguments[key]);
	})
}

Object.prototype.addOptions = function(){
	Object.keys(arguments).forEach((key)=>{
		var opt = new El('option').addValue(arguments[key]).addText(arguments[key]);
		// opt.addValue(arguments[key]).addText(arguments[key])
		this.appendChild(opt);
	})
}

function DOM_tableRow(items){
	var tr = new El('tr');
	Object.keys(arguments).forEach((key)=>{
		var td = new El('td');
		if (typeof arguments[key] === 'string') {
			td.addText(arguments[key]);
		} else {
			td.appendChild(arguments[key]);
		}		
		tr.appendChild(td);
	})
	return tr;
}

function DOM_tableHeader(items){
	var tr = new El('tr');
	Object.keys(arguments).forEach((key)=>{
		var th = new El('th').addText(arguments[key]);
		tr.appendChild(th);
	})
	return tr;
}

function DOM_tableLtoR(items){
	var tr = new El('tr');
	Object.keys(arguments).forEach((key, index)=>{
		if (index === 0){
			var el = new El('th').addText(arguments[key]);
		} else {
			if (typeof arguments[key] === 'string'){
				var el = new El('td').addText(arguments[key]);
			} else {
				var el = new El('td'),
						div = new El('div').addText(arguments[key])
				el.appendChild(div)
			}
		}		
		tr.appendChild(el);
	})
	return tr;
}

function DOM_list(items){
	var ul = new El('ul');
	Object.keys(arguments).forEach((key)=>{
		var li = new El('li');
		if (typeof arguments[key] === 'string') {
			li.addText(arguments[key]);
		} else {
			li.appendChild(arguments[key]);
		}		
		ul.appendChild(li);
	})
	return tr;
}
