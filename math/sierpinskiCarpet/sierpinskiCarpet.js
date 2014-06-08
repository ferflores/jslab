window.onload = function(){
	var size = 0;
	var maxDepth = 0;
	var boxSize = 1;
	var translation = 0;
	var posMatrixTrans = [];
	var offset = -0.35;

	init();

	function init(){
		chaos.init();

		size = chaos.height * 0.5;
		posMatrixTrans = [[0,0],[boxSize/3,0],[boxSize/3*2,0],[boxSize/3*2,boxSize/3],
					     [boxSize/3*2,boxSize/3*2],[boxSize/3,boxSize/3*2],
						 [0,boxSize/3*2],[0,boxSize/3]];

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
		chaos.context.translate(chaos.width * 0.35, chaos.height * 0.25);
		chaos.context.scale(size,size);
		drawCarpet(maxDepth);
		chaos.context.restore();
	}

	function drawCarpet(depth){
		if(depth===0){
			chaos.context.fillRect(0, 0, boxSize, boxSize);
		}else{
			for(var x=0; x< posMatrixTrans.length; x++){

				chaos.context.save();
				chaos.context.translate(posMatrixTrans[x][0], posMatrixTrans[x][1]);
				chaos.context.scale(0.33333,0.33333);
				drawCarpet(depth-1);
				chaos.context.restore();
			}
		}
	}

}