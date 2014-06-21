window.onload = function(){
	var p;
	var friction;
	require(["../Vectors/Vector","../Particles/Particle"], function(Vectors) {


	init();

	function init(){
		chaos.init();
		p = Particle.create(chaos.width / 2, chaos.height/2, 10, Math.random() * Math.PI * 2);
		p.radious = 10;
		p.friction = 0.97;
		setInterval(draw, 1);
	}

	function draw(){
		//chaos.context.translate(chaos.width*0.5,chaos.height*0.6);
		chaos.clear();
		/*var angle = 0;

		chaos.context.moveTo(Math.cos(angle)*10, Math.sin(angle)*10);
		while(angle <2*Math.PI){
			angle += .01;
			chaos.context.lineTo(Math.cos(angle)*10, Math.sin(angle)*10);
		}

		chaos.context.stroke();*/
		/*if(p.velocity.getLength() > friction.getLength()){
			friction.setAngle(p.velocity.getAngle());
			p.velocity.subtractFrom(friction);
		}else{
			p.velocity.setLength(0);
		}*/

		p.update();

		chaos.context.beginPath();
		chaos.context.arc(p.position.getX(), p.position.getY(), p.radious, 0, Math.PI * 2, false);
		chaos.context.fill();


	}
});
}