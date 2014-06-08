function Gravity(){
	var _this = null;
	this.canvas = null;
	this.context = null;
	this.cx = 0;
	this.cy = 0;
	this.mass = 1;
	this.sun = 0;
	this.planet = 0;

	this.run = function(canvas, canvasWidth, canvasHeight){
		_this = this;
		require(["../Vectors/Vector","../Particles/Particle"], function(Vectors) {
			_this.canvas = canvas;
			_this.context = canvas.getContext("2d");
			_this.context.save();
			_this.cx = canvas.width / 2;
			_this.cy = canvas.height / 2;
			_this.configure();
			setInterval(_this.animate, 50);
		});
	}

	this.configure = function(){
		_this.sun = Particle.create(_this.cx,_this.cy,0,0);
		_this.planet = Particle.create(_this.cx+200, _this.cy, 10, -Math.PI / 2);
		_this.sun.mass = 10000;
		_this.bindEvents();
	}

	this.bindEvents = function(){

	}

	this.erase = function(){
		_this.canvas.width = _this.canvas.width;
		_this.context.fillStyle = "#FFFFFF";
		_this.context.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
		
	}

	this.animate = function(){
		_this.erase();
		var c = _this.context;

		_this.planet.gravitateTo(_this.sun);
		_this.planet.update();

		c.fillStyle = "#FFFF00";
		c.beginPath();
		c.arc(_this.sun.position.getX(), _this.sun.position.getY(),20,0,Math.PI*2,false);
		c.fill();

		c.fillStyle = "#FF0000";
		c.beginPath();
		c.arc(_this.planet.position.getX(), _this.planet.position.getY(),5,0,Math.PI*2,false);
		c.fill();

	}
}

window.onload = function(){
	chaos.init("Gravity");

}