window.onload = function(){
	require(["../Vectors/Vector"], function(Vector) {


	init();

	function init(){
		chaos.init();
		draw();
	}

	function draw(){
		chaos.context.translate(chaos.width*0.5,chaos.height*0.6);

		var angle = 0;

		chaos.context.moveTo(Math.cos(angle)*10, Math.sin(angle)*10);
		while(angle <2*Math.PI){
			angle += .01;
			chaos.context.lineTo(Math.cos(angle)*10, Math.sin(angle)*10);
		}

		chaos.context.stroke();


	}
});
}