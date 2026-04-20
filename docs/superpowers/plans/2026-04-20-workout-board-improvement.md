# Workout Board Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 오늘 루틴 중심 화면에 강도 선택, 주간 성취, 주간 회고를 추가해 초보자 친화성과 기록 경험을 함께 강화한다.

**Architecture:** 현재 단일 페이지 앱 구조를 유지하되, `src/app.js` 안의 데이터 계산과 렌더링 책임을 작은 헬퍼 단위로 분리한다. 강도별 처방은 루틴 데이터 확장으로 처리하고, 주간 성취 계산은 날짜 기반 헬퍼 함수로 묶어 테스트 가능하게 만든다.

**Tech Stack:** Vanilla JavaScript, localStorage, CSS, Python `http.server`, Vitest

---

## File Map

- Modify: `package.json` - 테스트 스크립트와 개발 의존성 정의
- Modify: `src/app.js` - 상태 모델, 주간 계산, 강도 선택, 렌더링, 이벤트 처리
- Modify: `src/styles.css` - 오늘 루틴 히어로 강화, 강도 선택 UI, 주간 성취 섹션 스타일
- Create: `tests/app.spec.js` - 핵심 데이터 계산과 DOM 렌더 흐름 테스트

## Task 1: 테스트 레일 추가

**Files:**
- Modify: `package.json`
- Create: `tests/app.spec.js`

- [ ] **Step 1: `package.json`에 테스트 스크립트와 Vitest 의존성을 추가한다**

```json
{
  "name": "fitness-care-web",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "python3 -m http.server 4173",
    "start": "python3 -m http.server 4173",
    "test": "vitest run"
  },
  "devDependencies": {
    "vitest": "^3.2.4"
  }
}
```

- [ ] **Step 2: 주간 계산과 강도 처방을 검증하는 실패 테스트를 작성한다**

```js
import { describe, expect, it } from 'vitest';
import {
  applyIntensityToExercise,
  createWorkoutLog,
  getWeekSummary,
} from '../src/app.js';

describe('applyIntensityToExercise', () => {
  const exercise = { name: '스쿼트', prescription: '15회', cue: '폼 유지' };

  it('light 강도면 기본 처방을 낮춘다', () => {
    const result = applyIntensityToExercise(exercise, 'light');
    expect(result.prescription).toBe('12회');
  });

  it('focus 강도면 기본 처방을 높인다', () => {
    const result = applyIntensityToExercise(exercise, 'focus');
    expect(result.prescription).toBe('18회');
  });
});

describe('getWeekSummary', () => {
  it('이번 주 완료 횟수와 회고를 계산한다', () => {
    const logs = {
      '2026-04-20': { ...createWorkoutLog(), sessionDone: true, note: '푸쉬업이 힘들었음' },
      '2026-04-21': { ...createWorkoutLog(), sessionDone: true, note: '런지가 안정적이었음' },
      '2026-04-22': { ...createWorkoutLog(), sessionDone: false, note: '' },
    };

    const summary = getWeekSummary(logs, new Date('2026-04-22T09:00:00+09:00'));

    expect(summary.completedSessions).toBe(2);
    expect(summary.reflections).toEqual([
      { dateKey: '2026-04-20', note: '푸쉬업이 힘들었음' },
      { dateKey: '2026-04-21', note: '런지가 안정적이었음' },
    ]);
  });
});
```

- [ ] **Step 3: 테스트를 실행해 실패를 확인한다**

Run: `npm test`  
Expected: FAIL with messages similar to `applyIntensityToExercise is not exported` and `getWeekSummary is not exported`

- [ ] **Step 4: 의존성을 설치한다**

Run: `npm install`  
Expected: `added ... packages` and `found 0 vulnerabilities`

- [ ] **Step 5: 테스트 파일과 의존성 변경만 커밋한다**

```bash
git add package.json package-lock.json tests/app.spec.js
git commit -m "test: add workout board coverage"
```

## Task 2: 강도 모델과 주간 계산 헬퍼 구현

**Files:**
- Modify: `src/app.js`
- Test: `tests/app.spec.js`

- [ ] **Step 1: `src/app.js`에 로그 기본값과 강도 상수를 추가한다**

```js
export const INTENSITY_PRESETS = {
  light: {
    label: '가볍게',
    adjustment: -0.2,
    message: '오늘은 리듬만 챙겨도 충분해요.',
  },
  normal: {
    label: '보통',
    adjustment: 0,
    message: '기본 루틴으로 안정적으로 가요.',
  },
  focus: {
    label: '집중',
    adjustment: 0.2,
    message: '컨디션이 괜찮다면 조금 더 밀어봐요.',
  },
};

export function createWorkoutLog() {
  return {
    note: '',
    completed: {},
    sessionDone: false,
    intensity: 'normal',
  };
}
```

