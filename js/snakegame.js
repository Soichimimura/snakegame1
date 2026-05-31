const WIDTH = 20;
const HEIGHT = 20;
const CELL_SIZE = 20; 

const SPEEDS = {
    1: 200,   // Easy
    2: 120,   // Normal
    3: 60     // Hard
};

class Snake{


   constructor(){

    this.DIR={
    up:{x: 0,y: -1},
    down:{x: 0,y: 1},
    left:{x: -1,y: 0},
    right:{x: 1,y: 0},
   }

    this.OPPOSITE = { 
     up: 'down', 
     down: 'up',
     left: 'right',
     right: 'left' 
    };

    this.body = [
         {x:10,y:10},
         {x:11,y:10}
    ];
    this.currentdir = 'left';
    this.nextdir= 'left';

    }

    setDir(newDir){
        this.nextdir = newDir;
    }

    
     move(food){

    if (this.nextdir !== this.OPPOSITE[this.currentdir]) {
      this.currentdir = this.nextdir;
     }


     const dir = this.DIR[this.currentdir];
     const newHead={
     x: this.body[0].x + dir.x,
     y: this.body[0].y + dir.y

     };

      this.body.unshift(newHead);

      if(newHead.x===food.x && newHead.y===food.y){
       return 'eat';
      }
      else{
        this.body.pop();
        return 'move';
      }
     }

    isWallHit(){
      const head = this.body[0];
      return head.x <= 0 || head.x >= WIDTH - 1 ||
      head.y <= 0 || head.y >= HEIGHT - 1;
    }
  
    isSelfHit(){
      const head = this.body[0];
      for (let i = 1; i < this.body.length; i++) {
       if (head.x === this.body[i].x && head.y === this.body[i].y) {
         return true;
       }
      }
    return false;
  } 
 }


class Food{

  constructor(initialSnakeBody = []){
    this.getFood(initialSnakeBody);
  }

  getFood(snakeBody = []) {   

    const maxSpaces = (WIDTH - 2) * (HEIGHT - 2);
    if (snakeBody.length >= maxSpaces) {
      return;
    }

    while(true){
    const x = Math.floor(Math.random() * (WIDTH - 2)) + 1;
    const y = Math.floor(Math.random() * (HEIGHT - 2)) + 1;

    let check=false;
    for(let i=0;i<snakeBody.length;i++){
      
        if(snakeBody[i].x===x && snakeBody[i].y===y){
            check = true;
            break;
        }
      
    }
    
     if(!check){
        this.x=x;
        this.y=y;
        return;
         }
    }
 
}

}

class Field{

   isWall(x,y){
     return x===0 || x ===WIDTH-1 ||y===0 || y===HEIGHT -1;
   }

   Draw(ctx,snake,food){
    
    ctx.fillStyle = '#1E006D';
    ctx.fillRect(0,0,WIDTH*CELL_SIZE,HEIGHT*CELL_SIZE);


    ctx.fillStyle = '#fff200';
    for (let y=0;y<HEIGHT;y++){
     for (let x=0;x<WIDTH;x++){
       if(this.isWall(x,y)){
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
       }     
      }
     }

     const cx = food.x * CELL_SIZE + CELL_SIZE / 2;
     const cy = food.y * CELL_SIZE + CELL_SIZE / 2;
     const r = CELL_SIZE / 2 - 3;

     ctx.shadowColor = '#ffffff';
     ctx.shadowBlur = 15;
     ctx.fillStyle = '#ffffff';
     ctx.beginPath();
     ctx.arc(cx, cy, r, 0, Math.PI * 2);
     ctx.fill();
     ctx.shadowBlur = 0;
        
     ctx.fillStyle = '#fff200';
     ctx.beginPath();
     ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
     ctx.fill();
        
     for (let i = 0; i < snake.body.length; i++) {
      const isHead = (i === 0);
      this.drawSnakeSegment(ctx, snake.body[i].x, snake.body[i].y, isHead, snake.currentdir);
        }   
    }

    drawSnakeSegment(ctx, x, y, isHead, direction) {
       const px = x * CELL_SIZE;
       const py = y * CELL_SIZE;
        
       if (isHead) {
            ctx.shadowColor = '#fff200';
            ctx.shadowBlur = 12;
        }
        
       ctx.fillStyle = '#fff200';
       const padding = isHead ? 1 : 2;
       ctx.fillRect(px + padding, py + padding, CELL_SIZE - padding * 2, CELL_SIZE - padding * 2);
        
       ctx.shadowBlur = 0;
        
       if (!isHead) {
           ctx.fillStyle = 'rgba(30, 0, 109, 0.3)';
           ctx.fillRect(px + 6, py + 6, CELL_SIZE - 12, CELL_SIZE - 12);
        }
        
       if (isHead) {
           this.drawEyes(ctx, px, py, direction);
        }
    }
    
