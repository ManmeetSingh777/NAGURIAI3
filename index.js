const canvas = document.getElementById("Mycanvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;




class Voila {
  constructor({ position,imageSrc}) {
    this.position = position;
    
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.image=new Image()
    this.image.src= imageSrc
    
    
    
  }

  draw() {
      c.drawImage(this.image,this.position.x,this.position.y)
    
  }

  update() {
    this.draw();
   
  }

  
}

class character {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.health = 100;
    this.lastKey;
    this.attackbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, 50, this.height);

    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackbox.position.x,
        this.attackbox.position.y,
        this.attackbox.width,
        this.attackbox.height
      );
    }
  }

  update() {
    this.draw();
    this.attackbox.position.x = this.position.x + this.attackbox.offset.x;
    this.attackbox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else this.velocity.y += gravity;
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}


const background=new Voila({
  position:{
    x:0,
    y:0
  },
  imageSrc:'./img/background.jpg'
})

const player = new character({
  position: {
    x: 430,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

const enemy = new character({
  position: {
    x: 900,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackbox.position.x + rectangle1.attackbox.width >=
      rectangle2.position.x &&
    rectangle1.attackbox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackbox.position.y + rectangle1.attackbox.height >=
      rectangle2.position.y &&
    rectangle1.attackbox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

let timer = 121;
let timerId
function decreaseTimer() {
  console.log("executed");
  timerId=setTimeout(decreaseTimer, 1000);
  if (timer > 0) timer--;
  // console.log("this is working")
  document.querySelector("#timer").innerHTML = timer;
  if (timer === 0) {
    if (player.health === enemy.health) {
      document.querySelector("#tie").innerHTML = "TIE";
      document.querySelector("#tie").style.display = "flex";
    } else if (player.health > enemy.health) {
      document.querySelector("#tie").innerHTML = "HERO";
      document.querySelector("#tie").style.display = "flex";
    } else if (enemy.health > player.health) {
      document.querySelector("#tie").innerHTML = "VILLAIN";
      document.querySelector("#tie").style.display = "flex";
    }
  }else if(player.health<=0){
    document.querySelector('#tie').innerHTML='VILLAIN'
    document.querySelector('#tie').style.display = 'flex'
    clearTimeout(timerId)
  
}else if(enemy.health<=0){
    document.querySelector('#tie').innerHTML='HERO'
    document.querySelector('#tie').style.display = 'flex'
    clearTimeout(timerId)
  
}
}
decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update()

  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }
  
  if (keys.ArrowLeft.pressed && lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

 

  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;

    document.querySelector("#player2Bar").style.width = enemy.health + "%";
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;

    console.log("enemy");
    document.querySelector("#player1Bar").style.width = player.health + "%";
  }
}
animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      player.velocity.y = -25;
      break;
    case " ":
      player.attack();
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -25;
      break;
    case "ArrowDown":
      enemy.isAttacking = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  

  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const jumpButton = document.getElementById("jumpButton");
const attackButton = document.getElementById("attackButton");

leftButton.addEventListener("touchstart", () => {
  keys.a.pressed = true;
  player.lastKey = "a";
});

leftButton.addEventListener("touchend", () => {
  keys.a.pressed = false;
});

rightButton.addEventListener("touchstart", () => {
  keys.d.pressed = true;
  player.lastKey = "d";
});

rightButton.addEventListener("touchend", () => {
  keys.d.pressed = false;
});

jumpButton.addEventListener("touchstart", () => {
  player.velocity.y = -25;
});

attackButton.addEventListener("touchstart", () => {
  player.attack();
});

