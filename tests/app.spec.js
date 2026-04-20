import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyIntensityToExercise,
  createWorkoutLog,
  getWeekSummary,
  renderAppForTest,
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

describe('render flow', () => {
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

  it('light 강도에서는 조정된 처방과 주간 회고를 함께 보여준다', () => {
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

  it('강도 변경 확인을 취소하면 기존 체크 상태를 유지한다', () => {
    const confirmMock = vi.spyOn(window, 'confirm').mockReturnValue(false);

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
    expect(document.body.textContent).toContain('완료');
    confirmMock.mockRestore();
  });
});
