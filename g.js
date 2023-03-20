class Road
{
	constructor(image, y)
	{
		this.x = 0;
		this.y = y;
		this.loaded = false;

		this.image = new Image();
		
		var obj = this;

		this.image.addEventListener("load", function () { obj.loaded = true; });

		this.image.src = image;
	}

	Update(road) 
	{
		this.y += step; //The image will move down with every frame

		if(this.y > window.innerHeight) //if the image left the screen, it will change it's position
		{
			this.y = road.y - canvas.width + step; //New position depends on the second Road object
		}
	}
}

class Car
{
	constructor(image, x, y, isPlayer)
	{
		this.x = x;
		this.y = y;
		this.loaded = false;
		this.dead = false;
		this.isPlayer = isPlayer;

		this.image = new Image();

		var obj = this;

		this.image.addEventListener("load", function () { obj.loaded = true; });

		this.image.src = image;
	}

	Update()
	{
		if(!this.isPlayer)
		{
			this.y += step;
		}

		if(this.y > canvas.height + 50)
		{
			this.dead = true;
		}
	}

	Collide(car)
	{
		var hit = false;

		if(this.y < car.y + car.image.height * scale*0.97 && this.y + this.image.height * scale*0.97> car.y) //If there is collision by y
		{
			if(this.x + this.image.width * scale*0.5 > car.x && this.x < car.x + car.image.width * scale*0.5) //If there is collision by x
			{
				hit = true;
			}
		}

		return hit;
	}

	Move(v, d) 
	{
		if(v == "x") //Moving on x
		{
			d *= 2;

			this.x += d; //Changing position

			//Rolling back the changes if the car left the screen
			if(this.x + this.image.width * scale > canvas.width)
			{
				this.x -= d; 
			}
	
			if(this.x < 0)
			{
				this.x = 0;
			}
		}
		else //Moving on y
		{
			this.y += d;

			if(this.y + this.image.height * scale > canvas.height)
			{
				this.y -= d;
			}

			if(this.y < 0)
			{
				this.y = 0;
			}
		}
		
	}
}


const UPDATE_TIME = 1000 / 60;

var timer = null;

var canvas = document.getElementById("canvas"); //Getting the canvas from DOM
var ctx = canvas.getContext("2d"); //Getting the context to work with the canvas

var scale = 0.2; //Cars scale

Resize(); //Changing the canvas size on startup

window.addEventListener("resize", Resize); //Change the canvas size with the window size

//Forbidding openning the context menu to make the game play better on mobile devices
canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); return false; }); 

window.addEventListener("keydown", function (e) { KeyDown(e); }); //Listenning for keyboard events

var objects = []; //Game objects

var roads = 
[
	new Road("image/road.png", 0),
	new Road("image/road.png", canvas.width)
]; //Backgrounds

var player = new Car("image/car.png", canvas.width / 2, canvas.height / 2, true); //Player's object


var step = 5;
var score = 0 //счет
var speed =1

Start();


function Start()
{
	if(!player.dead)
	{
        document.getElementById("header").remove();
		newHeader();
		timer = setInterval(Update, UPDATE_TIME); //Updating the game 60 times a second
	}
}

function newHeader()
{
	let Header=document.createElement("header");
    Header.id="header";
	let Score = document.createElement("h2")
	Score.textContent=score
	Score.id="score"
	Header.prepend(Score)
	let Home = document.createElement("a")
	Home.textContent="Закончить"
	Home.href='/'
	Header.append(Home)
    document.body.prepend(Header);
}

function deleteHeader()
{
	document.getElementById("header").remove();
}

function Stop()
{
	deleteHeader()
    createHeader()
	clearInterval(timer); //Game stop
	timer = null;
}

function createHeader()
{
    let Header=document.createElement("header");
    Header.id="header";
    document.body.prepend(Header);
}

var isEven = function(someNumber) {
    return (someNumber % 2 == 0) ? 1 : 2;
  };

