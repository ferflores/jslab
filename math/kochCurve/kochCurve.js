window.onload = function(){
	var size = 0;
	var maxDepth = 0;

	init();

	function init(){
		chaos.init();

		size = chaos.height * 0.5;

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
		var p0 ={
			x:chaos.width * 0.1,
			y:chaos.height * 0.75
		}
		var p1 ={
			x:chaos.width * 0.9,
			y:chaos.height * 0.75
		}

		chaos.clear();
		chaos.context.lineWidth = 1;

		koch(p0, p1, maxDepth);
	}

	function koch(p0,p1,depth){
		var dx = p1.x - p0.x;
		var dy = p1.y - p0.y;

		var dist = Math.sqrt(dx * dx + dy * dy);
		var unit = dist / 3;

		var angle = Math.atan2(dy,dx);

		var pa = {
			x: p0.x + Math.cos(angle) * unit,
			y: p0.y + Math.sin(angle) * unit
		};

		var pb = {
			x: pa.x + Math.cos(angle - Math.PI/3) * unit,
			y: pa.y + Math.sin(angle - Math.PI/3) * unit
		};

		var pc = {
			x: p0.x + Math.cos(angle) * unit * 2,
			y: p0.y + Math.sin(angle) * unit * 2
		};

		if(depth === 0){
			chaos.context.beginPath();
			chaos.context.moveTo(p0.x, p0.y);
			chaos.context.lineTo(pa.x, pa.y);
			chaos.context.lineTo(pb.x, pb.y);
			chaos.context.lineTo(pc.x, pc.y);
			chaos.context.lineTo(p1.x, p1.y);
			chaos.context.stroke();
		}else{
			koch(p0,pa,depth-1);
			koch(pa,pb,depth-1);
			koch(pb,pc,depth-1);
			koch(pc, p1, depth-1);
		}
	}

}