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
		chaos.init();

		size = chaos.height / 8;
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
						chaos.popImage();
						break;
					default:
					break;
				}
			}
			);
	}

	function draw(){
		chaos.clear();
		chaos.context.save();
		chaos.context.translate(chaos.width*0.5,chaos.height*0.6);
		drawShape();
		iterate(maxDepth);
		chaos.context.restore();
	}

	function iterate(depth){
		for(var i = 0; i<numShapes; i++){
			chaos.context.save();
			chaos.context.rotate(angles[i]);
			chaos.context.translate(dist,0);
			chaos.context.scale(scaleFactor, scaleFactor);
			drawShape(depth);
			if(depth>0){
				iterate(depth-1);
			}

			chaos.context.restore();
		}
	}

	function drawShape(depth){
		chaos.context.fillStyle = colors[maxDepth-depth];
		chaos.context.beginPath();
		chaos.context.arc(0,0,size*Math.random(),0,Math.PI*2, false); //ultimo cambio aqui quitar random y queda la flor
		chaos.context.fill();

	}
}