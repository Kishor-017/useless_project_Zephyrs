// Grass Debt 🌱 — Complete Web Application Engine

// --- PASSAGE BANK (32 VARIETIES) ---
const PASSAGES = [
  { id: 'p1', topic: 'Technology', text: 'Silicon chips process billions of calculations every single second. Meanwhile, human fingers struggle to tap a keycap without hitting adjacent letters.' },
  { id: 'p2', topic: 'Programming', text: 'Debugging software feels like being a detective in a crime movie where you are also the murderer who left all the bugs behind.' },
  { id: 'p3', topic: 'College Life', text: 'Surviving on lukewarm instant ramen and cold brew coffee, students pull all-nighters typing essays forty minutes before the submission deadline.' },
  { id: 'p4', topic: 'Football', text: 'The stadium roars as ninety minutes of tactical football culminate in a dramatic injury-time winner curling into the top corner of the net.' },
  { id: 'p5', topic: 'Nature', text: 'Blades of Bermuda grass absorb photons from sunlight, turning solar energy into green chlorophyll while human typists stare intently at illuminated pixels.' },
  { id: 'p6', topic: 'Science', text: 'Quantum particles can exist in multiple states simultaneously until observed, which is remarkably similar to how code behaves before running unit tests.' },
  { id: 'p7', topic: 'Space', text: 'Voyager one is currently traveling through interstellar space more than fourteen billion miles from Earth, silent and drifting among ancient stars.' },
  { id: 'p8', topic: 'Internet Culture', text: 'Submitting a pull request with zero breaking changes is the modern equivalent of finding a crisp twenty dollar bill in an old winter jacket.' },
  { id: 'p9', topic: 'Productivity', text: 'Optimizing your daily workflow to save four minutes per day is brilliant, provided you do not spend three hours organizing your notes app.' },
  { id: 'p10', topic: 'Travel', text: 'Walking through winding cobblestone streets in an unfamiliar city without relying on cellular navigation is a rare modern luxury.' },
  { id: 'p11', topic: 'Creativity', text: 'Blank canvases and empty text files are equally terrifying because they demand that you transform pure imagination into permanent reality.' },
  { id: 'p12', topic: 'Everyday Observations', text: 'Nobody ever notices how smoothly a elevator door operates until it stops between floors on a humid Tuesday morning.' },
  { id: 'p13', topic: 'Funny Thoughts', text: 'If mechanical keyboards were allowed in silent libraries, touch typists would be classified as domestic noise violations.' },
  { id: 'p14', topic: 'Technology', text: 'Cloud storage is simply someone else\'s computer running somewhere in a air-conditioned server farm surrounded by desert heat.' },
  { id: 'p15', topic: 'Programming', text: 'Refactoring legacy code without writing tests first is like playing Russian roulette with a production database on a Friday afternoon.' },
  { id: 'p16', topic: 'College Life', text: 'Finding an open power outlet in a crowded campus library during finals week triggers the same adrenaline rush as winning an Olympic medal.' },
  { id: 'p17', topic: 'Football', text: 'Tiki-taka passing sequences require razor-sharp precision, spatial awareness, and endless off-the-ball movement across green turf.' },
  { id: 'p18', topic: 'Nature', text: 'Redwood trees can live for over two thousand years, quietly growing taller while generations of civilization come and go underneath.' },
  { id: 'p19', topic: 'Science', text: 'Photosynthesis converts carbon dioxide and water into oxygen and glucose, providing the fuel that keeps every living organism breathing.' },
  { id: 'p20', topic: 'Space', text: 'The light leaving Andromeda galaxy takes two and a half million light years to reach human eyes stargazing on a clear autumn night.' },
  { id: 'p21', topic: 'Internet Culture', text: 'Infinite scroll feeds were designed by behavioral scientists to ensure you never quite reach the bottom of your social media feed.' },
  { id: 'p22', topic: 'Productivity', text: 'Checking off small items on a to-do list provides a pleasant dopamine bump, even if the main project remains completely untouched.' },
  { id: 'p23', topic: 'Travel', text: 'Watching sunrise over mountain peaks after an early morning hike reminds you how vast and magnificent our planet truly is.' },
  { id: 'p24', topic: 'Creativity', text: 'Great design is not about adding every possible decoration, but eliminating everything unnecessary until only perfection remains.' },
  { id: 'p25', topic: 'Everyday Observations', text: 'Pushing a door that explicitly says pull is a universal human experience that transcends language, culture, and intellect.' },
  { id: 'p26', topic: 'Funny Thoughts', text: 'Your mechanical keyboard switches click with terrifying velocity. Outside your window, lawn grass blades sway in silent anticipation.' },
  { id: 'p27', topic: 'Technology', text: 'Artificial intelligence models analyze petabytes of human text to generate responses, yet still cannot locate missing house keys.' },
  { id: 'p28', topic: 'Programming', text: 'The best error message is the one that tells you exactly which line failed and why, rather than printing unhandled null reference.' },
  { id: 'p29', topic: 'Nature', text: 'Underneath every lush green lawn lies a subterranean network of fungal mycelium sharing nutrients and water between roots.' },
  { id: 'p30', topic: 'Science', text: 'Tectonic plates drift across Earth\'s mantle at roughly the same rate human fingernails grow, shaping continents over eons.' },
  { id: 'p31', topic: 'Space', text: 'Supernovae scatter heavy elements like iron and gold across the cosmos, meaning the atoms in your body were forged in dying stars.' },
  { id: 'p32', topic: 'Internet Culture', text: 'Type faster than average? Congratulations. You\'ve saved time. Unfortunately, you now owe that exact time to nature.' }
];

const FUNNY_MESSAGES = [
  "Nature has sent you an invoice.",
  "Congratulations. Your productivity is now taxable.",
  "You typed faster than average. That's unfortunate.",
  "Every millisecond saved brings you closer to the grass.",
  "Touch grass. Literally.",
  "Your keyboard owes nature.",
  "Productivity has consequences.",
  "Chlorophyll appreciates your cooperation.",
  "Stop typing. Start touching grass.",
  "Ground yourself. Literally."
];

const STORAGE_KEY = 'grass_debt_app_v2';

