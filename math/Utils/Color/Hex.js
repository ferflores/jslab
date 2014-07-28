var Hex = {
	hexToInt: function (hex) {
		return parseInt(hex,16);
	},

	intToHex: function(number){
		var hex = number.toString(16);
		if(hex.length<2){
			return "0"+hex;
		}
		return hex;
	},

	hexToRgbIntArray: function (hex) {
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		if (hex.length < 6) {
			hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		}

		return [this.hexToInt(hex[0]+hex[1]),this.hexToInt(hex[2]+hex[3]),this.hexToInt(hex[4]+hex[5])];
	},

	rgbIntArrayToHex: function(getRgbIntArray){
		return "#"+this.intToHex(getRgbIntArray[0])+this.intToHex(getRgbIntArray[1])+this.intToHex(getRgbIntArray[2]);
	},

	fadeToColor: function(srcColor, destColor, inc){
		var srcIntArray = this.hexToRgbIntArray(srcColor);
		var destIntArray = this.hexToRgbIntArray(destColor);

		for(var x=0;x<3;x++){
			if(srcIntArray[x] > destIntArray[x]){
				if(srcIntArray[x] - inc < destIntArray[x]){
					srcIntArray[x] = destIntArray[x];
				}else{
					srcIntArray[x] -= inc;
				}
				
			}else if(srcIntArray[x] < destIntArray[x]){
				if(srcIntArray[x] + inc > destIntArray[x]){
					srcIntArray[x] = destIntArray[x];
				}else{
					srcIntArray[x] += inc;
				}
			}
		}

		return this.rgbIntArrayToHex(srcIntArray);
	},

	isNumber: function(n){
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

};