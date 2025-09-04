var stars = [], starNum = 0
var mouseDownCoord = [0,0], mouseUpCoord = [0,0];
var playSpeed = Number(document.getElementById("playSpeed").value), pps = playSpeed
document.getElementById("info").style.display = "block"


var runner = setInterval(tick, 60)

document.getElementById("canva").addEventListener("mousedown", function(event) {
  mouseDownCoord[0] = event.clientX
  mouseDownCoord[1] = event.clientY
});

document.getElementById("canva").addEventListener("mouseup", function(event) {
  mouseUpCoord[0] = event.clientX
  mouseUpCoord[1] = event.clientY
  
  stars.push(new Star());
});

addEventListener("keydown", function(event) {
  var key = event.keyCode;
  
  if (key == $KEY.p) {
    if (runner == undefined) {
      runner = setInterval(tick, 60*(1/playSpeed))
    } else {
      clearInterval(runner)
      runner = undefined
    }
  }
  
  if (key == $KEY.i) {
    $toggleDisplay(document.getElementById("info"))
  }
});

function Star() {
  var mass = Number(document.getElementById("mass").value)
  this.x = mouseDownCoord[0]
  this.y = mouseDownCoord[1]
  this.mass = mass
  this.position = stars.length
  
  this.velocityX = -(mouseDownCoord[0] - mouseUpCoord[0])/100;
  this.velocityY = -(mouseDownCoord[1] - mouseUpCoord[1])/100;
  this.velocity = 0
  if (this.velocity == 0) {this.velocity = 0.001}
  
  $("body").append("<div class='star' id='star_" + starNum + "' style='left:" + this.x + "px;top:" + this.y + "px'></div>")
  this.id = document.getElementById("star_" + starNum)
  starNum++
  
  this.id.style.left = this.x + "px"
  this.id.style.top = this.y + "px"
  this.id.style.width = Math.sqrt(mass) + 2 + "px"
  this.id.style.height = this.id.style.width
  this.id.style.backgroundColor = "rgb(255" + "," + (255**2 / ((this.mass/30) * 254)) + "," + (255**2 / ((this.mass/30) * 254)) + ")"
  
  this.update = (i) => {
    for (var j = 0;j < stars.length;j++) {
      if (this.x - stars[j].x != 0 && this.y - stars[j].y != 0) {
        var dx = this.x - stars[j].x, dy = this.y - stars[j].y
        var hyp = Math.sqrt(dx**2 + dy**2)
        
        if (!document.getElementById("antiG").checked) {
          this.velocityX -= (dx/(9.807 * (this.mass)**2))
          this.velocityY -= (dy/(9.807 * (this.mass)**2))
        } else {
          this.velocityX += (dx/(9.807 * (this.mass)**2))
          this.velocityY += (dy/(9.807 * (this.mass)**2))
        }
        
        
        if (document.getElementById("collisions").checked) {
          if (hyp < $removeLabel(this.id.style.width)) {
            if (this.mass < stars[j].mass) {
              stars[j].addMass(this.mass)
              this.delete(this.position)
            } else {
              this.addMass(stars[j].mass)
              stars[j].delete(j)
            }
          }
        }
      }
    }
//     $log(this.velocityX + "<br>" + this.velocityY)
    
//     this.id.style.transform = "rotate(" + Math.sin(dy/dx) + "rad)"
//     $moveForward(this.id, this.velocityX)
    
    this.id.style.left = $removeLabel(this.id.style.left) + this.velocityX + "px"
    this.id.style.top = $removeLabel(this.id.style.top) + this.velocityY + "px"
    
    this.x = $removeLabel(this.id.style.left)
    this.y = $removeLabel(this.id.style.top)
    
    if (document.getElementById("showPaths").checked) {
      $("body").append("<div class='dot' style='left:" + ($removeLabel(this.id.style.left) + ($removeLabel(this.id.style.width)/2)) + "px;top:" + ($removeLabel(this.id.style.top) + ($removeLabel(this.id.style.height)/2)) + "px;background-color:" + this.id.style.backgroundColor + "'></div>")
    } else {
      $(".dot").remove()
    }
  }
  
  this.delete = (i) => {
    this.id.style.display = "none"
    this.id.style.opacity = 0
    stars.splice(i,1)
  }
  
  this.addMass = (z) => {
    this.mass += z;
    this.id.style.backgroundColor = "rgb(255" + "," + (255**2 / ((this.mass/30) * 254)) + "," + (255**2 / ((this.mass/30) * 254)) + ")"
    this.id.style.width = 2 + Math.sqrt(this.mass) + "px"
    this.id.style.height = this.id.style.width
  }
}


function tick() {
  for(var i = 0;i < stars.length;i++) {
    stars[i].update(i)
    
    if (stars[i].x < 0 || stars[i].x > window.innerWidth || stars[i].y < 0 || stars[i].y > window.innerHeight) {
      if (document.getElementById("border").checked) {stars[i].delete(i)}
    }
  }
  document.getElementById("starNum").innerHTML = "Stars: " + stars.length
  if (playSpeed != Number(document.getElementById("playSpeed").value)) {
    playSpeed = Number(document.getElementById("playSpeed").value)
    clearInterval(runner)
    runner = setInterval(tick, 60*(1/playSpeed))
  }
}

function createOrbit() {
  var pMass = document.getElementById("mass").value
  
  mouseDownCoord[0] = window.innerWidth/2;
  mouseDownCoord[1] = window.innerHeight/2;
  mouseUpCoord[0] = mouseDownCoord[0]
  mouseUpCoord[1] = mouseDownCoord[1]
  document.getElementById("mass").value = 400
  stars.push(new Star());
  
  mouseDownCoord[0] = window.innerWidth/2;
  mouseDownCoord[1] = window.innerHeight/1.5;
  mouseUpCoord[0] = mouseDownCoord[0] + 550
  mouseUpCoord[1] = mouseDownCoord[1]
  document.getElementById("mass").value = 10
  stars.push(new Star());
  
  document.getElementById("mass").value = pMass
}

function createBinary() {
  var pMass = document.getElementById("mass").value
  
  mouseDownCoord[0] = window.innerWidth/2;
  mouseDownCoord[1] = window.innerHeight/2 + 50;
  mouseUpCoord[0] = mouseDownCoord[0] - 150
  mouseUpCoord[1] = mouseDownCoord[1]
  document.getElementById("mass").value = 20
  stars.push(new Star());
  
  mouseDownCoord[0] = window.innerWidth/2;
  mouseDownCoord[1] = window.innerHeight/2 - 50;
  mouseUpCoord[0] = mouseDownCoord[0] + 150
  mouseUpCoord[1] = mouseDownCoord[1]
  document.getElementById("mass").value = 20
  stars.push(new Star());
  
  document.getElementById("mass").value = pMass
}