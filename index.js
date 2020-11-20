let MAZEX = 0;
let MAZEY = 0;
let ENDPOINTX = 0;
let ENDPOINTY = 0;
let mazecells = document.getElementsByClassName("maze-block");
document.getElementById('build').onclick = function(){
    let x = document.getElementById('maze-height').value;
    let y = document.getElementById('maze-width').value;
    MAZEX = x;
    MAZEY = y;
    console.log(`X:${x} Y:${y}`);
    mazeBuilder(x, y);
    [].forEach.call(mazecells, function (el) {
        el.onclick = function(e) {
            e.target.dataset.taken = "true";
            e.target.className = e.target.className + " blocked-cell";
        };
    });
};

document.getElementById('solve').onclick = function() {
    solver(MAZEX, MAZEY);
};

document.getElementById("buildtype").onchange = (e) => {
console.log("Changed: " + e.target.value);
if (e.target.value == "custom")
{
    mazeBuilder(x, y);
}
else if (e.target.value == "rand10")
{
    for (let i = 2; i < MAZEX; i++)
    {
        for(let j = 2; j < MAZEY; j++)
        {
            if(getRandomInt(1, 10) == 1)
            {
                let selectCell = document.getElementsByClassName(`cell${i}-${j}`)[0];
                selectCell.dataset.taken = "true";
                selectCell.className += " blocked-cell" ;
            }
        }
    }
}
else if (e.target.value == "rand30")
{
    for (let i = 2; i < MAZEX; i++)
    {
        for(let j = 2; j < MAZEY; j++)
        {
            if(getRandomInt(1, 3) == 1)
            {
                let selectCell = document.getElementsByClassName(`cell${i}-${j}`)[0];
                selectCell.dataset.taken = "true";
                selectCell.className += " blocked-cell" ;
            }
        }
    }
}
};



async function mazeBuilder(x, y) {
    let field = document.getElementsByClassName('field')[0];
    field.innerHTML = "";
    for(let i = 0; i < x; i++)
    {
        //console.log("Creating row " + i);
        let rowElement = document.createElement("div");
        rowElement.className = "maze-line line" + i;
        field.appendChild(rowElement);
        let row = document.getElementsByClassName('line' + i)[0];
        //await sleep(1);
        for(let j = 0; j < y; j++)
        {
            //console.log("Creating cell " + j + " in row " + i);
            let cell = document.createElement("div");
            if(i == 0 && j == 0)
            {
                //First Cell
                cell.className = "maze-block starting-cell cell" + i + "-" + j;
                cell.dataset.taken = "true";
            }
            else if (i == (x-1) && j == (y-1))
            {
                //last cell
                cell.className = "maze-block ending-cell cell" + i + "-" + j;
                cell.dataset.taken = "true";
                ENDPOINTX = i;
                ENDPOINTY = j;
            }
            else {
                cell.className = "maze-block cell" + i + "-" + j;
                cell.dataset.taken = "false";
            }
            row.appendChild(cell);
           // await sleep(1);
        }
    }
}


