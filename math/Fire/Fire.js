function Fire(){
	var _this = null;
	this.cx = 0;
	this.cy = 0;
	this.context = null;
	this.stopped = false;
	this.canvas = null;
	this.imageUrls = ["fire1.jpg","fire2.jpg","fire3.jpg","fire4.jpg",
		"fire5.jpg","fire6.jpg","fire7.jpg","fire8.jpg"];
	this.imageObjects = [];
	this.imageIndex = 0;
	this.fireAnims = [];
	this.focalLength = 300;
	this.fireCount = 1000;
	this.centerZ = 500;
	this.radious = 500;
	this.baseAngle = 0;
	this.rotationSpeed = 0.02;

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

		for (var i = 0; i < _this.imageUrls.length; i++) {
			var img = new Image();
			img["ref"] = img;
			img.onload = function(){
				_this.imageObjects.push(this.ref);
			}

			img.src = "../Fire/"+_this.imageUrls[i];
		};

		for(var i = 0; i < _this.fireCount; i += 1) {
			
			var	angle = 0.2 * i;
			var y = 2000-4000 / _this.fireCount * i;
			var x = Math.cos(angle + _this.baseAngle) * _this.radious;
			var z = _this.centerZ + Math.sin(angle + _this.baseAngle) * _this.radious;

			var fire = new _this.FireAnim();
			fire.create(x,y,z,angle);
			_this.fireAnims.push(fire);
		}

		

	}

	this.drawFireAnims = function(){
		for (var i = 0; i < _this.fireAnims.length; i++) {
			_this.fireAnims[i].draw(_this.context);
		};
	}

	this.bindEvents = function(){

		document.addEventListener("mousemove", function(e){
			_this.rotationSpeed = (event.clientX - _this.canvas.width / 2) * 0.00005;
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
		_this.context.fillStyle = "#000000";
		_this.context.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
		_this.context.translate(_this.cx, _this.cy);
	}

	this.FireAnim = function(){

		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.angle = 0;
		this.imageIndex = 0;


		this.create = function(x,y,z, angle){
			this.x = x;
			this.y = y;
			this.z = z;
			this.angle = angle;
		}

		this.draw = function(context){
			if(_this.imageObjects.length > 0){

				var perspective = _this.focalLength / (_this.focalLength + this.z);

				context.save();
				context.scale(perspective, perspective);
				context.translate(this.x, this.y);
				context.scale(Math.sin(this.angle + _this.baseAngle),1);
				context.globalAlpha = 0.7;
				context.drawImage(_this.imageObjects[this.imageIndex],0-this.imageIndex,0);

				context.restore();

				this.imageIndex ++;
				if(this.imageIndex>=_this.imageObjects.length){
					this.imageIndex = 0;
				}

				this.x = Math.cos(this.angle + _this.baseAngle) * _this.radious;
				this.z = _this.centerZ + Math.sin(this.angle + _this.baseAngle) * _this.radious;
			}
		}
	}

	this.main = function(){
		_this.erase();
		_this.baseAngle += _this.rotationSpeed;
		_this.fireAnims.sort(_this.zsort);

		_this.drawFireAnims();

		if(!_this.stopped){
			requestAnimationFrame(_this.main);
		}
	}

	this.zsort = function(elmA, elmB) {
		return elmB.z - elmA.z;
	}


}