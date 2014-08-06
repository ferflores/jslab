function Colors(){
	var _this = null;
	this.canvas = null;
	this.context = null;
	this.cx = 0;
	this.cy = 0;
	this.circles = [];
	this.currentAngle = 0;
	this.stopped = false;

	this.run = function(canvas, canvasWidth, canvasHeight){
		_this = this;
		_this.canvas = canvas[1];
		_this.context = canvas[1].getContext("2d");
		_this.cx = canvas[1].width / 2;
		_this.cy = canvas[1].height / 2;
		_this.configure();
	}

	this.configure = function(){
		require(["../Utils/Color/Hex","../Vectors/Vector","../Particles/Particle"], function(ColorUtil) {
			_this.context.fillStyle = "#000000";
			_this.context.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
			_this.createCircle();
			_this.main();
		});
	}

	this.stop = function(){
		_this.stopped = true;
	}

	this.reset =function(){
		
	}

	this.resize = function(){
		_this.cx = _this.canvas.width / 2;
		_this.cy = _this.canvas.height / 2;
	}

	this.erase = function(){
		
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
			if(circle.particle.position.getY()< 0 - circle.radious || circle.particle.position.getY()> (_this.canvas.height+circle.radious)
				|| circle.particle.position.getX() < 0 - circle.radious || circle.particle.position.getX()> (_this.canvas.width+circle.radious) ){
				_this.circles.splice(i,1);
			}
		};
	}

	this.createCircle = function(){
		var circle = new Circle();
		circle.radious = 30;
		circle.color = _this.getRandomColor();
		circle.nextColor = _this.getRandomColor();
		circle.particle = Particle.create(_this.cx, _this.cy, 5, _this.currentAngle,0.02);

		_this.circles.push(circle);
		_this.currentAngle+=0.1;
		if(_this.currentAngle>Math.PI*2){
			_this.currentAngle = 0;
		}
	}

	this.main = function(){
		_this.erase();
		_this.drawCircles();

		_this.createCircle();
		_this.counter = 0;

		if(!_this.stopped){
			requestAnimationFrame(_this.main);
		}
	}

	function Circle(){
		this.color = "#FFFFFF";
		this.nextColor = "#000000";
		this.radious = 0;
		this.particle = null;

		this.draw = function(context){
			var x = this.particle.position.getX();
			var y = this.particle.position.getY();

			this.particle.update();

			context.fillStyle = this.color;
			context.beginPath();
			context.moveTo(x, y);
			context.arc(x, y, this.radious, 0, 2 * Math.PI, false);
			context.closePath();
			context.fill();

			this.radious += 0.3;

			if(this.color.toLowerCase() != this.nextColor.toLowerCase()){
				this.color = Hex.fadeToColor(this.color, this.nextColor, 5);
			}else{
				this.nextColor = _this.getRandomColor();
			}
		}
	}
	
}