function solver(maze_size_x, maze_size_y) {

    //Get solving preference
    let prefer_down = false;
    let prefer_last_direction = false;
    let prefer_rand = false;
    var pref = document.getElementById("solvetype").value;
    if(pref == "prefdown")
    {
        prefer_down = true;
        console.log("Prefering down");
    }
    else if(pref == "preflast")
    {
        prefer_last_direction = true;
        console.log("Prefering last");
    }
    else {
        prefer_rand = true;
        console.log("Prefering rand");
    }

    console.log("Solving,,,");
    let positions = [];
    let solve_stuck = 0;//1 -- Solved  2 -- Stuck
    let count = 0;
    let dontPop = false;
    let last_sucessful_direction = 0;

    //Push starting coord onto stack
    positions.push({x: 0, y: 0});
    let direction;
    let currentPosition = {x: 0, y: 0};
    while(solve_stuck == 0)
    {
        if(positions.length == 0)
        {
            solve_stuck = 2;
            console.log("STUCK< LEAVING")
            return;
        } else {
            //console.log("LEN OF AR: " + positions.length);
        }

        let availableDirectionFlag = false;
        let testX, testY, visitedU, visitedD, visitedL, visitedR;
        visitedU = visitedR = visitedD = visitedL = false;
        do {
            testX = currentPosition.x;
            testY = currentPosition.y;
            if(prefer_down)
            {
                if(visitedD == false)
                {
                    direction = 0;
                }
                else {
                   direction = getRandomInt(1, 3);
                }
            }
            else if(prefer_last_direction)
            {
                if(last_sucessful_direction == 0 && visitedD == false)
                {
                    direction = 0;
                }
                else if (last_sucessful_direction == 1 && visitedR == false)
                {
                    direction = 1;
                }
                else if (last_sucessful_direction == 2 && visitedU == false)
                {
                    direction = 2;
                }
                else if (last_sucessful_direction == 3 && visitedL == false)
                {
                    direction = 3;
                }
                else {
                    direction = getRandomInt(0, 3);
                 }
            }
            else {
                direction = getRandomInt(0, 3);
            }

            if(direction == 0)//Down
            {
                testX += 1;
                visitedD = true;
            }
            else if(direction == 1)//Right
             {
                testY += 1;
                visitedR = true;
             }
             else if(direction == 2)//Up
             {
                testX -= 1;
                visitedU = true;
             }
             else if(direction == 3)//Left
             {
                 testY -= 1;
                 visitedL = true;
             }

             //Test if points can be taken
             if(testX < 0 || testX >= maze_size_x || testY < 0 || testY >= maze_size_y)
             {
                 //Coords out of bounds
                 //console.log(`from [${count}]  x:${testX} y:${testY} is out of bounds`);
             }
             else if(document.getElementsByClassName(`cell${testX}-${testY}`)[0].dataset.taken == "true")
             {
                //Coords are taken
                //console.log(`from [${count}]  x:${testX} y:${testY} is taken`);
                if(testX == ENDPOINTX && testY == ENDPOINTY)
                {
                    console.log("SOLVED!");
                    let solvedtext = document.createElement("h4");
                    solvedtext.innerHTML = `Solved! in ${count} steps.`;
                    document.getElementsByClassName('field')[0].appendChild(solvedtext);
                    solve_stuck = 1;
                    return;
                }
             }
             else {
                 //Not taken
                 //console.log(`from [${count}]   x:${testX} y:${testY} is FREE`)
                 availableDirectionFlag = true;
                 last_sucessful_direction = direction;
             }

             if(visitedU && visitedD && visitedL && visitedR && availableDirectionFlag == false)
             {
                 //Tried all directions, no hits, gotta backtrack
                 //console.log("at [" +count + "] Tried all directions, no hits, gotta backtrack");
                 currentPosition = positions.pop();
                 visitedU = visitedR = visitedD = visitedL = false;

                 if (currentPosition == undefined)
                 {
                     console.log("Nothing left in stack. done");
                     return;
                 }
             }
        } while (availableDirectionFlag == false);
        //Claim tested points in field
        document.getElementsByClassName(`cell${testX}-${testY}`)[0].dataset.taken = "true";
        document.getElementsByClassName(`cell${testX}-${testY}`)[0].style.backgroundColor = "#999";
        //document.getElementsByClassName(`cell${testX}-${testY}`)[0].innerHTML = count;
        sleep(1);
        count++;

        //push claimed points onto stack
        positions.push({x: testX, y: testY});
        dontPop = true;
        //console.log(`added position x:${testX} y:${testY} to stack. Stack:`);
        currentPosition.x = testX;
        currentPosition.y = testY;
        //console.log(positions);
    }
}



//Helper functions
function sleep(ms) {
    setTimeout(()=>{}, ms);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}