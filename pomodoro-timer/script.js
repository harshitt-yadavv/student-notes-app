
const MODES = {
  focus: { label: 'Focus Time', duration: 25 * 60, color: '#a78bfa' },
  short: { label: 'Short Break', duration: 5 * 60, color: '#34d399' },
  long:  { label: 'Long Break',  duration: 15 * 60, color: '#60a5fa' }
};

const TIPS = [
  "Turn off notifications during focus time 📵",
  "Drink water before your session starts 💧",
  "After 4 sessions, take a long break 🧘",
  "One task at a time — focus beats multitasking 🎯",
  "Stand up and stretch during your break 🙆",
  "Your brain needs rest to retain information 🧠",
  "Consistency beats intensity — show up daily 🔥",
  "Close unused tabs to reduce distractions 💻"
];

let currentMode = 'focus';
let timeLeft = MODES.focus.duration;
let totalTime = MODES.focus.duration;
let timerInterval = null;
let isRunning = false;
let sessionCount = 0;
let totalFocusMinutes = 0;
let streak = parseInt(localStorage.getItem('pomStreak') || '0');
let lastDate = localStorage.getItem('pomLastDate') || '';

const circumference = 2 * Math.PI * 85;

function init() {
  document.getElementById('ringFill').style.strokeDasharray = circumference;
  document.getElementById('ringFill').style.strokeDashoffset = 0;
  document.getElementById('streakCount').textContent = streak;
  showTip();
  updateDisplay();
}

function switchMode(mode) {
  if (isRunning) return;
  currentMode = mode;
  timeLeft = MODES[mode].duration;
  totalTime = MODES[mode].duration;

  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + mode).classList.add('active');
  document.getElementById('modeLabel').textContent = MODES[mode].label;
  document.getElementById('ringFill').style.stroke = MODES[mode].color;
  document.querySelector('.start-btn').style.background = MODES[mode].color;

  updateDisplay();
  updateRing();
}

function toggleTimer() {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  isRunning = true;
  const btn = document.getElementById('startBtn');
  btn.textContent = 'Pause';
  btn.classList.add('running');

  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();
    updateRing();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      onSessionEnd();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  const btn = document.getElementById('startBtn');
  btn.textContent = 'Resume';
  btn.classList.remove('running');
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  timeLeft = MODES[currentMode].duration;
  totalTime = MODES[currentMode].duration;
  const btn = document.getElementById('startBtn');
  btn.textContent = 'Start';
  btn.classList.remove('running');
  updateDisplay();
  updateRing();
}

function skipSession() {
  clearInterval(timerInterval);
  isRunning = false;
  onSessionEnd();
}

function onSessionEnd() {
  const btn = document.getElementById('startBtn');
  btn.textContent = 'Start';
  btn.classList.remove('running');

  if (currentMode === 'focus') {
    sessionCount++;
    totalFocusMinutes += 25;
    document.getElementById('sessionCount').textContent = sessionCount;
    document.getElementById('totalFocus').textContent = totalFocusMinutes + 'm';
    updateStreak();

    if (sessionCount % 4 === 0) {
      switchMode('long');
    } else {
      switchMode('short');
    }
  } else {
    switchMode('focus');
  }

  showTip();
  playSound();
}

function updateDisplay() {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  document.getElementById('timeDisplay').textContent = mins + ':' + secs;
  document.title = mins + ':' + secs + ' — Pomodoro Timer';
}

function updateRing() {
  const progress = timeLeft / totalTime;
  const offset = circumference * (1 - progress);
  document.getElementById('ringFill').style.strokeDashoffset = offset;
}

function updateStreak() {
  const today = new Date().toDateString();
  if (lastDate !== today) {
    streak++;
    lastDate = today;
    localStorage.setItem('pomStreak', streak);
    localStorage.setItem('pomLastDate', today);
    document.getElementById('streakCount').textContent = streak;
  }
}

function editTask() {
  const input = document.getElementById('taskInput');
  const text = document.getElementById('taskText');
  input.classList.remove('hidden');
  text.classList.add('hidden');
  input.value = text.textContent === 'Click Edit to set your task' ? '' : text.textContent;
  input.focus();
}

function saveTask(e) {
  if (e.key === 'Enter') {
    const input = document.getElementById('taskInput');
    const text = document.getElementById('taskText');
    text.textContent = input.value || 'Click Edit to set your task';
    input.classList.add('hidden');
    text.classList.remove('hidden');
  }
}

function showTip() {
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
  document.getElementById('tipBox').textContent = '💡 ' + tip;
}

function playSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}

init();