// --- INITIAL STATE ---
let state = {
  view: 'landing', // landing, setup, test, grass, results, slow_result
  config: {
    dailyHours: 4,
    dailyMinutes: 0,
    avgWpm: 40
  },
  activeDebtSeconds: 0,
  totalTests: 0,
  totalGrassPaidSeconds: 0,
  bestWpm: 0,
  history: [],
  // Current test state
  currentPassage: PASSAGES[0],
  userInput: '',
  startTime: null,
  endTime: null,
  liveWpm: 0,
  liveAccuracy: 100,
  liveElapsedSeconds: 0,
  latestResult: null,
  // Touch grass state
  isTouchingGrass: false,
  touchPos: null
};

let lastPassageId = null;

function getRandomPassage() {
  const available = PASSAGES.filter(p => p.id !== lastPassageId);
  const selected = available[Math.floor(Math.random() * available.length)] || PASSAGES[0];
  lastPassageId = selected.id;
  return selected;
}

// --- AUDIO SYNTHESIZER ---
let audioCtx = null;
let rustleGain = null;
let rustleSource = null;

function getAudioCtx() {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioCtxClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playKeyClick(isError = false) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (isError) {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    } else {
      osc.type = 'sine';
      const freq = 550 + Math.random() * 200;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch {}
}

function startRustleSound() {
  try {
    const ctx = getAudioCtx();
    if (rustleSource) return;

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.03;
      b6 = white * 0.115926;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.3);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseSource.start();
    rustleSource = noiseSource;
    rustleGain = gain;
  } catch {}
}

function stopRustleSound() {
  try {
    if (rustleGain && audioCtx) {
      const ctx = audioCtx;
      rustleGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      setTimeout(() => {
        if (rustleSource) {
          try { rustleSource.stop(); } catch {}
          rustleSource = null;
        }
        rustleGain = null;
      }, 200);
    }
  } catch {
    rustleSource = null;
    rustleGain = null;
  }
}

function playDebtPaidChime() {
  try {
    const ctx = getAudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + idx * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.9);
    });
  } catch {}
}

// --- MATH CALCULATIONS (EXISTING FORMULA PRESERVED) ---
function calculateGrassDebt(userWpm, config, testDurationSeconds) {
  const dailyHours = config.dailyHours + config.dailyMinutes / 60;
  const safeDailyHours = Math.max(0.1, dailyHours);
  const avgWpm = Math.max(1, config.avgWpm);

  const speedRatio = userWpm / avgWpm;
  const equivalentAvgHours = safeDailyHours * speedRatio;
  const dailyTimeSavedHours = Math.max(0, equivalentAvgHours - safeDailyHours);
  
  // Grass Rate = Daily Time Saved / Daily Typing Time
  const grassRateHoursPerTypingHour = safeDailyHours > 0 
    ? dailyTimeSavedHours / safeDailyHours 
    : 0;

  // Grass Debt = Grass Rate * Test Duration
  const testDurationHours = testDurationSeconds / 3600;
  const grassDebtHours = grassRateHoursPerTypingHour * testDurationHours;
  const grassDebtSeconds = Math.max(0, grassDebtHours * 3600);

  return {
    dailyHours: safeDailyHours,
    userWpm: Math.round(userWpm),
    avgWpm: Math.round(avgWpm),
    speedRatio: Number(speedRatio.toFixed(2)),
    equivalentAvgHours: Number(equivalentAvgHours.toFixed(2)),
    dailyTimeSavedHours: Number(dailyTimeSavedHours.toFixed(2)),
    grassRateHoursPerTypingHour: Number(grassRateHoursPerTypingHour.toFixed(2)),
    testDurationSeconds: Math.round(testDurationSeconds),
    grassDebtSeconds: Number(grassDebtSeconds.toFixed(1))
  };
}

