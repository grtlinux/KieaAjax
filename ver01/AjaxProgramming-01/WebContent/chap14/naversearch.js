var naverOpenAPIKey = "";

ResultView = function(title, td) {
	this.td = td;
	var html = 
		"<div class='resultBox'>"+
			"<div class='title'>"+title+" 검색</div>"+
			"<div class='result'></div>"+
		"</div>";
	this.td.innerHTML = html;
	this.result = this.td.firstChild.lastChild;
}
ResultView.prototype = {
	renderReady: function() {
		this.result.innerHTML = "검색 중입니다...";
	},
	renderResult: function(req) {
		if (req.readyState == 4) {
			if (req.status != 200) {
				this.result.innerHTML = "<span class='error'>에러 발생:"+
					req.status + "</span>";
			} else {
				this.renderFromXML(req.responseXML);
			}
		}
	},
	renderFromXML: function(xmlDoc) {
		this.result.innerHTML = "";
		var items = xmlDoc.getElementsByTagName("item");
		for (var i = 0 ; i < items.length ; i++) {
			var item = items.item(i);
			
			var titleNode = item.getElementsByTagName("title").item(0);
			var title = (titleNode.firstChild) ? titleNode.firstChild.nodeValue : "";
			
			var linkNode = item.getElementsByTagName("link").item(0);
			var link = (linkNode.firstChild) ? linkNode.firstChild.nodeValue : "";
			
			var descNode = item.getElementsByTagName("description").item(0);
			var desc = (descNode.firstChild) ? descNode.firstChild.nodeValue : "";
			
			var titleDiv = document.createElement("div");
			var titleHtml = "<a href='"+link+"' target='_new'>"+
			                title+"</a>";
			titleDiv.className = "itemTitle";
			titleDiv.innerHTML = titleHtml;
			
			var descDiv = document.createElement("div");
			descDiv.className = "itemDesc";
			descDiv.innerHTML = desc;
			
			this.result.appendChild(titleDiv);
			this.result.appendChild(descDiv);
		}
	}
}

NaverSearch = function(options) {
	this.options = options;
	
	this.queryInput = null;
	this.kinCheckBox = null;
	this.blogCheckBox = null;
	this.webkrCheckBox = null;
	
	this.resultTable = null;
	
	this.resultView = {
		kin: null, blog: null, webkr: null
	};
	this.titles = {
		kin: '지식인', blog: '블로그', webkr: '웹'
	};
	this.tdIndex = {
		kin: 0, blog: 1, webkr: 2
	};
	
	this.searched = false;
	this.query = null;
	this.init();
}
NaverSearch.prototype = {
	init: function() {
		this.queryInput = 
			document.getElementById(this.options.queryInput);
		
		var searchBtn = 
			document.getElementById(this.options.searchButton);
		ajax.Event.addListener(searchBtn, "click",
			ajax.Event.bindAsListener(this.doClickOnSearchBtn, this));
		
		this.kinCheckBox = 
			document.getElementById(this.options.checkKin);
		ajax.Event.addListener(this.kinCheckBox, "click", 
			ajax.Event.bindAsListener(this.doCheck, this));

		this.blogCheckBox = 
			document.getElementById(this.options.checkBlog);
		ajax.Event.addListener(this.blogCheckBox, "click", 
			ajax.Event.bindAsListener(this.doCheck, this));

		this.webkrCheckBox = 
			document.getElementById(this.options.checkWebkr);
		ajax.Event.addListener(this.webkrCheckBox, "click", 
			ajax.Event.bindAsListener(this.doCheck, this));
		
		this.resultTable = document.getElementById(this.options.resultTable);
	},
	doClickOnSearchBtn: function() {
		if (this.queryInput.value == '') {
			alert("검색어를 입력하세요");	
		} else {
			if (this.kinCheckBox.checked ||
			        this.blogCheckBox.checked ||
			        this.webkrCheckBox.checked) {
				this.searched = true;
				this.query = this.queryInput.value;
				
				if (this.kinCheckBox.checked) {
					this.startSearch('kin');
				}
				if (this.blogCheckBox.checked) {
					this.startSearch('blog');
				}
				if (this.webkrCheckBox.checked) {
					this.startSearch('webkr');
				}
			} else {
				alert("검색 항목을 선택하세요.");
			}
		}
	},
	startSearch: function(type) {
		if (this.resultView[type] == null) {
			this.resultView[type] = this.makeResultView(type);
		}
		this.resultView[type].renderReady();
		this.sendKeyword(type);
	},
	makeResultView: function(type) {
		var tr = this.resultTable.rows.item(0);
		
		var idx = this.tdIndex[type];
		if (idx > tr.cells.length - 1) idx = -1;
		
		var td = tr.insertCell(idx);
		td.vAlign = "top";
		var resultView = new ResultView(this.titles[type], td);
		return resultView;
	},
	sendKeyword: function(type) {
		if (this.resultView[type] != null) {
			var url = "naver_proxy.jsp";
			var params = "key="+naverOpenAPIKey+
				"&query="+encodeURIComponent(this.query)+
				"&display=10&start=1&target="+type+"&sort=sim";
			
			new ajax.xhr.Request(url, params, 
				this.resultView[type].renderResult, "GET",
				this.resultView[type]);
		}
	},
	doCheck: function(e) {
		var event = window.event || e;
		var target = ajax.Event.getTarget(event);
		var type = null;
		if (target == this.kinCheckBox) {
			type = 'kin';
		} else if (target == this.blogCheckBox) {
			type = 'blog';
		} else if (target == this.webkrCheckBox) {
			type = 'webkr';
		}
		if (target.checked) {
			if (this.resultView[type] == null && this.searched) {
				this.startSearch(type);
			}
		} else {
			if (this.resultView[type] != null && this.searched) {
				this.closeResultView(type);
			}
		}
	},
	closeResultView: function(type) {
		var td = this.resultView[type].td;
		td.parentNode.removeChild(td);
		this.resultView[type] = null;
	}
}