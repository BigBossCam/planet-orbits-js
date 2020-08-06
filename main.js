var canvas, width, height, ctx;

var objects = [];

function init(){
	canvas = document.getElementById("canvas");
	width = 1200;
	height = 600;
	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext('2d');
	createObjects();
	setInterval(function(){
		updateSystem();
		updateObjects(0.01);
		ctx.clearRect(0,0, width, height);
		drawObjects();
	}, 1);
}

function createObjects(){
	// x, y, velocity, angle, mass, raduis

	objects.push(new Body(100, 300, 250, Math.PI/2, 1000, 4));
	objects.push(new Body(150, 300, 200, Math.PI/2, 10, 0.5));

	objects.push(new Body(600, 300, 0, 0, 1000000, 15)); // Sol
}

function drawObjects(){
	for (var i=0; i < objects.length; i++)
		objects[i].draw(ctx);
}

function updateObjects(dt){
	for (var i=0; i < objects.length; i++)
		objects[i].update(dt);
}

function updateSystem(){
	var G = 10;

	for (var i=0; i < objects.length; i++)
		for (var j=0; j < objects.length; j++){
			if (i == j) continue;
			var b1 = objects[i];
			var b2 = objects[j];
			var dist = Math.sqrt(
				(b1.x - b2.x)*(b1.x - b2.x) +
				(b1.y - b2.y)*(b1.y - b2.y)
			);
			var force = G*(b1.m * b2.m)/dist/dist;
			var nx = (b2.x - b1.x)/dist;
			var ny = (b2.y - b1.y)/dist;
			b1.ax += nx * force / b1.m;
			b1.ay += ny * force / b1.m;
			b2.ax -= nx * force / b2.m;
			b2.ay -= ny * force / b2.m;
		}
}

function Body(x, y, v, angle, mass, radius){
	this.x = x;
	this.y = y;
	this.vx = v * Math.cos(angle);
	this.vy = v * Math.sin(angle);
	this.m = mass;
	this.radius = radius;
	this.ax = 0;
	this.ay = 0;
	this.update = function(dt) {
		this.vx += this.ax * dt;
		this.vy += this.ay * dt;

		this.x += this.vx * dt;
		this.y += this.vy * dt;

		this.ax = 0;
		this.ay = 0;
	};
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 6.28);
		ctx.strokeStyle = "white";
		ctx.stroke();
	};
}