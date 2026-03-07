/* ═══════════════════════════════════════════
   Family Wordle — app.js
   Screens: pick → cover → guess → result
═══════════════════════════════════════════ */

// ── Valid word set (for guess validation) ──
const ALL_VALID_WORDS = new Set([...WORDS, ...(typeof VALID_GUESSES !== 'undefined' ? VALID_GUESSES : [])]);

// ── State ────────────────────────────────
let secretWord   = '';
let guesses      = [];          // array of evaluated guess arrays
let currentGuess = '';
let gameOver     = false;
let isAnimating  = false;       // prevents input during tile reveal
let hardMode     = false;
let selectedGrade = 2;          // current grade level filter
let requiredPositions = {};     // { index: letter } — greens
let requiredLetters   = {};     // { letter: minCount } — yellows + greens
const MAX_GUESSES = 6;
const WORD_LEN    = 5;
const HINT_COUNT  = 8;

// ── DOM refs ─────────────────────────────
const screens = {
  pick:   document.getElementById('screen-pick'),
  cover:  document.getElementById('screen-cover'),
  guess:  document.getElementById('screen-guess'),
  result: document.getElementById('screen-result'),
};
const wordGrid       = document.getElementById('word-grid');
const wordSearch     = document.getElementById('word-search');
const lockBtn        = document.getElementById('lock-btn');
const readyBtn       = document.getElementById('ready-btn');
const guessGrid      = document.getElementById('guess-grid');
const keyboard       = document.getElementById('keyboard');
const toast          = document.getElementById('toast');
const resultTitle    = document.getElementById('result-title');
const resultBody     = document.getElementById('result-body');
const resultEmoji    = document.getElementById('result-emoji');
const resultGridEmoji= document.getElementById('result-grid-emoji');
const shareBtn       = document.getElementById('share-btn');
const viewboardBtn   = document.getElementById('viewboard-btn');
const playagainBtn   = document.getElementById('playagain-btn');
const playagain2Btn  = document.getElementById('playagain2-btn');
const finalBoard     = document.getElementById('final-board');
const finalGuessGrid = document.getElementById('final-guess-grid');
const hardModeSwitch = document.getElementById('hard-mode-switch');
const srAnnouncer    = document.getElementById('sr-announcer');
const hintBtn        = document.getElementById('hint-btn');
const hintOverlay    = document.getElementById('hint-overlay');
const hintClose      = document.getElementById('hint-close');
const hintWords      = document.getElementById('hint-words');
const hintRefresh    = document.getElementById('hint-refresh');
const gradeButtons   = document.querySelectorAll('.grade-btn');

// ── Screen-reader announcements ───────────
function announce(message) {
  srAnnouncer.textContent = '';
  requestAnimationFrame(() => { srAnnouncer.textContent = message; });
}

// ── Screen management ─────────────────────
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');

  // Focus management for accessibility
  if (name === 'pick') wordSearch.focus();
  else if (name === 'cover') readyBtn.focus();
  else if (name === 'guess') guessGrid.focus();
  else if (name === 'result') resultTitle.focus();
}

// ── Hard Mode Toggle ──────────────────────
hardModeSwitch.addEventListener('click', () => {
  hardMode = !hardMode;
  hardModeSwitch.setAttribute('aria-checked', String(hardMode));
  announce(hardMode ? 'Hard mode enabled' : 'Hard mode disabled');
});

// ── Grade Filtering ──────────────────────
function getWordsForGrade(grade) {
  const words = [];
  for (let g = 2; g <= grade; g++) {
    if (WORD_GRADES[g]) words.push(...WORD_GRADES[g]);
  }
  return words.sort();
}

// ── Grade Selector ───────────────────────
gradeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedGrade = Number(btn.dataset.grade);
    gradeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedWord = '';
    lockBtn.disabled = true;
    buildWordGrid(wordSearch.value);
    announce(`Grade ${selectedGrade} selected`);
  });
});

// ── Word Picker ───────────────────────────
let selectedWord = '';