- [ ] **Step 2: 반복 수와 초 단위 처방을 강도별로 조정하는 함수를 구현한다**

```js
export function applyIntensityToExercise(exercise, intensity) {
  const preset = INTENSITY_PRESETS[intensity] || INTENSITY_PRESETS.normal;
  const match = exercise.prescription.match(/^(\d+)(~(\d+))?(회|초)$/);

  if (!match) return exercise;

  const start = Number(match[1]);
  const end = match[3] ? Number(match[3]) : null;
  const unit = match[4];
  const adjust = (value) => Math.max(unit === '초' ? 15 : 1, Math.round(value * (1 + preset.adjustment)));

  const nextPrescription = end
    ? `${adjust(start)}~${adjust(end)}${unit}`
    : `${adjust(start)}${unit}`;

  return {
    ...exercise,
    prescription: nextPrescription,
  };
}
```

- [ ] **Step 3: 주간 완료 횟수와 회고 목록을 계산하는 헬퍼를 구현한다**

```js
function getDateKey(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function startOfWeek(date) {
  const copy = new Date(date);
  const diff = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function getWeekSummary(logs, now = new Date()) {
  const start = startOfWeek(now);
  const reflections = [];
  let completedSessions = 0;

  for (let offset = 0; offset < 7; offset += 1) {
    const current = new Date(start);
    current.setDate(start.getDate() + offset);
    const dateKey = getDateKey(current);
    const log = logs[dateKey];

    if (!log) continue;
    if (log.sessionDone) completedSessions += 1;
    if (log.note?.trim()) reflections.push({ dateKey, note: log.note.trim() });
  }

  return { completedSessions, reflections };
}
```

- [ ] **Step 4: 테스트를 다시 실행해 핵심 계산이 통과하는지 확인한다**

Run: `npm test`  
Expected: PASS for `applyIntensityToExercise` and `getWeekSummary`

- [ ] **Step 5: 데이터 모델 변경을 커밋한다**

```bash
git add src/app.js tests/app.spec.js
git commit -m "feat: add workout intensity and weekly summary helpers"
```

## Task 3: 오늘 루틴 히어로와 강도 선택 UI 구현

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css`
- Test: `tests/app.spec.js`

- [ ] **Step 1: 렌더링에 강도 선택 상태와 히어로 메시지를 추가하는 실패 테스트를 작성한다**

```js
import { beforeEach, describe, expect, it } from 'vitest';
import { renderAppForTest } from '../src/app.js';

describe('hero intensity rendering', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
  });

  it('기본 강도와 주간 완료 수를 보여준다', () => {
    renderAppForTest({
      selectedDay: 'monday',
      timerSeconds: 60,
      logs: {
        '2026-04-20': {
          note: '푸쉬업이 힘들었음',
          completed: {},
          sessionDone: true,
          intensity: 'normal',
        },
      },
    });

    expect(document.body.textContent).toContain('보통');
    expect(document.body.textContent).toContain('이번 주 1회 완료');
    expect(document.body.textContent).toContain('오늘 컨디션');
  });
});
```

- [ ] **Step 2: 히어로와 강도 선택 마크업을 `render()`에 추가한다**

```js
const weekSummary = getWeekSummary(state.logs, today);
const intensity = log.intensity || 'normal';
const intensityPreset = INTENSITY_PRESETS[intensity];

