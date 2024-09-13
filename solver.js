let lettersVisible = false;

document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.querySelector('.grid-container');

    // Create the 6x6 grid without letters
    for (let i = 0; i < 36; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', toggleColor);
        cell.addEventListener('contextmenu', resetColor);
        cell.addEventListener('click', (e) => e.stopPropagation());
        gridContainer.appendChild(cell);
    }
    updateCounts();
});

function generatenew() {}


function toggleColor(event) {
    const cell = event.target;
    if (cell.classList.contains('blue')) {
        cell.classList.remove('blue');
        cell.classList.add('white');
        cell.innerText = lettersVisible ? 'O' : '';
    } else if (cell.classList.contains('white')) {
        cell.classList.remove('white');
        cell.innerText = '';
    } else {
        cell.classList.add('blue');
        cell.innerText = lettersVisible ? 'X' : '';
    }
    updateCounts();
}

function updateCounts() {
		//Column Counts
    for (let i = 0; i < 6; i++) {
        let xCount = 0;
        let oCount = 0;
        for (let j = 0; j < 6; j++) {
            const cell = document.querySelector(`.grid-container > :nth-child(${i + j * 6 + 1})`);
            if (cell.classList.contains('blue')) xCount++;
            if (cell.classList.contains('white')) oCount++;
        }
        const countDiv = document.getElementById(`count-${i + 1}`);
        countDiv.innerText = `${xCount}/${oCount}`;
    }
		//Row Counts
	for (let i = 0; i < 6; i++) {
        let xCount = 0;
        let oCount = 0;
        for (let j = 0; j < 6; j++) {
            const cell = document.querySelector(`.grid-container > :nth-child(${i * 6 + j + 1})`);
            if (cell.classList.contains('blue')) xCount++;
            if (cell.classList.contains('white')) oCount++;
        }
        const rowCountDiv = document.getElementById(`row-count-${i + 1}`);
        rowCountDiv.innerText = `${xCount}/${oCount}`;
    }
}

function resetColor(event) {
    event.preventDefault();
    const cell = event.target;
    cell.className = 'cell';
    cell.innerText = '';
    updateCounts();
}

function resetAll() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.className = 'cell';
        cell.innerText = '';
    });
    
    const toggleButton = document.getElementById('toggleLetters');
    if (toggleButton.classList.contains('inverted')) {
        toggleButton.classList.remove('inverted');
    }
    
    lettersVisible = false;
    updateCounts();
}

function toggleLetters() {
    const toggleButton = document.querySelector('#toggleLetters');

    const cells = document.querySelectorAll('.cell');
    if (lettersVisible) {
        cells.forEach(cell => {
            cell.innerText = '';
        });
        toggleButton.classList.remove('inverted');
        lettersVisible = false;
    } else {
        cells.forEach(cell => {
            if (cell.classList.contains('blue')) {
                cell.innerText = 'X';
            } else if (cell.classList.contains('white')) {
                cell.innerText = 'O';
            }
        });
        toggleButton.classList.add('inverted');
        lettersVisible = true;
    }
}