function buildWordGrid(filter = '') {
  wordGrid.innerHTML = '';
  const gradeWords = getWordsForGrade(selectedGrade);
  const query = filter.trim().toUpperCase();
  const filtered = query ? gradeWords.filter(w => w.includes(query)) : gradeWords;

  if (filtered.length === 0) {
    const msg = document.createElement('div');
    msg.className = 'no-results';
    msg.textContent = 'No words match your search.';
    wordGrid.appendChild(msg);
    return;
  }

  filtered.forEach(word => {
    const card = document.createElement('button');
    card.className = 'word-card';
    card.textContent = word;
    card.setAttribute('role', 'listitem');
    card.addEventListener('click', () => selectWord(word));
    wordGrid.appendChild(card);
  });
}

function selectWord(word) {
  document.querySelectorAll('.word-card.selected')
    .forEach(c => c.classList.remove('selected'));

  if (selectedWord === word) {
    selectedWord = '';
    lockBtn.disabled = true;
    return;
  }

  selectedWord = word;
  lockBtn.disabled = false;

  document.querySelectorAll('.word-card').forEach(c => {
    if (c.textContent === word) c.classList.add('selected');
  });

  const selected = wordGrid.querySelector('.word-card.selected');
  if (selected) selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

lockBtn.addEventListener('click', () => {
  if (!selectedWord) return;
  secretWord = selectedWord;
  // Disable options once game starts
  hardModeSwitch.disabled = true;
  hardModeSwitch.classList.add('disabled');
  gradeButtons.forEach(b => b.classList.add('disabled'));
  showScreen('cover');
});

wordSearch.addEventListener('input', () => {
  selectedWord = '';
  lockBtn.disabled = true;
  buildWordGrid(wordSearch.value);
});

// ── Cover Screen ─────────────────────────
readyBtn.addEventListener('click', () => {
  buildGuessGrid();
  buildKeyboard();
  showScreen('guess');
  announce('Game started. Make your first guess.');
});

// ── Guess Grid ────────────────────────────
function buildGuessGrid() {
  guessGrid.innerHTML = '';
  for (let r = 0; r < MAX_GUESSES; r++) {
    const row = document.createElement('div');
    row.className = 'guess-row';
    row.id = `row-${r}`;
    row.setAttribute('role', 'row');
    for (let c = 0; c < WORD_LEN; c++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.id = `tile-${r}-${c}`;
      tile.setAttribute('role', 'gridcell');
      tile.setAttribute('aria-label', `Row ${r + 1}, Letter ${c + 1}: empty`);
      row.appendChild(tile);
    }
    guessGrid.appendChild(row);
  }
}

function getTile(row, col) {
  return document.getElementById(`tile-${row}-${col}`);
}

function updateCurrentGuessDisplay() {
  const row = guesses.length;
  for (let c = 0; c < WORD_LEN; c++) {
    const tile = getTile(row, c);
    const letter = currentGuess[c] || '';
    if (letter && !tile.dataset.letter) {
      tile.classList.add('pop');
      tile.addEventListener('animationend', () => tile.classList.remove('pop'), { once: true });
    }
    tile.textContent = letter;
    if (letter) {
      tile.dataset.letter = letter;
      tile.setAttribute('aria-label', `Row ${row + 1}, Letter ${c + 1}: ${letter}`);
    } else {
      delete tile.dataset.letter;
      tile.setAttribute('aria-label', `Row ${row + 1}, Letter ${c + 1}: empty`);
    }
  }
}

// ── Keyboard ──────────────────────────────
const KEY_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','DEL'],
];

function buildKeyboard() {
  keyboard.innerHTML = '';
  KEY_ROWS.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'key-row';
    row.forEach(key => {
      const btn = document.createElement('button');
      btn.className = 'key' + (key.length > 1 ? ' wide' : '');
      btn.textContent = key === 'DEL' ? '⌫' : key;
      btn.dataset.key = key;
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-label', key === 'DEL' ? 'Delete' : key === 'ENTER' ? 'Submit guess' : key);
      btn.addEventListener('click', () => handleKey(key));
      rowEl.appendChild(btn);
    });
    keyboard.appendChild(rowEl);
  });
}

