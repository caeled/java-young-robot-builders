const test = require('node:test');
const assert = require('node:assert/strict');
const m = require('../assets/lab-models.js');
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} != ${b}`);

test('averaging removes this balanced noise pattern, not fixed bias', () => {
  close(m.sensor(5, 10, 0).mean, 45);
  close(m.sensor(5, 10, 5).mean, 40);
  assert.equal(new Set(m.sensor(0, 4, 0).readings).size, 5);
});
test('differential drive travels straight, reverses, curves, and turns in place', () => {
  close(m.motor(0.5, 0.5, 2).end.x, 50);
  close(m.motor(0.5, 0.5, 2).end.y, 0);
  close(m.motor(-0.5, -0.5, 2).end.x, -50);
  const turn = m.motor(-0.5, 0.5, 2);
  close(turn.end.x, 0); close(turn.end.y, 0);
  assert.ok(turn.end.heading > 0);
  const curve = m.motor(0.5, 0.7, 2);
  assert.ok(curve.end.x > 0 && curve.end.y > 0);
  close(m.motor(0.5, 0.7, 0).end.x, 0);
});
test('automation waits, drives three intervals, latches done, and stops on an obstacle', () => {
  const start = { state: 'WAIT', driveSteps: 0 };
  assert.equal(m.stateStep(start, false).state, 'WAIT');
  let state = m.stateStep(start, true);
  assert.equal(state.motorOn, true);
  for (let i = 1; i <= 3; i++) {
    state = m.stateStep(state, true);
    assert.equal(state.driveSteps, i);
    assert.equal(state.motorOn, i < 3);
  }
  assert.equal(m.stateStep(state, true).state, 'DONE');
  assert.equal(m.stateStep(m.stateStep(start, true), false).motorOn, false);
});
test('feedback distinguishes convergence, zero gain, and oscillation', () => {
  const good = m.correction(0.5);
  assert.equal(good.reached, true);
  assert.equal(good.trace.length - 1, 8);
  close(good.x, 98.90625);
  for (const gain of [0, 2]) {
    const result = m.correction(gain);
    assert.equal(result.reached, false);
    assert.equal(result.trace.length, 31);
  }
});
test('mission accepts a delivery and requires intentional final stopping', () => {
  const result = m.runPlan('DRIVE 100\nTURN 90\nDRIVE 80\nSTOP');
  assert.equal(result.reached, true);
  assert.equal(result.stopped, true);
  close(result.pathLength, 180);
  close(result.pose.x, 140); close(result.pose.y, 120);
  assert.ok(m.runPlan('TURN 38.6598\nDRIVE 128.0625\nSTOP').reached);
  assert.equal(m.runPlan('STOP').reached, false);
});
test('mission syntax rejects malformed or unbounded plans before execution', () => {
  for (const plan of ['', 'DRIVE 2', 'STOP\nDRIVE 2', 'TURN NaN\nSTOP', 'TURN 361\nSTOP', 'DRIVE 201\nSTOP', 'DRIVE 1e309\nSTOP', 'alert(1)\nSTOP', Array(21).fill('TURN 0').join('\n') + '\nSTOP']) assert.throws(() => m.parsePlan(plan));
  assert.equal(m.parsePlan('turn -90\r\ndrive .5\r\nstop').length, 3);
});
test('out-of-field route reports partial trace and does not accept the offending move', () => {
  const result = m.runPlan('DRIVE 100\nDRIVE 100\nSTOP');
  assert.equal(result.reached, false);
  assert.equal(result.stopped, false);
  assert.match(result.error, /leave the field/);
  assert.equal(result.trace.length, 2);
  close(result.pose.x, 140);
});

test('replay interpolates drives and preserves the commanded turn direction', () => {
  const start = { x: 40, y: 40, heading: 0 };
  const drive = { x: 140, y: 40, heading: 0, kind: 'drive', value: 100 };
  assert.deepEqual(m.playbackPose(start, drive, 0.5), { x: 90, y: 40, heading: 0 });
  const clockwise = { ...start, heading: 90, kind: 'turn', value: -270 };
  close(m.playbackPose(start, clockwise, 0.5).heading, 225);
  const fullTurn = { ...start, kind: 'turn', value: 360 };
  close(m.playbackPose(start, fullTurn, 0.5).heading, 180);
  close(m.playbackPose(start, fullTurn, 1).heading, 0);
  assert.equal(m.runPlan('DRIVE 200\nSTOP').rejected.value, 200);
});