function formatTime(totalSeconds) {
  if (totalSeconds <= 0) return '00:00';
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  const paddedMins = String(mins).padStart(2, '0');
  const paddedSecs = String(secs).padStart(2, '0');
  
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${remMins}m ${paddedSecs}s`;
  }
  return `${paddedMins}:${paddedSecs}`;
}

// --- STORAGE MANAGER ---
function loadStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      state = { ...state, ...data };
    }
  } catch {}
}

function saveStorage() {
  try {
    const toSave = {
      config: state.config,
      activeDebtSeconds: state.activeDebtSeconds,
      totalTests: state.totalTests,
      totalGrassPaidSeconds: state.totalGrassPaidSeconds,
      bestWpm: state.bestWpm,
      history: state.history
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {}
}

// --- APP INITIALIZATION ---
function initApp() {
  loadStorage();

  // Enforce Grass Punishment on reload if unpaid debt exists!
  if (state.activeDebtSeconds > 0) {
    state.view = 'grass';
  }

  renderApp();
}

function setView(newView) {
  if (state.activeDebtSeconds > 0 && newView !== 'grass') {
    alert('🌱 You cannot leave! You must pay off your Grass Debt first.');
    return;
  }
  state.view = newView;
  renderApp();
}

function startNewTest() {
  state.currentPassage = getRandomPassage();
  state.userInput = '';
  state.startTime = null;
  state.endTime = null;
  state.liveWpm = 0;
  state.liveAccuracy = 100;
  state.liveElapsedSeconds = 0;
  setView('test');
}

function renderApp() {
  const root = document.getElementById('root');
  if (!root) return;

  root.innerHTML = `
    <!-- Header Navbar -->
    <header style="padding: 20px 32px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(52, 211, 153, 0.15); background: rgba(7, 11, 8, 0.9); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 40;">
      <div id="brand-btn" style="display: flex; align-items: center; gap: 12px; cursor: ${state.activeDebtSeconds > 0 ? 'not-allowed' : 'pointer'};">
        <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(52, 211, 153, 0.3); display: flex; align-items: center; justify-content: center; font-size: 20px;">
          🌱
        </div>
        <div>
          <h1 style="font-size: 1.15rem; font-weight: 800; letter-spacing: -0.02em; margin: 0; color: #ffffff;">
            GRASS DEBT
          </h1>
          <p style="font-size: 0.72rem; color: #9ca3af; margin: 0; font-weight: 500;">
            The time you save is the time you owe.
          </p>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 12px;">
        ${state.activeDebtSeconds > 0 ? `
          <div id="active-debt-badge" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 8px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #f87171; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
            ⚠️ UNPAID DEBT: ${formatTime(state.activeDebtSeconds)}
          </div>
        ` : `
          <button id="nav-setup-btn" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.85rem;">
            <span>Setup</span>
          </button>
          <button id="nav-stats-btn" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.85rem;">
            <span>Stats</span>
          </button>
        `}
      </div>
    </header>

    <!-- Main Content -->
    <main id="main-content" style="flex: 1; display: flex; flex-direction: column;">
      ${renderCurrentView()}
    </main>

    <div id="modal-container"></div>
  `;

  attachGlobalEvents();
}

function renderCurrentView() {
  switch (state.view) {
    case 'landing': return renderLandingView();
    case 'setup': return renderSetupView();
    case 'test': return renderTestView();
    case 'grass': return renderGrassView();
    case 'results': return renderResultsView();
    case 'slow_result': return renderSlowResultView();
    default: return renderLandingView();
  }
}

// --- VIEW 1: LANDING HERO ---
function renderLandingView() {
  return `
    <div style="padding: 80px 0 100px 0; flex: 1; display: flex; flex-direction: column; justify-content: center;">
      <div class="container">
        <div style="max-width: 820px;">
          <div class="label-uppercase" style="margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #34d399; display: inline-block;"></span>
            <span>Intentionally Useless Productivity Tool</span>
          </div>

          <h1 style="font-size: clamp(3.2rem, 8.5vw, 6rem); font-weight: 800; line-height: 0.98; letter-spacing: -0.04em; margin-bottom: 24px; color: #ffffff;">
            GRASS DEBT <span style="color: #34d399;">🌱</span>
          </h1>

          <p style="font-size: clamp(1.4rem, 3.2vw, 2.1rem); font-weight: 700; color: #34d399; margin-bottom: 12px; line-height: 1.25;">
            “The time you save is the time you owe.”
          </p>

          <p style="font-size: 1.15rem; color: #9ca3af; font-style: italic; margin-bottom: 44px;">
            Type faster. Owe nature more.
          </p>

          <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 32px; align-items: start; margin-bottom: 48px;">
            <div className="panel" style="background: rgba(15, 23, 17, 0.85); border: 1px solid rgba(52, 211, 153, 0.2); padding: 32px; border-radius: 16px;">
              <p style="font-size: 1.1rem; color: #e5e7eb; line-height: 1.65; margin: 0;">
                Type faster than average? <strong>Congratulations.</strong> You've saved some time.
                <br /><br />
                <span style="color: #6ee7b7;">
                  Unfortunately, nature has issued a mandatory invoice. The time you saved must now be physically spent touching grass.
                </span>
              </p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div class="panel-subtle">
                <div class="label-uppercase" style="margin-bottom: 4px;">01 / TYPE</div>
                <div style="font-weight: 700; font-size: 0.95rem;">Test typing speed against baseline WPM</div>
              </div>
              <div class="panel-subtle">
                <div class="label-uppercase" style="margin-bottom: 4px;">02 / CALCULATE</div>
                <div style="font-weight: 700; font-size: 0.95rem;">Convert saved hours into exact Grass Debt</div>
              </div>
              <div class="panel-subtle">
                <div class="label-uppercase" style="margin-bottom: 4px;">03 / REPAY</div>
                <div style="font-weight: 700; font-size: 0.95rem;">Hold screen grass canvas to pay back debt</div>
              </div>
            </div>
          </div>

          <button id="start-btn" class="btn btn-primary btn-lg">
            <span>START CALCULATING DEBT</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// --- VIEW 2: SETUP ---
function renderSetupView() {
  const mockCalc = calculateGrassDebt(80, state.config, 60);

  return `
    <div style="padding: 60px 0 80px 0; flex: 1; display: flex; flex-direction: column; justify-content: center;">
      <div class="container" style="max-width: 680px;">
        <div style="margin-bottom: 36px;">
          <div class="label-uppercase" style="margin-bottom: 8px;">CALIBRATION</div>
          <h2 style="font-size: 2.4rem; font-weight: 800; margin: 0; color: #ffffff;">
            Calculate Personal Debt Rate
          </h2>
          <p style="color: #9ca3af; font-size: 1rem; margin-top: 6px;">
            Set your daily typing habits to calibrate how quickly you accumulate Grass Debt.
          </p>
        </div>

        <div class="panel" style="display: flex; flex-direction: column; gap: 32px;">
          <div>
            <div class="label-uppercase" style="margin-bottom: 6px;">DAILY TYPING TIME</div>
            <label style="display: block; font-weight: 700; font-size: 1.1rem; margin-bottom: 6px;">
              How many hours do you spend typing every day?
            </label>
            <p style="font-size: 0.85rem; color: #9ca3af; margin-bottom: 16px;">
              Used to scale your typing test gains across your entire workday.
            </p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <span style="font-size: 0.75rem; color: #6ee7b7; font-weight: 700;">HOURS</span>
                <input id="input-hours" type="number" min="0" max="24" value="${state.config.dailyHours}" style="width: 100%; padding: 14px; border-radius: 10px; background: #070b08; border: 1px solid rgba(52, 211, 153, 0.25); color: #fff; font-size: 1.3rem; font-weight: 700; margin-top: 6px; outline: none;" />
              </div>
              <div>
                <span style="font-size: 0.75rem; color: #6ee7b7; font-weight: 700;">MINUTES</span>
                <input id="input-minutes" type="number" min="0" max="59" value="${state.config.dailyMinutes}" style="width: 100%; padding: 14px; border-radius: 10px; background: #070b08; border: 1px solid rgba(52, 211, 153, 0.25); color: #fff; font-size: 1.3rem; font-weight: 700; margin-top: 6px; outline: none;" />
              </div>
            </div>
          </div>

          <div style="height: 1px; background: rgba(52, 211, 153, 0.15);"></div>

          <div>
            <div class="label-uppercase" style="margin-bottom: 6px;">BASELINE TYPING SPEED</div>
            <label style="display: block; font-weight: 700; font-size: 1.1rem; margin-bottom: 6px;">
              Average human typing speed baseline
            </label>
            <p style="font-size: 0.85rem; color: #9ca3af; margin-bottom: 16px;">
              The standard human typing speed (Default: <strong>40 WPM</strong>).
            </p>

            <div style="display: flex; align-items: center; gap: 20px;">
              <input id="input-avg-wpm" type="range" min="20" max="100" step="5" value="${state.config.avgWpm}" style="flex: 1; accent-color: #10b981; height: 8px; cursor: pointer;" />
              <span id="label-avg-wpm" class="font-mono" style="font-size: 1.6rem; font-weight: 800; color: #34d399; min-width: 100px; text-align: right;">
                ${state.config.avgWpm} WPM
              </span>
            </div>
          </div>

          <div class="panel-subtle" style="background: rgba(16, 185, 129, 0.08); border-color: rgba(52, 211, 153, 0.25);">
            <div class="label-uppercase">ESTIMATED GRASS RATE (AT 80 WPM)</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #ffffff; margin-top: 4px;">
              🌱 ${mockCalc.grassRateHoursPerTypingHour} hour${mockCalc.grassRateHoursPerTypingHour !== 1 ? 's' : ''} of grass for every 1 hour of typing
            </div>
          </div>

          <div style="display: flex; gap: 16px; margin-top: 8px;">
            <button id="setup-back-btn" class="btn btn-secondary" style="flex: 1;">Back</button>
            <button id="setup-proceed-btn" class="btn btn-primary" style="flex: 2;">PROCEED TO TYPING TEST ➔</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// --- VIEW 3: TYPING TEST ---
function renderTestView() {
  const passage = state.currentPassage;
  const text = passage.text;

  return `
    <div style="padding: 50px 0 70px 0; cursor: text;" id="typing-test-wrapper">
      <div class="container" style="max-width: 920px;">
        <!-- Top Info Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px;">
          <div>
            <span class="label-uppercase">TOPIC: ${passage.topic.toUpperCase()}</span>
            <div style="font-size: 0.85rem; color: #9ca3af; margin-top: 2px;">
              Passage #${passage.id} — Type cleanly to calculate WPM
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 24px;">
            <div>
              <div style="font-size: 0.72rem; color: #6ee7b7; font-weight: 700;">SPEED</div>
              <div id="live-wpm" class="font-mono" style="font-size: 1.5rem; font-weight: 800; color: #34d399;">
                ${state.liveWpm} <span style="font-size: 0.75rem; color: #9ca3af;">WPM</span>
              </div>
            </div>

            <div>
              <div style="font-size: 0.72rem; color: #6ee7b7; font-weight: 700;">ACCURACY</div>
              <div id="live-accuracy" class="font-mono" style="font-size: 1.5rem; font-weight: 800; color: #ffffff;">
                ${state.liveAccuracy}%
              </div>
            </div>

            <div>
              <div style="font-size: 0.72rem; color: #6ee7b7; font-weight: 700;">ELAPSED</div>
              <div id="live-time" class="font-mono" style="font-size: 1.5rem; font-weight: 800; color: #ffffff;">
                ${state.liveElapsedSeconds.toFixed(1)}s
              </div>
            </div>
          </div>
        </div>

        <input id="hidden-typing-input" type="text" style="position: absolute; opacity: 0; pointer-events: none; left: -9999px;" autofocus />

        <!-- Typing Box -->
        <div class="panel" style="padding: 44px 48px; min-height: 240px; position: relative; line-height: 1.85; font-size: 1.35rem; background: #070b08;">
          ${!state.startTime ? `
            <div style="position: absolute; top: 16px; right: 24px; font-size: 0.78rem; color: #34d399; font-weight: 700; background: rgba(16, 185, 129, 0.12); padding: 4px 14px; border-radius: 6px; border: 1px solid rgba(52, 211, 153, 0.25);">
              ▶ Begin typing to start timing
            </div>
          ` : ''}

          <div id="passage-char-container" class="font-mono" style="word-break: break-word; color: #4b5563;">
            ${renderPassageChars(text, state.userInput)}
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 24px;">
          <div style="font-size: 0.85rem; color: #9ca3af;">
            Typed: <strong id="typed-count-label" style="color: #ffffff;">${state.userInput.length}</strong> / ${text.length} characters
          </div>
          <button id="reset-test-btn" class="btn btn-secondary" style="padding: 8px 18px; font-size: 0.85rem;">
            🔄 Reset Passage
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderPassageChars(text, userInput) {
  return text.split('').map((char, idx) => {
    const isTyped = idx < userInput.length;
    const isCurrent = idx === userInput.length;
    const isCorrect = isTyped && userInput[idx] === char;

    let style = 'position: relative; transition: color 0.1s ease;';
    if (isTyped) {
      if (isCorrect) {
        style += ' color: #34d399; font-weight: 600;';
      } else {
        style += ' color: #ffffff; background-color: rgba(239, 68, 68, 0.45); border-radius: 2px; text-decoration: underline red;';
      }
    }

    const caretHtml = isCurrent ? `<span style="position: absolute; left: 0; bottom: -2px; width: 100%; height: 3px; background-color: #10b981; box-shadow: 0 0 10px #34d399; animation: caretBlink 0.9s infinite;"></span>` : '';
    return `<span style="${style}">${caretHtml}${char}</span>`;
  }).join('');
}

// --- VIEW 4: TOUCH THE GRASS SCREEN ---
function renderGrassView() {
  const currentMsg = FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)];

  return `
    <div style="padding: 40px 0 60px 0; flex: 1; display: flex; flex-direction: column; justify-content: center;">
      <div class="container" style="max-width: 880px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div class="label-uppercase" style="color: #f87171; margin-bottom: 8px;">MANDATORY RECONNECTION</div>
          <h2 style="font-size: 2.8rem; font-weight: 800; margin: 0 0 8px 0; color: #ffffff;">
            TOUCH GRASS 🌱
          </h2>
          <p style="color: #9ca3af; font-size: 1.1rem; margin: 0;">
            You saved the time. Now spend it here.
          </p>
        </div>

        <!-- Big Timer Panel -->
        <div class="panel" style="text-align: center; padding: 28px; margin-bottom: 24px; background: rgba(15, 23, 17, 0.95);">
          <div class="label-uppercase">REMAINING GRASS DEBT</div>
          <div id="grass-timer-display" class="hero-number text-gradient" style="margin: 12px 0;">
            ${formatTime(state.activeDebtSeconds)}
          </div>
          <div id="grass-status-label" style="font-size: 1rem; color: #f87171; font-weight: 700;">
            ⏸️ You left the grass. Debt paused. 🌱
          </div>
        </div>

        <!-- Canvas Container -->
        <div id="grass-canvas-box" style="position: relative; height: 380px; border-radius: 20px; overflow: hidden; border: 2px solid rgba(52, 211, 153, 0.35); box-shadow: 0 16px 48px rgba(0,0,0,0.7); cursor: grab; touch-action: none;">
          <canvas id="grass-canvas" style="width: 100%; height: 100%; display: block;"></canvas>

          <div id="grass-overlay-instruction" style="position: absolute; inset: 0; background: rgba(7, 11, 8, 0.7); backdrop-filter: blur(4px); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 24px; text-align: center; pointer-events: none;">
            <div style="width: 76px; height: 76px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); border: 2px dashed #34d399; display: flex; align-items: center; justify-content: center; font-size: 36px;">
              ✋
            </div>
            <div>
              <h3 style="font-size: 1.5rem; font-weight: 800; color: #ffffff; margin-bottom: 6px;">
                PRESS & HOLD THE GRASS
              </h3>
              <p style="color: #6ee7b7; font-size: 0.95rem; max-width: 420px;">
                Hold your finger or mouse continuously inside this canvas box to repay your debt.
              </p>
            </div>
          </div>
        </div>

        <div style="margin-top: 24px; padding: 16px 24px; border-radius: 12px; background: rgba(11, 17, 13, 0.6); border: 1px solid rgba(52, 211, 153, 0.15); text-align: center; color: #6ee7b7; font-style: italic; font-size: 1rem;">
          💬 “${currentMsg}”
        </div>
      </div>
    </div>
  `;
}

