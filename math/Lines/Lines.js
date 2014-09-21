function Lines(){
	var _this = null;
	this.cx = 0;
	this.cy = 0;
	this.context = null;
	this.stopped = false;
	this.canvas = null;
	this.elements = [];

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

		var lineBoy = new Lines.LineBoy();
		var lineBoyParticle = Particle2.create(100, 100, 0, 0);
		lineBoy.create(lineBoyParticle, _this.canvas);
		_this.elements.push(lineBoy);
	}

	this.drawElements = function(){
		for (var i = 0; i < _this.elements.length; i++) {
			_this.elements[i].draw();
		};
	}

	this.bindEvents = function(){
		// document.addEventListener("mousedown", function(e){
		// 	var mX = (e.pageX  - _this.canvas.offsetParent.offsetLeft);
		// 	var mY = (e.pageY  - _this.canvas.offsetParent.offsetTop);
		// });

		// document.addEventListener("mousemove", function(e){
		// 	var mX = (e.pageX  - _this.canvas.offsetParent.offsetLeft);
		// 	var mY = (e.pageY  - _this.canvas.offsetParent.offsetTop);
		// });
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
		
		_this.drawElements();

		// _this.context.stroke();

		if(!_this.stopped){
			requestAnimationFrame(_this.main);
		}
	}


}

// *** Line Boy ***

Lines.LineBoy = function(){

	this.position = null;
	this.canvas = null;
	this.context = null;
	this.state = Lines.LineBoyStates.Stopped;
	this.direction = 1;
	this.height = 0;
	this.width = 0;

	this.create = function(position, canvas){

		this.position = position;
		this.canvas = canvas;
		this.context = canvas.getContext("2d");

		this.height = canvas.height / 15;
		this.width = this.height - (this.height / 5);

	}

	this.draw = function(){
		var c = this.context;
		var pos = this.position;

		c.save();

		c.translate(pos.x, pos.y);

		c.beginPath();
		c.strokeStyle = "#FFFFFF";

		// Draw head
		var headRadious = 10;
		var headPos = -(this.height/headRadious + (headRadious/2));

		c.arc(0, headPos, headRadious, Math.PI*2, false);

		// Draw trunk

		var trunkLength = this.height/2;
		c.moveTo(0, 0);
		c.lineTo(0, trunkLength);

		// Draw arms

		var armLength = this.width/2;
		c.moveTo(0,trunkLength /3);
		c.lineTo(this.width/5, armLength);
		c.moveTo(0,trunkLength /3);
		c.lineTo(-this.width/5, armLength);

		// Draw legs

		var legLength = this.width;
		c.moveTo(0,trunkLength);
		c.lineTo(this.width/5, legLength);
		c.moveTo(0,trunkLength);
		c.lineTo(-this.width/5, legLength);

		c.closePath();
		c.stroke();

		c.restore();
	}


}

Lines.LineBoyStates = {
	Stopped: 0,
	Walking: 1,
	Running: 2,
	Jumping: 3,
	Falling: 4
}

Lines.LineBoyDirections = {
	Right: 0,
	Left: 1
}

// *** Line Boy end ***