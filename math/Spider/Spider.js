function Spider(){
	var _this = null;
	this.cx = 0;
	this.cy = 0;
	this.context = null;
	this.stopped = false;
	this.canvas = null;
	this.spiders = [];
	this.floorY = 0;
	this.mouseX = 0;
	this.mouseY = 0;

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
		_this.floorY = _this.canvas.height-30;
		_this.erase();
		_this.bindEvents();
		_this.createSpider(Math.random()*(_this.canvas.width-100)+100,Math.random()*100+100);
	}

	this.createSpider = function(x,y){
		var arania = new Arania();
		var randomWalkProb = Math.random()+0.5;
		if(randomWalkProb > .90){
			randomWalkProb = .90;
		}
		arania.create(x,y,_this.canvas.height/(Math.random()*40+20)	, _this.floorY, randomWalkProb);
		_this.spiders.push(arania);
	}

	this.bindEvents = function(){
		document.addEventListener("mousedown", function(e){
			if(_this.spiders.length<20){
				var mX = (e.pageX  - _this.canvas.offsetParent.offsetLeft);
				var mY = (e.pageY  - _this.canvas.offsetParent.offsetTop);

				_this.createSpider(mX, mY);
			}
		});

		document.addEventListener("mousemove", function(e){
			var mX = (e.pageX  - _this.canvas.offsetParent.offsetLeft);
			var mY = (e.pageY  - _this.canvas.offsetParent.offsetTop);

			for (var i = 0; i < _this.spiders.length; i++) {
				var spider = _this.spiders[i];

				var dy = mY - spider.headParticle.y;
				var dx = mX - spider.headParticle.x;

				var distance = Math.sqrt(dy*dy + dx*dx);

				if(distance<50){
					spider.walkProb = .0;
					if(mX >= spider.headParticle.x){
						spider.direction = 3.8;
						
					}else{
						spider.direction = 5.5;
					}
				}else{
					spider.direction = spider.defaultDirection;
					spider.walkProb = spider.defaultWalkProb;
				}
			};
		});
	}

	this.drawSpiders = function(){
		for (var i = 0; i < _this.spiders.length; i++) {
			_this.spiders[i].draw(_this.context);
			var random = Math.random();
			if(random>_this.spiders[i].walkProb){
				_this.spiders[i].walk();
			}
		};
	}

	this.drawFloor = function(){
		var c = _this.context;
		c.beginPath();
		c.strokeStyle = "#CCCCCC";
		c.moveTo(0, _this.floorY);
		c.lineTo(_this.canvas.width, _this.floorY);
		c.stroke();
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
		_this.context.fillStyle = "#000000";
		_this.context.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
	}


	this.main = function(){
		_this.erase();
		
		_this.drawSpiders();
		_this.drawFloor();
		if(!_this.stopped){
			requestAnimationFrame(_this.main);
		}
	}

	function Arania(){

		this.headParticle = null;
		this.legs = [];
		this.size = 0;
		this.radious = 0;
		this.floorY = 0;
		this.legLength = 25;
		this.drag = false;
		this.direction = 5.5;
		this.walkProb = .8;
		this.defaultWalkProb = .8;
		this.defaultDirection = 5.5;
		
		this.create = function(x, y, size, floor, walkProb){
			this.headParticle = Particle2.create(x,y,0,0,0.4);
			this.size = size;
			this.floorY = floor;
			this.walkProb = walkProb;
			this.defaultWalkProb = walkProb;

			this.radious = this.size/4;

			this.createLegs();
		}

		this.createLegs = function(){
			var k = 0.02;

			var leg1Particle1 = Particle2.create(this.headParticle.x + this.legLength, this.headParticle.y - this.size/2,0,0);
			var leg1Particle2 = Particle2.create(this.headParticle.x + this.legLength * 2, this.headParticle.y + this.size/2,0,0, 0.1);
			var invisible1 = {
				particle: Particle2.create(this.headParticle.x + this.legLength, this.headParticle.y+this.radious,0,0,0),
				length:this.legLength
				}

			

			this.headParticle.addSpring(leg1Particle1, k,this.legLength);
			leg1Particle1.addSpring(this.headParticle, k, this.legLength+5);
			leg1Particle1.addSpring(leg1Particle2,k, this.legLength);
			leg1Particle1.addSpring(invisible1.particle,k, this.legLength);
			leg1Particle2.addSpring(leg1Particle1,k, this.legLength);
			
			var leg2Particle1 = Particle2.create(this.headParticle.x - this.legLength, this.headParticle.y - this.size/2,0,0);
			var leg2Particle2 = Particle2.create(this.headParticle.x - (this.legLength*2), this.headParticle.y + this.size/2,0,0, 0.1);
			var invisible2 = {
				particle: Particle2.create(this.headParticle.x - this.legLength, this.headParticle.y+this.radious,0,0,0),
				length:-this.legLength
				}

			this.headParticle.addSpring(leg2Particle1, k,this.legLength);
			leg2Particle1.addSpring(this.headParticle, k, this.legLength+5);
			leg2Particle1.addSpring(leg2Particle2, k, this.legLength);
			leg2Particle1.addSpring(invisible2.particle, k, this.legLength);
			leg2Particle2.addSpring(leg2Particle1,k, this.legLength);

			var leg3Particle1 = Particle2.create(this.headParticle.x + (this.legLength*2), this.headParticle.y - this.size/2,0,0);
			var leg3Particle2 = Particle2.create(this.headParticle.x + (this.legLength * 4), this.headParticle.y + this.size/2,0,0, 0.1);
			var invisible3 = {
				particle: Particle2.create(this.headParticle.x + (this.legLength*2), this.headParticle.y+this.radious,0,0,0),
				length:this.legLength
				}

			

			this.headParticle.addSpring(leg3Particle1, k,this.legLength);
			leg3Particle1.addSpring(this.headParticle, k, this.legLength+5);
			leg3Particle1.addSpring(leg3Particle2,k, this.legLength);
			leg3Particle1.addSpring(invisible1.particle,k, this.legLength);
			leg3Particle2.addSpring(leg3Particle1,k, this.legLength);
			
			var leg4Particle1 = Particle2.create(this.headParticle.x - (this.legLength*2), this.headParticle.y - this.size/2,0,0);
			var leg4Particle2 = Particle2.create(this.headParticle.x - (this.legLength*4), this.headParticle.y + this.size/2,0,0, 0.1);
			var invisible4 = {
				particle: Particle2.create(this.headParticle.x - (this.legLength*2), this.headParticle.y+this.radious,0,0,0),
				length:-this.legLength
				}

			this.headParticle.addSpring(leg4Particle1, k,this.legLength);
			leg4Particle1.addSpring(this.headParticle, k, this.legLength+5);
			leg4Particle1.addSpring(leg4Particle2, k, this.legLength);
			leg4Particle1.addSpring(invisible2.particle, k, this.legLength);
			leg4Particle2.addSpring(leg4Particle1,k, this.legLength);

			this.legs.push({ p1:leg1Particle1, p2:leg1Particle2, invisible: invisible1, moving:false});
			this.legs.push({ p1:leg2Particle1, p2:leg2Particle2, invisible: invisible2, moving:false});
			this.legs.push({ p1:leg3Particle1, p2:leg3Particle2, invisible: invisible3, moving:false});
			this.legs.push({ p1:leg4Particle1, p2:leg4Particle2, invisible: invisible4, moving:false});
			
		}

		this.draw = function(context){
			this.drawHead(context);
			this.drawLegs(context)

			this.headParticle.update();

			if(this.headParticle.y + this.radious > this.floorY){
				this.headParticle.y = this.floorY - this.radious;
				this.headParticle.setSpeed(this.headParticle.getSpeed()*this.headParticle.bounce*0.3);
			}

			if(this.headParticle.x > _this.canvas.width){
				this.direction = 3.8;
				this.defaultDirection = 3.8;
			}

			if(this.headParticle.x < 0){
				this.direction = 5.5;
				this.defaultDirection = 5.5;
			}

		}

		this.walk = function(){
			if(this.headParticle.y > this.floorY - 30){
				var randomLeg = parseInt(Math.random()*(this.legs.length-1)+1);

				if(!this.legs[randomLeg].moving){
					this.legs[randomLeg].moving = true;
					this.legs[randomLeg].p1.y-=3;
					this.legs[randomLeg].p1.setSpeed(2);
					this.legs[randomLeg].p1.setHeading(this.direction);
				}
			}
		}

		this.drawHead = function(c){
			c.beginPath();
			c.fillStyle = "#FFFFFF";
			if(this.drag){
				this.headParticle.x = _this.mouseX;
				this.headParticle.y = _this.mouseY;
			}
			c.moveTo(this.headParticle.x, this.headParticle.y);
			c.arc(this.headParticle.x, this.headParticle.y,this.radious,0,Math.PI*2,false);
			c.fill();
		}

		this.drawLegs = function(c){
			c.beginPath();
			c.strokeStyle = "#FFFFFF";
			for (var i = 0; i < this.legs.length; i++) {
				var p1 = this.legs[i].p1;
				var p2 = this.legs[i].p2;
				var inv = this.legs[i].invisible;

				c.moveTo(this.headParticle.x, this.headParticle.y);
				c.lineTo(p1.x,p1.y);
				c.lineTo(p2.x,p2.y);

				if(p1.y > this.floorY){
					p1.y = this.floorY;
					p1.setSpeed(p1.getSpeed()*p1.bounce*0.2);
				}

				if(p2.y > this.floorY){
					p2.y = this.floorY;
					p2.setSpeed(p2.getSpeed()*p2.bounce*0.2);
					this.legs[i].moving = false;
				}

				p1.update();
				p2.update();
				inv.particle.x = this.headParticle.x + inv.length;
				inv.particle.y = this.headParticle.y + this.radious; 
			};

			c.stroke();
		}
	}

}