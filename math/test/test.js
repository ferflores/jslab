function Test(){
	this.p;
	this.friction;
	var _this = null;
	this.springPoint;
	this.weight;
	this.k = 0.2;
	this.canvas = null;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	this.cx = 0;
	this.cy = 0;
	
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
		weight = Particle.create(Math.random()*_this.canvasWidth, Math.random()*_this.canvasHeight,50,Math.random()*Math.PI*2);
		weight.radious = 20;
		weight.friction = 0.9;
		_this.draw();
	}

	this.draw = function(){
		//layout.context.translate(layout.width*0.5,layout.height*0.6);
		//Pendiente: video 17 al final
		_this.canvas.width = _this.canvas.width;
		var distance = springPoint.subtract(weight.position);
		var springForce = distance.multiply(k);

		weight.velocity.addTo(springForce);
		weight.update();

		layout.context.beginPath();
		layout.context.arc(weight.position.getX(), weight.position.getY(), weight.radious, 0, Math.PI*2, false);
		layout.context.fill();

		layout.context.beginPath();
		layout.context.arc(springPoint.getX(), springPoint.getY(), 4, 0, Math.PI*2, false);
		layout.context.fill();

		layout.context.beginPath();
		layout.context.moveTo(weight.position.getX(), weight.position.getY());
		layout.context.lineTo(springPoint.getX(), springPoint.getY());
		layout.context.stroke();
		requestAnimationFrame(draw);
	}
}