function applyAdjacentTransformations() {
    const cells = document.querySelectorAll('.cell');

    // Helper function to transform based on pattern
    function transformPattern(cellArray) {
    for(let i = 0; i < cellArray.length - 2; i++) {
        // XEX -> XOX
        if(cellArray[i].classList.contains('blue') && !cellArray[i+1].classList.contains('blue') && !cellArray[i+1].classList.contains('white') && cellArray[i+2].classList.contains('blue')) {
            cellArray[i+1].innerText = lettersVisible ? 'O' : '';
            cellArray[i+1].classList.add('white');
        } 
        // OEO -> OXO
        else if(cellArray[i].classList.contains('white') && !cellArray[i+1].classList.contains('blue') && !cellArray[i+1].classList.contains('white') && cellArray[i+2].classList.contains('white')) {
            cellArray[i+1].innerText = lettersVisible ? 'X' : '';
            cellArray[i+1].classList.add('blue');
        }
        // EXX -> OXX
        else if(!cellArray[i].classList.contains('blue') && !cellArray[i].classList.contains('white') && cellArray[i+1].classList.contains('blue') && cellArray[i+2].classList.contains('blue')) {
            cellArray[i].innerText = lettersVisible ? 'O' : '';
            cellArray[i].classList.add('white');
        } 
        // EOO -> XOO
        else if(!cellArray[i].classList.contains('blue') && !cellArray[i].classList.contains('white') && cellArray[i+1].classList.contains('white') && cellArray[i+2].classList.contains('white')) {
            cellArray[i].innerText = lettersVisible ? 'X' : '';
            cellArray[i].classList.add('blue');
        }
        // XXE -> XXO
        else if(cellArray[i].classList.contains('blue') && cellArray[i+1].classList.contains('blue') && !cellArray[i+2].classList.contains('blue') && !cellArray[i+2].classList.contains('white')) {
            cellArray[i+2].innerText = lettersVisible ? 'O' : '';
            cellArray[i+2].classList.add('white');
        } 
        // OOE -> OOX
        else if(cellArray[i].classList.contains('white') && cellArray[i+1].classList.contains('white') && !cellArray[i+2].classList.contains('blue') && !cellArray[i+2].classList.contains('white')) {
            cellArray[i+2].innerText = lettersVisible ? 'X' : '';
            cellArray[i+2].classList.add('blue');
        }
    }
}

    // Transform rows
    for(let i = 0; i < 6; i++) {
        const row = [];
        for(let j = 0; j < 6; j++) {
            row.push(cells[i * 6 + j]);
        }
        transformPattern(row);
    }

    // Transform columns
    for(let i = 0; i < 6; i++) {
        const column = [];
        for(let j = 0; j < 6; j++) {
            column.push(cells[j * 6 + i]);
        }
        transformPattern(column);
    }
	updateCounts();
	console.log('Updated adjacents!');
	checkSolution();
}
function applyNumberTransformations() {
    const cells = document.querySelectorAll('.cell');

    function transformByCount(cellArray) {
        let xCount = 0;
        let oCount = 0;
        
        cellArray.forEach(cell => {
            if(cell.innerText === 'X' || cell.classList.contains('blue')) {
                xCount++;
            } else if(cell.innerText === 'O' || cell.classList.contains('white')) {
                oCount++;
            }
        });

        if(xCount === 3) {
            cellArray.forEach(cell => {
                if(!(cell.innerText === 'X' || cell.classList.contains('blue'))) {
                    cell.innerText = lettersVisible ? 'O' : '';
                    cell.classList.add('white');
                    cell.classList.remove('blue');
                }
            });
        } else if(oCount === 3) {
            cellArray.forEach(cell => {
                if(!(cell.innerText === 'O' || cell.classList.contains('white'))) {
                    cell.innerText = lettersVisible ? 'X' : '';
                    cell.classList.add('blue');
                    cell.classList.remove('white');
                }
            });
        }
    }

    // Transform rows
    for(let i = 0; i < 6; i++) {
        const row = [];
        for(let j = 0; j < 6; j++) {
            row.push(cells[i * 6 + j]);
        }
        transformByCount(row);
    }

    // Transform columns
    for(let i = 0; i < 6; i++) {
        const column = [];
        for(let j = 0; j < 6; j++) {
            column.push(cells[j * 6 + i]);
        }
        transformByCount(column);
    }

    updateCounts();
	checkSolution();
}

function checkSolution() {
    let isComplete = true;

    // Function to check for sequences
    function hasSequence(cellArray, seq) {
        return cellArray.map(cell => cell.innerText || cell.className).join('').includes(seq);
    }

    // Check rows
    for(let i = 0; i < 6; i++) {
        const row = [];
        for(let j = 0; j < 6; j++) {
            row.push(document.querySelector(`.grid-container > :nth-child(${i * 6 + j + 1})`));
        }
        const xCount = row.filter(cell => cell.classList.contains('blue')).length;
        const oCount = row.filter(cell => cell.classList.contains('white')).length;
        
        if (xCount !== 3 || oCount !== 3 || hasSequence(row, 'XXX') || hasSequence(row, 'OOO')) {
            isComplete = false;
            break;
        }
    }

    // Check columns
    for(let i = 0; i < 6 && isComplete; i++) {
        const column = [];
        for(let j = 0; j < 6; j++) {
            column.push(document.querySelector(`.grid-container > :nth-child(${j * 6 + i + 1})`));
        }
        const xCount = column.filter(cell => cell.classList.contains('blue')).length;
        const oCount = column.filter(cell => cell.classList.contains('white')).length;

        if (xCount !== 3 || oCount !== 3 || hasSequence(column, 'XXX') || hasSequence(column, 'OOO')) {
            isComplete = false;
            break;
        }
    }

    if (isComplete) {
        alert('Congrats!');
    }
}


// Attach the function to the "Numbers" button
document.getElementById('numbersButton').addEventListener('click', applyNumberTransformations);


// Attach the function to the "Adjacent" button
document.getElementById('adjacent').addEventListener('click', applyAdjacentTransformations);
