/* Visual replay uses the validated calculation trace; it never reruns student code. */
(() => {
  'use strict';
  const models = window.RobotLabs;
  const lab = document.querySelector('[data-lab="9"]');
  if (!lab) return;
  const form = lab.querySelector('form');
  const layout = document.createElement('div');
  layout.className = 'mission-lab-layout';
  form.before(layout);
  layout.append(form);
  const panel = document.createElement('section');
  panel.className = 'mission-player';
  panel.setAttribute('aria-label', 'Visual mission replay');
  panel.innerHTML = `
    <div class="player-heading"><h4>Watch your plan</h4><button class="secondary" type="button" data-player="expand">Enlarge ↗</button></div>
    <svg viewBox="0 0 500 500" role="img" aria-label="Top-down 200 by 200 centimeter robot field. Robot pose and replay action are shown in text below." class="mission-field">
      <defs><pattern id="mission-grid" x="40" y="40" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M42 0H0V42" fill="none" stroke="#c6d5cd" stroke-width="1"/></pattern></defs>
      <rect x="40" y="40" width="420" height="420" fill="url(#mission-grid)" stroke="#809e91"/>
      <path d="M40 40V460H460" fill="none" stroke="#17463e" stroke-width="2"/>
      <g fill="#17463e" font-size="13" font-family="monospace"><text x="32" y="480">0</text><text x="242" y="480">100</text><text x="436" y="480">200 x</text><text x="7" y="253">100</text><text x="7" y="43">200</text><text x="15" y="22">y ↑</text></g>
      <polyline data-player="planned-path" fill="none" stroke="#9bafa5" stroke-width="2" stroke-dasharray="6 6"/>
      <polyline data-player="travelled-path" fill="none" stroke="#267f6e" stroke-width="4"/>
      <circle cx="124" cy="376" r="5" fill="#173e35"/>
      <g transform="translate(334 208)"><circle r="10.5" fill="#f5cc68" stroke="#a24c26" stroke-width="2"/><path d="M-5 0H5M0 -5V5" stroke="#a24c26" stroke-width="2"/><text x="14" y="-13" fill="#173e35" font-size="12">Target</text></g>
      <g data-player="robot"><rect x="-14" y="-15" width="28" height="7" rx="3" fill="#163e36"/><rect x="-14" y="8" width="28" height="7" rx="3" fill="#163e36"/><rect x="-13" y="-10" width="26" height="20" rx="5" fill="#3b9988" stroke="#163e36" stroke-width="2"/><path d="M4 -5L11 0L4 5Z" fill="#fff8e7"/></g>
    </svg>
    <p class="player-pose" data-player="pose"></p>
    <p class="player-caption" data-player="caption" role="status">Run your plan to watch it move.</p>
    <div class="player-controls"><button type="button" class="button" data-player="play" disabled>Replay ▶</button><button type="button" class="secondary" data-player="step" disabled>Step →</button><button type="button" class="secondary" data-player="rewind" disabled>Rewind</button></div>
    <p class="small">Dashed = planned route. Solid = travelled. Playback is slowed for learning, not real motor timing.</p>`;
  layout.append(panel);
  const get = name => panel.querySelector(`[data-player="${name}"]`);
  const controls = ['play', 'step', 'rewind'].map(get);
  const point = p => `${40 + p.x * 2.1},${460 - p.y * 2.1}`;
  const format = n => (Math.abs(n) < 0.05 ? 0 : n).toFixed(1);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let rows = [{ x: 40, y: 40, heading: 0, command: 'START' }];
  let result = null, index = 0, raf = 0, started = null, playing = false;

  function render(pose = rows[index]) {
    get('robot').setAttribute('transform', `translate(${40 + pose.x * 2.1} ${460 - pose.y * 2.1}) rotate(${-pose.heading})`);
    get('travelled-path').setAttribute('points', [...rows.slice(0, index + 1), pose].map(point).join(' '));
    get('pose').textContent = `x ${format(pose.x)} cm · y ${format(pose.y)} cm · heading ${format(pose.heading)}°`;
  }
  function label() {
    if (!result) return;
    const row = rows[index];
    if (index === rows.length - 1) {
      get('caption').textContent = result.rejected
        ? `Paused before rejected ${result.rejected.kind.toUpperCase()} ${result.rejected.value}. Robot stays at the last valid position.`
        : `${row.command} · ${result.reached ? 'Delivered and stopped!' : 'Stopped outside target tolerance.'}`;
    } else get('caption').textContent = index === 0 ? 'Start (40, 40), facing east. Ready to replay.' : `Command ${index} of ${rows.length - 1}: ${row.command} complete.`;
  }
  function pause() {
    cancelAnimationFrame(raf); raf = 0; started = null; playing = false;
    get('play').textContent = 'Replay ▶';
    get('step').disabled = !result;
  }
  function duration(row) {
    if (row.kind === 'turn') return Math.max(500, Math.min(2500, Math.abs(row.value) * 10));
    if (row.kind === 'drive') return Math.max(500, Math.min(2500, Math.abs(row.value) * 16));
    return 500;
  }
  function animate(time) {
    if (!playing) return;
    if (started === null) started = time;
    const next = rows[index + 1];
    const progress = Math.min(1, (time - started) / duration(next));
    render(models.playbackPose(rows[index], next, progress));
    if (progress === 1) {
      index++; started = null; render(); label();
      if (index === rows.length - 1) { pause(); return; }
      get('caption').textContent = `Command ${index + 1} of ${rows.length - 1}: ${rows[index + 1].command}`;
    }
    raf = requestAnimationFrame(animate);
  }
  function play() {
    if (!result || rows.length === 1) return;
    if (playing) { pause(); render(); label(); return; }
    if (index === rows.length - 1) index = 0;
    if (reducedMotion.matches) {
      index = rows.length - 1; render(); label(); return;
    }
    playing = true; get('play').textContent = 'Pause Ⅱ'; get('step').disabled = true;
    get('caption').textContent = `Command ${index + 1} of ${rows.length - 1}: ${rows[index + 1].command}`;
    raf = requestAnimationFrame(animate);
  }
  function clear(message = 'Run your plan to watch it move.') {
    pause(); result = null; index = 0;
    rows = [{ x: 40, y: 40, heading: 0, command: 'START' }];
    controls.forEach(button => { button.disabled = true; });
    get('planned-path').setAttribute('points', ''); render(); get('caption').textContent = message;
  }
  get('play').addEventListener('click', play);
  get('step').addEventListener('click', () => { pause(); index = Math.min(index + 1, rows.length - 1); render(); label(); });
  get('rewind').addEventListener('click', () => { pause(); index = 0; render(); label(); });
  lab.addEventListener('mission-result', event => {
    pause(); result = event.detail; rows = result.trace; index = 0;
    controls.forEach(button => { button.disabled = false; });
    get('play').disabled = rows.length === 1;
    get('planned-path').setAttribute('points', rows.map(point).join(' '));
    render(); label();
    if (reducedMotion.matches) { index = rows.length - 1; render(); label(); }
    else play();
  });
  lab.addEventListener('mission-clear', () => clear());
  form.elements.namedItem('plan').addEventListener('input', () => clear('Plan edited. Run it to update the graphic.'));
  document.addEventListener('visibilitychange', () => { if (document.hidden) { pause(); render(); label(); } });
  reducedMotion.addEventListener('change', () => { pause(); render(); label(); });

  // Enlarge the same player; controls and replay state stay in one place.
  const dialog = document.createElement('dialog');
  dialog.className = 'mission-dialog'; dialog.setAttribute('aria-label', 'Expanded visual mission replay');
  const close = document.createElement('button'); close.className = 'secondary'; close.type = 'button'; close.textContent = 'Close enlarged view';
  dialog.append(close); document.body.append(dialog);
  get('expand').addEventListener('click', () => {
    dialog.append(panel); get('expand').hidden = true; dialog.showModal(); close.focus();
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { layout.append(panel); get('expand').hidden = false; get('expand').focus(); });
  clear();
})();