root.innerHTML = `
  <main class="app-shell">
    <section class="today-card card hero-card">
      <div class="today-card-top">
        <div>
          <div class="routine-badge">${plan.label}</div>
          <h2>${plan.category}</h2>
          <p>${intensityPreset.message}</p>
        </div>
        <div class="today-progress">
          <span>이번 주 ${weekSummary.completedSessions}회 완료</span>
          <strong>${completionPercent}%</strong>
        </div>
      </div>
      <div class="progress-track"><span style="width:${completionPercent}%"></span></div>
      <div class="today-summary-row">
        <div class="summary-pill"><span>오늘 강도</span><strong>${intensityPreset.label}</strong></div>
        <div class="summary-pill"><span>다음 운동</span><strong>${nextExercise ? nextExercise.name : '완료'}</strong></div>
        <div class="summary-pill"><span>주간 흐름</span><strong>${weekSummary.reflections.length}개 메모</strong></div>
      </div>
      <button class="primary-btn hero-cta" data-action="scroll-routine">${completedCount ? '이어하기' : '시작하기'}</button>
    </section>

    <section class="section-block">
      <div class="section-head">
        <div>
          <div class="section-kicker">TODAY INTENSITY</div>
          <h3>오늘 컨디션</h3>
        </div>
      </div>
      <div class="intensity-row">
        ${Object.entries(INTENSITY_PRESETS)
          .map(([key, preset]) => `
            <button class="intensity-chip ${intensity === key ? 'active' : ''}" data-intensity="${key}" ${!isToday ? 'disabled' : ''}>
              <strong>${preset.label}</strong>
              <span>${preset.message}</span>
            </button>
          `)
          .join('')}
      </div>
    </section>
  </main>
`;
```

- [ ] **Step 3: 강도 선택 이벤트와 진행 중 변경 확인 로직을 추가한다**

```js
document.querySelectorAll('[data-intensity]').forEach((button) => {
  button.addEventListener('click', () => {
    const nextIntensity = button.dataset.intensity;
    const log = getWorkoutLog();
    const hasProgress = Object.values(log.completed[state.selectedDay] || {}).some(Boolean);

    if (hasProgress && log.intensity !== nextIntensity) {
      const confirmed = window.confirm('강도를 바꾸면 오늘 체크한 운동이 초기화돼요. 계속할까요?');
      if (!confirmed) return;
      log.completed[state.selectedDay] = {};
      log.sessionDone = false;
    }

    log.intensity = nextIntensity;
    saveState();
    render();
  });
});
```

- [ ] **Step 4: 강도 선택 UI 스타일을 추가한다**

```css
.hero-card {
  gap: 14px;
}

.hero-cta {
  width: 100%;
  margin-top: 14px;
}

.intensity-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.intensity-chip {
  min-height: 88px;
  padding: 14px;
  text-align: left;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-secondary);
}

.intensity-chip.active {
  border-color: rgba(114, 130, 255, 0.28);
  background: rgba(114, 130, 255, 0.12);
  color: var(--text);
}

.intensity-chip strong,
.intensity-chip span {
  display: block;
}

.intensity-chip span {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.45;
}
```

- [ ] **Step 5: 렌더 테스트와 수동 확인 후 커밋한다**

Run: `npm test`  
Expected: PASS including `hero intensity rendering`

Run: `npm run dev`  
Expected: 브라우저에서 오늘 루틴 카드 아래 강도 선택 3개와 주간 완료 수가 보임

```bash
git add src/app.js src/styles.css tests/app.spec.js
git commit -m "feat: add hero intensity selection flow"
```

## Task 4: 강도별 체크리스트와 주간 회고 섹션 연결

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css`
- Test: `tests/app.spec.js`

- [ ] **Step 1: 체크리스트 처방과 주간 회고 렌더링을 검증하는 실패 테스트를 추가한다**

```js
it('light 강도에서는 조정된 처방과 주간 회고를 함께 보여준다', () => {
  document.body.innerHTML = '<div id="app"></div>';

  renderAppForTest({
    selectedDay: 'monday',
    timerSeconds: 60,
    logs: {
      '2026-04-20': {
        note: '런지 균형이 좋아졌음',
        completed: {},
        sessionDone: true,
        intensity: 'light',
      },
    },
  });

  expect(document.body.textContent).toContain('12회');
  expect(document.body.textContent).toContain('이번 주 회고');
  expect(document.body.textContent).toContain('런지 균형이 좋아졌음');
});
```

- [ ] **Step 2: 선택한 강도 기준으로 루틴 처방을 렌더링한다**

```js
function getSelectedRoutine(log = getWorkoutLog()) {
  const routine = routineCatalog[getSelectedPlan().key];
  const intensity = log.intensity || 'normal';

  return {
    ...routine,
    exercises: routine.exercises.map((exercise) => applyIntensityToExercise(exercise, intensity)),
  };
}
```

- [ ] **Step 3: 하단에 주간 성취/회고 섹션을 추가한다**

```js
<section class="section-block compact-block">
  <div class="section-head">
    <div>
      <div class="section-kicker">WEEKLY PROGRESS</div>
      <h3>이번 주 성취</h3>
    </div>
  </div>
  <div class="weekly-summary-grid">
    <div class="summary-pill weekly-highlight">
      <span>완료 횟수</span>
      <strong>이번 주 ${weekSummary.completedSessions}회</strong>
    </div>
    <div class="weekly-reflections card">
      <strong>이번 주 회고</strong>
      ${
        weekSummary.reflections.length
          ? weekSummary.reflections
              .map(({ dateKey, note }) => `<p><span>${dateKey}</span>${escapeHtml(note)}</p>`)
              .join('')
          : '<p class="empty-copy">아직 남긴 회고가 없어요.</p>'
      }
    </div>
  </div>
</section>
```

