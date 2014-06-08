var Particle = {
	position: null,
	velocity: null,
	gravity: null,
	radious: 0,
	bounce: -1,

	create: function(x, y, speed, direction, gravity){
		var obj = Object.create(this);
		obj.position = Vector.create(x,y);
		obj.velocity = Vector.create(0,0);
		obj.velocity.setLength(speed);
		obj.velocity.setAngle(direction);
		obj.gravity = Vector.create(0, gravity || 0);
		return obj;
	},

	accelerate: function(accel){
		this.velocity.addTo(accel);
	},

	angleTo: function(particle2){
		return Math.atan2(particle2.position.getY() - this.position.getY(), 
			particle2.position.getX() - this.position.getX());
	},

	distanceTo: function(particle2){
		var dx = particle2.position.getX() - this.position.getX();
		var dy = particle2.position.getY() - this.position.getY();

		return Math.sqrt(dx*dx + dy*dy);
	},

	gravitateTo: function(particle2){
		var gravityVector = Vector.create(0,0);
		var distance = this.distanceTo(particle2);

		gravityVector.setLength(particle2.mass / (distance * distance));
		gravityVector.setAngle(this.angleTo(particle2));

		this.velocity.addTo(gravityVector);
	},

	update: function(){
		this.velocity.addTo(this.gravity);
		this.position.addTo(this.velocity);
	}

};