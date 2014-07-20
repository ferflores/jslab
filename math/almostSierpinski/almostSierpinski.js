window.onload = function(){
	var maxDepth = 0;
	var numShapes = 8;
	var angles = [0, Math.PI * 1/4, Math.PI * 2/4,Math.PI * 3/4,Math.PI * 4/4,Math.PI * 5/4,Math.PI * 6/4,Math.PI * 7/4,];
	var size = 0;
	var scaleFactor = .4;
	var dist = 0;
	var colors = ["#CC0000","#CC6600","#CCCC00","#66CC00","#00CC00","#","#00CC66","#00CCCC","#0066CC","#0000CC"]

	init();

	function init(){
		layout.init();

		size = layout.height / 8;
		dist = size * 1.4;

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
		drawShape();
		iterate(maxDepth);
		layout.context.restore();
	}

	function iterate(depth){
		for(var i = 0; i<numShapes; i++){
			layout.context.save();
			layout.context.rotate(angles[i]);
			layout.context.translate(dist,0);
			layout.context.scale(scaleFactor, scaleFactor);
			drawShape(depth);
			if(depth>0){
				iterate(depth-1);
			}

			layout.context.restore();
		}
	}

	function drawShape(depth){
		layout.context.fillStyle = colors[maxDepth-depth];
		layout.context.beginPath();
		layout.context.arc(0,0,size*Math.random(),0,Math.PI*2, false); //ultimo cambio aqui quitar random y queda la flor
		layout.context.fill();

	}
}