
var wipwrp = window.wipwrp || {};
	
	
wipwrp.services = (function() {

	var self = {}
	var stage, stageCenter, ctx;
	var mousePos = {};
	var globalRotation = 0;

	self.practices = [];
	

	self.init = function(){
		retrieveDataFromDom(initCanvas);
	}


	function retrieveDataFromDom(callback){
		var wrp = document.querySelector('ul#practices');
		var practiceNodes = wrp.querySelectorAll('li.practice');
		for (i = 0; i < practiceNodes.length; i++) { 
			var practiceName = practiceNodes[i].querySelector('li.practice h5 a').innerHTML;
			var serviceNodes = practiceNodes[i].querySelectorAll('li');
			var practiceServiceNames = [];
			for (u = 0; u < serviceNodes.length; u++) {
				practiceServiceNames.push(serviceNodes[u].innerHTML);
			}
			// chiave: nome area, records: array dei i servizi dentro
			// self.practices[practiceName] = practiceServiceNames; 
			self.practices[i] = { 'name': practiceName, 'services': practiceServiceNames}; 
		};
		if (callback && typeof callback === "function") {
	        callback();
	    }
	}

	function initCanvas(){
		// remove the standard html 4 services
		document.querySelector('#practices').remove();

		// create a canvas stage
		stage = document.createElement("canvas");
	    stage.setAttribute('id', 'practices');
	    document.querySelector("#main").appendChild(stage);
		ctx = stage.getContext('2d');

		// resize the canvas to fill browser window dynamically
	    window.addEventListener('resize', resetCanvas, false);
	    resetCanvas();

	    //get mouse position:
	    window.addEventListener("mousemove", function(event){
		    mousePos = {
	    		 x: event.clientX
	    		,y: event.clientY
	    	};
	    });

	    drawThings();

        // remove blocker
	   wipwrp.container.destroyLoader();
	}


    function resetCanvas() {
        stage.width = window.innerWidth;
        stage.height = window.innerHeight;
        stageCenter = {
    		 x: (stage.width / 2)
    		,y: (stage.height / 2)
    	}
    }

	function drawThings(){
		// clear canvas
		ctx.clearRect(0, 0, stage.width, stage.height);

		// create Areas:
		var practicesRadius = stage.height / 3; 
		var practicesAngle = 0;
		// angle increment in radians:
	    var practicesAngleIncrement = (2*Math.PI) / self.practices.length; 
	    // ok, cycle Practices
		for (i = 0; i < self.practices.length; i++) { 
			var practiceX = Math.round(stageCenter.x + practicesRadius * Math.cos(practicesAngle + globalRotation));
        	var practiceY = Math.round(stageCenter.y + practicesRadius * Math.sin(practicesAngle + globalRotation));
			filledCircle({
	 		 	 x: practiceX
	 		 	,y: practiceY
	 		 	,rad:5
	 		});
	 		practicesAngle += practicesAngleIncrement;
	 		// Area Text:
	 		writeText({
	 			 font: '13px Arial'
	 			,color: '#ffffff'
	 			,x: practiceX+10
	 			,y: practiceY+5
	 			,txt: self.practices[i].name
	 		});

	 		// create Services in this Practice
			var servicesRadius = 80; 
			var servicesAngle = 0;
			// angle increment in radians:
		    var servicesAngleIncrement = (2*Math.PI) / self.practices[i].services.length; 
		    // ok, cycle Services
			for (s = 0; s < self.practices[i].services.length; s++) {
				var serviceX = Math.round(practiceX + servicesRadius * Math.cos(servicesAngle - globalRotation*2));
	        	var serviceY = Math.round(practiceY + servicesRadius * Math.sin(servicesAngle - globalRotation*2));
				filledCircle({
		 		 	 x: serviceX
		 		 	,y: serviceY
		 		 	,rad:3
		 		});
		 		servicesAngle += servicesAngleIncrement;
		 		// Service Text:
		 		writeText({
		 			 font: '12px RobotoLight'
		 			,color: '#ccc'
		 			,x: serviceX+10
		 			,y: serviceY+5
		 			,txt: self.practices[i].services[s]
		 		});
				// Connect with a line Service and Area
				ctx.beginPath();
				ctx.moveTo(serviceX,serviceY);
 				ctx.strokeStyle = '#ffffff';
				ctx.lineTo(practiceX,practiceY);
				ctx.stroke();
			}
		}

		globalRotation += 0.005;
	  
	    // init the animation frame
	    window.requestAnimationFrame(drawThings);
	}

	function strokedCircle(opt){
		//{x:int,y:int,rad:int}
    	ctx.beginPath();
 		ctx.arc(opt.x, opt.y, opt.rad, 0, 2 * Math.PI, false);
 		ctx.lineWidth = 1;
 		ctx.strokeStyle = '#ffffff';
 		ctx.stroke();	
	}

	function filledCircle(opt){
		//{x:int,y:int,rad:int}
    	ctx.beginPath();
 		ctx.arc(opt.x, opt.y, opt.rad, 0, 2 * Math.PI, false);
 		ctx.fillStyle = '#ffffff';
 		ctx.fill();
	}

	function writeText(opt){
		// {font: '11px FontName', color: 'colorString', x:int,y:int, txt : 'string'}
		ctx.font = opt.font;
		ctx.fillStyle = opt.color;
		ctx.fillText(opt.txt,opt.x,opt.y);
	}


	return self;

})();



wipwrp.services.init();