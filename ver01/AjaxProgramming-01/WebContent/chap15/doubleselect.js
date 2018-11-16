DoubleSelect = function(selId1, selId2, url, optionParam) {
	this.select1 = document.getElementById(selId1);
	this.select2 = document.getElementById(selId2);
	
	this.url = url;
	this.optionParam = (optionParam == null) ? null : optionParam;
	
	ajax.Event.addListener(this.select1, "change", 
		ajax.Event.bindAsListener(this.doChange, this));
}
DoubleSelect.prototype = {
	doChange: function(e) {
		if (this.select1.value != '') {
			var param = "value="+encodeURIComponent(this.select1.value);
			if (this.optionParam != null) {
				param += this.optionParam;
			}
			var thisObj = this;
			new ajax.xhr.Request(this.url, param, this.loaded, "GET", thisObj);
		} else {
			this.clearSelect2();
		}
	},
	clearSelect2: function() {
		this.select2.length = 0;
	},
	loaded: function(req) {
		if (req.readyState == 4) {
			if (req.status == 200) {
				var optionList = eval("(" + req.responseText + ")");
				this.initSelect2(optionList);
			} else {
				alert("에러 발생: "+req.status);
			}
		}
	},
	initSelect2: function(optionList) {
		this.clearSelect2();

		var optionArray = new Array();
		
		var option = document.createElement("option");
		option.text = "선택하세요";
		option.value = "";
		optionArray[optionArray.length] = option;
		
		option = document.createElement("option");
		option.text = "-----";
		option.value = "";
		optionArray[optionArray.length] = option;
		
		for (var i = 0 ; i < optionList.length ; i++) {
			option = document.createElement("option");
			option.text = optionList[i].text;
			option.value = optionList[i].value;
			optionArray[optionArray.length] = option;
		}
		for (var i = 0 ; i < optionArray.length ; i++) {
			try {
				this.select2.add(optionArray[i], null);
			} catch(e) {
				this.select2.add(optionArray[i], -1);
			}
		}
	}
}