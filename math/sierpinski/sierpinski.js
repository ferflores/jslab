window.onload = function(){
	var size = 0;
	var maxDepth = 0;

	init();

	function init(){
		layout.init();

		size = layout.height * 0.5;

		draw();

		document.body.addEventListener("keyup",
			function(event){
				switch(event.keyCode){
					case 32:
						maxDepth += 1;
						draw();
						break;
					case 80:
						layout.popImage();
						break;
					default:
					break;
				}
			}
			);
	}

	function draw(){
		layout.clear();
		layout.context.save();
		layout.context.translate(layout.width*0.5,layout.height*0.6);
		layout.context.scale(size,size);
		drawTriangle(maxDepth);
		layout.context.restore();
	}

	function drawTriangle(depth){
		var angle = -Math.PI/2;

		if(depth===0){
			layout.context.beginPath();
			layout.context.moveTo(Math.cos(angle), Math.sin(angle));
			angle += Math.PI * 2 / 3;
			layout.context.lineTo(Math.cos(angle), Math.sin(angle));
			angle += Math.PI * 2 / 3;
			layout.context.lineTo(Math.cos(angle), Math.sin(angle));
			layout.context.fill();
		}else{
			layout.context.save();
			layout.context.translate(Math.cos(angle)*0.5, Math.sin(angle)*0.5);
			layout.context.scale(0.5,0.5);
			drawTriangle(depth-1);
			layout.context.restore();

			angle += Math.PI * 2 / 3;
			layout.context.save();
			layout.context.translate(Math.cos(angle)*0.5, Math.sin(angle) * 0.5);
			layout.context.scale(0.5,0.5);
			drawTriangle(depth-1);
			layout.context.restore();

			angle += Math.PI * 2 / 3;
			layout.context.save();
			layout.context.translate(Math.cos(angle)*0.5, Math.sin(angle) * 0.5);
			layout.context.scale(0.5,0.5);
			drawTriangle(depth-1);
			layout.context.restore();
		}
	}
}