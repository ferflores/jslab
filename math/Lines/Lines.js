function Lines(){
	var _this = null;
	this.cx = 0;
	this.cy = 0;
	this.context = null;
	this.stopped = false;
	this.canvas = null;
	this.environment = null;
	this.elements = [];
	this.enemies = [];
	this.floor = null;
	this.lineBoy = null;
	this.rightPressed = false;
	this.leftPressed = false;

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

		var environment = new Lines.FirstEnvironment();
		environment.create(_this.canvas);
		_this.elements.push(environment);
		_this.floor = environment.floorYPoints;

		var lineBoy = new Lines.LineBoy();
		var lineBoyParticle = Particle2.create(100, 100, 0, 0, Lines.Config.LineBoyGravity);
		lineBoy.create(lineBoyParticle, _this.canvas);
		_this.elements.push(lineBoy);

		var bug = new Lines.Beatle();
		bug.create(_this.cx, _this.cy, _this.canvas);
		_this.enemies.push(bug);

		bug = new Lines.Beatle();
		bug.create(_this.cx, _this.cy, _this.canvas);
		_this.enemies.push(bug);

		bug = new Lines.Beatle();
		bug.create(_this.cx, _this.cy, _this.canvas);
		_this.enemies.push(bug);

		_this.lineBoy = lineBoy;

	}

	this.drawElements = function(){
		for (var i = 0; i < _this.elements.length; i++) {
			var elm = _this.elements[i];

			elm.draw();

			this.detectCollisions(elm);
		};

		for (var i = 0; i < _this.enemies.length; i++) {
			_this.enemies[i].draw();
		};

		_this.detectEnemyCollision();
		
	}

	this.detectCollisions = function(element){
		if(element.floorStop){
			this.detectFloorCollision(element);
		}

	}

	this.detectFloorCollision = function(elm){
		if(elm.position.y + (elm.height/2) >= _this.floor[parseInt(elm.position.x)]){
			elm.position.gravity = 0;
			elm.position.y = _this.floor[parseInt(elm.position.x)]-(elm.height/2);
			elm.touchedFloor();
		}
	}

	this.detectEnemyCollision = function(){
		for (var i = 0; i < _this.enemies.length; i++) {
			var dx = _this.lineBoy.position.x -_this.enemies[i].position.x;
			var dy = _this.lineBoy.position.y -_this.enemies[i].position.y;

			var distance = Math.sqrt(dx*dx + dy*dy);
			if(distance<=20){
				_this.die();
			}
		};
	}

	this.handleKeys = function(){
		_this.handleRightKey();
		_this.handleLeftKey();
	}

	this.handleRightKey = function(){
		if(_this.rightPressed){
			if(_this.lineBoy.position.x< _this.canvas.width-5){
				_this.lineBoy.position.x+=2;
			}
			_this.lineBoy.state = Lines.LineBoyStates.Walking;
		}
	}

	this.handleLeftKey = function(){
		if(_this.leftPressed){
			if(_this.lineBoy.position.x > 0){
				_this.lineBoy.position.x-=2;
			}
			_this.lineBoy.state = Lines.LineBoyStates.Walking;
		}
	}

	this.handleUpKey = function(){
		if(_this.lineBoy.notJumpingOrFalling()){
			_this.lineBoy.jump();
		}
	}

	this.die = function(){
		for (var i = 0; i < _this.elements.length; i++) {
			if(_this.elements[i].elementType == Lines.ElementType.LineBoy){
				_this.elements.splice(i,1);
				_this.lineBoy = new Lines.LineBoy();
				var lineBoyParticle = Particle2.create(100, 100, 0, 0, Lines.Config.LineBoyGravity);
				_this.lineBoy.create(lineBoyParticle, _this.canvas);
				_this.elements.push(_this.lineBoy);
			}
		};
	}

	this.bindEvents = function(){
		// document.addEventListener("mousedown", function(e){
		// 	var mX = (e.pageX  - _this.canvas.offsetParent.offsetLeft);
		// 	var mY = (e.pageY  - _this.canvas.offsetParent.offsetTop);
		// });

		// document.addEventListener("mousemove", function(e){
		// 	var mX = (e.pageX  - _this.canvas.offsetParent.offsetLeft);
		// 	var mY = (e.pageY  - _this.canvas.offsetParent.offsetTop);
		// });

		document.body.addEventListener("keydown", function(e){
			switch(e.keyCode){
				case 38: //up
					_this.handleUpKey();
					break;
				case 37: //left
					_this.lineBoy.direction = Lines.LineBoyDirections.Right;
					_this.leftPressed = true;
					break;
				case 39: //right
					_this.lineBoy.direction = Lines.LineBoyDirections.Left;
					_this.rightPressed = true;
					break;
				default: 
					break;
			}	
		});


		document.body.addEventListener("keyup", function(e){
			switch(e.keyCode){
				case 38: //up
					break;
				case 37: //left
					_this.leftPressed = false;
					if(_this.lineBoy.notJumpingOrFalling()){
						_this.lineBoy.state = Lines.LineBoyStates.Stopped;
					}
					break;
				case 39: //right
					_this.rightPressed = false;
					if(_this.lineBoy.notJumpingOrFalling()){
						_this.lineBoy.state = Lines.LineBoyStates.Stopped;
					}
					break;
				case 32:
					break;
				default: 
					break;
			}	
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

	}


	this.main = function(){
		_this.erase();
		
		_this.drawElements();

		_this.handleKeys();

		if(!_this.stopped){
			requestAnimationFrame(_this.main);
		}
	}


}

// *** Config ***

Lines.Config = {
	LineBoyGravity: 0.4,
	LineBoySpeed: 2
}

Lines.ElementType = {
	LineBoy: 0,
	Floor: 1,
	Enemy: 2
}

Lines.LineBoyStates = {
	Stopped: 0,
	Walking: 1,
	Running: 2,
	Jumping: 3,
	Falling: 4
}

Lines.LineBoyDirections = {
	Right: 0,
	Left: 1
}

// *** Config end ***

// *** Line Boy ***

Lines.LineBoy = function(){

	this.position = null;
	this.canvas = null;
	this.context = null;
	this.state = Lines.LineBoyStates.Stopped;
	this.direction = Lines.LineBoyDirections.Right;
	this.height = 0;
	this.width = 0;
	this.elementType = Lines.ElementType.LineBoy;
	this.floorStop = true;
	this.walkingState = 0;
	this.walkingStateChangeTime = 100;
	this.walkingTime = 0;
	this.canJump = true;

	this.create = function(position, canvas){

		this.position = position;
		this.canvas = canvas;
		this.context = canvas.getContext("2d");

		this.height = canvas.height / 15;
		this.width = this.height - (this.height / 5);

	}

	this.draw = function(){
		var c = this.context;
		var pos = this.position;

		c.save();

		c.translate(pos.x, pos.y);

		c.beginPath();
		c.strokeStyle = "#FFFFFF";

		var head = this.drawHead(c);

		var trunkLength = this.drawTrunk(c, head);

		switch(this.state){
			case Lines.LineBoyStates.Stopped:
				this.drawStoppedState(c, trunkLength);
			break;
			case Lines.LineBoyStates.Walking:
				this.drawWalkingState(c, trunkLength);
			break;
			case Lines.LineBoyStates.Jumping:
				this.drawStoppedState(c, trunkLength);
			break;
		}
		
		c.stroke();

		c.restore();

		this.position.update();
	}

	this.drawHead = function(c){
		var headRadious = this.height/5;
		var headPos = -(this.height/headRadious + (headRadious/2));

		c.arc(0, headPos, headRadious, Math.PI*2, false);

		return {radious: headRadious, pos:headPos};
	}

	this.drawTrunk = function(c, head){
		// Draw trunk

		var trunkLength = this.height/2;
		c.moveTo(0, head.pos+(head.radious));
		c.lineTo(0, trunkLength);

		return trunkLength;
	}

	this.drawStoppedState = function(c, trunkLength){

		// Draw arms

		var armLength = this.width/2;
		c.moveTo(0,trunkLength /3);
		c.lineTo(this.width/5, armLength);
		c.moveTo(0,trunkLength /3);
		c.lineTo(-this.width/5, armLength);

		// Draw legs

		var legLength = this.width;
		c.moveTo(0,trunkLength);
		c.lineTo(this.width/5, legLength);
		c.moveTo(0,trunkLength);
		c.lineTo(-this.width/5, legLength);

		c.closePath();
	}

	this.drawWalkingState = function(c, trunkLength){
		if(this.walkingState == 0){
			this.drawStoppedState(c,trunkLength);
		}else if(this.walkingState == 1){

			// Draw arms

			var armLength = this.width/2;
			c.moveTo(0,trunkLength /3);
			c.lineTo(this.width/10, armLength);
			c.moveTo(0,trunkLength /3);
			c.lineTo(-this.width/10, armLength);

			// Draw legs

			var legLength = this.width;
			c.moveTo(0,trunkLength);
			c.lineTo(this.width/12, legLength);
			c.moveTo(0,trunkLength);
			c.lineTo(-this.width/12, legLength);

			c.closePath();
		}

		if(new Date().getTime() - this.walkingTime > this.walkingStateChangeTime){
			this.walkingState ++;
			if(this.walkingState>1){
				this.walkingState = 0;
			}
			this.walkingTime = new Date().getTime();
		}

	}

	this.touchedFloor = function(){
		if(!this.notJumpingOrFalling()){
			this.state = Lines.LineBoyStates.Stopped;
		}
		this.canJump = true;
	}

	this.jump = function(){
		if(this.canJump){
			this.position.setHeading(Math.PI*2-(Math.PI*2/4));
			this.position.setSpeed(10);
			this.position.gravity = Lines.Config.LineBoyGravity;
			this.state = Lines.LineBoyStates.Jumping;
			this.canJump = false;
		}
	}

	this.notJumpingOrFalling = function(){
		return this.state != Lines.LineBoyStates.Jumping && this.state != Lines.LineBoyStates.Falling;
	}

}

// *** Line Boy end ***

// *** Environment ***

Lines.FirstEnvironment = function(){

	this.canvas = null;
	this.context = null;
	this.floor = null;
	this.floorYPoints = [];
	this.elementType = Lines.ElementType.Floor;
	this.floorStop = false;

	this.create = function(canvas){
		this.canvas = canvas;
		this.context = canvas.getContext("2d");

		this.generateRandomFloor();
	}

	this.draw = function(){
		this.drawFloor(this.context);
	}

	this.drawFloor = function(context){
		context.beginPath();
		context.strokeStyle = "#166920";

		for (var i = 1; i < this.floorYPoints.length; i++) {
			context.moveTo(i-1,this.floorYPoints[i-1]);
			context.lineTo(i,this.floorYPoints[i]);
		};

		context.closePath();
		context.stroke();
	}

	this.generateRandomFloor = function(){
		var limLeft = 0,
			limRight = this.canvas.width;

		var averageFloor = this.canvas.height - 100;

		for (var i = 0; i < limRight; i++) {
			var randomChange = (-2)+Math.random()*(3);
			var floorY = averageFloor + randomChange;
			this.floorYPoints.push(floorY);
		};
	}
}

// *** Environment end ***

// *** Bug ***


Lines.Beatle = function(){
	this.position = null;
	this.angle = 0;
	this.size = 0;
	this.canvas = null;
	this.context = null;
	this.widthFactor = 0;
	this.heightFactor = 0;
	this.state = Lines.Beatle.getRandomState();
	this.counter = 0;
	this.setStateTime = 2000;
	this.lastStateTime = 0;
	this.wingPos = 1;
	this.wingTime = 0;
	this.angleOrientation = 0.05;
	this.setAngleTime = 1500;
	this.lastAngleTime = 0;
	this.legsUp = false;
	this.moveLegsTime = 0;
	this.cx = 0;
	this.cy = 0;
	this.floorStop = false;
	var c = null;

	this.create = function(x, y, canvas){
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		c = this.context;
		this.cx  = canvas.width/2;
		this.cy = canvas.height / 2;
		this.angle = Math.random()*Math.PI * 2;
		this.size = Math.random() * 20+10;
		this.heightFactor = this.size*1.1;
		this.widthFactor = this.size/4;
		this.position = Particle2.create(x, y, 0, this.angle);
		this.lastStateTime = new Date().getTime();
		this.wingTime = new Date().getTime();
	}

	this.draw = function(){
		var c = this.context;
		this.context.strokeStyle = "#FFFFFF";
		this.counter++;
		if(this.counter>1000){
			this.counter = 0;
		}

		c.save();
		c.translate(this.position.x,this.position.y);
		c.rotate(this.angle-(Math.PI*2/4*3));

		this.drawBody();
		this.drawHead();
		this.drawWings();
		this.drawLegs();

		c.moveTo(0,0);
		c.closePath();
		c.stroke();
		c.restore();

		if(new Date().getTime() - this.lastStateTime > this.setStateTime){
			this.lastStateTime = new Date().getTime();
			this.setStateTime = Math.random()*3000 + 2000;
			this.state = Lines.Beatle.getRandomState();
		}

		if(this.position.x > this.canvas.width+this.size || this.position.x < -this.size
			|| this.position.y > this.canvas.height-100 || this.position.y < -this.size){
			var dy = this.cy - this.position.y;
			var dx = this.cx - this.position.x;

			var newAngle = Math.atan2(dy,dx);
			this.angle = newAngle;

		}else{
			if(this.state == "Beatleing"){
				this.angle += this.angleOrientation;
			}

			if(this.state == "walking"){
				this.angle += this.angleOrientation*0.2;
			}
		}

		if(new Date().getTime() - this.lastAngleTime > this.setAngleTime){
			this.angleOrientation = -(this.angleOrientation);
			this.lastAngleTime = new Date().getTime();
			this.setAngleTime = Math.random()*2000+1000;
		}

	}

	this.drawBody = function(){

		var upPoint = {
			x:0,
			y:-this.heightFactor
		}

		var leftDownPoint = {
			x:-this.widthFactor-5,
			y:this.heightFactor
		}

		var rightDownPoint = {
			x:this.widthFactor+5,
			y:this.heightFactor
		}

		var rightPoint = {
			x: this.widthFactor,
			y: 0
		}

		var leftPoint = {
			x: -this.widthFactor,
			y: 0
		}

		c.beginPath();
		c.moveTo(-this.widthFactor, 0);
		c.quadraticCurveTo(upPoint.x, upPoint.y, rightPoint.x, rightPoint.y);
		c.moveTo(this.widthFactor, 0);
		c.lineTo(leftPoint.x, leftPoint.y);
		c.bezierCurveTo(leftDownPoint.x, leftDownPoint.y, rightDownPoint.x, rightDownPoint.y, rightPoint.x, rightPoint.y);

	}

	this.drawHead = function(){
		var headPoint = {
			x: 0,
			y:-(this.heightFactor - this.heightFactor/4)
		}

		this.context.moveTo(headPoint.x + (this.size/5), headPoint.y);
		this.context.arc(headPoint.x, headPoint.y,this.size/4,0,Math.PI*2,false);
	}

	this.drawWings = function(){
		var initLeftWing = {
			x:0,
			y:-this.heightFactor/6
		}

		var endLeftWing = {
			x:0,
			y:this.heightFactor
		}

		var initRightWing = {
			x:0,
			y:-this.heightFactor/6
		}

		var endRightWing = {
			x:0,
			y:this.heightFactor
		}

		var leftWingControlPoint = null;

		var rightWingControlPoint = null;

		if(this.state == "stopped" || this.state == "walking" || this.state == "cleaning"){

			leftWingControlPoint = {
				x:-(this.widthFactor*3),
				y:this.heightFactor
			}

			rightWingControlPoint = {
				x:this.widthFactor*3,
				y:this.heightFactor
			}

			c.moveTo(initLeftWing.x, initLeftWing.y);
			c.quadraticCurveTo(leftWingControlPoint.x, leftWingControlPoint.y, endLeftWing.x, endLeftWing.y);
			c.lineTo(initLeftWing.x,initLeftWing.y);

			c.moveTo(initRightWing.x, initRightWing.y);
			c.quadraticCurveTo(rightWingControlPoint.x, rightWingControlPoint.y, endRightWing.x, endRightWing.y);
			c.lineTo(initRightWing.x, initRightWing.y);

		}else if(this.state = "Beatleing"){

			this.position.setSpeed(5);
			this.position.setHeading(this.angle);
			this.position.update();

			if(this.wingPos == 1){
				leftWingControlPoint = {
					x:-(this.widthFactor*9),
					y:-this.heightFactor
				}

				rightWingControlPoint = {
					x:this.widthFactor*9,
					y:-this.heightFactor
				}
			}else if(this.wingPos == 2){
				leftWingControlPoint = {
					x:-(this.widthFactor*9),
					y:0
				}

				rightWingControlPoint = {
					x:this.widthFactor*9,
					y:0
				}
			}else{
				leftWingControlPoint = {
					x:-(this.widthFactor*9),
					y:this.heightFactor
				}

				rightWingControlPoint = {
					x:this.widthFactor*9,
					y:this.heightFactor
				}
			}

			if(new Date().getTime() - this.wingTime > 15){
				this.wingPos++;
				this.wingTime = new Date().getTime();
			}


			c.moveTo(initLeftWing.x, initLeftWing.y);
			c.quadraticCurveTo(leftWingControlPoint.x, leftWingControlPoint.y, endLeftWing.x, endLeftWing.y-this.heightFactor/3);
			c.lineTo(endLeftWing.x,endLeftWing.y-this.heightFactor/3);

			c.moveTo(initRightWing.x, initRightWing.y);
			c.quadraticCurveTo(rightWingControlPoint.x, rightWingControlPoint.y, endRightWing.x, endRightWing.y-this.heightFactor/3);
			c.lineTo(endRightWing.x, endRightWing.y-this.heightFactor/3);

			if(this.wingPos >=4){
				this.wingPos = 1;
			}
		}else{
			console.log("unknown state: ",this.state);
		}

	}

	this.drawLegs = function(){
		if(this.state == "stopped" || this.state == "cleaning"){
			this.position.setSpeed(0);
			var leg1 = {
				initX: -this.widthFactor,
				initY: 0,
				p1X: -this.widthFactor-(this.widthFactor/3),
				p1Y: -this.heightFactor/4,
				p2X: -this.widthFactor-(this.widthFactor*2),
				p2Y: 0
			}
			c.moveTo(leg1.initX, leg1.initY);
			c.lineTo(leg1.p1X, leg1.p1Y);
			c.lineTo(leg1.p2X, leg1.p2Y);

			c.moveTo(-(leg1.initX), leg1.initY);
			c.lineTo(-(leg1.p1X), leg1.p1Y);
			c.lineTo(-(leg1.p2X), leg1.p2Y);

			var leg2 = {
				initX: -this.widthFactor+2,
				initY: -this.heightFactor/4,
				p1X: -this.widthFactor-(this.widthFactor/4),
				p1Y: -this.heightFactor/2,
				p2X: -this.widthFactor-(this.widthFactor*2),
				p2Y: -this.heightFactor/5
			}

			c.moveTo(leg2.initX, leg2.initY);
			c.lineTo(leg2.p1X, leg2.p1Y);
			c.lineTo(leg2.p2X, leg2.p2Y);

			c.moveTo(-(leg2.initX), leg2.initY);
			c.lineTo(-(leg2.p1X), leg2.p1Y);
			c.lineTo(-(leg2.p2X), leg2.p2Y);

			var leg3 = {
				initX: -this.widthFactor,
				initY: this.heightFactor/4,
				p1X: -this.widthFactor-(this.widthFactor/2),
				p1Y: -this.heightFactor/20,
				p2X: -this.widthFactor-(this.widthFactor*2),
				p2Y: this.heightFactor/2
			}

			c.moveTo(leg3.initX, leg3.initY);
			c.lineTo(leg3.p1X, leg3.p1Y);
			c.lineTo(leg3.p2X, leg3.p2Y);

			c.moveTo(-(leg3.initX), leg3.initY);
			c.lineTo(-(leg3.p1X), leg3.p1Y);
			c.lineTo(-(leg3.p2X), leg3.p2Y);

		}else if(this.state == "Beatleing"){
			var leg1 = {
				initX: -this.widthFactor,
				initY: 0,
				p1X: -this.widthFactor-(this.widthFactor),
				p1Y: this.heightFactor,
			}
			c.moveTo(leg1.initX, leg1.initY);
			c.lineTo(leg1.p1X, leg1.p1Y);

			c.moveTo(-(leg1.initX), leg1.initY);
			c.lineTo(-(leg1.p1X), leg1.p1Y);

			var leg2 = {
				initX: -this.widthFactor,
				initY: this.heightFactor/2,
				p1X: -this.widthFactor-(this.widthFactor/2),
				p1Y: this.heightFactor*0.9
			}

			c.moveTo(leg2.initX, leg2.initY);
			c.lineTo(leg2.p1X, leg2.p1Y);

			c.moveTo(-(leg2.initX), leg2.initY);
			c.lineTo(-(leg2.p1X), leg2.p1Y);

		}else if(this.state == "walking"){
			this.position.setSpeed(1);
			this.position.setHeading(this.angle);
			this.position.update();

			if(this.legsUp){
				var leg1 = {
					initX: -this.widthFactor,
					initY: 0,
					p1X: -this.widthFactor-(this.widthFactor/3),
					p1Y: -this.heightFactor/4,
					p2X: -this.widthFactor-(this.widthFactor*2),
					p2Y: 0
				}

				c.moveTo(leg1.initX, leg1.initY);
				c.lineTo(leg1.p1X, leg1.p1Y);
				c.lineTo(leg1.p2X, leg1.p2Y);

				c.moveTo(-(leg1.initX), leg1.initY);
				c.lineTo(-(leg1.p1X), leg1.p1Y);
				c.lineTo(-(leg1.p2X), leg1.p2Y);

				var leg2 = {
					initX: -this.widthFactor+2,
					initY: -this.heightFactor/4,
					p1X: -this.widthFactor-(this.widthFactor/4),
					p1Y: -this.heightFactor/2,
					p2X: -this.widthFactor-(this.widthFactor*2),
					p2Y: -this.heightFactor/5
				}

				c.moveTo(leg2.initX, leg2.initY);
				c.lineTo(leg2.p1X, leg2.p1Y);
				c.lineTo(leg2.p2X, leg2.p2Y);

				c.moveTo(-(leg2.initX), leg2.initY);
				c.lineTo(-(leg2.p1X), leg2.p1Y);
				c.lineTo(-(leg2.p2X), leg2.p2Y);

				var leg3 = {
					initX: -this.widthFactor,
					initY: this.heightFactor/4,
					p1X: -this.widthFactor-(this.widthFactor/2),
					p1Y: -this.heightFactor/20,
					p2X: -this.widthFactor-(this.widthFactor*2),
					p2Y: this.heightFactor/2
				}

				c.moveTo(leg3.initX, leg3.initY);
				c.lineTo(leg3.p1X, leg3.p1Y);
				c.lineTo(leg3.p2X, leg3.p2Y);

				c.moveTo(-(leg3.initX), leg3.initY);
				c.lineTo(-(leg3.p1X), leg3.p1Y);
				c.lineTo(-(leg3.p2X), leg3.p2Y);
			}else{
				var leg1 = {
						initX: -this.widthFactor,
						initY: 0,
						p1X: -this.widthFactor-(this.widthFactor/3),
						p1Y: (-this.heightFactor/4)+this.heightFactor/5,
						p2X: -this.widthFactor-(this.widthFactor*2),
						p2Y: this.heightFactor/5
					}

					c.moveTo(leg1.initX, leg1.initY);
					c.lineTo(leg1.p1X, leg1.p1Y);
					c.lineTo(leg1.p2X, leg1.p2Y);

					c.moveTo(-(leg1.initX), leg1.initY);
					c.lineTo(-(leg1.p1X), leg1.p1Y);
					c.lineTo(-(leg1.p2X), leg1.p2Y);

					var leg2 = {
						initX: -this.widthFactor+2,
						initY: -this.heightFactor/4,
						p1X: -this.widthFactor-(this.widthFactor/4),
						p1Y: (-this.heightFactor/2)+this.heightFactor/5,
						p2X: -this.widthFactor-(this.widthFactor*2),
						p2Y: (-this.heightFactor/5)+this.heightFactor/5
					}

					c.moveTo(leg2.initX, leg2.initY);
					c.lineTo(leg2.p1X, leg2.p1Y);
					c.lineTo(leg2.p2X, leg2.p2Y);

					c.moveTo(-(leg2.initX), leg2.initY);
					c.lineTo(-(leg2.p1X), leg2.p1Y);
					c.lineTo(-(leg2.p2X), leg2.p2Y);

					var leg3 = {
						initX: -this.widthFactor,
						initY: this.heightFactor/4,
						p1X: -this.widthFactor-(this.widthFactor/2),
						p1Y: (-this.heightFactor/20)+this.heightFactor/5,
						p2X: -this.widthFactor-(this.widthFactor*2),
						p2Y: (this.heightFactor/2)+this.heightFactor/5
					}

					c.moveTo(leg3.initX, leg3.initY);
					c.lineTo(leg3.p1X, leg3.p1Y);
					c.lineTo(leg3.p2X, leg3.p2Y);

					c.moveTo(-(leg3.initX), leg3.initY);
					c.lineTo(-(leg3.p1X), leg3.p1Y);
					c.lineTo(-(leg3.p2X), leg3.p2Y);
			}

			if(new Date().getTime() - this.moveLegsTime > 60){
				this.legsUp = !this.legsUp;
				this.moveLegsTime = new Date().getTime();
			}

		}
	}
}

Lines.Beatle.states = ["stopped", "Beatleing", "walking"];
Lines.Beatle.getRandomState = function(){
	return Lines.Beatle.states[Math.round(Math.random()*(Lines.Beatle.states.length-1))];
}
// *** Bug End ***
