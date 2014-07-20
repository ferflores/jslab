window.onload = function(){
	var p;
	var friction;
	require(["../Vectors/Vector","../Particles/Particle"], function(Vectors) {
		var springPoint;
		var weight;
		var k = 0.2;

		init();

		function init(){
			layout.init();
			var canvasWidth = layout.canvas.width;
			var canvasHeight = layout.canvas.height;
			springPoint = Vector.create(canvasWidth/2, canvasHeight/2);
			weight = Particle.create(Math.random()*canvasWidth, Math.random()*canvasHeight,50,Math.random()*Math.PI*2);
			weight.radious = 20;
			weight.friction = 0.9;
			draw();
		}

		function draw(){
			//layout.context.translate(layout.width*0.5,layout.height*0.6);
			layout.clear();
			var distance = springPoint.subtract(weight.position);
			var springForce = distance.multiply(k);

			weight.velocity.addTo(springForce);
			weight.update();

			layout.context.beginPath();
			layout.context.arc(weight.position.getX(), weight.position.getY(), weight.radious, 0, Math.PI*2, false);
			layout.context.fill();

			layout.context.beginPath();
			layout.context.arc(springPoint.getX(), springPoint.getY(), 4, 0, Math.PI*2, false);
			layout.context.fill();

			layout.context.beginPath();
			layout.context.moveTo(weight.position.getX(), weight.position.getY());
			layout.context.lineTo(springPoint.getX(), springPoint.getY());
			layout.context.stroke();
			requestAnimationFrame(draw);
		}
	});
}