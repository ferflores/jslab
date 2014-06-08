function Solar(){
	var _this = null;
	this.canvas = null;
	var context = null;
	var cx = 0;
	var cy = 0;
	this.centerRatio = 10;
	this.outsideRatio = 150;
	this.lines = [];
	this.increment = 1;
	this.incMouse = 5;

	this.run = function(canvas, canvasWidth, canvasHeight){
		_this = this;
		_this.canvas = canvas;
		_this.context = canvas.getContext("2d");
		_this.context.save();
		_this.cx = canvas.width / 2;
		_this.cy = canvas.height / 2;
		_this.configure();
		_this.addLine();
		_this.drawLines();
		_this.context.webkitImageSmoothingEnabled = true;
		_this.context.translate(.5,.5);
		setInterval(_this.updateValues, 1);
	}

	this.configure = function(){
		_this.erase();
		_this.drawCenter(_this.centerRatio);
		_this.drawCenter(_this.outsideRatio);
		_this.canvas.addEventListener("mousemove", function(e){
			_this.incMouse = Math.sqrt(
					Math.pow((e.pageX  - _this.canvas.offsetLeft) - _this.cx, 2) 
					+ Math.pow((e.pageY - _this.canvas.offsetTop) - _this.cy, 2)
				) ;
		});
	}

	this.addLine = function(){
		var centerPoint = _this.getRandomCirclePoint(_this.centerRatio);
		var outPoint = _this.getRandomOutPoint(centerPoint.angle)
		var l1 = new _this.Line(centerPoint.rx, centerPoint.ry, outPoint.rx, outPoint.ry, 
		centerPoint.angle, outPoint.angle);
		_this.lines.push(l1);
	}

	this.drawLines = function(){
		_this.context.lineWidth = 1;
    	_this.context.strokeStyle = "E8E8E3";
		for(var x = 0; x< _this.lines.length; x++){
			var initPoint = {x:_this.lines[x].startX, y:_this.lines[x].startY};
			var endPoint = {x:_this.lines[x].endX, y:_this.lines[x].endY};
			_this.context.moveTo(initPoint.x, initPoint.y);

			var angles = [_this.lines[x].endAngle - .05, _this.lines[x].endAngle + .05];
			var distance = 0;
			var inc = 1;
			var newRatio = _this.centerRatio + 2;
			if(_this.incMouse < 1) {
				_this.incMouse = 1;
			}
			if(_this.incMouse > 20) {
				_this.incMouse = 20;
			}
			while(inc < _this.incMouse)
			{
				newRatio += distance/2;
				var angle = angles[Math.floor(Math.random()*2)];
				var newPoint = {x:Math.cos(angle)*newRatio+_this.cx,
					y:Math.sin(angle)*newRatio+_this.cy};
				_this.context.lineTo(newPoint.x, newPoint.y);
				distance = Math.sqrt(Math.pow(endPoint.x - newPoint.x, 2) +Math.pow(endPoint.y - (newPoint.y),2));
				inc ++;
			}
			_this.context.lineTo(endPoint.x, endPoint.y);
			
		}
		
	}

	this.drawCenter = function(ratio){
    	_this.context.lineWidth = 1;
    	_this.context.strokeStyle = "white";
    	var angle = 0;
    	_this.context.moveTo(Math.cos(angle)*ratio + _this.cx, Math.sin(angle)*ratio+_this.cy);
    	while(angle <2*Math.PI){
			angle += .01;
			_this.context.lineTo(Math.cos(angle)*ratio + _this.cx, Math.sin(angle)*ratio+_this.cy);
		}

		_this.context.stroke();
	}

	this.getRandomCirclePoint = function(ratio){
		var angle = Math.random() * 2 * Math.PI;
		var rx = Math.cos(angle)*ratio + _this.cx;
		var ry = Math.sin(angle)*ratio + _this.cy;
		return {rx: rx, ry:ry, angle:angle}
	}

	this.getRandomOutPoint = function(angle){
		var randomOutAngle = angle + (Math.random()*2*(Math.random()*1.5 + -.5));
		return {rx:Math.cos(randomOutAngle) * _this.outsideRatio + _this.cx,
				ry:Math.sin(randomOutAngle) * _this.outsideRatio + _this.cy,
				angle: randomOutAngle}
	}

	this.erase = function(){
		_this.canvas.width = _this.canvas.width;
		_this.context.fillStyle = "#000000";
		_this.context.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
		
	}

	this.Line = function(x1, y1, x2, y2, startAngle, endAngle){
		this.startX = x1;
		this.startY = y1;
		this.endX = x2;
		this.endY = y2;
		this.startAngle = startAngle;
		this.endAngle = endAngle;
		this.inRange = {min: this.startAngle -.5, max: this.startAngle + .5};
		this.outRange = {min: this.endAngle -.5, max: this.endAngle + .5};;
	}

	this.updateValues = function(){
		_this.increment ++;
		if(_this.increment>10){
			_this.increment = 1;
			if(_this.lines.length<1000){
				_this.addLine();
			}
			
		}

		for(var x = 0; x< _this.lines.length; x++){
			var posOrNeg = [-1,1];
			var polarity = posOrNeg[Math.floor(Math.random()*2)];
			_this.lines[x].startAngle += .1 * polarity;
			if(_this.lines[x].startAngle < _this.lines[x].inRange.min)
				_this.lines[x].startAngle += .1;
			if(_this.lines[x].startAngle > _this.lines[x].inRange.max)
				_this.lines[x].startAngle -= .1;
			_this.lines[x].startX = Math.cos(_this.lines[x].startAngle) * _this.centerRatio + _this.cx;
			_this.lines[x].startY = Math.sin(_this.lines[x].startAngle) * _this.centerRatio + _this.cy;
			_this.lines[x].endAngle += .01 * polarity;
			if(_this.lines[x].endAngle < _this.lines[x].outRange.min)
				_this.lines[x].endAngle += .1;
			if(_this.lines[x].endAngle > _this.lines[x].outRange.max)
				_this.lines[x].endAngle -= .1;
			_this.lines[x].endX = Math.cos(_this.lines[x].endAngle) * _this.outsideRatio + _this.cx;
			_this.lines[x].endY = Math.sin(_this.lines[x].endAngle) * _this.outsideRatio + _this.cy;
		}
		_this.erase();
		_this.configure();
		_this.drawLines();
		_this.context.stroke();
	}
}

window.onload = function(){
	chaos.init("Solar");

}