- [ ] **Step 4: 주간 성취 섹션 스타일을 추가한다**

```css
.weekly-summary-grid {
  display: grid;
  gap: 10px;
}

.weekly-highlight {
  background: rgba(114, 130, 255, 0.08);
  border-color: rgba(114, 130, 255, 0.18);
}

.weekly-reflections {
  padding: 14px;
}

.weekly-reflections strong {
  display: block;
  margin-bottom: 10px;
}

.weekly-reflections p {
  margin: 0;
  padding: 10px 0;
  border-top: 1px solid var(--line-soft);
  color: var(--text-secondary);
}

.weekly-reflections p:first-of-type {
  border-top: 0;
  padding-top: 0;
}

.weekly-reflections span {
  display: block;
  margin-bottom: 4px;
  color: var(--text-tertiary);
  font-size: 12px;
}

.empty-copy {
  color: var(--text-tertiary);
}
```

- [ ] **Step 5: 전체 테스트와 수동 플로우 확인 후 커밋한다**

Run: `npm test`  
Expected: PASS for intensity, weekly summary, and rendering coverage

Run: `npm run dev`  
Expected: 강도를 바꾸면 처방이 달라지고, 메모를 남기면 이번 주 회고에 반영됨

```bash
git add src/app.js src/styles.css tests/app.spec.js
git commit -m "feat: add weekly progress and reflections"
```

## Task 5: 마무리 정리와 회귀 확인

**Files:**
- Modify: `README.md`
- Test: `tests/app.spec.js`

- [ ] **Step 1: README 기능 목록을 최신 상태로 갱신한다**

```md
## 현재 기능

- 요일별 자동 운동 루틴 변경
- 오늘 컨디션 기준 강도 선택
- 강도에 맞게 조정되는 운동 처방
- 오늘 운동 순서 체크리스트
- 30초/60초 휴식 타이머
- 오늘 메모와 이번 주 회고
- 이번 주 완료 횟수 확인
- 모바일 우선 UI
- 모든 기록은 브라우저 `localStorage`에 저장
```

- [ ] **Step 2: 핵심 회귀 흐름을 한 번 더 테스트에 추가한다**

```js
it('강도 변경 확인을 취소하면 기존 체크 상태를 유지한다', () => {
  const confirmMock = vi.spyOn(window, 'confirm').mockReturnValue(false);
  document.body.innerHTML = '<div id="app"></div>';

  renderAppForTest({
    selectedDay: 'monday',
    timerSeconds: 60,
    logs: {
      '2026-04-20': {
        note: '',
        completed: { monday: { 0: true } },
        sessionDone: false,
        intensity: 'normal',
      },
    },
  });

  document.querySelector('[data-intensity="focus"]').click();

  expect(confirmMock).toHaveBeenCalled();
  expect(document.body.textContent).toContain('보통');
  confirmMock.mockRestore();
});
```

- [ ] **Step 3: 전체 테스트를 실행한다**

Run: `npm test`  
Expected: all tests pass

- [ ] **Step 4: 수동 브라우저 회귀를 확인한다**

Run: `npm run dev`  
Checklist:
- 기본 진입 시 오늘 루틴 히어로가 가장 먼저 보이는지
- 강도 선택 후 체크리스트 처방이 즉시 바뀌는지
- 진행 중 강도 변경 시 확인 창이 뜨는지
- 오늘 완료/메모가 이번 주 성취 섹션에 반영되는지

- [ ] **Step 5: 문서 변경과 최종 안정화 커밋을 남긴다**

```bash
git add README.md tests/app.spec.js
git commit -m "docs: update workout board feature summary"
```

## Self-Review

- 스펙의 핵심 요구사항인 `오늘 루틴 중심`, `강도 선택`, `오늘 진행감`, `이번 주 완료 횟수`, `이번 주 회고`, `강도 변경 시 초기화 규칙`을 각각 Task 2~4에 매핑했다.
- placeholder 표현은 제거했고, 각 단계마다 실제 코드나 명령을 넣었다.
- 타입/이름은 `intensity`, `applyIntensityToExercise`, `getWeekSummary`, `renderAppForTest`로 일관되게 맞췄다.
