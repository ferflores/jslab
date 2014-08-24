function EatingPacman(){
	var _this = null;
	this.cx = 0;
	this.cy = 0;
	this.context = null;
	this.stopped = false;
	this.canvas = null;
	this.canvasBg = null;
	this.pacmans = [];

	this.run = function(canvas, canvasWidth, canvasHeight){
		_this = this;
		_this.context = canvas[1].getContext("2d");
		_this.contextBg = canvas[0].getContext("2d");
		_this.cx = canvas[1].width / 2;
		_this.cy = canvas[1].height / 2;
		_this.canvas = canvas[1];
		_this.canvasBg = canvas[0];
		_this.context.webkitImageSmoothingEnabled = true;
		require(["../ParticlesOpt/Particle"], function(Particles) {
			_this.configure();
			_this.main();
		});
	}

	this.configure = function(){
		_this.erase();
		_this.bindEvents();
		var pacman = new Pacman();
		pacman.create(200,100, false);
		var pacman2 = new Pacman();
		pacman2.create(600,100, true);
		_this.pacmans.push(pacman);
		_this.pacmans.push(pacman2);
	}

	this.drawPacmans = function(){
		for (var i = 0; i < _this.pacmans.length; i++) {
			_this.pacmans[i].draw();
			_this.pacmans[i].particle.update();
		};
	}
	this.bindEvents = function(){
		document.addEventListener("mouseup",function(e){
			var mX = (e.pageX  - _this.canvas.offsetParent.offsetLeft);
			var mY = (e.pageY  - _this.canvas.offsetParent.offsetTop);
			var bgc = _this.contextBg;
			bgc.globalCompositeOperation = 'source-over';
			bgc.beginPath();
			bgc.arc(mX, mY, Math.random()*50+30,Math.PI*2,false);
			bgc.fill();
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
		_this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
	}


	this.main = function(){
		_this.erase();
		
		_this.drawPacmans();

		if(!_this.stopped){
			requestAnimationFrame(_this.main);
		}
	}


	this.scanBlack = function(scanReverse){

		var posx = 0;
		var posy = 0;

		var width = _this.canvas.width;
		var height = _this.canvas.height;

		posx = 0;
		posy = 0;

		imageData = _this.contextBg.getImageData(0, 0,width, height);

		if(scanReverse){
			posx = width;
			posy = height;
			for (var i = imageData.data.length-1; i > 4; i-=4) {
				var pixel = imageData.data[i];

				if(posx <= 0){
					posx = width;
					posy--;
				}

				if(pixel>0){
					return {posx:posx, posy: posy};
				}

				posx--;
			}
		}else{
			for (var i = 3; i < imageData.data.length; i+=4) {
				var pixel = imageData.data[i];
				
				if(posx > width-1){
					posx = 0;
					posy++;
				}

				if(pixel>0){
					return {posx:posx, posy: posy};
				}

				posx ++;
			}
		}

		return null;
	}

	function Pacman(){
		this.particle = null;
		this.radious = 10;
		this.bitTime = 100;
		this.lastBitTime = new Date().getTime();
		this.openMouth = true;
		this.angle = 0;
		this.scanTime = 200;
		this.lastScanTime = new Date().getTime();
		this.chasing = false;
		this.scanReverse = false;

		this.create = function(x,y, scanReverse){
			this.particle = Particle2.create(x,y,0,this.angle);
			this.radious = 15;
			this.scanReverse = scanReverse;
		}

		this.draw = function(){
			var c = _this.context;
			var c2 = _this.contextBg;

			c.save();
			c.translate(this.particle.x, this.particle.y);
			c.rotate(this.angle);

			c.fillStyle = "#FFFFFF";
			c.beginPath();
			c.arc(0, 0,this.radious,0,Math.PI*2,false);
			c.fill();

			if(!_this.drawing){
				c2.fillStyle="rgba(0,0,0,1)";
				c2.lineWidth=1;
				c2.globalCompositeOperation = 'destination-out';
				c2.beginPath();
				c2.arc(this.particle.x, this.particle.y, this.radious,Math.PI*2,false);
				c2.fill();
			}

			var currentTime = new Date().getTime();

			var nextPoint = null;
			if(currentTime - this.lastScanTime > this.scanTime){
				this.lastScanTime = currentTime;
				nextPoint = _this.scanBlack(this.scanReverse);
				if(nextPoint!=null){
					var dy = (nextPoint.posy) -this.particle.y;
					var dx = (nextPoint.posx) - this.particle.x;
					var newAngle = Math.atan2(dy,dx);
					this.particle.setSpeed(6);
					this.particle.setHeading(newAngle);
					
					this.angle = newAngle;

					var distance = Math.sqrt(dy*dy + dx*dx);
				}else{
					this.particle.setSpeed(0);

				}
			}

			if(currentTime - this.lastBitTime > this.bitTime){
				this.lastBitTime = currentTime;
				this.openMouth = !this.openMouth;
			}

			if(this.openMouth){
				
				c.globalCompositeOperation = 'destination-out';
				c.beginPath();
				c.moveTo(0, 0);

				var angle1 = 80*(Math.PI/180);
				var angle2 = 280*(Math.PI/180);
				c.lineTo(Math.cos(angle1)*(this.radious*10),Math.sin(angle1)*(this.radious+10));
				c.lineTo(Math.cos(angle2)*(this.radious*10),Math.sin(angle2)*(this.radious+10));
				c.lineTo(0, 0);
				c.fill();
			}else{
				c.strokeStyle = "#000000";
				c.beginPath();
				c.moveTo(0,0);
				c.lineTo(this.radious, 0);
				c.stroke();
			}

			c.globalCompositeOperation = 'source-over';
			c.restore();
		}
	}

}