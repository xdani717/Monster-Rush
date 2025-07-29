const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0, timeLeft = 30;
const monsters = [];
const spawnInterval = 1000;
const rareChance = 0.1;

function addMonster() {
  const isRare = Math.random() < rareChance;
  const size = isRare ? 30 : (20 + Math.random() * 30);
  const speed = isRare ? 3 : (1 + Math.random()*2);
  monsters.push({
    x: Math.random()*(canvas.width-size),
    y: canvas.height,
    size,
    speed,
    rare: isRare,
    appearTime: Date.now()
  });
  if (isRare) {
    playSignal();
  }
}

function playSignal(){
  // Blink-Effekt im Body
  document.body.style.border = '5px solid yellow';
  setTimeout(()=>document.body.style.border='',200);
}

canvas.addEventListener("click", (e)=>{
  for(let i=monsters.length-1;i>=0;i--){
    const m = monsters[i];
    if (e.clientX >= m.x && e.clientX <= m.x + m.size
      && e.clientY >= m.y && e.clientY <= m.y + m.size) {
      score += m.rare ? 50 : Math.round(50 / m.size);
      monsters.splice(i,1);
      document.getElementById("score").textContent = "Punkte: "+score;
      break;
    }
  }
});

function update(){
  monsters.forEach(m=> m.y -= m.speed);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  monsters.forEach(m=>{
    ctx.fillStyle = m.rare ? 'gold':'lime';
    ctx.fillRect(m.x,m.y,m.size,m.size);
  });
  monsters.filter(m=> m.y + m.size > 0);
  if (Math.random() < 0.02) addMonster();
}

function gameTick(){
  update();
  timeLeft -= 1/60;
  document.getElementById("timer").textContent = "Zeit: "+Math.ceil(timeLeft);
  if(timeLeft<=0){
    clearInterval(intervalId);
    alert("Spiel vorbei! Deine Punkte: "+score);
    const best = localStorage.getItem("bestScore")||0;
    if(score>best) {
      localStorage.setItem("bestScore",score);
      alert("Neuer Highscore!");
    }
  }
}

const intervalId = setInterval(gameTick,1000/60);