ajax.dnd = {};

ajax.dnd.SimpleDragSource = function(elementId) {
	this.element = document.getElementById(elementId);
	this.dragging = false; // 현재 드래그중인지 여부 표시
	this.selected = false; // 현재 마우스다운 상태인지 표시
	this.diff = null; // 마우스 위치와 객체 위치
	
	this.mouseDown = ajax.Event.bindAsListener(this.doMouseDown, this);
	this.mouseMove = ajax.Event.bindAsListener(this.doMouseMove, this);
	this.mouseUp = ajax.Event.bindAsListener(this.doMouseUp, this);
	
	ajax.Event.addListener(
		this.element, "mousedown", this.mouseDown);
}
ajax.dnd.SimpleDragSource.prototype = {
	doMouseDown: function(e) {
		var event = window.event || e;
		if (!ajax.Event.isLeftButton(event)) return;
		
		this.selected = true;
		
		var elementXY = ajax.GUI.getXY(this.element);
		var mouseXY = ajax.Event.getMouseXY(event);
		this.diff = {
			x: mouseXY.x - elementXY.x,
			y: mouseXY.y - elementXY.y
		};
		
		ajax.Event.addListener(document, "mousemove", this.mouseMove);
		ajax.Event.addListener(document, "mouseup", this.mouseUp);
		ajax.Event.stopEvent(event);
	},
	doMouseMove: function(e) {
		if (!this.selected) return false;
		
		if (!this.dragging) {
			this.dragging = true;
			ajax.GUI.setOpacity(this.element, 0.60);
		}
		
		var event = window.event || e;
		var mouseXY = ajax.Event.getMouseXY(event);
		var newXY = {
			x: mouseXY.x - this.diff.x,
			y: mouseXY.y - this.diff.y
		}
		ajax.GUI.setXY(this.element, newXY.x, newXY.y);
		
		ajax.Event.stopEvent(event);
	},
	doMouseUp: function(e) {
		if (!this.selected) return;
		
		this.selected = false;
		this.diff = null;
		
		var event = window.event || e;
		if (this.dragging) {
			this.dragging = false;
			ajax.GUI.setOpacity(this.element, 1.0);
		}
		ajax.Event.removeListener(
			document, "mousemove", this.mouseMove);
		ajax.Event.removeListener(
			document, "mouseup", this.mouseUp);
		ajax.Event.stopEvent(event);
	}
}

