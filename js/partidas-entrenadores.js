/* Partidas públicas de entrenadores: API de Lichess + tablero de análisis compartido. */
(function () {
  'use strict';
  var root = document.getElementById('entrenadores-partidas');
  var jump = document.getElementById('ver-partidas-entrenador');
  var analysisCard = document.getElementById('analisis-tablero');
  var analysisFrame = document.getElementById('tablero-analisis-lichess');
  var analysisLink = document.getElementById('enlace-analisis-lichess');
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
  function pgnForAnalysis(game, meta, pos) {
    var initialFen = game.initialFen || '';
    var initialChess = new window.Chess(initialFen || undefined);
    var fenParts = initialChess.fen().split(' '), moveNumber = Number(fenParts[5]) || 1;
    var blackToMove = fenParts[1] === 'b', moves = [];
    pos.slice(1).forEach(function (item, i) {
      if (!blackToMove || i === 0) moves.push(moveNumber + (blackToMove ? '...' : '.'));
      moves.push(item.san);
      if (blackToMove) moveNumber += 1;
      blackToMove = !blackToMove;
    });
    var date = game.createdAt ? new Date(game.createdAt) : null;
    var dateTag = date ? date.getUTCFullYear() + '.' + String(date.getUTCMonth() + 1).padStart(2, '0') + '.' + String(date.getUTCDate()).padStart(2, '0') : '????.??.??';
    var pgnResult = meta.result === '1-0' || meta.result === '0-1' ? meta.result : meta.result === '½-½' ? '1/2-1/2' : '*';
    var headers = [
      '[Event "Partida de entrenador"]',
      '[Site "https://lichess.org/' + (game.id || '') + '"]',
      '[Date "' + dateTag + '"]',
      '[White "' + meta.white.replace(/([\\"])/g, '\\$1') + '"]',
      '[Black "' + meta.black.replace(/([\\"])/g, '\\$1') + '"]',
      '[Result "' + pgnResult + '"]'
    ];
    if (initialFen) headers.push('[SetUp "1"]', '[FEN "' + initialChess.fen() + '"]');
    return headers.join('\n') + '\n\n' + moves.join(' ') + ' ' + pgnResult;
  }
  function loadIntoAnalysis(game, meta, pos) {
    if (!analysisFrame) return;
    var encodedPgn = encodeURIComponent(pgnForAnalysis(game, meta, pos));
    analysisFrame.src = 'https://lichess.org/analysis/pgn/' + encodedPgn;
    if (analysisLink) analysisLink.href = analysisFrame.src;
    analysisFrame.title = 'Análisis de la partida: ' + meta.white + ' — ' + meta.black;
    var frame = analysisFrame.closest('.lichess-frame');
    if (frame) frame.classList.remove('is-loaded');
    if (analysisCard) analysisCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function openGame(coach, index) {
    var s = state(coach), game = s.games[index], m = gameMeta(game, coach), pos;
    try { if (!window.Chess) throw Error('No se cargó el visor de ajedrez'); pos = positions(game); } catch (e) { setStatus('Esta partida no se puede reproducir porque sus jugadas no tienen un formato válido.', 'error'); return; }
    loadIntoAnalysis(game, m, pos);
  }
  if (jump) jump.addEventListener('click', function () { root.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
  if (!coaches.length) { setStatus('No hay entrenadores configurados para mostrar.'); return; }
  render(); coaches.forEach(hydrate);
}());
