const today = new Date();
const todayKey = today.toISOString().slice(0, 10);
const storageKey = 'fitness-care-workout-v1';

const weeklyPlan = {
  monday: {
    key: 'fullA',
    label: '전신 A',
    category: '기초 체력 · 하체 · 코어',
    duration: '약 30분',
    warmup: '제자리 걷기 1분 + 팔 돌리기 + 고관절 돌리기 + 가벼운 스쿼트',
    motivation: '호흡만 너무 급하지 않게 가져가시면 충분히 좋은 운동이 돼요.',
    note: '30분이 부담되면 15분만 해도 성공이에요.',
  },
  tuesday: {
    key: 'upperCore',
    label: '상체 + 코어',
    category: '가슴 · 어깨 · 복부',
    duration: '약 25~30분',
    warmup: '어깨 돌리기 + 팔 벌려 가볍게 흔들기 + 벽 밀기 스트레칭',
    motivation: '오늘은 상체 자극과 코어 안정성을 같이 챙기는 날이에요.',
    note: '푸쉬업은 무릎 버전으로 바꿔도 괜찮아요.',
  },
  wednesday: {
    key: 'lowerCore',
    label: '하체 + 코어',
    category: '하체 · 둔근 · 코어',
    duration: '약 30분',
    warmup: '제자리 스텝 + 무릎 들어올리기 + 고관절 열기 + 천천히 런지',
    motivation: '하체는 자세만 안정적이면 운동 효과가 아주 좋아요.',
    note: '무릎보다 엉덩이와 복부 힘을 더 의식해 주세요.',
  },
  thursday: {
    key: 'recoveryLight',
    label: '회복형 + 가벼운 전신',
    category: '회복 · 순환 · 가벼운 전신',
    duration: '약 20분',
    warmup: '가볍게 걷기 + 어깨/허리/고관절 회전',
    motivation: '몸을 쉬게 하면서도 리듬을 끊지 않는 날이에요.',
    note: '무리하지 않는 것이 오늘의 핵심입니다.',
  },
  friday: {
    key: 'fullB',
    label: '전신 B',
    category: '전신 · 밸런스 · 코어',
    duration: '약 30분',
    warmup: '제자리 스텝 + 팔 돌리기 + 가벼운 스쿼트 + 몸통 회전',
    motivation: '주간 마무리 루틴이에요. 전신을 시원하게 써주세요.',
    note: '흐름이 좋으면 1라운드 더 해도 좋아요.',
  },
  saturday: {
    key: 'optionalMove',
    label: '선택형 움직임',
    category: '가벼운 유산소 · 회복',
    duration: '20~30분',
    warmup: '집 안에서 천천히 걷기 + 발목/종아리 풀기',
    motivation: '컨디션에 따라 산책 또는 회복 루틴으로 가볍게 가면 돼요.',
    note: '토요일은 “쉬면서 움직이기”가 목표예요.',
  },
  sunday: {
    key: 'restStretch',
    label: '휴식 / 가벼운 스트레칭',
    category: '회복',
    duration: '10~15분',
    warmup: '깊은 호흡과 목/어깨 가벼운 풀기',
    motivation: '완전 휴식도 루틴의 일부예요.',
    note: '오늘은 몸 상태만 확인하고 무리하지 마세요.',
  },
};

