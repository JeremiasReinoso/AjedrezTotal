/* Partidas públicas de entrenadores: API de Lichess + reproductor local. */
(function () {
  'use strict';
  var root = document.getElementById('entrenadores-partidas');
  var jump = document.getElementById('ver-partidas-entrenador');
  var coaches = (window.AjedrezDatos && window.AjedrezDatos.partidasEntrenadores) || [];
  var api = 'https://lichess.org/api/games/user/';
  var max = 8, cacheTime = 10 * 60 * 1000, cachePrefix = 'ajedrez-total-coach-games-v2-';
  var states = {}, requestQueue = Promise.resolve();
  if (!root) return;

  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]; }); }
  function read(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } }
  function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }
  function state(coach) { return states[coach.id] || (states[coach.id] = { games: [], loading: false, error: '', hasMore: true, until: null }); }
  function enqueue(task) { var next = requestQueue.then(task, task); requestQueue = next.catch(function () {}); return next; }
  function displayName(player, fallback) { return player && player.user && (player.user.name || player.user.id) || fallback; }
  function gameMeta(game, coach) {
    var p = game.players || {}, w = p.white || {}, b = p.black || {}, winner = game.winner;
    var result = winner === 'white' ? '1-0' : winner === 'black' ? '0-1' : game.status === 'draw' || game.status === 'stalemate' ? '½-½' : game.status || '—';
    var speeds = { bullet: 'Bala', blitz: 'Blitz', rapid: 'Rápidas', classical: 'Clásicas', correspondence: 'Correspondencia' };
    return { white: displayName(w, 'Blancas'), black: displayName(b, 'Negras'), result: result, date: game.createdAt ? new Date(game.createdAt).toLocaleDateString('es-AR') : 'Fecha no disponible', speed: speeds[game.speed] || game.speed || game.perf || 'Ritmo no disponible', opening: game.opening && (game.opening.name || game.opening.eco) || game.eco || 'Apertura no disponible', coach: coach.nombre, id: game.id || '', createdAt: Number(game.createdAt) || 0 };
  }
  function parseResponse(text) { return text.trim().split(/\n+/).filter(Boolean).map(function (line) { try { return JSON.parse(line); } catch (e) { return null; } }).filter(function (game) { return game && game.moves && (game.variant || 'standard') === 'standard'; }); }
  function fetchGames(coach, until) {
    var query = '?max=' + max + '&moves=true&clocks=false&evals=false&opening=true';
    if (until) query += '&until=' + encodeURIComponent(Math.max(0, until));
    return enqueue(function () { return fetch(api + encodeURIComponent(coach.lichessUsername) + query, { headers: { Accept: 'application/x-ndjson' } }).then(function (response) { if (response.status === 429) throw Error('rate-limit'); if (response.status === 404) throw Error('not-found'); if (!response.ok) throw Error('HTTP ' + response.status); return response.text(); }).then(parseResponse); });
  }
  function setStatus(message, kind) { root.innerHTML = '<div class="coach-games-state ' + (kind || '') + '" role="status"><p>' + esc(message) + '</p></div>'; }
  function loadCoach(coach, append) {
    var s = state(coach); if (s.loading) return Promise.resolve(); s.loading = true; s.error = ''; render();
    return fetchGames(coach, append ? s.until : null).then(function (fresh) {
      var seen = {}; s.games.concat(fresh).forEach(function (g) { if (g.id) seen[g.id] = g; });
      s.games = Object.keys(seen).map(function (id) { return seen[id]; }).sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
      s.hasMore = fresh.length === max; s.until = s.games.length ? Math.min.apply(null, s.games.map(function (g) { return Number(g.createdAt) || Date.now(); })) - 1 : null;
      write(cachePrefix + coach.id, { savedAt: Date.now(), games: s.games, hasMore: s.hasMore, until: s.until });
    }).catch(function (error) { s.error = error.message === 'not-found' ? 'Lichess no pudo servir esta cuenta (puede no existir o haber bloqueado temporalmente la consulta).' : error.message === 'rate-limit' ? 'Lichess pidió esperar antes de volver a consultar. Probá más tarde.' : 'No se pudieron obtener las partidas. Revisá la conexión e intentá de nuevo.'; }).then(function () { s.loading = false; render(); });
  }
  function hydrate(coach) { var s = state(coach), cached = read(cachePrefix + coach.id); if (cached && cached.games && Date.now() - cached.savedAt < cacheTime) { s.games = cached.games; s.hasMore = cached.hasMore !== false; s.until = cached.until; return Promise.resolve(); } return loadCoach(coach, false); }
  function render() {
    root.innerHTML = coaches.map(function (coach) {
      var s = state(coach), body = s.loading ? '<div class="coach-games-state" role="status">Cargando partidas públicas…</div>' : s.error ? '<div class="coach-games-state error" role="alert"><p>' + esc(s.error) + '</p><button type="button" class="button button-quiet coach-retry" data-coach="' + esc(coach.id) + '">Reintentar</button></div>' : s.games.length ? s.games.map(function (game, i) { var m = gameMeta(game, coach); return '<button class="coach-game-item" type="button" data-coach="' + esc(coach.id) + '" data-game="' + i + '"><strong>' + esc(m.white + ' — ' + m.black) + '</strong><span>' + esc(m.result + ' · ' + m.date + ' · ' + m.speed) + '</span><small>' + esc(m.opening) + '</small></button>'; }).join('') + (s.hasMore ? '<button type="button" class="button button-quiet coach-more" data-coach="' + esc(coach.id) + '">Cargar partidas más antiguas</button>' : '') : '<div class="coach-games-state">No hay partidas públicas estándar disponibles.</div>';
      return '<section class="coach-games-card" aria-labelledby="coach-' + esc(coach.id) + '"><div class="coach-games-heading"><div><strong id="coach-' + esc(coach.id) + '">' + esc(coach.nombre) + '</strong><span class="muted"> · @' + esc(coach.lichessUsername) + '</span></div><span class="muted">' + (s.games.length ? s.games.length + ' partidas cargadas' : 'Partidas públicas') + '</span></div>' + body + '</section>';
    }).join('') + '<p class="coach-games-note">Datos públicos de <a href="https://lichess.org" target="_blank" rel="noopener noreferrer">Lichess</a>. Se reproducen dentro de AjedrezTotal y no afectan el ELO de ejercicios.</p>';
    root.querySelectorAll('.coach-retry,.coach-more').forEach(function (b) { b.addEventListener('click', function () { var coach = coaches.filter(function (c) { return c.id === b.dataset.coach; })[0]; loadCoach(coach, b.classList.contains('coach-more')); }); });
    root.querySelectorAll('.coach-game-item').forEach(function (b) { b.addEventListener('click', function () { openGame(coaches.filter(function (c) { return c.id === b.dataset.coach; })[0], Number(b.dataset.game)); }); });
  }
  function positions(game) {
    var chess = new window.Chess(game.initialFen || undefined), result = [{ fen: chess.fen(), san: 'Posición inicial', uci: '' }];
    String(game.moves || '').trim().split(/\s+/).filter(Boolean).forEach(function (san) { var move = chess.move(san, { sloppy: true }); if (move) result.push({ fen: chess.fen(), san: move.san, uci: move.from + move.to + (move.promotion || '') }); });
    if (result.length === 1 && game.moves) throw Error('PGN o jugadas inválidas'); return result;
  }
  function openGame(coach, index) {
    var s = state(coach), game = s.games[index], m = gameMeta(game, coach), pos;
    try { if (!window.Chess) throw Error('No se cargó el visor de ajedrez'); pos = positions(game); } catch (e) { setStatus('Esta partida no se puede reproducir porque sus jugadas no tienen un formato válido.', 'error'); return; }
    var at = 0;
    root.innerHTML = '<div class="game-viewer"><div class="game-viewer-heading"><div><span class="tag">' + esc(m.coach + ' · ' + m.white + ' — ' + m.black) + '</span><h4>Reproducción de partida</h4></div><button class="button button-quiet" id="volver-partidas" type="button">← Volver a la lista</button></div><div class="game-viewer-grid"><div><div id="partida-tablero" class="chessboard game-board" aria-label="Tablero de la partida"></div><p class="game-turn" id="game-turn" role="status"></p><div class="game-controls"><button class="button button-quiet" id="game-first" type="button" aria-label="Primera jugada">|&lt;</button><button class="button button-quiet" id="game-prev" type="button" aria-label="Jugada anterior">‹</button><button class="button button-primary" id="game-restart" type="button">Reiniciar</button><button class="button button-quiet" id="game-next" type="button" aria-label="Siguiente jugada">›</button><button class="button button-quiet" id="game-last" type="button" aria-label="Última jugada">&gt;|</button></div></div><div><p class="muted"><strong>' + esc(m.white) + ' — ' + esc(m.black) + '</strong><br>' + esc(m.result + ' · ' + m.date + ' · ' + m.speed) + '<br>' + esc(m.opening) + '</p><div class="move-list game-notation" id="game-notation" aria-label="Lista de jugadas"></div><a class="external-link" href="https://lichess.org/' + esc(m.id) + '" target="_blank" rel="noopener noreferrer">Fuente original en Lichess ↗</a></div></div></div>';
    function draw() { var board = document.getElementById('partida-tablero'), chess = new window.Chess(pos[at].fen), glyphs = { p:'♟',r:'♜',n:'♞',b:'♝',q:'♛',k:'♚',P:'♙',R:'♖',N:'♘',B:'♗',Q:'♕',K:'♔' }; board.innerHTML = ''; chess.board().forEach(function (row, r) { row.forEach(function (piece, c) { var square = document.createElement('span'); square.className = 'square ' + ((r + c) % 2 ? 'dark' : 'light'); if (at > 0 && pos[at].uci && ((r === 8 - Number(pos[at].uci.charAt(3)) && c === 'abcdefgh'.indexOf(pos[at].uci.charAt(2))) || (r === 8 - Number(pos[at].uci.charAt(1)) && c === 'abcdefgh'.indexOf(pos[at].uci.charAt(0))))) square.classList.add('last-move'); if (piece) { square.textContent = glyphs[piece.color === 'w' ? piece.type.toUpperCase() : piece.type]; square.classList.add(piece.color === 'w' ? 'piece-white' : 'piece-black'); } board.appendChild(square); }); }); document.getElementById('game-turn').textContent = 'Jugada ' + (at ? Math.ceil(at / 2) : 0) + ' · Turno de ' + (chess.turn() === 'w' ? 'blancas' : 'negras'); document.getElementById('game-notation').innerHTML = pos.slice(1).map(function (item, i) { return '<button type="button" class="move-chip ' + (i + 1 === at ? 'is-current' : '') + '" data-ply="' + (i + 1) + '">' + (i % 2 === 0 ? '<b>' + (Math.floor(i / 2) + 1) + '.</b> ' : '') + esc(item.san) + '</button>'; }).join(''); document.querySelectorAll('.move-chip').forEach(function (b) { b.addEventListener('click', function () { at = Number(b.dataset.ply); draw(); }); }); }
    function go(n) { at = Math.max(0, Math.min(pos.length - 1, n)); draw(); }
    document.getElementById('volver-partidas').addEventListener('click', render); document.getElementById('game-first').addEventListener('click', function () { go(0); }); document.getElementById('game-prev').addEventListener('click', function () { go(at - 1); }); document.getElementById('game-next').addEventListener('click', function () { go(at + 1); }); document.getElementById('game-last').addEventListener('click', function () { go(pos.length - 1); }); document.getElementById('game-restart').addEventListener('click', function () { go(0); }); draw();
  }
  if (jump) jump.addEventListener('click', function () { root.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
  if (!coaches.length) { setStatus('No hay entrenadores configurados para mostrar.'); return; }
  render(); coaches.forEach(hydrate);
}());
