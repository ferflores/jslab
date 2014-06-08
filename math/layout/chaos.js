var chaos = (function(){
	return {
		init: function(run){
			this.canvas = document.getElementById("canvas");
			this.context = this.canvas.getContext("2d");
			this.setSize(window.innerWidth, window.innerHeight);

			if(typeof run !== "undefined" && run.length > 0){
				var scriptClass = new window[run]();
        		scriptClass.run(this.canvas,window.innerWidth, window.innerHeight);
        	}
		},

		setSize: function(width, height){
			this.width = canvas.width = width;
			this.height = canvas.height = height;
		},

		clear: function(color){
			if(color){
				this.context.fillStyle = color;
				this.context.fillRect(0, 0, this.width, this.height);
			}else{
				this.context.clearRect(0, 0, this.width, this.height);
			}
		},

		popImage: function(){
			var win = window.open("","Canvas image");
			var src = this.canvas.toDataURL("image/png");
			win.document.write("<img src='"+src+"' width='"+this.width+"' height='"+this.height+"'/>");
		}
	};
}());