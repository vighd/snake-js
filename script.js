var key = false;
var keysDown = [];
var fps = 10;
var imgLoad = false;
var bgLoad = false;
var db = 0;

var bg = new Image();
bg.onload = function()
{
	bgLoad = true;
}
bg.src = "images/bg.jpg";

var snakeImg = new Image();
snakeImg.onload = function()
{
	imgLoad = true;
}
snakeImg.src = "images/snakeImg.png";

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
		ctx.drawImage(bg, 0, 0, this.canvas.width, this.canvas.height);
	},
	reset: function() {
		snakeInit.init();
	}
}

var snakeInit = {
  x: 0,
  y: 0,
  width: 20,
  height: 20,
  foodX: 0,
  foodY: 0,
	food: true,
  score: 0,
	bodySize: 5,
	bodySliceSize: 20,
	body: [],
  facing: "right",
	tail: 0,
	message: "",
	scoreMsg: "",
	gameOver: false,
	init: function() {
		for(var i = this.bodySize - 1; i >= 0; i--) {
			this.body.push({x: i, y: 0});
		}
	},
	draw: function() {
		// Loop over every snake segment
        for (var i=0; i<this.body.length; i++) {
            var segment = this.body[i];
            var segx = segment.x;
            var segy = segment.y;
            var tilex = segx*this.width;
            var tiley = segy*this.height;

            // Sprite column and row that gets calculated
            var tx = 0;
            var ty = 0;

            if (i == 0) {
                // Head; Determine the correct image
                var nseg = this.body[i+1]; // Next segment
                if (segy < nseg.y) {
                    // Up
                    tx = 3; ty = 0;
                } else if (segx > nseg.x) {
                    // Right
                    tx = 4; ty = 0;
                } else if (segy > nseg.y) {
                    // Down
                    tx = 4; ty = 1;
                } else if (segx < nseg.x) {
                    // Left
                    tx = 3; ty = 1;
                }
            } else if (i == this.body.length-1) {
                // Tail; Determine the correct image
                var pseg = this.body[i-1]; // Prev segment
                if (pseg.y < segy) {
                    tx = 3; ty = 2;
                } else if (pseg.x > segx) {
                    // Right
                    tx = 4; ty = 2;
                } else if (pseg.y > segy) {
                    // Down
                    tx = 4; ty = 3;
                } else if (pseg.x < segx) {
                    // Left
                    tx = 3; ty = 3;
                }
            } else {
                // Body; Determine the correct image
                var pseg = this.body[i-1]; // Previous segment
                var nseg = this.body[i+1]; // Next segment
								if (pseg.x < segx && nseg.x > segx || nseg.x < segx && pseg.x > segx) {
                    // Horizontal Left-Right
                    tx = 1; ty = 0;
                } else if (pseg.x < segx && nseg.y > segy || nseg.x < segx && pseg.y > segy) {
                    // Angle Left-Down
                    tx = 2; ty = 0;
                } else if (pseg.y < segy && nseg.y > segy || nseg.y < segy && pseg.y > segy) {
                    // Vertical Up-Down
                    tx = 2; ty = 1;
                } else if (pseg.y < segy && nseg.x < segx || nseg.y < segy && pseg.x < segx) {
                    // Angle Top-Left
                    tx = 2; ty = 2;
                } else if (pseg.x > segx && nseg.y < segy || nseg.x > segx && pseg.y < segy) {
                    // Angle Right-Up
                    tx = 0; ty = 1;
                } else if (pseg.y > segy && nseg.x > segx || nseg.y > segy && pseg.x > segx) {
                    // Angle Down-Right
                    tx = 0; ty = 0;
                }
            }

            // Draw the image of the snake part
						var ctx = game.canvas.getContext("2d");
            ctx.drawImage(snakeImg, tx*64, ty*64, 64, 64, tilex, tiley, this.width, this.height);	}
		},
	genFood: function() {
		if (this.food) {
			this.foodX = Math.round(Math.random() * (game.canvas.width - this.bodySliceSize) / this.bodySliceSize);
			this.foodY = Math.round(Math.random() * (game.canvas.height - this.bodySliceSize) / this.bodySliceSize);
			this.food=false;
		}
		var ctx = game.canvas.getContext("2d");
		ctx.drawImage(snakeImg, 0, 193, 64, 64, this.foodX*this.bodySliceSize, this.foodY*this.bodySliceSize, this.width, this.height);
	},
	checkFoodColl: function() {
		if(this.x == this.foodX && this.y == this.foodY) {
			this.food=true;
			this.tail = {x: this.foodX, y:this.foodY};
			this.body.push(this.tail);
			this.score++;
			this.scoreMsg = "Score: " + this.score;
		}
	},
	drawMessage: function() {
		if (this.message !== null) {
			var ctx = game.canvas.getContext("2d");
			ctx.fillStyle = '#00F';
			ctx.strokeStyle = '#FFF';
			ctx.font = (game.canvas.height / 15) + 'px Impact';
			ctx.textAlign = 'center';
			ctx.fillText(this.message, game.canvas.width/2, game.canvas.height/2);
		}
	},
	drawScore: function() {
		if (this.message !== null) {
			var ctx = game.canvas.getContext("2d");
			ctx.fillStyle = '#00F';
			ctx.strokeStyle = '#FFF';
			ctx.font = (game.canvas.height / 25) + 'px Impact';
			ctx.textAlign = 'center';
			ctx.fillText(this.scoreMsg, 45, 20);
		}
	},
	checkMapColl: function() {
		if(this.x <= -1 || this.y <= -1 || this.x == (game.canvas.height/this.bodySliceSize)+this.bodySize || this.y == (game.canvas.width/this.bodySliceSize)-this.bodySize) {
			this.gameOver = true;
			this.message = 'GAME OVER - PRESS SPACEBAR';
			this.drawMessage();
		}
	},
	checkSnakeColl: function() {
		for(var i = 1; i < this.body.length; i++) {
				var s = this.body[i];
				if(s.y == 0) {

				} else if (this.x == s.x && this.y == s.y) {
					this.gameOver = true;
					this.message = 'GAME OVER - PRESS SPACEBAR';
					this.drawMessage();
				}
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
	snakeInit.checkMapColl();
	snakeInit.checkSnakeColl();
	snakeInit.genFood();
	snakeInit.drawScore();
	snakeInit.checkFoodColl();
	snakeInit.update();
}


function draw() {
    setTimeout(function() {
        requestAnimationFrame(draw);

        update();

    }, 1000 / fps);
}

draw();

function update()
{
	if (db == 8) {
		db = 0;
	}
	if(keysDown[32] && snakeInit.gameOver == true){
		snakeInit.gameOver = false;
		snakeInit.x = 0;
	  snakeInit.y = 0;
	  snakeInit.width = 20;
	  snakeInit.height = 20;
	  snakeInit.foodX = 0;
	  snakeInit.foodY = 0;
		snakeInit.food = true;
	  snakeInit.score = 0;
		snakeInit.bodySize = 5;
		snakeInit.bodySliceSize = 20;
		snakeInit.body = [];
	  snakeInit.facing = "right";
		snakeInit.tail = 0;
		snakeInit.message = "";
		snakeInit.init();
	}

	if(!snakeInit.gameOver) {
		game.clear();
		snakeInit.draw();
		snakeInit.checkMapColl();
		snakeInit.checkSnakeColl();
		snakeInit.genFood();
		snakeInit.drawScore();
		snakeInit.checkFoodColl();
		snakeInit.update();
	}
}


play();