// --- VIEW 5: FAST TYPIST GRASS DEBT RESULT ---
function renderResultsView() {
  const result = state.latestResult;
  const calc = result ? result.calculation : null;

  return `
    <div style="padding: 60px 0 80px 0; flex: 1; display: flex; flex-direction: column; justify-content: center;">
      <div class="container" style="max-width: 820px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div class="label-uppercase" style="margin-bottom: 8px;">CALCULATION COMPLETE</div>
          <h2 style="font-size: 2.6rem; font-weight: 800; margin: 0; color: #ffffff;">
            GRASS DEBT ACCUMULATED
          </h2>
          <p style="color: #6ee7b7; font-size: 1.15rem; font-style: italic; margin-top: 6px;">
            “You saved it. Now give it back.”
          </p>
        </div>

        ${result && calc ? `
          <div class="panel" style="text-align: center; padding: 36px; margin-bottom: 32px; background: rgba(15, 23, 17, 0.95);">
            <div class="label-uppercase">YOUR GRASS DEBT FOR THIS TEST</div>
            <div class="hero-number text-gradient" style="margin: 16px 0;">
              ${formatTime(calc.grassDebtSeconds)}
            </div>
            <div style="color: #9ca3af; font-size: 1rem;">
              You typed at <strong>${result.wpm} WPM</strong> vs <strong>${calc.avgWpm} WPM baseline</strong> (Speed Ratio: <strong>${calc.speedRatio}x</strong>).
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 36px;">
            <div class="panel-subtle">
              <div class="label-uppercase">SPEED</div>
              <div class="font-mono" style="font-size: 1.8rem; font-weight: 800; color: #34d399;">${result.wpm} WPM</div>
              <div style="font-size: 0.75rem; color: #9ca3af;">Baseline: ${calc.avgWpm} WPM</div>
            </div>
            <div class="panel-subtle">
              <div class="label-uppercase">ACCURACY</div>
              <div class="font-mono" style="font-size: 1.8rem; font-weight: 800; color: #ffffff;">${result.accuracy}%</div>
              <div style="font-size: 0.75rem; color: #9ca3af;">Chars: ${result.charactersTyped}</div>
            </div>
            <div class="panel-subtle">
              <div class="label-uppercase">DAILY SAVED</div>
              <div class="font-mono" style="font-size: 1.8rem; font-weight: 800; color: #ffffff;">${calc.dailyTimeSavedHours}h</div>
              <div style="font-size: 0.75rem; color: #6ee7b7;">Per ${calc.dailyHours}h daily typing</div>
            </div>
            <div class="panel-subtle">
              <div class="label-uppercase">GRASS RATE</div>
              <div class="font-mono" style="font-size: 1.8rem; font-weight: 800; color: #34d399;">${calc.grassRateHoursPerTypingHour}h</div>
              <div style="font-size: 0.75rem; color: #9ca3af;">Grass / hour typing</div>
            </div>
          </div>
        ` : ''}

        <button id="proceed-to-grass-btn" class="btn btn-primary btn-lg" style="width: 100%;">
          <span>PAY YOUR DEBT TO NATURE ➔</span>
        </button>
      </div>
    </div>
  `;
}