// Also handle physical keyboard
document.addEventListener('keydown', e => {
  if (!screens.guess.classList.contains('active')) return;
  if (e.key === 'Escape') { closeHintPanel(); return; }
  if (e.metaKey || e.ctrlKey) return;

  if (e.key === 'Enter') {
    handleKey('ENTER');
  } else if (e.key === 'Backspace') {
    handleKey('DEL');
  } else if (/^[a-zA-Z]$/.test(e.key)) {
    handleKey(e.key.toUpperCase());
  }
});

function handleKey(key) {
  if (gameOver || isAnimating) return;

  if (key === 'DEL') {
    if (currentGuess.length > 0) {
      currentGuess = currentGuess.slice(0, -1);
      updateCurrentGuessDisplay();
    }
    return;
  }

  if (key === 'ENTER') {
    submitGuess();
    return;
  }

  if (currentGuess.length < WORD_LEN && /^[A-Z]$/.test(key)) {
    currentGuess += key;
    updateCurrentGuessDisplay();
  }
}

// ── Guess evaluation ──────────────────────
function evaluateGuess(guess, secret) {
  const result = Array(WORD_LEN).fill(null).map((_, i) => ({
    letter: guess[i],
    state: 'absent',
  }));

  const remaining = secret.split('');

  // Pass 1: mark correct positions
  for (let i = 0; i < WORD_LEN; i++) {
    if (guess[i] === secret[i]) {
      result[i].state = 'correct';
      remaining[i] = null;
    }
  }

  // Pass 2: mark present (wrong position)
  for (let i = 0; i < WORD_LEN; i++) {
    if (result[i].state === 'correct') continue;
    const idx = remaining.indexOf(guess[i]);
    if (idx !== -1) {
      result[i].state = 'present';
      remaining[idx] = null;
    }
  }

  return result;
}

