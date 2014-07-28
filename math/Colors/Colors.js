function Colors(){
	var _this = null;
	this.canvas = null;
	this.context = null;
	this.cx = 0;
	this.cy = 0;
	this.circles = [];
	this.counter = 0;

	this.run = function(canvas, canvasWidth, canvasHeight){
		_this = this;
		_this.canvas = canvas[1];
		_this.context = canvas[1].getContext("2d");
		_this.cx = canvas[1].width / 2;
		_this.cy = canvas[1].height / 2;
		_this.configure();
	}

	this.configure = function(){
		require(["../Utils/Color/Hex"], function(ColorUtil) {
			_this.context.fillStyle = "#000000";
			_this.context.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
			_this.createCircle();
			_this.main();
		});
	}

	this.stop = function(){

	}

	this.reset =function(){
		
	}

	this.resize = function(){
		_this.cx = _this.canvas.width / 2;
		_this.cy = _this.canvas.height / 2;
	}

	this.erase = function(){
		/*_this.canvas.width = _this.canvas.width;
		_this.context.fillStyle = "#000000";
		_this.context.fillRect(0, 0, _this.canvas.width, _this.canvas.height);*/
		
	}

	this.getRandomColor = function(){
		var colorArray = [Math.round(Math.random()*255), Math.round(Math.random()*255),Math.round(Math.random()*255)];

		return Hex.rgbIntArrayToHex(colorArray);
	}

	this.hexToInt = function(){

	}

	this.getRed = function(hex){

	}

	this.drawCircles = function(){
		for (var i = 0; i < _this.circles.length; i++) {
			var circle = _this.circles[i];
			circle.draw(_this.context);
			if(circle.spiralRadious > (_this.canvas.width > _this.canvas.height ? _this.canvas.width : _this.canvas.height)){
				_this.circles.splice(i,1);
			}
		};
	}

	this.createCircle = function(){
		var circle = new Circle();
		circle.radious = 30;
		circle.color = _this.getRandomColor();
		circle.nextColor = _this.getRandomColor();
		circle.x = _this.cx;
		circle.y = _this.cy;
		_this.circles.push(circle);
	}

	this.main = function(){
		_this.erase();
		_this.drawCircles();

		_this.counter++;
		if(_this.counter>500){
			_this.createCircle();
			_this.counter = 0;
		}

		requestAnimationFrame(_this.main);
	}

	function Circle(){
		this.color = "#FFFFFF";
		this.nextColor = "#000000";
		this.x = 0;
		this.y = 0;
		this.radious = 0;
		this.angle = 0;
		this.spiralRadious = 0;

		this.draw = function(context){
			var x = Math.cos(this.angle) * this.spiralRadious + _this.cx;
			var y = Math.sin(this.angle) * this.spiralRadious + _this.cy;

			context.fillStyle = this.color;
			context.beginPath();
			context.moveTo(x, y);
			context.arc(x, y, this.radious, 0, 2 * Math.PI, false);
			context.closePath();
			context.fill();

			if(this.angle >= Math.PI*2){
				this.angle = 0;
			}

			var distance = Math.sqrt((y-_this.cy) * (y -_this.cy) + (x-_this.cx) * (x -_this.cx));

			this.angle += 0.08;
			this.spiralRadious += 0.08
			this.radious += 0.01;

			if(this.color.toLowerCase() != this.nextColor.toLowerCase()){
				this.color = Hex.fadeToColor(this.color, this.nextColor, 1);
			}else{
				this.nextColor = _this.getRandomColor();
			}
		}
	}
	
}