const routineCatalog = {
  fullA: {
    rounds: '3라운드',
    rest: '라운드 사이 60초',
    kind: 'standard',
    exercises: [
      { name: '스쿼트', prescription: '15회', cue: '발바닥 전체로 바닥을 누르고, 의자에 앉듯 내려가세요.' },
      { name: '푸쉬업', prescription: '8~12회', cue: '무릎 버전 가능 · 몸통이 일직선이 되게 유지해요.' },
      { name: '글루트 브릿지', prescription: '15회', cue: '허리를 꺾지 말고 엉덩이를 조여 들어 올려요.' },
      { name: '버드독', prescription: '좌우 각 10회', cue: '골반이 흔들리지 않게 천천히 진행해요.' },
      { name: '플랭크', prescription: '30초', cue: '배와 엉덩이에 힘을 주고 허리가 꺼지지 않게 유지해요.' },
    ],
  },
  upperCore: {
    rounds: '3라운드',
    rest: '라운드 사이 50~60초',
    kind: 'standard',
    exercises: [
      { name: '무릎 푸쉬업', prescription: '10~12회', cue: '가슴으로 바닥을 민다는 느낌으로 진행해요.' },
      { name: '숄더 탭 플랭크', prescription: '좌우 각 10회', cue: '골반이 좌우로 흔들리지 않게 복부 힘 유지.' },
      { name: '인클라인 푸쉬업', prescription: '10회', cue: '책상/소파를 짚고 천천히 깊게.' },
      { name: '데드버그', prescription: '좌우 각 10회', cue: '허리가 바닥에서 뜨지 않게 범위를 조절해요.' },
      { name: '플랭크 홀드', prescription: '35초', cue: '어깨 힘을 빼고 몸통 길게 유지.' },
    ],
  },
  lowerCore: {
    rounds: '3라운드',
    rest: '라운드 사이 60초',
    kind: 'standard',
    exercises: [
      { name: '스쿼트', prescription: '15회', cue: '무릎보다 엉덩이를 먼저 접는 느낌.' },
      { name: '리버스 런지', prescription: '좌우 각 10회', cue: '앞다리로 중심을 잡고 상체를 과하게 숙이지 않아요.' },
      { name: '굿모닝 힙힌지', prescription: '12회', cue: '허리보다 엉덩이를 뒤로 보내는 패턴에 집중.' },
      { name: '글루트 브릿지', prescription: '18회', cue: '둔근 수축을 끝까지 느끼기.' },
      { name: '플랭크', prescription: '30초', cue: '배에 힘을 주고 호흡은 짧지 않게.' },
    ],
  },
  recoveryLight: {
    rounds: '2~3라운드',
    rest: '필요하면 30~45초',
    kind: 'recovery',
    exercises: [
      { name: '제자리 스텝', prescription: '1분', cue: '심박수만 가볍게 올리는 느낌으로 진행.' },
      { name: '스쿼트', prescription: '12회', cue: '가볍고 부드럽게, 깊이보다 리듬.' },
      { name: '무릎 푸쉬업', prescription: '8회', cue: '무리하지 말고 깔끔한 반복만.' },
      { name: '버드독', prescription: '좌우 각 8회', cue: '척추 길이를 길게 유지해요.' },
      { name: '플랭크', prescription: '20~30초', cue: '짧게라도 안정적으로 버티기.' },
      { name: '전신 스트레칭', prescription: '2분', cue: '어깨, 허벅지 앞쪽, 둔근을 중심으로 부드럽게.' },
    ],
  },
  fullB: {
    rounds: '3라운드',
    rest: '라운드 사이 60초',
    kind: 'standard',
    exercises: [
      { name: '스쿼트 + 바닥 터치', prescription: '15회', cue: '리듬 있게 진행하되 허리가 말리지 않게.' },
      { name: '푸쉬업', prescription: '8~12회', cue: '무릎 버전 가능 · 품질 우선.' },
      { name: '리버스 런지', prescription: '좌우 각 10회', cue: '균형을 잡으며 천천히.' },
      { name: '슈퍼맨', prescription: '12회', cue: '허리를 꺾기보다 등 길이를 늘리는 느낌.' },
      { name: '플랭크', prescription: '40초', cue: '복압 유지, 엉덩이 처지지 않게.' },
    ],
  },
  optionalMove: {
    rounds: '선택형',
    rest: '편한 흐름으로',
    kind: 'optional',
    exercises: [
      { name: '가벼운 산책', prescription: '20~30분', cue: '빠르지 않아도 괜찮아요. 꾸준히 걷는 게 핵심.' },
      { name: '회복 스트레칭', prescription: '10분', cue: '허리, 고관절, 어깨 위주로 가볍게 풀기.' },
    ],
  },
  restStretch: {
    rounds: '휴식',
    rest: '필요 없음',
    kind: 'rest',
    exercises: [
      { name: '목/어깨 스트레칭', prescription: '3분', cue: '강하게 당기지 말고 천천히.' },
      { name: '고관절/허벅지 스트레칭', prescription: '5분', cue: '호흡을 길게 유지하며 부드럽게.' },
      { name: '가벼운 산책 또는 완전 휴식', prescription: '선택', cue: '오늘은 회복을 목표로 해요.' },
    ],
  },
};