// --- VIEW 6: SLOW TYPIST WARNING RESULT ---
function renderSlowResultView() {
  const result = state.latestResult;

  return `
    <div style="padding: 60px 0 80px 0; flex: 1; display: flex; flex-direction: column; justify-content: center;">
      <div class="container" style="max-width: 680px; text-align: center;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(239, 68, 68, 0.15); border: 2px solid rgba(239, 68, 68, 0.4); display: inline-flex; align-items: center; justify-content: center; font-size: 38px; margin-bottom: 24px;">
          🐌
        </div>

        <h1 style="font-size: clamp(2.8rem, 7vw, 4.2rem); font-weight: 800; color: #ffffff; margin-bottom: 12px;">
          YOU'RE TOO SLOW. 🌱
        </h1>

        <p style="font-size: 1.4rem; font-weight: 700; color: #f87171; margin-bottom: 24px;">
          Your typing speed is below average.
        </p>

        <div class="panel" style="text-align: left; padding: 32px; margin-bottom: 36px; border-color: rgba(239, 68, 68, 0.3);">
          <p style="font-size: 1.15rem; color: #e5e7eb; line-height: 1.6; margin: 0;">
            You typed at <strong>${result ? result.wpm : 0} WPM</strong> (Baseline: <strong>${state.config.avgWpm} WPM</strong>).
            <br /><br />
            <span style="color: #fca5a5;">
              You don't owe nature any time yet. Your assignment: increase your screen time and come back stronger.
            </span>
          </p>
        </div>

        <button id="increase-screen-time-btn" class="btn btn-primary btn-lg" style="background: #ef4444; color: #ffffff; box-shadow: 0 4px 24px rgba(239, 68, 68, 0.35);">
          <span>INCREASE SCREEN TIME</span>
          <span>➔</span>
        </button>
      </div>
    </div>
  `;
}

