var key = false;
var keysDown = [];


var game = {
	canvas: document.createElement("canvas"),
	setup: function(){
		this.canvas.width = 500;
		this.canvas.height = 400;
		document.body.appendChild(this.canvas);
		//document.body.insertBefore(this.canvas, document.body.childNodes[i])
		window.addEventListener("keydown", function(e){
			//key = e.keyCode;
			keysDown[e.keyCode] = true;
      //console.log(e.keyCode);
		});
		window.addEventListener("keyup", function(e){
			//key = false;
			keysDown[e.keyCode] = false;
		});
		snakeInit.x = this.canvas.width/2;
		snakeInit.y = this.canvas.height/2;
	},
	clear: function(){
		var ctx = this.canvas.getContext("2d");
		ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
	}
}

var snakeInit = {
  x: null,
  y: null,
  width: 20,
  height: 20,
  speedX: 0,
  speedY: 0,
  score: 0,
	size: 7,
	body: [],
  facing: "right",
	tail: 0,
	init: function() {
		for(var i = this.size - 1; i >= 0; i--) {
			this.body.push({x: i, y: 0});
		}
	},
	draw: function() {
		for(var i = 0; i < this.body.length; i++) {
			var s = this.body[i];
			var ctx = game.canvas.getContext("2d");
			ctx.fillStyle = "black";
			ctx.fillRect(s.x*this.size, s.y*this.size, this.height, this.width);
		}
	},
  update: function(){
		this.x = this.body[0].x;
		this.y = this.body[0].y;

    if(keysDown[37] && this.facing != "right"){this.facing = "left";}
    if(keysDown[39] && this.facing != "left"){this.facing = "right";}
    if(keysDown[38] && this.facing != "down"){this.facing = "up";}
    if(keysDown[40] && this.facing != "up"){this.facing = "down";}

    switch(this.facing) {
      case 'up':
        this.y--;
        break;
      case 'down':
        this.y++;
        break;
      case 'left':
        this.x--;
        break;
      case 'right':
        this.x++;
        break;
    }

		//Move snake
		this.tail = this.body.pop();
		this.tail.x = this.x;
		this.tail.y = this.y;
		this.body.unshift(this.tail);
  }
}

function play()
{
	game.setup();
	snakeInit.init();
	snakeInit.draw();
	snakeInit.update();

	animate();
}

function animate()
{
	requestAnimationFrame = window.mozRequestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.msRequestAnimationFrame ||
						window.oRequestAnimationFrame;
	update();

	//rajzolás

	requestAnimationFrame(animate);
}

function update()
{
	game.clear();
	snakeInit.draw();
	snakeInit.update();
}


play();
