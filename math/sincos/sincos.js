window.onload = function(){

	var cx;
	var cy;
	var speed = 0.01;
	var offset = 200;
	var angle = 0;

	init();

	function init(){
		layout.init();
		cx = layout.width / 2;
		cy = layout.height / 2;
		drawCircle();
		layout.context.scale(10,10);
		layout.context.translate(20,20);
		drawCircle();
		setInterval(oscilate, 1);
	}

	function drawCircle(){
		//layout.clear();
		layout.context.beginPath();
		layout.context.arc(cx, cy, 1, 0, Math.PI*2, false);
		layout.context.fill();
	}

	function oscilate(){
		var y = cy + Math.sin(angle) * offset;

		layout.clear();
		layout.context.beginPath();
		layout.context.arc(cx, y, 50, 0, Math.PI*2, false);
		layout.context.fill();

		angle += speed;
	}
}