// --- GLOBAL EVENT BINDING ---
function attachGlobalEvents() {
  document.getElementById('brand-btn')?.addEventListener('click', () => {
    if (state.activeDebtSeconds === 0) setView('landing');
  });

  document.getElementById('nav-setup-btn')?.addEventListener('click', () => setView('setup'));
  document.getElementById('nav-stats-btn')?.addEventListener('click', () => showStatsModal());
  document.getElementById('active-debt-badge')?.addEventListener('click', () => setView('grass'));

  document.getElementById('start-btn')?.addEventListener('click', () => setView('setup'));

  const inputHours = document.getElementById('input-hours');
  const inputMinutes = document.getElementById('input-minutes');
  const inputAvgWpm = document.getElementById('input-avg-wpm');

  if (inputAvgWpm) {
    inputAvgWpm.addEventListener('input', (e) => {
      state.config.avgWpm = parseInt(e.target.value) || 40;
      document.getElementById('label-avg-wpm').innerText = `${state.config.avgWpm} WPM`;
    });
  }

  document.getElementById('setup-back-btn')?.addEventListener('click', () => setView('landing'));
  document.getElementById('setup-proceed-btn')?.addEventListener('click', () => {
    if (inputHours) state.config.dailyHours = Math.max(0, parseInt(inputHours.value) || 0);
    if (inputMinutes) state.config.dailyMinutes = Math.max(0, Math.min(59, parseInt(inputMinutes.value) || 0));
    saveStorage();
    startNewTest();
  });

  if (state.view === 'test') {
    setupTypingEngine();
  }

  if (state.view === 'grass') {
    setupGrassCanvas();
  }

  document.getElementById('proceed-to-grass-btn')?.addEventListener('click', () => {
    setView('grass');
  });

  document.getElementById('increase-screen-time-btn')?.addEventListener('click', () => {
    startNewTest();
  });
}

// --- TYPING ENGINE ---
function setupTypingEngine() {
  const wrapper = document.getElementById('typing-test-wrapper');
  const hiddenInput = document.getElementById('hidden-typing-input');
  const resetBtn = document.getElementById('reset-test-btn');

  if (!wrapper || !hiddenInput) return;

  hiddenInput.focus();
  wrapper.addEventListener('click', () => hiddenInput.focus());

  resetBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    startNewTest();
  });

  hiddenInput.addEventListener('input', (e) => {
    const text = state.currentPassage.text;
    const value = e.target.value;
    if (value.length > text.length) return;

    if (!state.startTime && value.length > 0) {
      state.startTime = Date.now();
      startLiveMetricsTimer();
    }

    const charIndex = value.length - 1;
    if (charIndex >= 0) {
      const isMismatch = value[charIndex] !== text[charIndex];
      playKeyClick(isMismatch);
    }

    state.userInput = value;
    updateTypingDOM();

    // Check completion
    if (value.length === text.length) {
      state.endTime = Date.now();
      stopLiveMetricsTimer();

      const elapsedSeconds = Math.max(1, (state.endTime - state.startTime) / 1000);
      const minutes = elapsedSeconds / 60;
      
      let correct = 0;
      for (let i = 0; i < text.length; i++) {
        if (value[i] === text[i]) correct++;
      }

      const finalWpm = Math.round((correct / 5) / minutes);
      const finalAccuracy = Math.round((correct / text.length) * 100);

      // Math calculation
      const calculation = calculateGrassDebt(finalWpm, state.config, elapsedSeconds);

      // Check if SLOW typist (user WPM < average WPM baseline)
      if (finalWpm < state.config.avgWpm) {
        calculation.grassDebtSeconds = 0; // 0 Grass Debt for slow typists!
      }

      state.latestResult = {
        id: `test_${Date.now()}`,
        timestamp: Date.now(),
        wpm: finalWpm,
        accuracy: finalAccuracy,
        charactersTyped: text.length,
        testDurationSeconds: Math.round(elapsedSeconds),
        calculation
      };

      state.totalTests += 1;
      state.bestWpm = Math.max(state.bestWpm, finalWpm);
      
      if (finalWpm >= state.config.avgWpm) {
        state.activeDebtSeconds += calculation.grassDebtSeconds;
      }

      state.history.unshift(state.latestResult);
      state.history = state.history.slice(0, 50);
      saveStorage();

      setTimeout(() => {
        if (finalWpm < state.config.avgWpm) {
          setView('slow_result');
        } else if (calculation.grassDebtSeconds > 0) {
          setView('results'); // Show Grass Debt summary screen then CTA to grass
        } else {
          setView('results');
        }
      }, 350);
    }
  });
}