function Update() 
{
	roads[0].Update(roads[1]);
	roads[1].Update(roads[0]);
    i=RandomInteger(0, 100) 
	if(i> 98) //Generating new car
	{
		let Score = document.getElementById('score')
		score+=1;
		Score.textContent=score
        //необходимо сделать проверки, чтобы машины не были рядом!
        var n=isEven(i)
		objects.push(new Car("image/player".concat(n,'.png'), (n==2)?RandomInteger(10, canvas.width/2-90):RandomInteger(canvas.width/2+10, canvas.width-90), RandomInteger(250, 400) * -1, false));
	}

	player.Update();

	if(player.dead)
	{

        //заменить картинки и сказать, что игра окончена
		//alert("Crash!");
		Stop();
        createWindow("Игра окончена")
	}

	var isDead = false; 

	for(var i = 0; i < objects.length; i++)// проверка на захождение за горизонт приложения
	{
		objects[i].Update();

		if(objects[i].dead)
		{
			isDead = true;
		}
	}

	if(isDead)
	{
		objects.shift();
	}

	var hit = false;

	for(var i = 0; i < objects.length; i++)
	{
		hit = player.Collide(objects[i]);

		if(hit)
		{
            // необходимо сделать 
			//alert("Crash!");
			Stop();
			player.dead = true;
            createWindow('Игра окончена')
			break;
		}
	}

	Draw();
}

function Draw() //Working with graphics
{
	ctx.clearRect(0, 0, canvas.width, canvas.height); //Clearing the canvas

	for(var i = 0; i < roads.length; i++)
	{
		ctx.drawImage
		(
			roads[i].image, //Image
			0, //First X on image
			0, //First Y on image
			roads[i].image.width, //End X on image
			roads[i].image.height, //End Y on image
			roads[i].x, //X on canvas
			roads[i].y, //Y on canvas
			canvas.width, //Width on canvas
			canvas.width //Height on canvas
		);
	}

	DrawCar(player);

	for(var i = 0; i < objects.length; i++)
	{
		DrawCar(objects[i]);
	}
}

function DrawCar(car)
{
	ctx.drawImage
	(
		car.image, 
		0, 
		0, 
		car.image.width, 
		car.image.height, 
		car.x, 
		car.y, 
		car.image.width * scale, 
		car.image.height * scale 
	);
}

function KeyDown(e)
{
	switch(e.keyCode)
	{
		case 37: //Left
			player.Move("x", -step);
			break;

		case 39: //Right
			player.Move("x", step);
			break;

		case 38: //Up
			player.Move("y", -step);
			break;

		case 40: //Down
			player.Move("y", step);
			break;

		case 27: //Esc
			if(timer == null && !player.dead)
			{
                Continue();
			}
            else if(player.dead)
            {
                Again();
            }
			else
			{
                Stop();
                let timerId = setTimeout(createWindow("Игра остановлена"),3000)
			}
			break;
	}
}

function Resize()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function RandomInteger(min, max) 
{
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

async function createWindow(text)
{
    console.log(score)
    let NWindow=document.createElement("div");
    NWindow.className="NWindow";
    NWindow.id="NWindow";
    let to_say=document.createElement('h3')
    to_say.className='to_say'
    to_say.textContent=text
    NWindow.append(to_say);
    let Button1=document.createElement('button');
    Button1.id="again"
    Button1.textContent="Начать сначала"
    Button1.onclick=Again;
    NWindow.append(Button1);
    if(!text.localeCompare("Игра остановлена"))
    {
        let Button2=document.createElement('button');
        Button2.id="continue"
        Button2.textContent="Продолжить"
        Button2.onclick=Continue;
        NWindow.append(Button2);
    }
    canvas.before(NWindow);
    document.body.style.overflow="hidden";
}


function closeWindow()
{
    document.body.style.overflow="visible";
    document.body.style.pointerEvents='auto';
    console.log('remove')
    document.getElementById("NWindow").remove();
}

function Again()
{
	score=0;
    closeWindow();
    objects=[]
    player=null;
    player = new Car("image/car.png", canvas.width / 2, canvas.height / 2, true); //Player's object
    Start();
}

function Continue()
{
    closeWindow();
    Start()
}