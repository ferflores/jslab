function Asteroids(){
	var _this = null;
	this.canvas = null;
	this.context = null;
	this.cx = 0;
	this.cy = 0;
	this.ship = null;
	this.thrust = null;
	this.angle = 0;
	this.turningLeft = false;
	this.turningRight = false;
	this.thrusting = false;

	this.run = function(canvas, canvasWidth, canvasHeight){
		_this = this;
		require(["../Vectors/Vector","../Particles/Particle"], function(Vectors) {
			_this.canvas = canvas;
			_this.context = canvas.getContext("2d");
			_this.context.save();
			_this.cx = canvas.width / 2;
			_this.cy = canvas.height / 2;
			_this.configure();
			_this.context.webkitImageSmoothingEnabled = true;
			//_this.context.translate(.5,.5);
			setInterval(_this.animate, 5);
		});
	}

	this.configure = function(){
		_this.ship = Particle.create(_this.canvas.width / 2, _this.canvas.height / 2, 0 ,0);
		_this.ship.friction = 0.99;
		_this.thrust = Vector.create(0,0);
		_this.bindEvents();
	}

	this.bindEvents = function(){
		document.body.addEventListener("keydown", function(e){
			switch(e.keyCode){
				case 38: //up
					_this.thrusting = true;
					break;
				case 37: //left
					_this.turningLeft = true;
					break;
				case 39: //right
					_this.turningRight = true;
					break;
				default: 
					break;
			}	
		});
		document.body.addEventListener("keyup", function(e){
			switch(e.keyCode){
				case 38: //up
					_this.thrusting = false;
					break;
				case 37: //left
					_this.turningLeft = false;
					break;
				case 39: //right
					_this.turningRight = false;
					break;
				default: 
					break;
			}	
		});
	}

	this.erase = function(){
		_this.canvas.width = _this.canvas.width;
		_this.context.fillStyle = "#FFFFFF";
		_this.context.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
		
	}

	this.animate = function(){
		_this.erase();

		if(_this.turningLeft)
			_this.angle -= 0.05;

		if(_this.turningRight)
			_this.angle += 0.05;

		_this.thrust.setAngle(_this.angle);

		if(_this.thrusting)
			_this.thrust.setLength(0.1);
		else
			_this.thrust.setLength(0);

		_this.ship.accelerate(_this.thrust);
		_this.ship.update();

		_this.context.fillStyle = "#000000";

		_this.context.save();
		_this.context.translate(_this.ship.position.getX(), _this.ship.position.getY());
		_this.context.rotate(_this.angle);

		_this.context.beginPath();
		_this.context.moveTo(10, 0);
		_this.context.lineTo(-10, -7);
		_this.context.lineTo(-10, 7);
		_this.context.lineTo(10,0);
		if(_this.thrusting){
			_this.context.moveTo(-10, 0);
			_this.context.lineTo(-18,0);
		}
		_this.context.stroke();

		_this.context.restore();

		if(_this.ship.position.getX() < 0)
			_this.ship.position.setX(_this.canvas.width);
		if(_this.ship.position.getX() > _this.canvas.width)
			_this.ship.position.setX(0);
		if(_this.ship.position.getY() < 0)
			_this.ship.position.setY(_this.canvas.height);
		if(_this.ship.position.getY() > _this.canvas.height)
			_this.ship.position.setY(0);


	}
}

window.onload = function(){
	chaos.init("Asteroids");

}