let liveMetricsInterval = null;
function startLiveMetricsTimer() {
  if (liveMetricsInterval) clearInterval(liveMetricsInterval);
  liveMetricsInterval = setInterval(() => {
    if (!state.startTime || state.endTime) return;
    const elapsedSec = (Date.now() - state.startTime) / 1000;
    state.liveElapsedSeconds = elapsedSec;

    const text = state.currentPassage.text;
    let correct = 0;
    for (let i = 0; i < state.userInput.length; i++) {
      if (state.userInput[i] === text[i]) correct++;
    }
    const mins = Math.max(0.001, elapsedSec / 60);
    state.liveWpm = Math.round((correct / 5) / mins);
    const typed = state.userInput.length;
    state.liveAccuracy = typed > 0 ? Math.round((correct / typed) * 100) : 100;

    const wpmEl = document.getElementById('live-wpm');
    const accEl = document.getElementById('live-accuracy');
    const timeEl = document.getElementById('live-time');
    if (wpmEl) wpmEl.innerHTML = `${state.liveWpm} <span style="font-size: 0.75rem; color: #9ca3af;">WPM</span>`;
    if (accEl) accEl.innerHTML = `${state.liveAccuracy}%`;
    if (timeEl) timeEl.innerHTML = `${elapsedSec.toFixed(1)}s`;
  }, 100);
}

function stopLiveMetricsTimer() {
  if (liveMetricsInterval) {
    clearInterval(liveMetricsInterval);
    liveMetricsInterval = null;
  }
}

function updateTypingDOM() {
  const container = document.getElementById('passage-char-container');
  const countLabel = document.getElementById('typed-count-label');
  if (container) {
    container.innerHTML = renderPassageChars(state.currentPassage.text, state.userInput);
  }
  if (countLabel) {
    countLabel.innerText = state.userInput.length;
  }
}

// --- GRASS CANVAS PHYSICS ---
let grassAnimFrame = null;

