/* Pure teaching models: no hardware commands, Java evaluation, or real-time assumptions. */
(function (root) {
  'use strict';
  const geometry = typeof module !== 'undefined' && module.exports ? require('./geometry.js') : root.RobotGeometry;
  const clamp = (v, low, high) => Math.max(low, Math.min(high, v));
  function sensor(bias, noise, calibration) {
    const readings = [-1, 0.5, 0, 1, -0.5].map(offset => 40 + bias + noise * offset);
    const corrected = readings.map(value => value - calibration);
    const mean = corrected.reduce((sum, value) => sum + value, 0) / corrected.length;
    return { readings, corrected, mean, error: mean - 40 };
  }
  function motor(leftPower, rightPower, seconds) {
    const left = leftPower * 50, right = rightPower * 50;
    const speed = (left + right) / 2, omega = (right - left) / 20;
    const at = time => {
      const theta = omega * time;
      return Math.abs(omega) < 1e-9
        ? { x: speed * time, y: 0, heading: 0 }
        : { x: speed / omega * Math.sin(theta), y: speed / omega * (1 - Math.cos(theta)), heading: geometry.normalize(theta * 180 / Math.PI) };
    };
    return { left, right, speed, omega, end: at(seconds), path: Array.from({ length: 41 }, (_, i) => at(seconds * i / 40)) };
  }
  function stateStep(current, clear) {
    let { state, driveSteps } = current;
    if (state === 'WAIT' && clear) state = 'DRIVE';
    else if (state === 'DRIVE') {
      driveSteps++;
      if (!clear || driveSteps >= 3) state = 'DONE';
    }
    return { state, driveSteps, motorOn: state === 'DRIVE' };
  }
  function correction(gain) {
    let x = 5;
    const trace = [{ step: 0, x, error: 100 - x }];
    for (let step = 1; step <= 30 && Math.abs(100 - x) > 2; step++) {
      x += clamp(gain * (100 - x), -20, 20);
      trace.push({ step, x, error: 100 - x });
    }
    return { trace, reached: Math.abs(100 - x) <= 2, x };
  }
  function parsePlan(source) {
    const lines = source.trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    if (lines.length < 1 || lines.length > 20) throw new Error('Use 1–20 non-empty command lines.');
    const parsed = lines.map((line, index) => {
      if (line.toUpperCase() === 'STOP') return { kind: 'stop', value: 0 };
      const match = /^(TURN|DRIVE)\s+(-?(?:\d+(?:\.\d*)?|\.\d+))$/i.exec(line);
      if (!match) throw new Error(`Line ${index + 1}: use TURN number, DRIVE number, or STOP.`);
      const kind = match[1].toLowerCase(), value = Number(match[2]);
      const limit = kind === 'turn' ? 360 : 200;
      if (!Number.isFinite(value) || Math.abs(value) > limit) throw new Error(`Line ${index + 1}: ${kind} must be between −${limit} and ${limit}.`);
      return { kind, value };
    });
    if (parsed.at(-1).kind !== 'stop' || parsed.slice(0, -1).some(c => c.kind === 'stop')) throw new Error('End your plan with one STOP, and place no commands after it.');
    return parsed;
  }
  function runPlan(source) {
    const plan = parsePlan(source);
    let pose = { x: 40, y: 40, heading: 0 }, pathLength = 0;
    const trace = [{ command: 'START', ...pose }];
    for (const { kind, value } of plan) {
      const next = kind === 'stop' ? pose : geometry[kind](pose, value);
      if (!geometry.inField(next)) return { trace, pose, pathLength, reached: false, stopped: false, rejected: { kind, value }, error: `${kind.toUpperCase()} ${value} would leave the field. Rejected at (${next.x.toFixed(1)}, ${next.y.toFixed(1)}); prior commands remain in the trace.` };
      pose = next;
      if (kind === 'drive') pathLength += Math.abs(value);
      trace.push({ command: kind.toUpperCase() + (kind === 'stop' ? '' : ` ${value}`), kind, value, ...pose });
    }
    const distance = geometry.guidance(pose, { x: 140, y: 120 }).distance;
    return { trace, pose, pathLength, distance, reached: distance <= 5, stopped: true };
  }
  // Keep the requested signed turn so +360 and -270 are animated faithfully.
  function playbackPose(from, to, progress) {
    const t = clamp(progress, 0, 1);
    return {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
      heading: to.kind === 'turn' ? geometry.normalize(from.heading + to.value * t) : from.heading
    };
  }
  const api = { clamp, sensor, motor, stateStep, correction, parsePlan, runPlan, playbackPose };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.RobotLabs = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
