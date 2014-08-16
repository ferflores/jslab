function EatingPacman(){
	var _this = null;
	this.cx = 0;
	this.cy = 0;
	this.context = null;
	this.stopped = false;
	this.canvas = null;
	this.canvasBg = null;
	this.pacmans = [];
	this.drawing = false;

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
		pacman.create(200,100);
		_this.pacmans.push(pacman);
	}

	this.drawPacmans = function(){
		for (var i = 0; i < _this.pacmans.length; i++) {
			_this.pacmans[i].draw();
			_this.pacmans[i].particle.update();
		};
	}

	this.bindEvents = function(){
		document.addEventListener("mousedown", function(e){
			var mX = (e.pageX  - _this.canvas.offsetParent.offsetLeft);
			var mY = (e.pageY  - _this.canvas.offsetParent.offsetTop);
			_this.drawing = true;
			_this.contextBg.moveTo(mX,mY);
		});

		document.addEventListener("mousemove", function(e){
			if(_this.drawing){
				var mX = (e.pageX  - _this.canvas.offsetParent.offsetLeft);
				var mY = (e.pageY  - _this.canvas.offsetParent.offsetTop);
				var bgc = _this.contextBg;
				bgc.lineWidth = 10;
				bgc.lineTo(mX, mY);
				bgc.stroke();
			}
		});

		document.addEventListener("mouseup", function(e){
			_this.drawing = false;
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

	function Pacman(){
		this.particle = null;
		this.radious = 10;
		this.bitTime = 100;
		this.time = new Date().getTime();
		this.openMouth = true;
		this.angle = 0;

		this.create = function(x,y){
			this.particle = Particle2.create(x,y,0,this.angle);
			this.radious = Math.random()*20+10;
		}

		this.draw = function(){
			var c = _this.context;

			c.save();
			c.translate(this.particle.x, this.particle.y);
			c.rotate(this.angle);

			c.fillStyle = "#FFFFFF";
			c.beginPath();
			c.moveTo(this.particle.x, this.particle.y);
			c.arc(0, 0,this.radious,0,Math.PI*2,false);
			c.fill();

			var currentTime = new Date().getTime();

			if(currentTime - this.time > this.bitTime){
				this.time = currentTime;
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