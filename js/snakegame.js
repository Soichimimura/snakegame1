const WIDTH = 20;
const HEIGHT = 20;

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

   Draw(snake,food){
    let result = '';
    for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
       if (this.isWall(x, y)) {
          result += '+';
        } 
       else if (x === food.x && y === food.y) {
          result += '$';
        } 
       else {
         let isSnake = false;
         for (let i = 0; i < snake.body.length; i++) {
          if (snake.body[i].x === x && snake.body[i].y === y) {
              isSnake = true;
              break;
            }
          }
         result += isSnake ? '0' : ' ';
        }
      }
      result += '\n';
    }
    return result;
  }
}


class Game {
    constructor() {

      this.field = new Field();
      this.score = 0;
      this.level = 1;
      this.gameLoop = null;
        
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
        this.showScreen('start');     // スタート画面に戻る
       });      
    }
    
    startGame(level) {
      this.level = level;
      this.snake = new Snake();
      this.food = new Food(this.snake.body);
      this.score = 0;
    
      this.showScreen('game');
      this.updateScreen();
    
      this.gameLoop = setInterval(() => this.tick(), SPEEDS[level]);
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
      document.getElementById('final-score').textContent = this.score;
      this.showScreen('gameover');
     }
    
    updateScreen() {
       document.getElementById('board').textContent = this.field.Draw(this.snake, this.food);
       document.getElementById('score').textContent = this.score;
    }

    restart() {
    
    this.snake = new Snake();
    this.food = new Food(this.snake.body);
    this.score = 0;

    document.getElementById('gameover').style.display = 'none';

    this.start();
}
}

const game = new Game();

