function Garden(){
	var _this = null;
	this.canvas = null;
	this.context = null;
	this.cx = 0;
	this.cy = 0;
	this.gravity = 0.02;
	this.seeds = [];
	this.seedBounce = -0.3;
	this.floor = window.innerHeight-50;
//CAMBIAR TODO A CANVAS.WIDTH/HEIGHT
	this.run = function(canvas, canvasWidth, canvasHeight){
		_this = this;
		_this.canvas = canvas;
		_this.context = canvas.getContext("2d");
		_this.cx = canvas.width / 2;
		_this.cy = canvas.height / 2;

		require(["../Vectors/Vector","../Particles/Particle"], function(Vectors) {
			_this.configure();
			setInterval(_this.main, 5);
		});
	}

	this.configure = function(){
		_this.erase();
		_this.drawFLoor();
		_this.createSeed();
		_this.drawSeeds();
		_this.bindEvents();
	}

	this.bindEvents = function(){
		_this.canvas.addEventListener("click", function(e){
			var mouseX = (e.pageX  - _this.canvas.offsetLeft);
			var mouseY = (e.pageY  - _this.canvas.offsetTop);
			_this.createSeed(mouseX, mouseY);
		});
	}

	this.createSeed = function(x,y){
		var seed = new Seed();
		var randomX = x || Math.random()*(window.innerWidth - (window.innerWidth / 3)) + (window.innerWidth / 3);
		var randomY = y || Math.random()*(window.innerHeight-200) + 100;
		var seedSpeed = 1;
		var seedRadious = 2;
		var randomDirection = Math.random() * Math.PI * 2;
		var randomFLoor = Math.random() * 40 + _this.floor;
		seed.create(randomX, randomY, randomFLoor, seedSpeed, randomDirection, _this.gravity, seedRadious);
		_this.seeds.push(seed);
	}

	this.drawSeeds = function(){
		for(var x = 0; x < _this.seeds.length ; x++){
			if(!_this.seeds[x].stopped){
				_this.seeds[x].particle.update();
				_this.wrapSeed(_this.seeds[x]);
			}
			_this.seeds[x].draw(_this.context);
		}
	}

	this.wrapSeed = function(seed){
		if(seed.particle.position.getY() + seed.radious > seed.floor){
			if(seed.particle.velocity.getY() < 0.050){
				seed.stopped = true;
				return;
			}
			seed.particle.position.setY(seed.floor - seed.radious);
			seed.particle.velocity.setY(seed.particle.velocity.getY() * _this.seedBounce);
			seed.particle.velocity.setX(seed.particle.velocity.getX() * 0.3);
		} else if(seed.particle.position.getX() + seed.radious > _this.canvas.width){
			seed.particle.position.setX(_this.canvas.width - seed.radious);
			seed.particle.velocity.setX(seed.particle.velocity.getX() * -1);
		}else if(seed.particle.position.getX() - seed.radious < 0){
			seed.particle.position.setX(0 + seed.radious);
			seed.particle.velocity.setX(seed.particle.velocity.getX() * -1);
		}
	}

	this.drawFLoor = function(){
		_this.context.fillStyle = "#00FF66";
		_this.context.fillRect(0, window.innerHeight-50, window.innerWidth, 50 );
	}
	
	this.erase = function(){
		_this.canvas.width = _this.canvas.width;
		_this.context.fillStyle = "#FFFFFF";
		_this.context.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
	}

	this.main = function(){
		_this.erase();
		_this.drawFLoor();
		_this.drawSeeds();
	}
}

function Seed(){
	this.particle = null;
	this.radious = 0;
	this.stopped = false;
	this.floor = 0;

	this.create = function(x, y, floor, speed, direction, gravity, radious){
		this.particle = Particle.create(x,y,speed, direction, gravity);
		this.radious = radious;
		this.floor = floor;
	}

	this.draw = function(context){
		context.fillStyle = "#000000";
		context.beginPath();
		context.arc(this.particle.position.getX(), 
			this.particle.position.getY(),this.radious,0,Math.PI*2,false);
		context.fill();
	}
}

window.onload = function(){
	chaos.init("Garden");

}