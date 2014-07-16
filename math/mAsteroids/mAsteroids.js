function mAsteroids(){
	var _this = null;
	this.canvas = null;
	this.context = null;
	this.cx = 0;
	this.cy = 0;
	this.ship = null;
	this.turnLeft = false;
	this.turnRight = false;
	this.accelerating = false;
	this.bullets = [];
	this.enemies = [];

	this.run = function(canvas, canvasWidth, canvasHeight){
		_this = this;
		require(["../Vectors/Vector","../Particles/Particle"], function(Vectors) {
			_this.canvas = canvas;
			_this.context = canvas.getContext("2d");
			_this.cx = canvas.width / 2;
			_this.cy = canvas.height / 2;
			_this.configure();
		});
	}

	this.configure = function(){
		_this.ship = new Ship();
		_this.ship.create(_this.cx, _this.cy, Vector.create(0,0));
		_this.bindEvents();
		var stone = new Stone();
		stone.create(200,200,0,0);
		_this.enemies.push(stone);
		_this.main();
	}

	this.stop = function(){
		document.body.removeEventListener("keydown");
		document.body.removeEventListener("keyup");
	}

	this.resize = function(){

	}

	this.bindEvents = function(){
		document.body.addEventListener("keydown", function(e){
			switch(e.keyCode){
				case 38: //up
					_this.ship.acceleration.setLength(0.2);
					_this.ship.acceleration.setAngle(_this.ship.angle);
					_this.accelerating = true;
					break;
				case 37: //left
					_this.turnLeft = true;
					break;
				case 39: //right
					_this.turnRight = true;
					break;
				default: 
					break;
			}	
		});
		document.body.addEventListener("keyup", function(e){
			switch(e.keyCode){
				case 38: //up
					_this.accelerating = false;
					_this.ship.acceleration.setLength(0);
					break;
				case 37: //left
					_this.turnLeft = false;
					break;
				case 39: //right
					_this.turnRight = false;
					break;
				case 32:
					_this.fireBullet();
					break;
				default: 
					break;
			}	
		});
	}

	this.erase = function(){
		_this.canvas.width = _this.canvas.width;
		_this.context.fillStyle = "#000000";
		_this.context.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
		
	}

	this.fireBullet = function(){
		var newBullet = new Bullet();
		newBullet.create(_this.ship.frontPoint.x, _this.ship.frontPoint.y, _this.ship.angle);
		_this.bullets.push(newBullet);
	}

	this.drawBullets = function(){
		for(var x=0;x<_this.bullets.length;x++){
			if(_this.bullets[x].particle.position.getX()>_this.canvas.width
				|| _this.bullets[x].particle.position.getX()<0
				|| _this.bullets[x].particle.position.getY()>_this.canvas.height
				|| _this.bullets[x].particle.position.getY()<0){

				_this.bullets.splice(x,1);
			}else{
				_this.bullets[x].draw(_this.context);
				_this.bullets[x].particle.update();
			}
		}
	}

	this.drawEnemies = function(){
		for(var x=0;x<_this.enemies.length;x++){
			_this.enemies[x].draw(_this.context);
		}
	}

	this.main = function(){
		_this.erase();

		if(_this.turnLeft){
			_this.ship.setAngle(_this.ship.getAngle()-0.06);
		}

		if(_this.turnRight){
			_this.ship.setAngle(_this.ship.getAngle()+0.06);
		}

		_this.ship.particle.update();
		_this.ship.draw(_this.context, _this.accelerating);

		_this.context.stroke();

		if(_this.ship.particle.position.getX() < 0)
			_this.ship.particle.position.setX(_this.canvas.width);
		if(_this.ship.particle.position.getX() > _this.canvas.width)
			_this.ship.particle.position.setX(0);
		if(_this.ship.particle.position.getY() < 0)
			_this.ship.particle.position.setY(_this.canvas.height);
		if(_this.ship.particle.position.getY() > _this.canvas.height)
			_this.ship.particle.position.setY(0);

		_this.drawBullets();
		_this.drawEnemies();

		requestAnimationFrame(_this.main);
	}

	function Ship(){

		this.particle = null;
		this.acceleration = null;
		this.angle = 0;
		this.size = 10;
		this.fireDrew = false;
		this.frontPoint = null;

		this.create = function(x, y, accel){
			this.particle = Particle.create(x,y, 0, 0);
			this.particle.friction = 0.99;
			this.acceleration = accel;
		}

		this.setAngle = function(ang){
			this.angle = ang;
		}

		this.getAngle = function(){
			return this.angle;
		}

		this.draw = function(context, accelerating){

			
			this.particle.accelerate(this.acceleration);

			var dirPoint = {
				x: Math.cos(this.angle) * this.size + this.particle.position.getX(),
				y: Math.sin(this.angle) * this.size + this.particle.position.getY()
			}

			this.frontPoint = dirPoint;

			var nextPoint = {
				x: Math.cos(this.angle+(Math.PI * 2 / 2.5)) * (this.size +10) + this.particle.position.getX(),
				y: Math.sin(this.angle+(Math.PI * 2 / 2.5)) * (this.size +10) + this.particle.position.getY()
			}

			var nextPoint2 = {
				x: Math.cos(this.angle+(Math.PI * 2 / 2.5 * 9)) * (this.size +10) + this.particle.position.getX(),
				y: Math.sin(this.angle+(Math.PI * 2 / 2.5 * 9)) * (this.size +10) + this.particle.position.getY()
			}

			context.strokeStyle = "#FFFFFF";

			context.beginPath();
			context.moveTo(dirPoint.x, dirPoint.y);
			context.lineTo(nextPoint.x, nextPoint.y);
			context.lineTo(nextPoint2.x, nextPoint2.y);
			context.lineTo(dirPoint.x, dirPoint.y);

			this.fireDrew = !this.fireDrew
			if(accelerating && this.fireDrew){
				context.strokeStyle = "#DBA72C";
				context.moveTo(Math.cos(this.angle) * (-this.size*2.4) + this.particle.position.getX(),
					Math.sin(this.angle) * (-this.size*2.4) + this.particle.position.getY());
				context.lineTo(Math.cos(this.angle) * (-this.size-5) + this.particle.position.getX(),
					Math.sin(this.angle) * (-this.size-5) + this.particle.position.getY()
					);
			}
		}
	}

	function Bullet(){
		this.particle = null;
		this.speed = 13;

		this.create = function(x,y, dir){
			this.particle = Particle.create(x,y,this.speed, dir);
		}

		this.draw = function(context){
			var x = this.particle.position.getX();
			var y = this.particle.position.getY();
			context.fillStyle = "#FFFFFF";
			context.beginPath();
			context.moveTo(x,y);
			context.arc(x, y, 2, 0, 2 * Math.PI, false);
			context.fill();
		}
	}

	function Stone(){
		this.particle = null;
		this.speed = 3;
		this.points = [];

		this.create = function(x,y,dir,speed){
			this.particle = Particle.create(x,y,speed,dir);
			var nPoints = Math.round(Math.random()*6+3);

			var angleIncrement = (Math.PI*2)/nPoints;
			var angleFactor = Math.PI;
			for(var i = 0; i < nPoints ; i++){
				var randomRadious = Math.random()*25+10;
				var randomAngle = Math.random()*((angleFactor+angleIncrement)-angleFactor)+(angleFactor);
				this.points.push({
					x: Math.cos(randomAngle) * randomRadious + x,
					y: Math.sin(randomAngle) * randomRadious + y
				});
				angleFactor+=angleIncrement;
			}
		}

		this.draw = function(context){
			context.strokeStyle = "#FFFFFF";
			context.moveTo(this.points[0].x, this.points[0].y);
			for(var x=1; x<this.points.length;x++){
				context.lineTo(this.points[x].x, this.points[x].y);
			}
			context.lineTo(this.points[0].x, this.points[0].y);
			context.stroke();
		}
	}

}

window.onload = function(){
	chaos.init("mAsteroids");

}