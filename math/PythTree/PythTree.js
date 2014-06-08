function PythTree(){
	var _this = null;
	this.canvas = null;
	this.context = null;
	this.cx = 0;
	this.cy = 0;
	this.maxDepth = 10;
	this.mouseDistance = 100;
	this.baseSize = 0;
	this.angle = Math.PI / 4;

	this.run = function(canvas, canvasWidth, canvasHeight){
		_this = this;
		_this.canvas = canvas;
		_this.context = canvas.getContext("2d");
		_this.context.save();
		_this.cx = canvas.width / 2;
		_this.cy = canvas.height / 2;
		_this.configure();
		_this.draw();
	}

	this.configure = function(){
		_this.erase();
		_this.baseSize = _this.canvas.height * .2;
		_this.canvas.addEventListener("mousemove", function(e){
			_this.mouseDistance = Math.sqrt(
				Math.pow((e.pageX - _this.canvas.offsetLeft) - _this.cx, 2)
				+Math.pow((e.pageY - _this.canvas.offsetTop) - _this.cy, 2));

			if(e.pageX - _this.canvas.offsetLeft > _this.cx && _this.angle < Math.PI / 3)
				_this.angle += 0.015;
			if(e.pageX - _this.canvas.offsetLeft < _this.cx && _this.angle > Math.PI / 5)
				_this.angle -= 0.015;

			_this.draw();
		});
	}

	
	this.erase = function(){
		_this.canvas.width = _this.canvas.width;
		_this.context.fillStyle = "#000000";
		_this.context.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
		
	}

	this.draw = function() {
		_this.erase();
		_this.context.lineWidth = 2;
		_this.context.save();
		_this.context.translate(_this.canvas.width * 0.5, _this.canvas.height * 0.9);

		_this.context.translate(-_this.baseSize / 2, 0);
		var depth = _this.mouseDistance/60;
		if(depth > 16)
			depth = 16
		if(depth < 1)
			depth = 0

		_this.drawTree(depth , _this.baseSize, "0C3B00");
		_this.context.restore();		
	}

	this.drawTree = function(depth, size, color) {
		_this.context.save();

		var newColor = _this.colorLuminance(color, .3);
		_this.drawSquare(size, newColor);

		var branch0Size = size * Math.cos(_this.angle);
		var branch1Size = size * Math.sin(_this.angle);

		_this.context.translate(0, -size);
		_this.context.rotate(-_this.angle);

		

		if(depth <= 0) {
			_this.drawSquare(branch0Size, newColor);
		}
		else {
			_this.drawTree(depth - 1, branch0Size, newColor);
		}

		_this.context.translate(branch0Size, 0);
		_this.context.rotate(Math.PI / 2);
		if(depth <= 0) {
			_this.drawSquare(branch1Size,newColor);
		}
		else {
			_this.drawTree(depth - 1, branch1Size, newColor);
		}
		_this.context.restore();
	}

	this.drawSquare = function(size, color) {
		_this.context.lineWidth = 1;

    	_this.context.fillStyle = color;
    	_this.context.shadowColor = '#111';
      	_this.context.shadowBlur = 10;
      	_this.context.shadowOffsetX = 5;
      	_this.context.shadowOffsetY = 5;
		_this.context.beginPath();
		_this.context.rect(0, 0, size, -size);
		_this.context.fill();
	}

	this.colorLuminance = function(hex, lum) {

		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		if (hex.length < 6) {
			hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		}
		lum = lum || 0;

		var rgb = "#", c, i;
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i*2,2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ("00"+c).substr(c.length);
		}

		return rgb;
	}
}

/*window.onload = function(){
	chaos.init("PythTree");

}*/