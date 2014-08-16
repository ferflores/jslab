function test(){
	var _this = null;
	this.canvas = null;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	this.context = null;
	this.cx = 0;
	this.cy = 0;
	
	this.run = function(canvas, canvasWidth, canvasHeight){
		_this = this;
		require(["../ParticlesOpt/Particle"], function(Particles) {
		_this.canvas = canvas[1];
		_this.context = _this.canvas.getContext("2d");
		_this.init();
		});
	}

	this.init = function(){
		_this.canvasWidth = _this.canvas.width;
		_this.canvasHeight = _this.canvas.height;
		_this.cx = _this.canvas.width / 2;
		_this.cy = _this.canvas.height / 2;
		
		document.addEventListener("mousemove", function(e){
			//_this.springPoint.x = e.clientX;
			//_this.springPoint.y = e.clientY;
		})
		_this.draw();
	}

	this.draw = function(){
		_this.canvas.width = _this.canvas.width;

		var cont = _this.context;

		

		requestAnimationFrame(_this.draw);
	}
}