const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const todayDayKey = dayKeys[today.getDay()];

const defaultState = {
  selectedDay: todayDayKey,
  timerSeconds: 60,
  logs: {
    [todayKey]: createWorkoutLog(),
  },
};

function createWorkoutLog() {
  return {
    note: '',
    completed: {},
    sessionDone: false,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      selectedDay: weeklyPlan[parsed.selectedDay] ? parsed.selectedDay : todayDayKey,
      logs: {
        ...defaultState.logs,
        ...(parsed.logs || {}),
        [todayKey]: normalizeWorkoutLog(parsed.logs?.[todayKey]),
      },
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function normalizeWorkoutLog(log) {
  const base = createWorkoutLog();
  return {
    ...base,
    ...(log || {}),
    completed: log?.completed || {},
  };
}

let state = loadState();
let timerHandle = null;

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function getWorkoutLog() {
  if (!state.logs[todayKey]) state.logs[todayKey] = createWorkoutLog();
  state.logs[todayKey] = normalizeWorkoutLog(state.logs[todayKey]);
  return state.logs[todayKey];
}

function getSelectedPlan() {
  return weeklyPlan[state.selectedDay];
}

function getSelectedRoutine() {
  return routineCatalog[getSelectedPlan().key];
}

function getCompletedCount(log, dayKey) {
  return Object.values(log.completed[dayKey] || {}).filter(Boolean).length;
}

function getTodayWeekLabel() {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(today);
}

function render() {
  const root = document.querySelector('#app');
  const log = getWorkoutLog();
  const plan = getSelectedPlan();
  const routine = getSelectedRoutine();
  const isToday = state.selectedDay === todayDayKey;
  const completedCount = getCompletedCount(log, state.selectedDay);
  const totalCount = routine.exercises.length;
  const completionPercent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  const nextExercise = routine.exercises.find((_, index) => !(log.completed[state.selectedDay] || {})[index]);

  root.innerHTML = `
    <main class="app-shell">
      <header class="top-strip">
        <div>
          <div class="eyebrow">오늘 운동 보드</div>
          <h1>${isToday ? getTodayWeekLabel() : `${labelForDay(state.selectedDay)} 루틴 보기`}</h1>
        </div>
      </header>

      <section class="today-card card">
        <div class="today-card-top">
          <div>
            <div class="routine-badge">${plan.label}</div>
            <h2>${plan.category}</h2>
            <p>${plan.duration} · ${plan.warmup}</p>
          </div>
          <div class="today-progress">
            <span>진행도</span>
            <strong>${completionPercent}%</strong>
          </div>
        </div>
        <div class="progress-track"><span style="width:${completionPercent}%"></span></div>
        <div class="today-summary-row">
          <div class="summary-pill"><span>라운드</span><strong>${routine.rounds}</strong></div>
          <div class="summary-pill"><span>휴식</span><strong>${routine.rest}</strong></div>
          <div class="summary-pill"><span>다음</span><strong>${nextExercise ? nextExercise.name : '완료'}</strong></div>
        </div>
        <div class="coach-note">
          <strong>${plan.motivation}</strong>
          <p>${plan.note}</p>
        </div>
      </section>

      <section class="section-block">
        <div class="section-head">
          <div>
            <div class="section-kicker">WEEKLY SCHEDULE</div>
            <h3>요일별 루틴</h3>
          </div>
        </div>
        <div class="day-chip-row">
          ${Object.keys(weeklyPlan)
            .map((dayKey) => {
              const item = weeklyPlan[dayKey];
              return `
                <button class="day-chip ${state.selectedDay === dayKey ? 'active' : ''} ${dayKey === todayDayKey ? 'today' : ''}" data-day="${dayKey}">
                  <span>${shortLabelForDay(dayKey)}</span>
                  <strong>${item.label}</strong>
                </button>
              `;
            })
            .join('')}
        </div>
      </section>

      <section class="section-block">
        <div class="section-head split-head">
          <div>
            <div class="section-kicker">TODAY FLOW</div>
            <h3>${plan.label} 운동 순서</h3>
          </div>
          <label class="session-toggle">
            <input type="checkbox" data-session-done ${log.sessionDone && isToday ? 'checked' : ''} ${!isToday ? 'disabled' : ''} />
            <span>오늘 운동 완료</span>
          </label>
        </div>
        <div class="exercise-list">
          ${routine.exercises
            .map((exercise, index) => {
              const isChecked = !!(log.completed[state.selectedDay] || {})[index];
              const isNext = !isChecked && nextExercise && nextExercise.name === exercise.name;
              return `
                <article class="exercise-card card ${isChecked ? 'done' : ''} ${isNext ? 'next' : ''} ${isToday ? 'clickable' : 'locked'}" data-exercise-card="${index}" ${isToday ? 'role="button" tabindex="0"' : ''}>
                  <div class="exercise-top">
                    <div class="exercise-index">${String(index + 1).padStart(2, '0')}</div>
                    <div class="exercise-copy">
                      <div class="exercise-title-row">
                        <h4>${exercise.name}</h4>
                        ${isNext ? '<span class="next-badge">다음</span>' : ''}
                        ${isChecked ? '<span class="done-badge">완료</span>' : ''}
                      </div>
                      <div class="exercise-prescription">${exercise.prescription}</div>
                      <p>${exercise.cue}</p>
                    </div>
                  </div>
                </article>
              `;
            })
            .join('')}
        </div>
      </section>

      <section class="bottom-grid">
        <section class="section-block compact-block">
          <div class="section-head">
            <div>
              <div class="section-kicker">QUICK TOOLS</div>
              <h3>타이머</h3>
            </div>
          </div>
          <div class="timer-card card">
            <div class="timer-value" id="timer-value">${formatSeconds(state.timerSeconds)}</div>
            <div class="timer-buttons">
              <button class="ghost-btn" data-action="timer-30">30초</button>
              <button class="ghost-btn" data-action="timer-60">60초</button>
              <button class="primary-btn" data-action="timer-start">시작</button>
              <button class="secondary-btn" data-action="timer-stop">정지</button>
            </div>
          </div>
        </section>

        <section class="section-block compact-block">
          <div class="section-head">
            <div>
              <div class="section-kicker">FORM GUIDE</div>
              <h3>빠른 자세 팁</h3>
            </div>
          </div>
          <div class="tip-list card">
            ${renderTipsForRoutine(plan.key)}
          </div>
        </section>
      </section>

      <section class="section-block compact-block">
        <div class="section-head">
          <div>
            <div class="section-kicker">SESSION NOTE</div>
            <h3>오늘 메모</h3>
          </div>
        </div>
        <textarea class="note-input" data-note placeholder="예: 오늘은 푸쉬업 10회부터 힘들었음 / 런지는 균형이 흔들렸음">${escapeHtml(log.note)}</textarea>
      </section>

      <nav class="mobile-dock">
        <button class="dock-btn" data-action="scroll-top">상단</button>
        <button class="dock-btn" data-action="scroll-routine">루틴</button>
        <button class="dock-btn primary" data-action="timer-start">타이머</button>
      </nav>
    </main>
  `;

  bindEvents();
}

function renderTipsForRoutine(key) {
  const tipSets = {
    fullA: [
      ['스쿼트', '무릎보다 엉덩이를 먼저 접는 느낌으로 내려가세요.'],
      ['글루트 브릿지', '허리를 꺾지 말고 둔근 수축으로 올리세요.'],
      ['버드독', '골반이 좌우로 흔들리지 않게 천천히.'],
    ],
    upperCore: [
      ['무릎 푸쉬업', '가슴으로 바닥을 민다는 느낌으로 진행.'],
      ['숄더 탭 플랭크', '골반 흔들림 최소화.'],
      ['데드버그', '허리가 뜨면 범위를 줄이세요.'],
    ],
    lowerCore: [
      ['리버스 런지', '앞다리 중심으로 균형 유지.'],
      ['굿모닝 힙힌지', '허리보다 엉덩이를 접는 패턴.'],
      ['플랭크', '배에 힘을 주고 호흡 끊지 않기.'],
    ],
    recoveryLight: [
      ['제자리 스텝', '심박수만 가볍게 올릴 정도로.'],
      ['버드독', '척추 길이를 길게 유지.'],
      ['전신 스트레칭', '강하게 당기지 말고 호흡 길게.'],
    ],
    fullB: [
      ['리버스 런지', '상체 과하게 숙이지 않기.'],
      ['슈퍼맨', '허리를 꺾기보다 등 길이를 늘리는 느낌.'],
      ['플랭크', '복압 유지, 엉덩이 처지지 않게.'],
    ],
    optionalMove: [
      ['산책', '빠르지 않아도 좋으니 리듬만 유지.'],
      ['회복 스트레칭', '허리/고관절/어깨를 부드럽게 풀기.'],
    ],
    restStretch: [
      ['목/어깨', '작게 천천히 풀어주세요.'],
      ['고관절', '강한 압박 없이 길게 호흡.'],
    ],
  };

  return (tipSets[key] || [])
    .map(([title, copy]) => `
      <div class="tip-item">
        <strong>${title}</strong>
        <p>${copy}</p>
      </div>
    `)
    .join('');
}

function bindEvents() {
  document.querySelectorAll('[data-day]').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedDay = button.dataset.day;
      saveState();
      render();
      document.querySelector('.exercise-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('[data-exercise-card]').forEach((card) => {
    const toggle = () => {
      const log = getWorkoutLog();
      const index = card.dataset.exerciseCard;
      log.completed[state.selectedDay] ||= {};
      log.completed[state.selectedDay][index] = !log.completed[state.selectedDay][index];
      saveState();
      render();
    };

    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });
  });

  const note = document.querySelector('[data-note]');
  if (note) {
    note.addEventListener('input', () => {
      getWorkoutLog().note = note.value;
      saveState();
    });
  }

  const sessionDone = document.querySelector('[data-session-done]');
  if (sessionDone) {
    sessionDone.addEventListener('change', () => {
      getWorkoutLog().sessionDone = sessionDone.checked;
      saveState();
      render();
    });
  }

  document.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => handleAction(button.dataset.action));
  });
}