// ── Hard Mode validation ──────────────────
function checkHardMode(guess) {
  // Check required positions (greens)
  for (const [idx, letter] of Object.entries(requiredPositions)) {
    if (guess[idx] !== letter) {
      return `${ordinal(+idx + 1)} letter must be ${letter}`;
    }
  }

  // Check required letters (yellows + greens combined minimum counts)
  for (const [letter, minCount] of Object.entries(requiredLetters)) {
    const count = guess.split('').filter(l => l === letter).length;
    if (count < minCount) {
      return `Guess must contain ${letter}`;
    }
  }

  return null;
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function updateHardModeConstraints(evaluation) {
  // Update required positions from greens
  evaluation.forEach(({ letter, state }, idx) => {
    if (state === 'correct') {
      requiredPositions[idx] = letter;
    }
  });

  // Update required letter minimum counts
  const letterCounts = {};
  evaluation.forEach(({ letter, state }) => {
    if (state === 'correct' || state === 'present') {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }
  });
  for (const [letter, count] of Object.entries(letterCounts)) {
    requiredLetters[letter] = Math.max(requiredLetters[letter] || 0, count);
  }
}

// ── Submit ────────────────────────────────
function submitGuess() {
  if (currentGuess.length < WORD_LEN) {
    showToast('Not enough letters');
    shakeRow(guesses.length);
    return;
  }

  // Validate word is in list
  if (!ALL_VALID_WORDS.has(currentGuess)) {
    showToast('Not in word list');
    shakeRow(guesses.length);
    return;
  }

  // Hard mode validation
  if (hardMode && guesses.length > 0) {
    const violation = checkHardMode(currentGuess);
    if (violation) {
      showToast(violation);
      shakeRow(guesses.length);
      return;
    }
  }

  const evaluation = evaluateGuess(currentGuess, secretWord);
  const rowIndex = guesses.length;
  guesses.push(evaluation);

  // Update hard mode constraints
  if (hardMode) {
    updateHardModeConstraints(evaluation);
  }

  isAnimating = true;
  currentGuess = '';

  revealRow(rowIndex, evaluation, () => {
    isAnimating = false;
    updateKeyboard(evaluation);

    // Announce result for screen readers
    const resultText = evaluation.map(({ letter, state }) => `${letter} ${state}`).join(', ');
    announce(`Row ${rowIndex + 1}: ${resultText}`);

    const won = evaluation.every(e => e.state === 'correct');

    if (won) {
      gameOver = true;
      const messages = ['Genius!', 'Brilliant!', 'Amazing!', 'Splendid!', 'Great!', 'Phew!'];
      showToast(messages[rowIndex] || 'Nice!');
      bounceRow(rowIndex);
      setTimeout(() => {
        announce(`You won! Solved in ${guesses.length} ${guesses.length === 1 ? 'guess' : 'guesses'}.`);
        showResult(true);
      }, 1800);
    } else if (guesses.length === MAX_GUESSES) {
      gameOver = true;
      showToast(secretWord, 3500);
      setTimeout(() => {
        announce(`Game over. The word was ${secretWord}.`);
        showResult(false);
      }, 2200);
    }
  });
}

// ── Row animations ────────────────────────
function revealRow(rowIndex, evaluation, callback) {
  const DELAY_PER_TILE = 300;

  evaluation.forEach(({ letter, state }, col) => {
    const tile = getTile(rowIndex, col);
    setTimeout(() => {
      tile.classList.add('flip');
      tile.addEventListener('animationend', () => {
        tile.classList.remove('flip');
        tile.classList.add(state);
        tile.setAttribute('aria-label', `Row ${rowIndex + 1}, Letter ${col + 1}: ${letter}, ${state}`);
      }, { once: true });
    }, col * DELAY_PER_TILE);
  });

  setTimeout(callback, WORD_LEN * DELAY_PER_TILE + 200);
}

function shakeRow(rowIndex) {
  const row = document.getElementById(`row-${rowIndex}`);
  row.classList.add('shake');
  row.addEventListener('animationend', () => row.classList.remove('shake'), { once: true });
}

function bounceRow(rowIndex) {
  const DELAY_PER_TILE = 100;
  for (let c = 0; c < WORD_LEN; c++) {
    const tile = getTile(rowIndex, c);
    setTimeout(() => {
      tile.classList.add('bounce');
      tile.addEventListener('animationend', () => tile.classList.remove('bounce'), { once: true });
    }, c * DELAY_PER_TILE + 400);
  }
}

// ── Keyboard color updates ─────────────────
function updateKeyboard(evaluation) {
  const priority = { correct: 3, present: 2, absent: 1 };
  const keyStates = {};

  guesses.flat().forEach(({ letter, state }) => {
    const current = keyStates[letter];
    if (!current || priority[state] > priority[current]) {
      keyStates[letter] = state;
    }
  });

  document.querySelectorAll('.key[data-key]').forEach(btn => {
    const key = btn.dataset.key;
    const state = keyStates[key];
    if (state) {
      btn.classList.remove('correct', 'present', 'absent');
      btn.classList.add(state);
    }
  });
}

// ── Hint System ───────────────────────────
function getHintWords() {
  const guessedWords = new Set(guesses.map(row => row.map(e => e.letter).join('')));
  const pool = getWordsForGrade(selectedGrade).filter(w => w !== secretWord && !guessedWords.has(w));
  const onFifthGuess = guesses.length >= 4; // 0-indexed, so 4 = 5th guess

  // Shuffle pool
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  let hints = pool.slice(0, onFifthGuess ? HINT_COUNT - 1 : HINT_COUNT);

  // On 5th guess or later, sneak the answer into the list
  if (onFifthGuess && !guessedWords.has(secretWord)) {
    const insertAt = Math.floor(Math.random() * (hints.length + 1));
    hints.splice(insertAt, 0, secretWord);
  }

  return hints;
}

function renderHintWords() {
  hintWords.innerHTML = '';
  const words = getHintWords();
  words.forEach(word => {
    const chip = document.createElement('div');
    chip.className = 'hint-word';
    chip.textContent = word;
    hintWords.appendChild(chip);
  });
}

function openHintPanel() {
  renderHintWords();
  hintOverlay.classList.remove('hidden');
  hintOverlay.setAttribute('aria-hidden', 'false');
  hintClose.focus();
}

function closeHintPanel() {
  hintOverlay.classList.add('hidden');
  hintOverlay.setAttribute('aria-hidden', 'true');
}

hintBtn.addEventListener('click', () => {
  if (gameOver) return;
  openHintPanel();
});

hintClose.addEventListener('click', closeHintPanel);

hintOverlay.addEventListener('click', (e) => {
  if (e.target === hintOverlay) closeHintPanel();
});

hintRefresh.addEventListener('click', renderHintWords);

// ── Toast ─────────────────────────────────
let toastTimeout = null;

function showToast(message, duration = 1200) {
  toast.textContent = message;
  toast.classList.add('show');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), duration);
}

