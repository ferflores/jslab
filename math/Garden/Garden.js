function Garden(){
	var _this = null;
	this.canvas = null;
	this.context = null;
	this.cx = 0;
	this.cy = 0;
	this.gravity = 0.02;
	this.seeds = [];
	this.seedBounce = -0.3;
	this.floor = 0;
	this.growProcLimit = 3;
	this.seedsBeingProcessed = 0;
	this.plants = [];

	this.run = function(canvas, canvasWidth, canvasHeight){
		_this = this;
		_this.floor = canvas.height - 50;
		_this.canvas = canvas;
		_this.context = canvas.getContext("2d");
		_this.cx = canvas.width / 2;
		_this.cy = canvas.height / 2;
		_this.context.webkitImageSmoothingEnabled = true;
		_this.context.lineCap = "rounded";

		require(["../Vectors/Vector","../Particles/Particle"], function(Vectors) {
			_this.configure();
			setInterval(_this.main, 5);
		});
	}

	this.configure = function(){
		_this.erase();
		_this.drawFLoor();
		_this.createSeed();
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
		var randomX = x || Math.random()*(_this.canvas.width - (_this.canvas.width / 3)) + (_this.canvas.width / 3);
		var randomY = y || Math.random()*(_this.canvas.height-200) + 100;
		var seedSpeed = 1;
		var seedRadious = 2;
		var randomDirection = Math.random() * Math.PI * 2;
		var randomFLoor = Math.random() * 40 + (_this.floor+5);
		seed.create(randomX, randomY, randomFLoor, seedSpeed, randomDirection, _this.gravity, seedRadious);
		_this.seeds.push(seed);
	}

	this.drawSeeds = function(){
		for(var x = 0; x < _this.seeds.length ; x++){
			if(!_this.seeds[x].stopped){
				_this.seeds[x].particle.update();
				_this.wrapSeed(_this.seeds[x]);
			}else{
				if(!_this.seeds[x].readyToGrow && _this.seedsBeingProcessed < _this.growProcLimit){
					_this.seedsBeingProcessed++;
					_this.seeds[x].readyToGrow = true;
				}

				if(_this.seeds[x].readyToGrow){
					_this.seeds[x].alpha -= 0.009;
					_this.seeds[x].color = "rgba(0,0,0,"+_this.seeds[x].alpha+")";
					if(_this.seeds[x].alpha <= 0){
						var plant = new Plant();
						var plantX = _this.seeds[x].particle.position.getX();
						var plantY = _this.seeds[x].particle.position.getY();
						var scaleFactor = Math.random() * _this.canvas.height/1.3 + 100;
						plant.create(plantX, plantY, scaleFactor, Garden.initialLineWIdth, 270, 0);
						_this.plants.push(plant);

						_this.seedsBeingProcessed--;
						_this.seeds.splice(x,1);
						continue;
					}
				}
			}
			_this.seeds[x].draw(_this.context);
		}
	}

	this.drawPLants = function(){
		for(var x=0;x< _this.plants.length;x++){
			var plant = _this.plants[x];

			plant.draw(_this.context);
			
		}
		_this.context.stroke();
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
		_this.context.fillRect(0, _this.canvas.height-50, _this.canvas.width, 50 );
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
		_this.drawPLants();
	}
}

Garden.maxBranchDepth = 3;
Garden.initialLineWIdth = 4;
Garden.posNeg = [-1,1];

function Seed(){
	this.particle = null;
	this.radious = 0;
	this.stopped = false;
	this.floor = 0;
	this.readyToGrow = false;
	this.alpha = 1;
	this.color = "rgba(0,0,0,1)";

	this.create = function(x, y, floor, speed, direction, gravity, radious){
		this.particle = Particle.create(x,y,speed, direction, gravity);
		this.radious = radious;
		this.floor = floor;
	}

	this.draw = function(context){
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.particle.position.getX(), 
			this.particle.position.getY(),this.radious,0,Math.PI*2,false);
		context.fill();
	}
}

function Plant(){
	this.x = 0;
	this.y = 0;
	this.height = 0;
	this.direction = 270;
	this.branches = [];
	this.color = "#1D5E2A";
	this.depth = 0;
	this.growingLength = 0;
	this.currentY = 0;
	this.width = 0;

	this.create = function(x,y, scaleFactor, width, direction, depth){
		this.x = x;
		this.y = y;
		this.depth = depth;
		this.width = width;

		this.height = Math.random()*scaleFactor + 20;
		this.direction = direction || 270;

		if(depth < Garden.maxBranchDepth){
			var numberOfBranches = Math.random()*4+1;
			for(var x=0;x< numberOfBranches; x++){
				var plant = new Plant();
				var branchHeight = Math.random() *this.height + 10;
				var dir = this.direction + (Math.random() * 45 * Garden.posNeg[Math.round(Math.random()*1)]);
				var randomRatio = Math.random() * this.height;
				var branchX = Math.cos(this.direction * Math.PI / 180) * (randomRatio) + this.x;
				var branchY = Math.sin(this.direction * Math.PI / 180) * (randomRatio) + this.y;
				plant.create(branchX, branchY, scaleFactor / 3, this.width -1 < 1 ? 1 : this.width - 1 ,dir, this.depth+1);
				this.branches.push(plant);
			}
		}
	}

	this.draw = function(context){

		context.strokeStyle = this.color;

		if(this.growingLength < this.height){
			this.growingLength++;
		}

		var yPoint = this.currentY = Math.sin(this.direction * Math.PI / 180) * this.growingLength + this.y;
		var xPoint = Math.cos(this.direction * Math.PI / 180) * this.growingLength + this.x;

		var linesX = [];
		var linesX2 = [];
		var linesY = [];

		for(var x = 0; x < this.width/2 ; x++){
			linesX.push(this.x-x);
			linesX2.push(xPoint-x);
			linesY.push(yPoint-x);
		}

		for(var x = 0; x < this.width/2 ; x++){
			linesX.push(this.x+x);
			linesX2.push(xPoint+x);
			linesY.push(yPoint+x);
		}

		for(var x=0;x< linesX.length;x++){
			context.moveTo(linesX[x], this.y);
			context.lineTo(linesX2[x], linesY[x]);
		}

		for(var y = 0; y< this.branches.length;y++){
			if(this.currentY<this.branches[y].y){
				this.branches[y].draw(context);
			}
		}
	}
}


window.onload = function(){
	chaos.init("Garden");

}