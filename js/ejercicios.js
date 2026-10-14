/**
 * Provee un validador local de movimientos y la interfaz de resolución de ejercicios.
 * Consume FEN y soluciones de js/datos-ejercicios.js; valida el subconjunto de reglas usado por esas posiciones.
 */
(function () {
  'use strict';
  var PIECES = {
    p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
    P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
  };
  var files = 'abcdefgh';
  function fromFen(fen) {
    var rows = fen.split(' ')[0].split('/');
    var board = [];
    rows.forEach(function (row) {
      var line = [];
      for (var index = 0; index < row.length; index++) {
        var character = row[index];
        if (/\d/.test(character)) {
          for (var count = 0; count < +character; count++) line.push(null);
        } else {
          line.push(character);
        }
      }
      board.push(line);
    });
    return {
      board: board,
      turn: fen.split(' ')[1],
      castling: fen.split(' ')[2] || '-',
      ep: fen.split(' ')[3] || '-',
      history: []
    };
  }

  function color(piece) {
    return piece === piece.toUpperCase() ? 'w' : 'b';
  }

  function inside(row, column) {
    return row >= 0 && row < 8 && column >= 0 && column < 8;
  }

  function square(row, column) {
    return files[column] + (8 - row);
  }

  function coords(squareName) {
    return [8 - +squareName[1], files.indexOf(squareName[0])];
  }

  function attacks(state, fromRow, fromColumn, toRow, toColumn) {
    var piece = state.board[fromRow][fromColumn];
    var type = piece.toLowerCase();
    var rowDelta = toRow - fromRow;
    var columnDelta = toColumn - fromColumn;
    if (type === 'p') {
      return Math.abs(columnDelta) === 1 &&
        rowDelta === (color(piece) === 'w' ? -1 : 1);
    }
    if (type === 'n') {
      return (Math.abs(rowDelta) === 2 && Math.abs(columnDelta) === 1) ||
        (Math.abs(rowDelta) === 1 && Math.abs(columnDelta) === 2);
    }
    if (type === 'k') {
      return Math.max(Math.abs(rowDelta), Math.abs(columnDelta)) === 1;
    }
    if (type === 'r' && rowDelta !== 0 && columnDelta !== 0 ||
        type === 'b' && Math.abs(rowDelta) !== Math.abs(columnDelta) ||
        type === 'q' && rowDelta !== 0 && columnDelta !== 0 &&
        Math.abs(rowDelta) !== Math.abs(columnDelta)) {
      return false;
    }
    var rowStep = Math.sign(rowDelta);
    var columnStep = Math.sign(columnDelta);
    var row = fromRow + rowStep;
    var column = fromColumn + columnStep;
    while (row !== toRow || column !== toColumn) {
      if (state.board[row][column]) return false;
      row += rowStep;
      column += columnStep;
    }
    return true;
  }

  function attacked(state, row, column, byColor) {
    for (var fromRow = 0; fromRow < 8; fromRow++) {
      for (var fromColumn = 0; fromColumn < 8; fromColumn++) {
        var piece = state.board[fromRow][fromColumn];
        if (piece && color(piece) === byColor &&
            attacks(state, fromRow, fromColumn, row, column)) {
          return true;
        }
      }
    }
    return false;
  }

  function inCheck(state, side) {
    for (var row = 0; row < 8; row++) {
      for (var column = 0; column < 8; column++) {
        if (state.board[row][column] === (side === 'w' ? 'K' : 'k')) {
          return attacked(state, row, column, side === 'w' ? 'b' : 'w');
        }
      }
    }
    return true;
  }

  function pseudo(state, fromRow, fromColumn, toRow, toColumn) {
    var piece = state.board[fromRow][fromColumn];
    var target = state.board[toRow][toColumn];
    if (!piece || color(piece) !== state.turn ||
        target && color(target) === state.turn ||
        target && target.toLowerCase() === 'k') {
      return false;
    }
    var type = piece.toLowerCase();
    var rowDelta = toRow - fromRow;
    var columnDelta = toColumn - fromColumn;
    if (type === 'p') {
      var direction = color(piece) === 'w' ? -1 : 1;
      var startRow = color(piece) === 'w' ? 6 : 1;
      if (columnDelta === 0 && !target && rowDelta === direction) return true;
      if (columnDelta === 0 && !target && fromRow === startRow &&
          rowDelta === 2 * direction && !state.board[fromRow + direction][fromColumn]) {
        return true;
      }
      if (Math.abs(columnDelta) === 1 && rowDelta === direction && target &&
          color(target) !== color(piece)) {
        return true;
      }
      return false;
    }
    return attacks(state, fromRow, fromColumn, toRow, toColumn);
  }

  function clone(state) {
    return {
      board: state.board.map(function (row) { return row.slice(); }),
      turn: state.turn,
      castling: state.castling,
      ep: state.ep,
      history: state.history.slice()
    };
  }

  function legal(state, fromRow, fromColumn, toRow, toColumn) {
    if (!pseudo(state, fromRow, fromColumn, toRow, toColumn)) return false;
    var next = clone(state);
    var piece = next.board[fromRow][fromColumn];
    next.board[toRow][toColumn] = piece;
    next.board[fromRow][fromColumn] = null;
    return !inCheck(next, color(piece));
  }

  function make(state, move) {
    var from = coords(move.slice(0, 2));
    var to = coords(move.slice(2, 4));
    if (!legal(state, from[0], from[1], to[0], to[1])) return false;
    state.board[to[0]][to[1]] = state.board[from[0]][from[1]];
    state.board[from[0]][from[1]] = null;
    state.history.push(move);
    state.turn = state.turn === 'w' ? 'b' : 'w';
    return true;
  }

  function renderBoard(root, state, selected, targets, click) {
    root.innerHTML = '';
    for (var row = 0; row < 8; row++) {
      for (var column = 0; column < 8; column++) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'square ' + ((row + column) % 2 ? 'dark' : 'light');
        var key = square(row, column);
        var piece = state.board[row][column];
        if (selected === key) button.classList.add('selected');
        if (targets.indexOf(key) > -1) button.classList.add(piece ? 'capture' : 'target');
        if (piece) {
          button.textContent = PIECES[piece];
          button.classList.add(color(piece) === 'w' ? 'piece-white' : 'piece-black');
          button.setAttribute(
            'aria-label',
            (color(piece) === 'w' ? 'Blanca ' : 'Negra ') + piece.toLowerCase() + ' en ' + key
          );
        } else {
          button.setAttribute('aria-label', 'Casilla ' + key);
        }
        button.addEventListener('click', function () {
          click(this.getAttribute('aria-label').split(' ').pop());
        });
        root.appendChild(button);
      }
    }
  }

  function targetsFor(state, from) {
    var origin = coords(from);
    var targets = [];
    for (var row = 0; row < 8; row++) {
      for (var column = 0; column < 8; column++) {
        if (legal(state, origin[0], origin[1], row, column)) {
          targets.push(square(row, column));
        }
      }
    }
    return targets;
  }

  window.AjedrezChess = { fromFen: fromFen, make: make, inCheck: inCheck };
  var root = document.querySelector('#tablero');
  var exercise = (window.AjedrezDatos.ejercicios || [])[0];
  var state;
  var selected = null;
  var targets = [];
  var index = 0;
  var solved = 0;
  if (!root) return;

  var title = document.querySelector('#ejercicio-titulo');
  var message = document.querySelector('#mensaje-ejercicio');
  var moveList = document.querySelector('#lista-movimientos');
  var progress = document.querySelector('#progreso');

  function load() {
    exercise = window.AjedrezDatos.ejercicios[index];
    state = fromFen(exercise.fen);
    selected = null;
    targets = [];
    title.textContent = exercise.titulo;
    document.querySelector('#ejercicio-meta').textContent =
      exercise.dificultad + ' · ' + exercise.categoria;
    message.textContent = 'Tu turno: encontrá la jugada definida para este ejercicio.';
    message.className = 'status-message';
    moveList.textContent = '';
    progress.textContent = solved + ' de ' + window.AjedrezDatos.ejercicios.length + ' resueltos';
    renderBoard(root, state, selected, targets, clickSquare);
  }

  function clickSquare(key) {
    if (selected) {
      if (targets.indexOf(key) > -1) {
        var move = selected + key;
        if (move === exercise.solucion) {
          AjedrezChess.make(state, move);
          solved++;
          message.textContent = 'Respuesta correcta. ' + exercise.explicacion;
          message.className = 'status-message success';
          moveList.textContent = state.history.join(' · ');
          renderBoard(root, state, null, [], clickSquare);
        } else {
          message.textContent = 'Ese movimiento es legal, pero no es la solución definida. ' +
            'Revisá jaques, capturas y amenazas.';
          message.className = 'status-message error';
          selected = null;
          targets = [];
          renderBoard(root, state, null, [], clickSquare);
        }
      } else {
        selected = null;
        targets = [];
        renderBoard(root, state, null, [], clickSquare);
      }
    } else {
      var coordinates = coords(key);
      var piece = state.board[coordinates[0]][coordinates[1]];
      if (piece && color(piece) === state.turn) {
        selected = key;
        targets = targetsFor(state, key);
        renderBoard(root, state, selected, targets, clickSquare);
      }
    }
  }

  document.querySelector('#reiniciar-ejercicio').addEventListener('click', load);
  document.querySelector('#siguiente-ejercicio').addEventListener('click', function () {
    index = (index + 1) % window.AjedrezDatos.ejercicios.length;
    load();
  });
  load();
}());
