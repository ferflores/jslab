window.onload = function(){

	var cx;
	var cy;
	var speed = 0.01;
	var offset = 200;
	var angle = 0;

	init();

	function init(){
		chaos.init();
		cx = chaos.width / 2;
		cy = chaos.height / 2;
		drawCircle();
		chaos.context.scale(10,10);
		chaos.context.translate(20,20);
		drawCircle();
		setInterval(oscilate, 1);
	}

	function drawCircle(){
		//chaos.clear();
		chaos.context.beginPath();
		chaos.context.arc(cx, cy, 1, 0, Math.PI*2, false);
		chaos.context.fill();
	}

	function oscilate(){
		var y = cy + Math.sin(angle) * offset;

		chaos.clear();
		chaos.context.beginPath();
		chaos.context.arc(cx, y, 50, 0, Math.PI*2, false);
		chaos.context.fill();

		angle += speed;
	}
}