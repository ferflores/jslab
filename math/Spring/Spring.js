function Spring(){
	this.p;
	this.friction;
	var _this = null;
	this.springPoint;
	this.springPoint2;
	this.weight;
	this.k = 0.1;
	this.canvas = null;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	this.cx = 0;
	this.cy = 0;
	this.springLength = 10;
	
	this.run = function(canvas, canvasWidth, canvasHeight){
		_this = this;
		require(["../ParticlesOpt/Particle"], function(Particles) {
		_this.canvas = canvas[1];
		_this.init();
		});
	}

	this.init = function(){
		_this.canvasWidth = _this.canvas.width;
		_this.canvasHeight = _this.canvas.height;
		_this.cx = _this.canvas.width / 2;
		_this.cy = _this.canvas.height / 2;
		_this.springPoint = {x: _this.cx, y: _this.cy};
		_this.springPoint2 = {x: Math.random()*_this.cx, y: Math.random()*_this.cy};
		_this.weight = Particle.create(Math.random()*_this.canvasWidth, Math.random()*_this.canvasHeight,50,Math.random()*Math.PI*2, 0.5);
		_this.weight.radious = 20;
		_this.weight.friction = 0.9;
		_this.weight.addSpring(_this.springPoint, _this.k, _this.springLength);
		_this.weight.addSpring(_this.springPoint2, _this.k, 100);
		document.addEventListener("mousemove", function(e){
			_this.springPoint.x = e.clientX;
			_this.springPoint.y = e.clientY;
		})
		_this.draw();
	}

	this.draw = function(){
		_this.canvas.width = _this.canvas.width;

		_this.weight.update();

		layout.context.beginPath();
		layout.context.arc(_this.weight.x, _this.weight.y, _this.weight.radious, 0, Math.PI*2, false);
		layout.context.fill();

		layout.context.beginPath();
		layout.context.arc(_this.springPoint.x, _this.springPoint.y, 4, 0, Math.PI*2, false);
		layout.context.fill();

		layout.context.beginPath();
		layout.context.arc(_this.springPoint2.x, _this.springPoint2.y, 4, 0, Math.PI*2, false);
		layout.context.fill();

		layout.context.beginPath();
		layout.context.moveTo(_this.weight.x, _this.weight.y);
		layout.context.lineTo(_this.springPoint.x, _this.springPoint.y);
		layout.context.moveTo(_this.weight.x, _this.weight.y);
		layout.context.lineTo(_this.springPoint2.x, _this.springPoint2.y);
		layout.context.stroke();
		requestAnimationFrame(_this.draw);
	}
}