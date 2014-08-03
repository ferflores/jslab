function test(){
	this.p;
	this.friction;
	var _this = null;
	this.springPoint;
	this.weight;
	this.k = 0.1;
	this.canvas = null;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	this.cx = 0;
	this.cy = 0;
	this.springLength = 100;
	
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
		_this.weight = Particle.create(Math.random()*_this.canvasWidth, Math.random()*_this.canvasHeight,50,Math.random()*Math.PI*2, 0.5);
		_this.weight.radious = 20;
		_this.weight.friction = 0.9;
		document.addEventListener("mousemove", function(e){
			_this.springPoint.x = e.clientX;
			_this.springPoint.y = e.clientY;
		})
		_this.draw();
	}

	this.draw = function(){
		//layout.context.translate(layout.width*0.5,layout.height*0.6);
		//Pendiente: video 17 al final
		_this.canvas.width = _this.canvas.width;
		var dx = _this.springPoint.x - _this.weight.x;
		var dy = _this.springPoint.y - _this.weight.y;
		var distance = Math.sqrt(dx*dx + dy*dy);
		var springForce = (distance - _this.springLength) * _this.k;
		var ax = dx / distance * springForce;
		var ay = dy / distance * springForce;

		_this.weight.x+= ax;
		_this.weight.y+= ay;
		/*var distance = springPoint.subtract(weight.position);
		var springForce = distance.multiply(k);

		weight.velocity.addTo(springForce);*/
		_this.weight.update();

		layout.context.beginPath();
		layout.context.arc(_this.weight.x, _this.weight.y, _this.weight.radious, 0, Math.PI*2, false);
		layout.context.fill();

		layout.context.beginPath();
		layout.context.arc(_this.springPoint.x, _this.springPoint.y, 4, 0, Math.PI*2, false);
		layout.context.fill();

		layout.context.beginPath();
		layout.context.moveTo(_this.weight.x, _this.weight.y);
		layout.context.lineTo(_this.springPoint.x, _this.springPoint.y);
		layout.context.stroke();
		requestAnimationFrame(_this.draw);
	}
}