// ── Results ───────────────────────────────
function buildEmojiGrid() {
  return guesses.map(row =>
    row.map(({ state }) =>
      state === 'correct' ? '🟩' : state === 'present' ? '🟨' : '⬜'
    ).join('')
  ).join('\n');
}

function showResult(won) {
  const guessCount = guesses.length;

  if (won) {
    resultEmoji.textContent = '🎉';
    resultTitle.textContent = guessCount === 1 ? 'Hole in one!' : 'You got it!';
    resultBody.textContent = `Solved in ${guessCount} ${guessCount === 1 ? 'guess' : 'guesses'}!`;
  } else {
    resultEmoji.textContent = '🤔';
    resultTitle.textContent = 'Nice try!';
    resultBody.textContent = `The word was ${secretWord}.`;
  }

  resultGridEmoji.textContent = buildEmojiGrid();

  finalBoard.classList.add('hidden');
  document.getElementById('result-card').classList.remove('hidden');

  showScreen('result');
}

// ── Share ─────────────────────────────────
shareBtn.addEventListener('click', () => {
  const guessCount = guesses.length;
  const won = guesses.length > 0 && guesses[guesses.length - 1].every(e => e.state === 'correct');
  const score = won ? guessCount : 'X';
  const mode = hardMode ? '*' : '';
  const text = `Family Wordle ${score}/${MAX_GUESSES}${mode}\n\n${buildEmojiGrid()}`;

  if (navigator.share) {
    navigator.share({ text }).catch(() => copyText(text));
  } else {
    copyText(text);
  }
});

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    shareBtn.textContent = 'Copied!';
    setTimeout(() => { shareBtn.textContent = 'Copy Result'; }, 2000);
  });
}

// ── View Board ────────────────────────────
viewboardBtn.addEventListener('click', () => {
  document.getElementById('result-card').classList.add('hidden');
  buildFinalBoard();
  finalBoard.classList.remove('hidden');
});

function buildFinalBoard() {
  finalGuessGrid.innerHTML = '';
  for (let r = 0; r < MAX_GUESSES; r++) {
    const row = document.createElement('div');
    row.className = 'guess-row';
    for (let c = 0; c < WORD_LEN; c++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      const evalRow = guesses[r];
      if (evalRow) {
        const { letter, state } = evalRow[c];
        tile.textContent = letter;
        tile.dataset.letter = letter;
        tile.classList.add(state);
      }
      row.appendChild(tile);
    }
    finalGuessGrid.appendChild(row);
  }
}

// ── Play Again ────────────────────────────
function resetGame() {
  secretWord   = '';
  guesses      = [];
  currentGuess = '';
  gameOver     = false;
  isAnimating  = false;
  selectedWord = '';
  requiredPositions = {};
  requiredLetters   = {};
  lockBtn.disabled = true;
  wordSearch.value = '';
  // Re-enable options
  hardModeSwitch.disabled = false;
  hardModeSwitch.classList.remove('disabled');
  gradeButtons.forEach(b => b.classList.remove('disabled'));
  closeHintPanel();
  buildWordGrid();
  showScreen('pick');
}

playagainBtn.addEventListener('click', resetGame);
playagain2Btn.addEventListener('click', resetGame);

// ── Init ──────────────────────────────────
buildWordGrid();
showScreen('pick');
