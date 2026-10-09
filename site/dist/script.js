const themeButton = document.querySelector('#theme-toggle');
function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.title = `Switch to ${dark ? 'light' : 'dark'} theme`;
  document.querySelector('meta[name="theme-color"]').content = dark ? '#111514' : '#FAFAF9';
}
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('theme', theme); } catch {}
  updateThemeButton();
});
updateThemeButton();


// A local, illustrative voting sequence. No real votes are collected.
const musicDemo = document.querySelector('.music-votes');
const voteRows = {
  one: musicDemo.querySelector('.vote-one'),
  two: musicDemo.querySelector('.vote-two'),
  six: musicDemo.querySelector('.vote-six')
};
const voteCount = document.querySelector('#rising-votes');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let voteTimer;
let voteStep = 0;
function resetVotes() {
  musicDemo.classList.remove('is-running');
  voteRows.six.classList.remove('is-gaining');
  voteRows.one.style.transform = 'translateY(0)';
  voteRows.two.style.transform = 'translateY(72px)';
  voteRows.six.style.transform = 'translateY(144px)';
  voteCount.textContent = '6';
  voteStep = 0;
}
function runVoteStep() {
  voteStep++;
  musicDemo.classList.add('is-running');
  if (voteStep >= 3 && voteStep <= 8) {
    const count = voteStep + 4;
    voteCount.textContent = String(count);
    voteRows.six.classList.add('is-gaining');
    if (count >= 8) {
      voteRows.two.style.transform = 'translateY(144px)';
      voteRows.six.style.transform = 'translateY(72px)';
    }
    if (count >= 11) {
      voteRows.one.style.transform = 'translateY(72px)';
      voteRows.six.style.transform = 'translateY(0)';
    }
  }
  if (voteStep >= 13) resetVotes();
}
function syncVoteAnimation() {
  clearInterval(voteTimer);
  resetVotes();
  if (!reducedMotion.matches && !document.hidden) voteTimer = setInterval(runVoteStep, 850);
}
reducedMotion.addEventListener('change', syncVoteAnimation);
document.addEventListener('visibilitychange', syncVoteAnimation);
syncVoteAnimation();
const deploymentDemo = document.querySelector('.deployment-demo');
const deploymentStatus = document.querySelector('#deployment-status');
const liveVersion = deploymentDemo.querySelector('.live-version');
const deploymentStages = [
  ['', 'Ready for the next update'],
  ['push', 'Pushing code to GitLab'],
  ['notify', 'GitLab signals a new version'],
  ['sync', 'Argo CD syncs the update'],
  ['live', 'Version 2 is live'],
  ['live', 'Everything is in sync']
];
let deploymentTimer;
let deploymentStep = 0;
function showDeploymentStage() {
  const [stage, label] = deploymentStages[deploymentStep];
  deploymentDemo.dataset.stage = stage;
  deploymentStatus.textContent = label;
  liveVersion.textContent = stage === 'live' ? 'v2.0' : 'v1.0';
}
function syncDeploymentAnimation() {
  clearInterval(deploymentTimer);
  deploymentStep = reducedMotion.matches ? 4 : 0;
  showDeploymentStage();
  if (!reducedMotion.matches && !document.hidden) {
    deploymentTimer = setInterval(() => {
      deploymentStep = (deploymentStep + 1) % deploymentStages.length;
      showDeploymentStage();
    }, 1900);
  }
}
reducedMotion.addEventListener('change', syncDeploymentAnimation);
document.addEventListener('visibilitychange', syncDeploymentAnimation);
syncDeploymentAnimation();
const ragDemo = document.querySelector('.rag-demo');
const ragTasks = [...ragDemo.querySelectorAll('.rag-task')];
let ragTimers = [];
let ragAnimations = [];
function clearRagSequence() {
  ragTimers.forEach(clearTimeout);
  ragTimers = [];
  ragAnimations.forEach(animation => animation.cancel());
  ragAnimations = [];
  ragDemo.querySelectorAll('.rag-flying-letter').forEach(letter => letter.remove());
}
function scheduleRag(callback, delay) { ragTimers.push(setTimeout(callback, delay)); }
function completeRagStep(index) {
  ragTasks[index].classList.remove('active');
  ragTasks[index].classList.add('complete');
  ragTasks[index].querySelector('.rag-status-mark').textContent = '✓';
}
function collectRagLetters() {
  const container = ragDemo.getBoundingClientRect();
  const targets = [...ragDemo.querySelectorAll('.rag-result span')];
  ragTasks.forEach((task, index) => {
    const initial = task.querySelector('.rag-initial');
    const from = initial.getBoundingClientRect();
    const to = targets[index].getBoundingClientRect();
    const letter = document.createElement('span');
    letter.className = 'rag-flying-letter';
    letter.textContent = initial.textContent;
    letter.style.left = `${from.left - container.left}px`;
    letter.style.top = `${from.top - container.top}px`;
    letter.style.fontSize = `${getComputedStyle(initial).fontSize}`;
    ragDemo.append(letter);
    initial.style.opacity = '0';
    const animation = letter.animate([
      { transform: 'translate(0, 0) scale(1)' },
      { transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${27 / parseFloat(getComputedStyle(initial).fontSize)})` }
    ], {duration:1100, delay:index * 120, easing:'cubic-bezier(.4,0,.2,1)', fill:'forwards'});
    ragAnimations.push(animation);
  });
  scheduleRag(() => {
    ragDemo.classList.add('collected');
    ragDemo.querySelectorAll('.rag-flying-letter').forEach(letter => letter.remove());
  }, 1450);
}
function startRagSequence() {
  clearRagSequence();
  ragDemo.classList.remove('collecting', 'collected');
  ragTasks.forEach(task => {
    task.classList.remove('visible', 'active', 'complete');
    task.querySelector('.rag-status-mark').textContent = '';
    task.querySelector('.rag-initial').style.opacity = '';
  });
  if (reducedMotion.matches) {
    ragTasks.forEach((task,index) => { task.classList.add('visible'); completeRagStep(index); });
    ragDemo.classList.add('collecting','collected');
    return;
  }
  if (document.hidden) return;
  ragTasks.forEach((task,index) => {
    scheduleRag(() => task.classList.add('visible','active'), 500 + index * 2100);
    scheduleRag(() => completeRagStep(index), 2400 + index * 2100);
  });
  scheduleRag(() => ragDemo.classList.add('collecting'), 7000);
  scheduleRag(collectRagLetters, 8000);
  scheduleRag(startRagSequence, 12500);
}
reducedMotion.addEventListener('change', startRagSequence);
document.addEventListener('visibilitychange', startRagSequence);
window.addEventListener('resize', startRagSequence);
startRagSequence();

// A deterministic Tetris rally: five pieces fill and clear two rows.
const tetrisSettled = document.querySelector('#tetris-settled');
const tetrisFalling = document.querySelector('#tetris-falling');
const tetrisPieces = [
  { cells: [[0,0],[0,1],[1,1],[2,1]], x:0, y:13 },
  { cells: [[0,0],[1,0],[2,0],[2,1]], x:1, y:13 },
  { cells: [[0,0],[1,0],[0,1],[1,1]], x:4, y:13 },
  { cells: [[0,0],[0,1],[1,1],[2,1]], x:6, y:13 },
  { cells: [[0,0],[1,0],[2,0],[2,1]], x:7, y:13 }
];
let tetrisTimer;
let tetrisPieceIndex = 0;
let tetrisRow = -2;
let tetrisHold = 0;
let tetrisPhase = 'fall';
function drawTetrisCells(target, cells, x, y) {
  cells.forEach(([dx,dy]) => {
    if (y + dy < 0) return;
    const block = document.createElementNS('http://www.w3.org/2000/svg','rect');
    block.setAttribute('x', String(151 + (x + dx) * 20));
    block.setAttribute('y', String(21 + (y + dy) * 20));
    block.setAttribute('width','18');
    block.setAttribute('height','18');
    block.setAttribute('rx','1');
    target.append(block);
  });
}
function resetTetris() {
  tetrisSettled.replaceChildren();
  tetrisFalling.replaceChildren();
  tetrisSettled.classList.remove('clearing');
  tetrisPieceIndex = 0;
  tetrisRow = -2;
  tetrisPhase = 'fall';
  tetrisHold = 0;
}
function tickTetris() {
  if (tetrisPhase === 'clear') {
    tetrisHold++;
    if (tetrisHold === 5) tetrisSettled.classList.add('clearing');
    if (tetrisHold >= 11) resetTetris();
    return;
  }
  const piece = tetrisPieces[tetrisPieceIndex];
  tetrisFalling.replaceChildren();
  drawTetrisCells(tetrisFalling, piece.cells, piece.x, tetrisRow);
  if (tetrisRow >= piece.y) {
    drawTetrisCells(tetrisSettled, piece.cells, piece.x, piece.y);
    tetrisFalling.replaceChildren();
    tetrisPieceIndex++;
    tetrisRow = -2;
    if (tetrisPieceIndex === tetrisPieces.length) tetrisPhase = 'clear';
  } else tetrisRow++;
}
function syncTetris() {
  clearInterval(tetrisTimer);
  resetTetris();
  if (reducedMotion.matches) {
    tetrisPieces.slice(0,3).forEach(piece => drawTetrisCells(tetrisSettled,piece.cells,piece.x,piece.y));
    drawTetrisCells(tetrisFalling,tetrisPieces[3].cells,6,5);
  } else if (!document.hidden) tetrisTimer = setInterval(tickTetris,120);
}
reducedMotion.addEventListener('change',syncTetris);
document.addEventListener('visibilitychange',syncTetris);
syncTetris();

// Play the header introduction once per browser, not on every page load.
const portfolioWordmark = document.querySelector('.portfolio-wordmark');
async function introduceWordmark() {
  let hasSeenIntro = false;
  try { hasSeenIntro = localStorage.getItem('portfolio-intro-seen') === '1'; } catch { hasSeenIntro = true; }
  if (hasSeenIntro || reducedMotion.matches) return;
  try { localStorage.setItem('portfolio-intro-seen', '1'); } catch {}
  portfolioWordmark.classList.add('is-writing');
  await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 1200))]);
  portfolioWordmark.classList.add('start-writing');
}
introduceWordmark();
