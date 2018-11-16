var tp = {}

tp.LOADING = 0x01; // 로딩중 의미
tp.LOADED = 0x02; // 로딩완료 의미
tp.LOADING_ERROR = 0x04; // 로딩 에러

tp.PhotoItem = function(url, desc) {
	this._url = url;
	this._desc = desc;
}
tp.PhotoItem.prototype = {
	getURL: function() {
		return this._url;
	},
	getDesc: function() {
		return this._desc;
	}
}

tp.TodayPhotoSlideModel = function() {
	this.items = new Array();
	this.listeners = new Array();
}
tp.TodayPhotoSlideModel.prototype = {
	loadPhotos: function() {
		this.notify(tp.LOADING);
		
		var model = this;
		var loadFunc = function() {
			model.loadedPhotos.apply(model, arguments);
		}
		_IG_FetchContent("http://javacan.madvirus.net/ajaxbook/chap17/today_photo.jsp", loadFunc);
	},
	loadedPhotos: function(responseText) {
		if (responseText == null) {
			this.notify(tp.LOADING_ERROR);
		} else {
			var photoList = eval("("+responseText+")");
			for (var i = 0 ; i < photoList.length ; i++) {
				var url = photoList[i].url;
				var desc = photoList[i].desc;
				var photo = new tp.PhotoItem(url, desc);
				this.items[this.items.length] = photo;
			}
			this.notify(tp.LOADED);
		}
	},
	getSize: function() {
		return this.items.length;
	},
	getItem: function(idx) {
		if (this.items.length == 0) return null;
		
		return this.items[idx];
	},
	addListener: function(listener) {
		this.listeners[this.listeners.length] = listener;
	},
	removeListener: function(listener) {
		var tempListeners = new Array();
		for (var i = 0 ; i < this.listeners.length ; i++) {
			if (this.listeners[i] != listener) {
				tempListeners.add(this.listeners[i]);
			}
		}
		this.listeners = tempListeners;
	},
	notify: function(type) {
		for (var i = 0 ; i < this.listeners.length ; i++) {
			this.listeners[i].actionPerformed(type);
		}
	}
}

tp.TodayPhotoSlide = function(rotationTime, viewId) {
	this.model = new tp.TodayPhotoSlideModel();
	this.ui = new tp.TodayPhotoSlideUI(rotationTime, viewId);
	
	this.ui.setTodayPhotoSlide(this);
	
	this.model.addListener(this);
	this.model.loadPhotos();
}
tp.TodayPhotoSlide.prototype = {
	getSize: function() {
		return this.model.getSize();
	},
	getItem: function(idx) {
		return this.model.getItem(idx);
	},
	actionPerformed: function(type) {
		if (type == tp.LOADING) {
			this.ui.renderLoading();
		} else if (type == tp.LOADING_ERROR) {
			this.ui.renderLoadingError();
		} else if (type == tp.LOADED) {
			this.ui.startSlideShow();
		}
	}
}

tp.TodayPhotoSlideUI = function(rotationTime, viewId) {
	this.photoSlide = null;
	this.rotationTime = rotationTime;
	
	this.viewDiv = document.getElementById(viewId);
	this.imgTags = new Array();;
	
	this.currentIdx = -1;
	
	this.rotatePhotoTimer = null;
	this.checkLoadingTimer = null;
}
tp.TodayPhotoSlideUI.prototype = {
	setTodayPhotoSlide: function(photoSlide) {
		this.photoSlide = photoSlide;
	},
	renderLoading: function() {
		this.viewDiv.innerHTML = "Loading.....";
	},
	renderLoadingError: function() {
		this.viewDiv.innerHTML = "Loading Error !!";
	},
	startSlideShow: function() {
		if (this.photoSlide.getSize() > 0) {
			for (var i = 0 ; i < this.photoSlide.getSize() ; i++) {
				var imgTag = document.createElement("img");
				var item = this.photoSlide.getItem(i);
				imgTag.src = item.getURL();
				imgTag.alt = item.getDesc();
				
				this.imgTags[this.imgTags.length] = imgTag;
			}
			this.viewDiv.innerHTML = "";
			this.checkLoading();
		} else {
			this.viewDiv.innerHTML = "No Photos.";
		}
	},
	checkLoading: function() {
		if (this.checkLoadingTimer != null) {
			clearTimeout(this.checkLoadingTimer);
		}
		var retry = false;
		if (this.imgTags.length > 0) {
			if (this.imgTags[0].complete == false) {
				retry = true;
			}
		}
		if (retry) {
			var ui = this;
			var checkFunc = function() {
				ui.checkLoading.apply(ui);
			}
			this.checkLoadingTimer = setTimeout(checkFunc, 300);
		} else {
			this.rotatePhoto();
		}
	},
	rotatePhoto: function() {
		if (this.rotatePhotoTimer != null) {
			clearTimeout(this.rotatePhotoTimer);
		}
		this.currentIdx++;
		if (this.currentIdx == this.photoSlide.getSize()) {
			this.currentIdx = 0;
		}
		var imgTag = this.imgTags[this.currentIdx];
		var iw = imgTag.width;
		var ih = imgTag.height;
		
		var cw = getModuleHeight();
		var ch = getModuleWidth();
		
		if (iw > cw || ih > ch) {
			var wRate = cw / iw;
			var hRate = ch / ih;
			var newWidth = 0;
			var newHeight = 0;
			if (wRate >= hRate) {
				newWidth = iw * hRate * 0.95;
				newHeight = ih * hRate * 0.95;
			} else {
				newWidth = iw * wRate * 0.95;
				newHeight = ih * wRate * 0.95;
			}
			imgTag.width = newWidth;
			imgTag.height = newHeight;
		}
		var imgs = this.viewDiv.getElementsByTagName("img");
		if (imgs.length != 0) {
			var currentImg = imgs.item(0);
			currentImg.parentNode.removeChild(currentImg);
		}
		this.viewDiv.appendChild(imgTag);
		
		var ui = this;
		var rotateFunc = function() {
			ui.rotatePhoto.apply(ui);
		}
		this.rotatePhotoTimer = setTimeout(rotateFunc, this.rotationTime);
	}
}