function handleAction(action) {
  if (action === 'timer-30') {
    state.timerSeconds = 30;
    saveState();
    render();
    return;
  }

  if (action === 'timer-60') {
    state.timerSeconds = 60;
    saveState();
    render();
    return;
  }

  if (action === 'timer-start') {
    startTimer();
    return;
  }

  if (action === 'timer-stop') {
    stopTimer();
    return;
  }

  if (action === 'scroll-top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (action === 'scroll-routine') {
    document.querySelector('.exercise-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function startTimer() {
  stopTimer();
  timerHandle = window.setInterval(() => {
    state.timerSeconds -= 1;
    if (state.timerSeconds <= 0) {
      state.timerSeconds = 0;
      stopTimer();
      window.alert('휴식 끝! 다음 동작으로 넘어가요.');
    }
    saveState();
    const value = document.querySelector('#timer-value');
    if (value) value.textContent = formatSeconds(state.timerSeconds);
  }, 1000);
}

function stopTimer() {
  if (timerHandle) {
    clearInterval(timerHandle);
    timerHandle = null;
  }
}

function formatSeconds(total) {
  const minutes = String(Math.floor(total / 60)).padStart(2, '0');
  const seconds = String(total % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function labelForDay(dayKey) {
  return {
    monday: '월요일',
    tuesday: '화요일',
    wednesday: '수요일',
    thursday: '목요일',
    friday: '금요일',
    saturday: '토요일',
    sunday: '일요일',
  }[dayKey];
}

function shortLabelForDay(dayKey) {
  return {
    monday: '월',
    tuesday: '화',
    wednesday: '수',
    thursday: '목',
    friday: '금',
    saturday: '토',
    sunday: '일',
  }[dayKey];
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

render();
