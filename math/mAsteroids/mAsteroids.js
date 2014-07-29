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
	this.explosions = [];

	this.run = function(canvas, canvasWidth, canvasHeight){
		_this = this;
		require(["../Vectors/Vector","../Particles/Particle"], function(Vectors) {
			_this.canvas = canvas[1];
			_this.context = canvas[1].getContext("2d");
			_this.cx = canvas[1].width / 2;
			_this.cy = canvas[1].height / 2;
			_this.configure();
		});
	}

	this.configure = function(){
		_this.ship = new Ship();
		_this.ship.create(_this.cx, _this.cy, Vector.create(0,0));
		_this.bindEvents();
		_this.main();
	}

	this.stop = function(){
		document.body.removeEventListener("keydown");
		document.body.removeEventListener("keyup");
	}

	this.reset =function(){
		
	}

	this.resize = function(){
		_this.cx = _this.canvas.width / 2;
		_this.cy = _this.canvas.height / 2;
		_this.ship.particle.position.setX(_this.cx);
		_this.ship.particle.position.setY(_this.cy);
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
					if(_this.bullets.length< 5 && !_this.ship.isDead){
						_this.fireBullet();
					}
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

	this.drawExplosions = function(){
		for (var i = 0; i < _this.explosions.length; i++) {
			_this.explosions[i].draw(_this.context, {width: _this.canvas.width, height: _this.canvas.height});
		};
	}

	this.drawEnemies = function(){
		for(var x=0;x<_this.enemies.length;x++){
			var enemy = _this.enemies[x];
			enemy.draw(_this.context, _this.ship);

			if(enemy.particle.position.getX() > 0 && enemy.particle.position.getX() < _this.canvas.width
				&& enemy.particle.position.getY() > 0 && enemy.particle.position.getY() < _this.canvas.height
				&& !enemy.onScreen){
				enemy.onScreen = true;
			}

			if(enemy.particle.position.getX() < -100 || enemy.particle.position.getX() > _this.canvas.width + 100
				&& enemy.particle.position.getY() < 100 || enemy.particle.position.getY() > _this.canvas.height + 100
				&& enemy.onScreen){
				_this.enemies.splice(x,1);
			return;
			}

			_this.detectCollisions(enemy, x);

		}

	}

	this.gameOver = function(){
		_this.ship.isDead = true;
		var exp = new Explosion();
		exp.create(_this.ship.particle.position.getX(), _this.ship.particle.position.getY(), 800);
		_this.explosions.push(exp);
		setTimeout(function(){ 
			_this.ship.particle.velocity.setX(0);
			_this.ship.particle.velocity.setY(0);
			_this.ship.particle.position.setX(_this.cx);
			_this.ship.particle.position.setY(_this.cy);
			_this.ship.isDead = false;
			_this.ship.acceleration.setLength(0);
			_this.ship.acceleration.setAngle(0);
		},3000);
	}

	this.detectCollisions = function(enemy, enemyIndex){

		var distance = enemy.particle.distanceTo(_this.ship.particle);
		if(distance < enemy.width-5 && !_this.ship.isDead){
			_this.gameOver();

		}

		for (var i = 0; i < _this.bullets.length; i++) {
			var bDistance = _this.bullets[i].particle.distanceTo(enemy.particle);
			if(bDistance < enemy.width -5){
				var exp = new Explosion();
				exp.create(enemy.particle.position.getX(), enemy.particle.position.getY());
				_this.explosions.push(exp);
				_this.enemies.splice(enemyIndex, 1);
			}
		};

	}

	this.generateEnemy = function(){
		if(_this.enemies.length < 10){
			var prob = Math.random();

			var randomCX = Math.random()*(_this.canvas.width-_this.canvas.width/10) + _this.canvas.width / 10;
			var randomCY = Math.random()*(_this.canvas.height-_this.canvas.height/10) + _this.canvas.height / 10;
			
			if(prob < 0.02){
				var stone = new Stone();
				var randomAngle = Math.random()*(Math.PI*2);
				var randomPosX = Math.cos(randomAngle) * (_this.canvas.width/2 + 50) + _this.cx;
				var randomPosY = Math.sin(randomAngle) * (_this.canvas.height/2 + 50) + _this.cy;
				var randomSpeed = Math.floor(Math.random()*3+1);
				var dx = _this.cx - randomPosX;
				var dy = _this.cy - randomPosY;
				var destinationAngle = Math.atan2(dy,dx) + (Math.random > 0.5 ? Math.random()*.5 : -Math.random()*.5);
				stone.create(randomPosX, randomPosY, randomSpeed, destinationAngle);
				_this.enemies.push(stone);

			}else if(prob > 0.02 && prob < 0.025){
				var spider = new SpaceSpider();
				spider.create(randomCX,randomCY);
				_this.enemies.push(spider);
			}
		}
	}

	this.main = function(){
		_this.erase();

		_this.drawEnemies();

		_this.generateEnemy();

		_this.drawBullets();

		if(!_this.ship.isDead){
			if(_this.turnLeft){
				_this.ship.setAngle(_this.ship.getAngle()-0.06);
			}

			if(_this.turnRight){
				_this.ship.setAngle(_this.ship.getAngle()+0.06);
			}

			_this.ship.particle.update();
			

			if(_this.ship.particle.position.getX() < 0)
				_this.ship.particle.position.setX(_this.canvas.width);
			if(_this.ship.particle.position.getX() > _this.canvas.width)
				_this.ship.particle.position.setX(0);
			if(_this.ship.particle.position.getY() < 0)
				_this.ship.particle.position.setY(_this.canvas.height);
			if(_this.ship.particle.position.getY() > _this.canvas.height)
				_this.ship.particle.position.setY(0);

			_this.ship.draw(_this.context, _this.accelerating);
		}

		_this.context.stroke();

		_this.drawExplosions();

		requestAnimationFrame(_this.main);
	}

	function Ship(){

		this.particle = null;
		this.acceleration = null;
		this.angle = 0;
		this.size = 10;
		this.fireDrew = false;
		this.frontPoint = null;
		this.isDead = false;

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

			context.closePath();
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
			context.closePath();
		}
	}

	function Stone(){

		this.particle = null;
		this.speed = 3;
		this.points = [];
		this.nPoints = 0;
		this.angleIncrement = 0;
		this.angleFactor = 0;
		this.onScreen = false;
		this.width = 0;
		this.height = 0;

		this.create = function(x,y,speed,dir){
			this.particle = Particle.create(x,y,speed,dir);
			this.nPoints = Math.round(Math.random()*6+3);

			this.angleIncrement = (Math.PI*2)/this.nPoints;
			this.angleFactor = Math.PI;

			for(var i = 0; i < this.nPoints ; i++){
				var randomRadious = Math.random()*25+10;
				if(randomRadious > this.width){
					this.width = randomRadious;
					this.height = randomRadious;
				}
				var randomAngle = Math.random()*((this.angleFactor+this.angleIncrement)-this.angleFactor)+(this.angleFactor);
				this.points.push({
					x: Math.cos(randomAngle) * randomRadious + x,
					y: Math.sin(randomAngle) * randomRadious + y,
					angle: randomAngle,
					radious: randomRadious
				});
				this.angleFactor+=this.angleIncrement;
			}
		}

		this.draw = function(context){

			this.particle.update();
			context.strokeStyle = "#FF0000";
			context.moveTo(this.points[0].x, this.points[0].y);
			for(var x=0; x<this.points.length;x++){
				if(x>0){
					context.lineTo(this.points[x].x, this.points[x].y);
				}
				this.points[x].angle += 0.05;
				this.points[x].x = Math.cos(this.points[x].angle) * this.points[x].radious + this.particle.position.getX();
				this.points[x].y = Math.sin(this.points[x].angle) * this.points[x].radious + this.particle.position.getY();
			}
			context.lineTo(this.points[0].x, this.points[0].y);
			context.stroke();
			context.closePath();
		}
	}

	function Explosion(){

		this.sparks = [];

		this.create = function(x,y, particleNumber){
			var nSparks = particleNumber || Math.random()*20+10;
			for (var i = 0; i < nSparks; i++) {
				var particle = Particle.create(x,y,Math.random()*8+2, Math.random()*Math.PI*2);
				this.sparks.push(particle);
			};
		}

		this.draw = function(context, canvasDimensions){
			for (var i = 0; i < this.sparks.length; i++) {
				var spark = this.sparks[i];
				var x = spark.position.getX();
				var y = spark.position.getY()
				context.fillStyle = "#FFFFFF";
				context.beginPath();
				context.moveTo(x,y);
				context.arc(x, y, 1, 0, 2 * Math.PI, false);
				context.fill();
				context.closePath();

				if(x < 0 || x > canvasDimensions.width || y < 0 || y > canvasDimensions.height){
					this.sparks.splice(i,1);
				}

				spark.update();
			};
		}
	}

	function SpaceSpider(){
		this.particle = null;
		this.points = [];
		this.onScreen = false;
		this.easing = false;
		this.easingPoint = null;
		this.easeIncrement = 0;
		this.width = 20;
		this.height = 20;
		this.easingProb = 0.01;

		this.create = function(x, y){

			for (var i = 0; i < 4; i++) {
				var angle = (Math.PI*2/4)*(i+1);
				var point = {
					x: Math.cos(angle) * 25 + x,
					y: Math.sin(angle) * 25 + y,
					angle: angle,
					radious: 25
				}
				this.points.push(point);
			};

			this.particle = Particle.create(x, y, 0, 0);
		}

		this.draw = function(context, ship){
			var x = this.particle.position.getX();
			var y = this.particle.position.getY();

			context.fillStyle = "#FF0000";
			context.beginPath();
			context.moveTo(x,y);
			context.arc(x, y, 4, 0, 2 * Math.PI, false);
			context.fill();
			context.closePath();

			context.beginPath();
			for (var i = 0; i < this.points.length; i++) {
				context.moveTo(x,y);
				context.lineTo(this.points[i].x, this.points[i].y);

				this.points[i].angle += 0.1;
				this.points[i].x = Math.cos(this.points[i].angle) * this.points[i].radious + x;
				this.points[i].y = Math.sin(this.points[i].angle) * this.points[i].radious + y;
			};

			context.closePath();
			context.stroke();

			if(Math.random()< this.easingProb && !this.easing){
				this.easing = true;
				var easeDistance = Math.floor(Math.random()*10+5);
				var angle = 0;
				if(!ship.isDead){
					this.easingProb = 0.01;
					var dy = ship.particle.position.getY() - y;
					var dx = ship.particle.position.getX() - x;
					angle = Math.atan2(dy,dx);
				}else{
					angle = Math.random()*Math.PI*2;
					this.easingProb = .4;
				}

				this.easingPoint = {
					x:Math.cos(angle) * easeDistance + x,
					y:Math.sin(angle) * easeDistance + y,
					angle: angle,
					distance: easeDistance
				}
			}

			if(this.easing){
				if(this.easeIncrement <= this.easingPoint.distance){
					this.easeIncrement++;
					var newX = Math.cos(this.easingPoint.angle) * this.easeIncrement+x;
					var newY = Math.sin(this.easingPoint.angle) * this.easeIncrement+y;
					this.particle.position.setX(newX);
					this.particle.position.setY(newY);
				}else{
					this.easeIncrement = 0;
					this.easing = false;
				}

			}
		}
	}
	

}