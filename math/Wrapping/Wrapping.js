function Wrapping(){
	var _this = null;
	this.canvas = null;
	this.context = null;
	this.cx = 0;
	this.cy = 0;
	this.particle = null;

	this.run = function(canvas, canvasWidth, canvasHeight){
		_this = this;
		require(["../Vectors/Vector","../Particles/Particle"], function(Vectors) {
			_this.canvas = canvas[1];
			_this.context = canvas[1].getContext("2d");
			_this.context.save();
			_this.cx = canvas[1].width / 2;
			_this.cy = canvas[1].height / 2;
			_this.configure();
			setInterval(_this.animate, 5);
		});
	}

	this.configure = function(){
		_this.particle = Particle.create(_this.cx, _this.cy, 3 , Math.random() * Math.PI * 2, 0.1);
		_this.particle.radious = 40;
		_this.particle.bounce = -0.7;
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

		_this.particle.update();

		var c = _this.context;

		c.fillStyle = "#000000";
		c.beginPath();
		c.arc(_this.particle.position.getX(), _this.particle.position.getY(), _this.particle.radious, 0, Math.PI * 2, false);
		c.fill();

		if(_this.particle.position.getX() + _this.particle.radious > _this.canvas.width){
			_this.particle.position.setX(_this.canvas.width - _this.particle.radious);
			_this.particle.velocity.setX(_this.particle.velocity.getX() * _this.particle.bounce);
		}
		if(_this.particle.position.getX() - _this.particle.radious < 0){
			_this.particle.position.setX(_this.particle.radious);
			_this.particle.velocity.setX(_this.particle.velocity.getX() * _this.particle.bounce);
		}
		if(_this.particle.position.getY() + _this.particle.radious > _this.canvas.height){
			_this.particle.position.setY(_this.canvas.height - _this.particle.radious);
			_this.particle.velocity.setY(_this.particle.velocity.getY() * _this.particle.bounce);
		}
		if(_this.particle.position.getY() - _this.particle.radious < 0){
			_this.particle.position.setY(_this.particle.radious);
			_this.particle.velocity.setY(_this.particle.velocity.getY() * _this.particle.bounce);
		}

	}
}