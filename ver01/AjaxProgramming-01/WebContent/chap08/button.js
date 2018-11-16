InvalidButton = function(elementId) {
	this.element = document.getElementById(elementId);
	ajax.Event.addListener(this.element, "mouseover", this.doMouseOver);
	ajax.Event.addListener(this.element, "mouseout", this.doMouseOut);
}
InvalidButton.prototype = {
	doMouseOver: function(e) {
		this.element.style.background = '#999';
	},
	doMouseOut: function(e) {
		this.element.style.background = '#fff';
	}
}

ValidButton = function(elementId) {
	this.element = document.getElementById(elementId);
	var btn = this;
	var overFunc = function() {
		btn.doMouseOver.apply(btn, arguments);
	}
	var outFunc = function() {
		btn.doMouseOut.apply(btn, arguments);
	}
	/*
	var overFunc = ajax.Event.bindAsListener(this.doMouseOver, this);
	var outFunc = ajax.Event.bindAsListener(this.doMouseOut, this);
	*/
	ajax.Event.addListener(this.element, "mouseover", overFunc);
	ajax.Event.addListener(this.element, "mouseout", outFunc);
}
ValidButton.prototype = {
	doMouseOver: function(e) {
		this.element.style.background = '#999';
	},
	doMouseOut: function(e) {
		this.element.style.background = '#fff';
	}
}
