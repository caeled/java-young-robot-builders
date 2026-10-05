/* Visualizes an ideal point robot. Java is displayed for teaching, never evaluated. */
(() => {
  'use strict';
  const geometry = window.RobotGeometry;
  const el = id => document.getElementById(id);
  const targets = { diagonal: { x: 140, y: 120 }, north: { x: 40, y: 160 }, west: { x: 20, y: 40 } };
  let pose, target, trail, commands;
  const format = value => (Math.abs(value) < 0.05 ? 0 : value).toFixed(1);
  const point = p => ({ x: 40 + p.x * 2.1, y: 460 - p.y * 2.1 });
  function render() {
    const p = point(pose), t = point(target), guide = geometry.guidance(pose, target);
    el('robot-marker').setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${-pose.heading})`);
    el('target-marker').setAttribute('transform', `translate(${t.x} ${t.y})`);
    el('trail').setAttribute('points', trail.map(item => { const pos = point(item); return `${pos.x},${pos.y}`; }).join(' '));
    const line = el('target-line');
    for (const [key, value] of Object.entries({ x1: p.x, y1: p.y, x2: t.x, y2: t.y })) line.setAttribute(key, value);
    el('read-x').textContent = `${format(pose.x)} cm`;
    el('read-y').textContent = `${format(pose.y)} cm`;
    el('read-heading').textContent = `${format(pose.heading)}°`;
    el('read-distance').textContent = `${format(guide.distance)} cm`;
    el('field-description').textContent = `Robot at x ${format(pose.x)}, y ${format(pose.y)} centimeters, heading ${format(pose.heading)} degrees. Target at (${target.x}, ${target.y}); distance ${format(guide.distance)} centimeters.`;
    el('hint').textContent = guide.distance <= 5 ? 'You are within the 5 cm goal! Try another route or another mission.' : `From here: Δx = ${format(target.x - pose.x)} cm, Δy = ${format(target.y - pose.y)} cm. Face ${format(guide.heading)}° by turning ${format(guide.turn)}°, then drive about ${format(guide.distance)} cm. Rounded numbers may leave a tiny error.`;
    el('command-log').textContent = ['// Start: (40, 40), heading 0°', ...commands].join('\n');
    el('log-note').textContent = commands.length >= 100 ? 'Notebook full: reset the mission to record a new experiment.' : 'The notebook keeps up to 100 accepted commands. Reset for a fresh experiment.';
  }
  function reset() {
    pose = { x: 40, y: 40, heading: 0 };
    target = targets[el('mission').value];
    trail = [{ ...pose }]; commands = [];
    el('feedback').textContent = 'Predict your first move, then test it.';
    render();
  }
  function execute(kind, value) {
    if (commands.length >= 100) { el('feedback').textContent = 'Your notebook is full. Reset this mission to start a new experiment.'; return; }
    if (!Number.isFinite(value)) { el('feedback').textContent = 'Enter a finite number before moving.'; return; }
    const next = geometry[kind](pose, value);
    if (!geometry.inField(next)) {
      el('feedback').textContent = `That move would end outside the field at (${format(next.x)}, ${format(next.y)}). No movement was made. Try a shorter distance or a different heading.`;
      return;
    }
    pose = next;
    if (kind === 'drive') trail.push({ ...pose });
    commands.push(kind === 'turn' ? `robot.turnLeft(${value});` : `robot.forward(${value});`);
    render();
    const distance = geometry.guidance(pose, target).distance;
    el('feedback').textContent = distance <= 5 ? `Target reached! You are ${format(distance)} cm away. What made your plan work?` : `${kind === 'turn' ? 'Turn' : 'Drive'} complete. You are ${format(distance)} cm from the target. Does that match your prediction?`;
  }
  for (const kind of ['turn', 'drive']) el(`${kind}-form`).addEventListener('submit', event => {
    event.preventDefault();
    const input = el(kind);
    if (input.reportValidity()) execute(kind, input.valueAsNumber);
  });
  el('mission').addEventListener('change', reset);
  el('reset').addEventListener('click', reset);
  reset();
})();
