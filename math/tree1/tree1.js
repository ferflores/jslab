window.onload = function(){
	var maxDepth = 0;
	var angles = [];
	var baseSize = 0;
	var scaleFactor = 0;

	init();

	function init(){
		layout.init();

		baseSize = layout.height * .8;

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
		layout.context.translate(layout.width*0.5,layout.height*0.9);
		drawTree(maxDepth, baseSize, 0);
		layout.context.restore();
	}

	function drawTree(depth , size, angle){
		//draw trunk
		angles = [-Math.PI/2 * Math.random(), Math.PI/2 * Math.random()];
		scaleFactor = .55 + Math.random() * .25;
		layout.context.save();
		layout.context.rotate(angle);
		layout.context.beginPath();
		layout.context.moveTo(0,0);
		layout.context.lineTo(0, -size*(1 - scaleFactor));
		layout.context.stroke();
		layout.context.translate(0,-size*(1 - scaleFactor));

		if(depth === 0){
			drawBranch(size * scaleFactor, angles[0], depth);
			drawBranch(size * scaleFactor , angles[1], depth);
		}else{
			drawTree(depth-1, size * scaleFactor, angles[0]);
			drawTree(depth-1, size * scaleFactor, angles[1]);
		}

		layout.context.restore();
	}

	function drawBranch(size, angle, depth){
		layout.context.save();
		layout.context.rotate(angle);
		layout.context.strokeStyle = ColorLuminance("1C5700", .8 );
		layout.context.beginPath();
		layout.context.moveTo(0,0);
		layout.context.lineTo(0, -size);
		layout.context.stroke();
		layout.context.restore();
	}

	function ColorLuminance(hex, lum) {

		// validate hex string
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		if (hex.length < 6) {
			hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		}
		lum = lum || 0;

		// convert to decimal and change luminosity
		var rgb = "#", c, i;
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i*2,2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ("00"+c).substr(c.length);
		}

		return rgb;
}
}