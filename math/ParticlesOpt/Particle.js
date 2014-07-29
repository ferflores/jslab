var Particle = {
	x:0,
	y:0,
	vx:0,
	vy:0,
	mass:1,
	gravity: 0,
	radious: 0,
	bounce: -1,
	friction: 1,

	create: function(x, y, speed, direction, gravity){
		var obj = Object.create(this);
		obj.x = x;
		obj.y = y;
		obj.vx = Math.cos(direction) * speed;
		obj.vy = Math.sin(direction) * speed;
		obj.gravity = gravity || 0;
		return obj;
	},

	getSpeed: function(){
		return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
	},

	setSpeed: function(speed){
		var heading = this.getHeading();
		this.vx = Math.cos(heading) * speed;
		this.vy = Math.sin(heading) * speed;
	},

	getHeading:function(){
		return Math.atan2(this.vy, this.vx);
	},

	setHeading: function(heading){
		var speed = this.getSpeed();
		this.vx = Math.cos(heading) * speed;
		this.vy = Math.sin(heading) * speed;
	},

	accelerate: function(ax, ay){
		this.vx += ax;
		this.vy += ay;
	},

	angleTo: function(particle2){
		return Math.atan2(particle2.y - this.y, 
			particle2.x - this.x);
	},

	distanceTo: function(particle2){
		var dx = particle2.x - this.x;
		var dy = particle2.y - this.y;

		return Math.sqrt(dx*dx + dy*dy);
	},

	gravitateTo: function(particle2){
		var dx = particle2.x - this.x;
		var dy = particle2.y - this.y;

		var distSq = dx*dx + dy*dy;
		var distance = Math.sqrt(distSq);
		var force = particle2.mass / distSq;
		var ax = dx / distance * force;
		var ay = dy / distance * force;

		this.vx += ax;
		this.vy += ay;
	},

	update: function(){
		this.vx *= this.friction;
		this.vy *= this.friction;
		this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;
	}

};