    drawEyes(ctx, px, py, direction) {
       ctx.fillStyle = '#1E006D';
       const eyeSize = 3;     
       let eye1x, eye1y, eye2x, eye2y;
        
       if (direction === 'right') {
         eye1x = px + 13; eye1y = py + 5;
         eye2x = px + 13; eye2y = py + 12;
       } else if (direction === 'left') {
         eye1x = px + 4;  eye1y = py + 5;
         eye2x = px + 4;  eye2y = py + 12;
       } else if (direction === 'down') {
         eye1x = px + 5;  eye1y = py + 13;
         eye2x = px + 12; eye2y = py + 13;
       } else {  // up
         eye1x = px + 5;  eye1y = py + 4;
         eye2x = px + 12; eye2y = py + 4;
        } 
       ctx.fillRect(eye1x, eye1y, eyeSize, eyeSize);
       ctx.fillRect(eye2x, eye2y, eyeSize, eyeSize);
    }
}


class Game {
    constructor() {

      this.field = new Field();
      this.snake = null;
      this.food =  null;
      this.score = 0;
      this.level = 1;
      this.gameLoop = null;

      this.canvas = document.getElementById('game-canvas');
      this.ctx = this.canvas.getContext('2d');
        
       window.addEventListener('keydown', (event) => {
          if (!this.snake) return; 

          if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(event.key)) {
           event.preventDefault();
           }
          switch (event.key) {
             case 'ArrowLeft':  this.snake.setDir('left');  break;
             case 'ArrowUp':    this.snake.setDir('up');    break;
             case 'ArrowRight': this.snake.setDir('right'); break;
             case 'ArrowDown':  this.snake.setDir('down');  break;
            }
        });

      let touchStartX = 0;
      let touchStartY = 0;
      let hasMoved = false; 

      window.addEventListener('touchstart', (event) => {
        if (document.getElementById('game-screen').classList.contains('hidden')) return;
        event.preventDefault(); 
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        hasMoved = false;
      });

      window.addEventListener('touchmove', (event) => {
       if (!this.snake) return;
       if (hasMoved) return;
       if (document.getElementById('game-screen').classList.contains('hidden')) return;

       event.preventDefault();

       const touch = event.touches[0];
       const dx = touch.clientX - touchStartX;
       const dy = touch.clientY - touchStartY;

       if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;

       if (Math.abs(dx) > Math.abs(dy)) {
           if (dx > 0) this.snake.setDir('right');
           else this.snake.setDir('left');
       } else {
           if (dy > 0) this.snake.setDir('down');
           else this.snake.setDir('up');
       }
      hasMoved = true;
    },{ passive: false });



        document.querySelectorAll('.level-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const level = parseInt(btn.dataset.level);   // "1" → 1
            this.startGame(level);
          });
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
          this.startGame(this.level); 
       });   
       
        document.getElementById('quit-btn').addEventListener('click', () => {
         document.body.classList.remove('no-scroll'); 
         this.showScreen('start');   
       });      
    }

    showScreen(name) {
     document.getElementById('start-screen').classList.add('hidden');
     document.getElementById('game-screen').classList.add('hidden');
     document.getElementById('gameover-screen').classList.add('hidden');
    
     document.getElementById(name + '-screen').classList.remove('hidden');
    }
    
    startGame(level) {
      this.level = level;
      this.snake = new Snake();
      this.food = new Food(this.snake.body);
      this.score = 0;

      document.body.classList.add('no-scroll'); 
    
      this.showScreen('game');
      this.updateScreen();
    
      this.runCountdown(() => {
        this.gameLoop = setInterval(() => this.tick(), SPEEDS[level]);
     });
    } 

      runCountdown(callback) {
        const overlay = document.getElementById('countdown-overlay');
        const text = document.getElementById('countdown-text');
  
  
         overlay.classList.remove('hidden');
  
         const sequence = ['3', '2', '1', 'GO'];
         let i = 0;
  
         const showNext = () => {
          if (i >= sequence.length) {
            overlay.classList.add('hidden');
            callback();
            return;
        }
    
    
          text.textContent = sequence[i];
    
    
         text.style.animation = 'none';
         text.offsetHeight; 
         text.style.animation = 'pulseCountdown 1s ease';
    
         i++;
         setTimeout(showNext, 700); 
        };
  
        showNext();
    }
    
    tick() {
      const result = this.snake.move(this.food);
      if (result === 'eat') {
        this.score++;
        this.food.getFood(this.snake.body);
        }
      if (this.snake.isWallHit() || this.snake.isSelfHit()) {
            this.end();
            return;
        }
      this.updateScreen();
    }
    
    end() {
      clearInterval(this.gameLoop);
      document.body.classList.remove('no-scroll');
      document.getElementById('final-score').textContent = this.score;
      this.showScreen('gameover');
     }
    
    updateScreen() {
       this.field.Draw(this.ctx, this.snake, this.food);
       document.getElementById('score').textContent = this.score;
       document.getElementById('level').textContent = this.level;
    }

}

const game = new Game();


