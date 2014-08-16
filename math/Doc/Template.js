function Name(){
	var _this = null;
	this.cx = 0;
	this.cy = 0;
	this.context = null;
	this.stopped = false;
	this.canvas = null;

	this.run = function(canvas, canvasWidth, canvasHeight){
		_this = this;
		_this.context = canvas[1].getContext("2d");
		_this.cx = canvas[1].width / 2;
		_this.cy = canvas[1].height / 2;
		_this.canvas = canvas[1];
		_this.context.webkitImageSmoothingEnabled = true;
		require(["../ParticlesOpt/Particle"], function(Particles) {
			_this.configure();
			_this.main();
		});
	}

	this.configure = function(){
		_this.erase();
		_this.bindEvents();
	}

	this.bindEvents = function(){
		document.addEventListener("mousedown", function(e){
			var mX = (e.pageX  - _this.canvas.offsetParent.offsetLeft);
			var mY = (e.pageY  - _this.canvas.offsetParent.offsetTop);
		});

		document.addEventListener("mousemove", function(e){
			var mX = (e.pageX  - _this.canvas.offsetParent.offsetLeft);
			var mY = (e.pageY  - _this.canvas.offsetParent.offsetTop);
		});
	}

	this.stop = function(){
		_this.stopped = true;
	}

	this.reset = function(){

	}

	this.resize = function(){
		_this.cx = _this.canvas.width / 2;
		_this.cy = _this.canvas.height / 2;
	}

	this.erase = function(){
		_this.canvas.width = _this.canvas.width;
		_this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
	}


	this.main = function(){
		_this.erase();
		

		if(!_this.stopped){
			requestAnimationFrame(_this.main);
		}
	}


}