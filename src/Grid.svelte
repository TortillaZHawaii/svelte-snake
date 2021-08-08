<script lang="ts">
import { xlink_attr } from "svelte/internal";
    import { LinkedList } from "./bidirectionalList"
    import GridBox from "./GridBox.svelte";

    enum BoxValue {
        Empty = "white",
        Apple = "red",
        Snake = "green",
    }

    enum Direction {
        Top,
        Right,
        Down,
        Left,
    }

    enum GameStatus {
        NotStarted,
        Running,
        Finished,
    }

    export let height: number;
    export let width: number;
    export let cellSize: string;
    let currentDirection: Direction = Direction.Right;
    let currentGameStatus: GameStatus = GameStatus.NotStarted;
    
    let array: BoxValue[][] = [];
    
    // array initialization
    for(let i = 0; i < height; ++i) {
        array[i] = [];
        for(let j = 0; j < width; ++j) {
            array[i][j] = BoxValue.Empty;
        }
    }
    
    let score: number;
    let snake = new LinkedList<[number, number]>();
    $: score = snake.count();
    $: timeBetweenMoves = 500 * (1 / Math.sqrt(score));
    let timerId: NodeJS.Timer;

    // random int
    function getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }


    // detect colision
    function detectCollision(x: number, y: number): number {
        if(x >= width || x < 0 || y >= height || y < 0) {
            // dead
            return -1;
        }

        if(array[y][x] === BoxValue.Snake) {
            // dead
            return -1;
        }

        if(array[y][x] === BoxValue.Apple) {
            // grow length
            return 1;
        }

        return 0;
    }

    
    // store snake in bidirectional list of (int x, int y) (changing position in O(1))

    // spawns apple in not filled position
    function spawnApple() {
        let freeSpaces = new Array<[number, number]>();
        
        // get free spaces O(height * width)
        array.forEach((row, y) => 
            row.forEach((element, x) => {
                if (element === BoxValue.Empty)
                    freeSpaces.push([x, y]);
            })
        );

        // test if there are any free spaces on the board
        if (freeSpaces.length === 0)
        {
            console.log(`couldn't spawn apple. board is full`);
            return;
        }

        // get random position from free spaces
        let randomIndex = getRandomInt(0, freeSpaces.length - 1);
        let [x, y] = freeSpaces[randomIndex];
        
        console.log(`apple spawned at: x: ${x}, y: ${y}`);
        
        // spawn apple in that position
        array[y][x] = BoxValue.Apple;
    }


    // main game loop
    function mainLoop() {
        if(currentGameStatus !== GameStatus.Running)
            return;
            
        clearTimeout(timerId);
        
        let k = snake.getHeadVal();
        
        if(k === null)
            return;

        let [curX, curY] = k;

        // note that 0 0 is top left
        switch(currentDirection) {
            case Direction.Top:
                var x = curX;
                var y = curY - 1;
                break;
            case Direction.Right:
                var x = curX + 1;
                var y = curY;
                break;
            case Direction.Left:
                var x = curX - 1;
                var y = curY;
                break;
            default:
            case Direction.Down:
                var x = curX;
                var y = curY + 1;
                break;
        }
        
        switch(detectCollision(x, y)) {
            case 1:
                // grow in size
                snake.insertAtBeginning([x, y]);
                array[y][x] = BoxValue.Snake;
                spawnApple();
                break;
            case -1:
                // hit obstacle
                currentGameStatus = GameStatus.Finished;
                return;
            case 0:
            default:
                // move
                snake.insertAtBeginning([x, y]);
                let tailCords = snake.removeTail()?.val;
                if(tailCords === undefined) {
                    return;
                }
                // render
                array[tailCords[1]][tailCords[0]] = BoxValue.Empty;
                array[y][x] = BoxValue.Snake;

                break;
        }

        // to update binding
        timerId = setTimeout(mainLoop, timeBetweenMoves);
        snake = snake;
    }


    function startGame() {
        // array initialization
        array = [];
        for(let i = 0; i < height; ++i) {
            array[i] = [];
            for(let j = 0; j < width; ++j) {
                array[i][j] = BoxValue.Empty;
            }
        }

        snake = new LinkedList<[number, number]>();
        currentGameStatus = GameStatus.Running;
        currentDirection = Direction.Right;

        // put snake in the center of the board
        let startX = Math.floor(width/2);
        let startY = Math.floor(height/2);
        snake.insertAtBeginning([startX, startY]);
        array[startY][startX] = BoxValue.Snake;

        spawnApple();

        // 500 ms
        clearTimeout(timerId);
        timerId = setTimeout(mainLoop, timeBetweenMoves);
    }


    function handleKeydown(event: KeyboardEvent) {
        switch(event.key) {
            case "ArrowDown":
                currentDirection = Direction.Down;
                break;
            case "ArrowLeft":
                currentDirection = Direction.Left;
                break;
            case "ArrowRight":
                currentDirection = Direction.Right;
                break;
            case "ArrowUp":
                currentDirection = Direction.Top;
                break;
            case "Enter":
                // room to add pause
                if(currentGameStatus !== GameStatus.Running)
                {
                    startGame();
                    event.preventDefault();
                }
                return;
            default:
                return;
            // case "Space":
            //     startGame();
            //     break;
        }
        // prevent default scrolling
        event.preventDefault();
        mainLoop();
    }

</script>

<svelte:window on:keydown={handleKeydown}/>

<main>
    <table id="menu" class="horizontal-center">
        <tr>
            <td>
                <h2 id="score">score: {score}</h2>
            </td>
            <td>
                <button id="startbtn" type="button" on:click={startGame}>
                    {#if currentGameStatus === GameStatus.NotStarted}
                        start
                    {:else}
                        restart
                    {/if}
                </button>
            </td>
        </tr>
    </table>
    
    <div id="container">
        {#if currentGameStatus === GameStatus.Finished}
            <h2 id="foreground">game over</h2>
        {/if}
        <div id="background">
            <table class="horizontal-center thin-border" style="margin-bottom: 1em;">
                {#each array as row}
                    <tr>
                        {#each row as box}
                        <td>
                            <GridBox size={cellSize} color={box} />
                        </td>
                        {/each}
                    </tr>
                {/each}
            </table>
        </div>
    </div>
</main>

<style>
    #score {
        padding: 0;
        margin: 0;
    }

    #startbtn {
        margin: 0;
    }

    .thin-border {
        border: 3px solid #ff3e00;
    }

    .horizontal-center {
        width: 50%;
        margin: 0 auto;
    }

    #container {
        position: relative;
    }
    #foreground,
    #background {
        width: 100%;
        height: 100%;
        position: absolute;
    }
    
    #foreground {
        z-index: 10;
    }
    
</style>