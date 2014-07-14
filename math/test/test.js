window.onload = function(){
	var p;
	var friction;
	require(["../Vectors/Vector","../Particles/Particle"], function(Vectors) {
		var springPoint;
		var weight;
		var k = 0.2;

		init();

		function init(){
			chaos.init();
			var canvasWidth = chaos.canvas.width;
			var canvasHeight = chaos.canvas.height;
			springPoint = Vector.create(canvasWidth/2, canvasHeight/2);
			weight = Particle.create(Math.random()*canvasWidth, Math.random()*canvasHeight,50,Math.random()*Math.PI*2);
			weight.radious = 20;
			weight.friction = 0.9;
			draw();
		}

		function draw(){
			//chaos.context.translate(chaos.width*0.5,chaos.height*0.6);
			chaos.clear();
			var distance = springPoint.subtract(weight.position);
			var springForce = distance.multiply(k);

			weight.velocity.addTo(springForce);
			weight.update();

			chaos.context.beginPath();
			chaos.context.arc(weight.position.getX(), weight.position.getY(), weight.radious, 0, Math.PI*2, false);
			chaos.context.fill();

			chaos.context.beginPath();
			chaos.context.arc(springPoint.getX(), springPoint.getY(), 4, 0, Math.PI*2, false);
			chaos.context.fill();

			chaos.context.beginPath();
			chaos.context.moveTo(weight.position.getX(), weight.position.getY());
			chaos.context.lineTo(springPoint.getX(), springPoint.getY());
			chaos.context.stroke();
			requestAnimationFrame(draw);
		}
	});
}