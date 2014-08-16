function Bezier(){
	var _this = null;
	this.canvas = null;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	this.context = null;
	this.cx = 0;
	this.cy = 0;
	
	this.run = function(canvas, canvasWidth, canvasHeight){
		_this = this;
		require(["../ParticlesOpt/Particle"], function(Particles) {
		_this.canvas = canvas[1];
		_this.context = _this.canvas.getContext("2d");
		_this.init();
		});
	}

	this.init = function(){
		_this.canvasWidth = _this.canvas.width;
		_this.canvasHeight = _this.canvas.height;
		_this.cx = _this.canvas.width / 2;
		_this.cy = _this.canvas.height / 2;
		
		document.addEventListener("mousemove", function(e){
			//_this.springPoint.x = e.clientX;
			//_this.springPoint.y = e.clientY;
		})
		_this.draw();
	}

	this.draw = function(){
		_this.canvas.width = _this.canvas.width;

		var cont = _this.context;

		var point1 = {x: 200, y:200};
		var point2 = {x: 300, y:-200};
		var point3 = {x: 400, y:200};

		cont.save();
		cont.translate(300,200);
		cont.rotate(Math.PI*2*1.1);
		

		cont.beginPath();
		cont.moveTo(point1.x, point1.y);
		cont.quadraticCurveTo(point2.x, point2.y, point3.x, point3.y);
		cont.stroke();

		cont.restore();

		var point4 = {x: 500, y:200};
		var point5 = {x: 600, y:-200};
		var point6 = {x: 700, y:200};

		cont.beginPath();
		cont.moveTo(point4.x, point4.y);
		cont.quadraticCurveTo(point5.x, point5.y, point6.x, point6.y);
		cont.stroke();

		cont.save();
		cont.translate(300,200);
		cont.rotate(Math.PI*2/3);
		cont.restore();

		requestAnimationFrame(_this.draw);
	}
}