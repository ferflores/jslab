window.onload = function(){
	require(["../Vectors/Vector","../Particles/Particle"], function(Vectors) {

	/*var position = Vector.create(100,100);
	var velocity = Vector.create(0,0);*/
	//var particle = Particle.create(100,100, 1, Math.PI /6);
	var particles = [];
	var numParticles = 100;

	init();

	function init(){
		chaos.init();
		/*velocity.setLength(1);
		velocity.setAngle(Math.PI/2);*/

		for(var x = 0; x< numParticles; x++){
			var p = Particle.create(chaos.width/2, chaos.height/2, Math.random() * 4 + 1, Math.random() * Math.PI * 2, 0.05);
			particles.push(p);
		}

		setInterval(update, 1);
	}

	function update(){
		//position.addTo(velocity);

		//particle.update();
		chaos.context.clearRect(0,0,chaos.width,chaos.height);
		
		for(var x=0; x <numParticles; x++){
			var p = particles[x];
			p.update();
		
			chaos.context.beginPath();
			chaos.context.arc(p.position.getX(), p.position.getY(),4, 0, Math.PI * 2, false);
			chaos.context.fill();
		}
	}
});
}