ajax.dnd.DNDManager = function() {
	this.dropTargetList = new Array();
	this.dragSourceList = new Array();
	
	this.mouseDown = ajax.Event.bindAsListener(this.doMouseDown, this);
	this.mouseMove = ajax.Event.bindAsListener(this.doMouseMove, this);
	this.mouseUp = ajax.Event.bindAsListener(this.doMouseUp, this);
	
	this.selectedDragSource = null;
}
ajax.dnd.DNDManager.prototype = {
	addDropTarget: function(dropTarget) {
		this.dropTargetList[this.dropTargetList.length] = dropTarget;
	},
	removeDropTarget: function(dropTarget) {
		var newList = new Array();
		for (var i = 0 ; i < this.dropTargetList.length ; i++) {
			if (this.dropTargetList[i] != dropTarget) {
				newList[newList.length] = this.dropTargetList[i];
			}
		}
		this.dropTargetList = newList;
	},
	addDragSource: function(dragSource) {
		this.dragSourceList[this.dragSourceList.length] = dragSource;
		ajax.Event.addListener(dragSource.getElement(),
		                       "mousedown", this.mouseDown);
	},
	removeDragSource: function(dragSource) {
		var newList = new Array();
		for (var i = 0 ; i < this.dropTargetList.length ; i++) {
			if (this.dragSourceList[i] != dragSource) {
				newList[newList.length] = this.dragSourceList[i];
			} else {
				ajax.Event.removeListener(
					dragSource.getElement(),
					"mousedown", this.mouseDown);
			}
		}
		this.dragSourceList = newList;
	},
	doMouseDown: function(e) {
		var event = window.event || e;
		if (!ajax.Event.isLeftButton(event)) return;
		
		var target = ajax.Event.getTarget(event);
		
		while (target && !target.dragSource) {
			target = target.parentNode;
		}
		this.selectedDragSource = target.dragSource;
		this.selectedDragSource.selectDrag(event);
		
		ajax.Event.addListener(document, "mousemove", this.mouseMove);
		ajax.Event.addListener(document, "mouseup", this.mouseUp);
		ajax.Event.stopEvent(event);
	},
	doMouseMove: function(e) {
		if (!this.selectedDragSource) return;

		var event = window.event || e;
		if (!this.selectedDragSource.isDragging()) {
			this.selectedDragSource.startDrag();
		}
		
		this.selectedDragSource.moveDrag(event);
		
		ajax.Event.stopEvent(event);
	},
	doMouseUp: function(e) {
		if (!this.selectedDragSource) return;
		
		var dragSource = this.selectedDragSource;
		this.selectedDragSource = null;
		
		var event = window.event || e;
		
		dragSource.deselectDrag(event);
		
		if (dragSource.isDragging()) {
			var mouseXY = ajax.Event.getMouseXY(event);
			
			var dropTarget = null;
			for (var i = 0 ; i < this.dropTargetList.length ; i++) {
				var droppable = this.dropTargetList[i].checkInDropTarget(
					dragSource, mouseXY);
				if (droppable) {
					dropTarget = this.dropTargetList[i];
					break;
				}
			}
			if (dropTarget) {
				dragSource.endDrag(event);
				dropTarget.drop(dragSource);
			} else {
				dragSource.cancelDrag(event);
			}
		}
		ajax.Event.removeListener(
			document, "mousemove", this.mouseMove);
		ajax.Event.removeListener(
			document, "mouseup", this.mouseUp);
		ajax.Event.stopEvent(event);
	}
}

ajax.dnd.DropTarget = function(elementId) {
	this.element = document.getElementById(elementId);
}
ajax.dnd.DropTarget.prototype = {
	checkInDropTarget: function(dragSource, mouseXY) {
		var bounds = ajax.GUI.getBounds(this.element);
		return bounds.x <= mouseXY.x && bounds.x + bounds.width >= mouseXY.x &&
		       bounds.y <= mouseXY.y && bounds.y + bounds.height >= mouseXY.y;
	},
	drop: function(dragSource) {
		var element = dragSource.getElement();
		this.element.appendChild(element);
	}
}

ajax.dnd.DragSource = function(elementId) {
	this.element = document.getElementById(elementId);
	this.element.dragSource = this;
	this.selected = false;
	this.dragging = false;
	this.diff = null;
}
ajax.dnd.DragSource.prototype = {
	getElement: function() {
		return this.element;
	},
	selectDrag: function(event) {
		this.selected = true;
		
		var elementXY = ajax.GUI.getBounds(this.element);
		var mouseXY = ajax.Event.getMouseXY(event);
		this.diff = {
			x: mouseXY.x - elementXY.x,
			y: mouseXY.y - elementXY.y
		};
	},
	deselectDrag: function(event) {
		this.selected = false;
		this.diff = null;
	},
	startDrag: function(event) {
		this.dragging = true;
		
		var elementXY = ajax.GUI.getBounds(this.element);
		this.element.style.position = "absolute";
		ajax.GUI.setOpacity(this.element, 0.60);
	},
	isDragging: function() {
		return this.dragging;
	},
	moveDrag: function(event) {
		var mouseXY = ajax.Event.getMouseXY(event);
		var newXY = {
			x: mouseXY.x - this.diff.x,
			y: mouseXY.y - this.diff.y
		}
		ajax.GUI.setXY(this.element, newXY.x, newXY.y);
	},
	endDrag: function(event) {
		this.dragging = false;
		this.element.style.position = "";
		ajax.GUI.setOpacity(this.element, 1.0);
		this.element.parentNode.removeChild(this.element);
	},
	cancelDrag: function(event) {
		this.dragging = false;
		this.element.style.position = "";
		ajax.GUI.setOpacity(this.element, 1.0);
	}
}
