const test = require('node:test');
const assert = require('node:assert/strict');
const g = require('../assets/geometry.js');
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} ≠ ${expected}`);

test('cardinal headings and reverse travel preserve the heading', () => {
  for (const [heading, x, y] of [[0, 60, 40], [90, 40, 60], [180, 20, 40], [270, 40, 20]]) {
    const start = { x: 40, y: 40, heading };
    const result = g.drive(start, 20);
    close(result.x, x); close(result.y, y);
    assert.equal(result.heading, heading);
    const reverse = g.drive(result, -20);
    close(reverse.x, 40); close(reverse.y, 40);
    assert.deepEqual(start, { x: 40, y: 40, heading });
  }
});
test('turns normalize negative and repeated full rotations without changing position', () => {
  assert.deepEqual(g.turn({ x: 40, y: 40, heading: 0 }, -90), { x: 40, y: 40, heading: 270 });
  assert.equal(g.normalize(720), 0);
  assert.equal(g.normalize(-450), 270);
});
test('guidance chooses a shortest turn and reaches targets in every quadrant', () => {
  const pose = { x: 100, y: 100, heading: 350 };
  for (const target of [{ x: 140, y: 120 }, { x: 40, y: 160 }, { x: 20, y: 40 }, { x: 160, y: 20 }]) {
    const guide = g.guidance(pose, target);
    assert.ok(guide.turn >= -180 && guide.turn < 180);
    const result = g.drive(g.turn(pose, guide.turn), guide.distance);
    close(result.x, target.x); close(result.y, target.y);
    assert.ok(g.inField(result));
  }
  close(g.guidance({ x: 0, y: 0, heading: 350 }, { x: 1, y: 0 }).turn, 10);
});
test('at-target guidance needs no move or turn', () => {
  assert.deepEqual(g.guidance({ x: 40, y: 40, heading: 90 }, { x: 40, y: 40 }), { distance: 0, heading: 90, turn: 0 });
});
test('field includes edges, rejects out-of-range and non-finite positions', () => {
  assert.ok(g.inField({ x: 0, y: 200 }));
  assert.ok(g.inField(g.drive({ x: 0, y: 0, heading: 90 }, 200)));
  for (const pose of [{ x: -1, y: 20 }, { x: 201, y: 20 }, { x: 20, y: -1 }, { x: 20, y: 201 }, { x: NaN, y: 20 }, { x: Infinity, y: 20 }]) assert.equal(g.inField(pose), false);
});
test('turn order changes the Module 1 delivery endpoint', () => {
  const start = { x: 0, y: 0, heading: 0 };
  const correct = g.drive(g.turn(g.drive(start, 20), 90), 20);
  const wrong = g.drive(g.drive(g.turn(start, 90), 20), 20);
  close(correct.x, 20); close(correct.y, 20);
  close(wrong.x, 0); close(wrong.y, 40);
});
