function FractalTree(){

	this.maxDepth = 0;
	var angles = [];
	var baseSize = 0;
	var scaleFactor = 0;
	var _this = null;
	var canvasRef = null;
	var canvasContext = null;
	this.lineThickness = 5;

	this.run = function(canvas, canvasWidth, canvasHeight){
		_this = this;
		_this.baseSize = canvas.height * .8;
		_this.canvasRef = canvas;
		_this.canvasContext = _this.canvasRef.getContext("2d");
		_this.canvasRef.style.background = "#F7F7F7";

		_this.draw();

		_this.canvasRef.addEventListener("click", function(event){
			if(_this.maxDepth < 15){
				_this.maxDepth += 1;
				_this.draw();
			}
		});
	}

	this.draw = function(){
		_this.canvasContext.clearRect(0, 0, _this.canvasRef.width, _this.canvasRef.height);

		_this.canvasContext.save();
		_this.canvasContext.translate(_this.canvasRef.width*0.5, _this.canvasRef.height*0.9);
		_this.drawTree(_this.maxDepth, _this.baseSize, 0, _this.lineThickness, "0F4A0C");
		_this.canvasContext.restore();
	}

	this.drawTree = function(depth , size, angle, lineWidth, color){


		_this.angles = [-Math.PI/2 * Math.random(), Math.PI/2 * Math.random()];
		_this.scaleFactor = .55 + Math.random() * .25;
		_this.canvasContext.save();
		_this.canvasContext.rotate(angle);
		_this.canvasContext.strokeStyle = color
		_this.canvasContext.beginPath();
		_this.canvasContext.lineWidth = lineWidth;
		_this.canvasContext.moveTo(0,0);
		_this.canvasContext.lineTo(0, -size*(1 - _this.scaleFactor));
		_this.canvasContext.stroke();
		_this.canvasContext.translate(0,-size*(1 - _this.scaleFactor));

		var newLineThickness = lineWidth - 1 < 1 ? 1 : lineWidth - 1;
		var newColor = _this.colorLuminance(color, .2);

		if(depth === 0){
			_this.drawBranch(size * _this.scaleFactor, _this.angles[0], depth, newLineThickness, newColor);
			_this.drawBranch(size * _this.scaleFactor , _this.angles[1], depth, newLineThickness), newColor;
		}else{
			_this.drawTree(depth-1, size * _this.scaleFactor, _this.angles[0], newLineThickness, newColor);
			_this.drawTree(depth-1, size * _this.scaleFactor, _this.angles[1], newLineThickness, newColor);
		}

		_this.canvasContext.restore();

	}

	this.drawBranch = function(size, angle, depth, lineWidth, color){

		_this.canvasContext.save();
		_this.canvasContext.rotate(angle);
		_this.canvasContext.strokeStyle = color;
		_this.canvasContext.lineWidth =  lineWidth;
		_this.canvasContext.beginPath();
		_this.canvasContext.moveTo(0,0);
		_this.canvasContext.lineTo(0, -size);
		_this.canvasContext.stroke();
		_this.canvasContext.restore();
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