function setupGrassCanvas() {
  const box = document.getElementById('grass-canvas-box');
  const canvas = document.getElementById('grass-canvas');
  if (!box || !canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = box.clientWidth);
  let height = (canvas.height = box.clientHeight);

  const numBlades = Math.floor(width / 3.5);
  const blades = [];
  const colors = ['#047857', '#065f46', '#10b981', '#34d399', '#022c22', '#6ee7b7'];
  const flowerColors = ['#fef08a', '#f472b6', '#a78bfa', '#38bdf8', '#ffffff'];

  for (let i = 0; i < numBlades; i++) {
    const isFlower = Math.random() < 0.08;
    blades.push({
      x: (i / numBlades) * width + (Math.random() * 4 - 2),
      height: Math.random() * 90 + 70,
      width: Math.random() * 5 + 3,
      lean: Math.random() * 20 - 10,
      flexibility: Math.random() * 0.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      flowerColor: isFlower ? flowerColors[Math.floor(Math.random() * flowerColors.length)] : undefined,
      flowerSize: isFlower ? Math.random() * 6 + 4 : undefined
    });
  }

  const particles = [];
  let windTime = 0;
  let lastGrassTick = Date.now();

  function renderGrass() {
    windTime += 0.03;
    const windForce = Math.sin(windTime) * 12 + Math.cos(windTime * 0.7) * 6;

    ctx.clearRect(0, 0, width, height);

    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#070b08');
    bgGrad.addColorStop(0.6, '#0f1711');
    bgGrad.addColorStop(1, '#022c22');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    blades.forEach(blade => {
      let bend = windForce * blade.flexibility;
      if (state.touchPos) {
        const dx = blade.x - state.touchPos.x;
        const dist = Math.abs(dx);
        if (dist < 150) {
          const push = (150 - dist) / 150;
          bend += dx > 0 ? push * 35 : -push * 35;
        }
      }

      ctx.beginPath();
      ctx.moveTo(blade.x, height);
      const cpX = blade.x + bend * 0.5;
      const cpY = height - blade.height * 0.5;
      const endX = blade.x + blade.lean + bend;
      const endY = height - blade.height;

      ctx.quadraticCurveTo(cpX, cpY, endX, endY);
      ctx.quadraticCurveTo(cpX + blade.width * 0.5, cpY, blade.x + blade.width, height);
      ctx.fillStyle = blade.color;
      ctx.fill();

      if (blade.flowerColor && blade.flowerSize) {
        ctx.beginPath();
        ctx.arc(endX, endY, blade.flowerSize, 0, Math.PI * 2);
        ctx.fillStyle = blade.flowerColor;
        ctx.fill();
      }
    });

    if (state.isTouchingGrass && state.touchPos) {
      if (Math.random() < 0.4) {
        particles.push({
          x: state.touchPos.x + (Math.random() * 60 - 30),
          y: state.touchPos.y + (Math.random() * 40 - 20),
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 2 - 1,
          size: Math.random() * 4 + 2,
          alpha: 1
        });
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.015;
      if (p.alpha <= 0) {
        particles.splice(i, 1);
      } else {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    if (state.touchPos && state.isTouchingGrass) {
      ctx.save();
      const halo = ctx.createRadialGradient(state.touchPos.x, state.touchPos.y, 0, state.touchPos.x, state.touchPos.y, 80);
      halo.addColorStop(0, 'rgba(52, 211, 153, 0.4)');
      halo.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(state.touchPos.x, state.touchPos.y, 80, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Process Debt Timer Tick
    if (state.isTouchingGrass && state.activeDebtSeconds > 0) {
      const now = Date.now();
      const deltaSec = (now - lastGrassTick) / 1000;
      lastGrassTick = now;

      state.activeDebtSeconds = Math.max(0, state.activeDebtSeconds - deltaSec);
      state.totalGrassPaidSeconds += deltaSec;
      saveStorage();

      const displayEl = document.getElementById('grass-timer-display');
      const badgeEl = document.getElementById('active-debt-badge');
      if (displayEl) displayEl.innerText = formatTime(state.activeDebtSeconds);
      if (badgeEl) badgeEl.innerText = `⚠️ UNPAID DEBT: ${formatTime(state.activeDebtSeconds)}`;

      if (state.activeDebtSeconds <= 0) {
        state.isTouchingGrass = false;
        stopRustleSound();
        playDebtPaidChime();
        renderDebtPaidScreen();
        return;
      }
    } else {
      lastGrassTick = Date.now();
    }

    grassAnimFrame = requestAnimationFrame(renderGrass);
  }

  renderGrass();

  // Pointer Event Listeners
  const startTouch = (e) => {
    e.preventDefault();
    const rect = box.getBoundingClientRect();
    state.touchPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    state.isTouchingGrass = true;
    startRustleSound();

    const overlay = document.getElementById('grass-overlay-instruction');
    const label = document.getElementById('grass-status-label');
    if (overlay) overlay.style.display = 'none';
    if (label) {
      label.style.color = '#34d399';
      label.innerHTML = `🌱 Repaying debt... Keep holding!`;
    }
  };

  const moveTouch = (e) => {
    if (!state.isTouchingGrass) return;
    const rect = box.getBoundingClientRect();
    state.touchPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const endTouch = () => {
    state.isTouchingGrass = false;
    stopRustleSound();
    const overlay = document.getElementById('grass-overlay-instruction');
    const label = document.getElementById('grass-status-label');
    if (overlay) overlay.style.display = 'flex';
    if (label) {
      label.style.color = '#f87171';
      label.innerHTML = `⏸️ You left the grass. Debt paused. 🌱`;
    }
  };

  box.addEventListener('pointerdown', startTouch);
  box.addEventListener('pointermove', moveTouch);
  box.addEventListener('pointerup', endTouch);
  box.addEventListener('pointercancel', endTouch);
  box.addEventListener('pointerleave', endTouch);
}

// --- DEBT PAID CELEBRATION VIEW ---
function renderDebtPaidScreen() {
  const root = document.getElementById('root');
  if (!root) return;

  root.innerHTML = `
    <header style="padding: 20px 32px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(52, 211, 153, 0.15); background: rgba(7, 11, 8, 0.9);">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 20px;">🌱</span>
        <h1 style="font-size: 1.15rem; font-weight: 800; color: #fff; margin: 0;">GRASS DEBT</h1>
      </div>
    </header>

    <main style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 24px;">
      <div class="panel" style="max-width: 650px; width: 100%; text-align: center; padding: 48px 36px; border-color: rgba(52, 211, 153, 0.4);">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: #10b981; display: inline-flex; align-items: center; justify-content: center; font-size: 36px; margin-bottom: 20px;">
          🌱
        </div>

        <h1 style="font-size: 3rem; font-weight: 800; color: #ffffff; margin-bottom: 8px;">
          DEBT PAID. 🌱
        </h1>

        <p style="font-size: 1.3rem; font-weight: 700; color: #34d399; margin-bottom: 32px;">
          “Nature accepts your payment.”
        </p>

        <p style="color: #9ca3af; font-size: 1rem; margin-bottom: 36px;">
          Your saved time has been officially returned to the soil. You are permitted to return to the keyboard.
        </p>

        <button id="debt-paid-test-again-btn" class="btn btn-primary btn-lg" style="width: 100%;">
          <span>TEST AGAIN</span>
          <span>➔</span>
        </button>
      </div>
    </main>
  `;

  document.getElementById('debt-paid-test-again-btn')?.addEventListener('click', () => {
    startNewTest();
  });
}

// --- STATS ANALYTICS MODAL ---
function showStatsModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  container.innerHTML = `
    <div style="position: fixed; inset: 0; background: rgba(7, 11, 8, 0.88); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; padding: 24px; z-index: 100;">
      <div class="panel" style="max-width: 650px; width: 100%; padding: 32px; max-height: 90vh; display: flex; flex-direction: column;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
          <h2 style="font-size: 1.6rem; font-weight: 800; margin: 0; color: #fff;">🏆 Grass Debt Analytics</h2>
          <button id="close-modal-btn" class="btn btn-secondary" style="padding: 8px 14px;">✕</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 24px;">
          <div class="panel-subtle">
            <div style="font-size: 0.75rem; color: #9ca3af;">Tests Taken</div>
            <div class="font-mono" style="font-size: 1.6rem; font-weight: 800; color: #ffffff;">${state.totalTests}</div>
          </div>
          <div class="panel-subtle">
            <div style="font-size: 0.75rem; color: #9ca3af;">Personal Best</div>
            <div class="font-mono" style="font-size: 1.6rem; font-weight: 800; color: #34d399;">${state.bestWpm} WPM</div>
          </div>
          <div class="panel-subtle">
            <div style="font-size: 0.75rem; color: #9ca3af;">Grass Touched</div>
            <div class="font-mono" style="font-size: 1.6rem; font-weight: 800; color: #6ee7b7;">${formatTime(state.totalGrassPaidSeconds)}</div>
          </div>
        </div>

        <div class="label-uppercase" style="margin-bottom: 12px;">RECENT TEST HISTORY</div>
        <div style="flex: 1; overflow-y: auto; margin-bottom: 24px; display: flex; flex-direction: column; gap: 10px;">
          ${state.history.length === 0 ? '<div style="text-align: center; color: #6b7280; padding: 20px;">No tests completed yet.</div>' : 
            state.history.map(item => `
              <div style="background: rgba(11, 17, 13, 0.6); border: 1px solid rgba(52, 211, 153, 0.15); border-radius: 10px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem; color: #fff;">${new Date(item.timestamp).toLocaleTimeString()}</div>
                  <div style="font-size: 0.8rem; color: #9ca3af;">${item.accuracy}% Accuracy</div>
                </div>
                <div style="text-align: right;">
                  <div class="font-mono" style="font-size: 1.1rem; font-weight: 800; color: #34d399;">${item.wpm} WPM</div>
                  <div style="font-size: 0.75rem; color: #6ee7b7;">🌱 Debt: ${formatTime(item.calculation.grassDebtSeconds)}</div>
                </div>
              </div>
            `).join('')
          }
        </div>

        <button id="reset-stats-btn" class="btn btn-secondary" style="width: 100%; border-color: rgba(239, 68, 68, 0.35); color: #f87171;">
          🗑️ Reset All Stats & History
        </button>
      </div>
    </div>
  `;

  document.getElementById('close-modal-btn')?.addEventListener('click', () => {
    container.innerHTML = '';
  });

  document.getElementById('reset-stats-btn')?.addEventListener('click', () => {
    if (confirm('Reset all Grass Debt history?')) {
      localStorage.removeItem(STORAGE_KEY);
      state.totalTests = 0;
      state.totalGrassPaidSeconds = 0;
      state.bestWpm = 0;
      state.activeDebtSeconds = 0;
      state.history = [];
      container.innerHTML = '';
      renderApp();
    }
  });
}

// Start Application on DOM Load
window.addEventListener('DOMContentLoaded', initApp);
