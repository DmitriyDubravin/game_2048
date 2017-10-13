
function app() {

	// settings
	const grid = 4; // desirable grid size
	const winCond = 64; // desirable number to win

	let board = [];
	let gaming = true;
	let frame = document.querySelector('.frame');
	let msg = document.querySelector('.msg');

	// start
	createBoard();
	addNew();
	addNew();
	fillBoard();

	function restart() {
		board = [];
		createBoard();
		addNew();
		addNew();
		fillBoard();
		msg.innerHTML = "";
		gaming = true;
	}

	function createBoard() {
		frame.innerHTML = "";
		for(let i = 0; i < grid * grid ; i++) {
			board[i] = {c: ' ', d: false};
			let cell = document.createElement('div');
			cell.className = 'cell';
			frame.appendChild(cell);
		}
		let w = grid * 40 + 4;
		document.querySelector('#app').style.width = w + 'px';
	}

	function fillBoard() {
		document.querySelectorAll('.cell').forEach(function(el,i) {
			el.innerHTML = board[i].c;
		});
	}

	function shift(direction) {
		for(let x = 0; x < board.length; x++) {

			// moving backwards if right or bottom
			let i = (direction === 'left' || direction === 'top') ? x : board.length - 1 - x;
			let moveStep = false;
			let double = false;

			// empty cell
			if(board[i].c === ' ') continue;

			// determine if there a path to shift
			let condition;
			if(direction === 'top') {
				// not in first row
				condition = i > grid - 1;
			}
			if(direction === 'right') {
				// not last in each row
				condition = i - (grid - 1) % grid !== 0;
			}
			if(direction === 'bottom') {
				// not in last row
				condition = i < board.length - grid;
			}
			if(direction === 'left') {
				// not first in each row
				condition = i % grid !== 0;
			}

			if(condition) {
				// examine path to move
				for(let l = 1; l < grid; l++) {
					let step;
					if(direction === 'top') {
						// step top
						step = i - grid * l;
						// edge of the board and no further cells
						if(step < 0) break;
					}
					if(direction === 'right') {
						// step right
						step = i + l;
						// edge of the board and no further cells
						if(step % grid === 0) break;
					}
					if(direction === 'bottom') {
						// step bottom
						step = i + grid * l;
						// edge of the board and no further cells
						if(step > board.length - 1) break;
					}
					if(direction === 'left') {
						// step left
						step = i - l;
						// edge of the board and no further cells
						if((step + 1) % grid === 0) break;
					}
					// empty and not equal current item
					if(board[step].c !== ' ' && (board[step].c !== board[i].c)) break;
					// already doubled
					if(board[step].d === true) break;
					// if same number
					if(board[step].c === board[i].c) {
						// should double
						double = true;
						// remember doubled
						board[step].d = true;
					}
					moveStep = step;
				}
			}

			if(moveStep !== false) {
				// shift to empty cell OR if should double and no doubled yet, shift to filled cell and double it
				board[moveStep].c = (double === true && board[moveStep].d !== false) ? board[i].c * 2 : board[i].c;
				// clear moved cell
				board[i].c = ' ';
			}
		}
	}

	function resetDoubled() {
		for(let x = 0; x < board.length; x++) {
			board[x].d = false;
		}
	}

	function shuffle(a) {
		var j, x, i;
		for (i = a.length; i; i--) {
			j = Math.floor(Math.random() * i);
			x = a[i - 1];
			a[i - 1] = a[j];
			a[j] = x;
		}
		return a;
	}

	function addNew() {
		let freePlaces = [];
		board.forEach((item,i) => {
			if(item.c === ' ') freePlaces.push(i);
		});
		let randomFreeIndex = shuffle(freePlaces).pop();
		let newVal = Math.random() < 0.5 ? 2 : 4;
		board[randomFreeIndex].c = newVal;
	}

	function evaluate() {
		let test = 0;
		for(let i = 0; i < board.length; i++) {
			if(board[i].c === ' ') {
				test = 1;
				break;
			}
		}
		for(let i = 0; i < board.length; i++) {
			if(board[i].c === winCond) {
				test = 'win';
				break;
			}
		}
		if(test === 0) {
			msg.innerHTML = 'You lose!';
			gaming = false;
		}
		if(test === 'win') {
			msg.innerHTML = 'You win!';
			gaming = false;
		}
	}

	function move(val) {
		shift(val);
		resetDoubled();
		addNew();
		fillBoard();
		evaluate();
	}

	function keyHandler(event) {
		var x = event.keyCode;
		if(x === 32) restart(); // space bar

		if(gaming === true) {
			switch(x) {
				case 38: move('top'); break; // arrow top
				case 39: move('right'); break; // arrow right
				case 40: move('bottom'); break; // arrow bottom
				case 37: move('left'); break; // arrow left
			}
		}
	}

	document.querySelector('.button').onclick = () => {restart(); return false};
	document.onkeyup = (event) => keyHandler(event);

}

app();
