(() => {
  'use strict';
  const models = window.RobotLabs;
  const f = v => (Math.abs(v) < 0.00005 ? 0 : v).toFixed(2);
  for (const lab of document.querySelectorAll('[data-lab]')) {
    const form = lab.querySelector('form'), status = lab.querySelector('[role="status"]'), trace = lab.querySelector('pre code');
    let state = { state: 'WAIT', driveSteps: 0 }, history = [];
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const value = name => form.elements.namedItem(name).value;
      const number = name => Number(value(name));
      let message, lines = [];
      try {
        switch (Number(lab.dataset.lab)) {
          case 2: {
            const count = number('repeats'), light = value('light');
            for (let lap = 0; lap < count; lap++) lines.push(`lap=${lap}; light=${light}; command=${light === 'green' ? 'MOVE' : 'WAIT'}`);
            message = `${count} loop passes; ${light === 'green' ? count : 0} move commands. Compare with your prediction.`;
            break;
          }
          case 3: {
            const result = models.sensor(number('bias'), number('noise'), number('calibration'));
            lines = result.readings.map((raw, i) => `Sample ${i + 1}: raw=${f(raw)} cm; corrected=${f(result.corrected[i])} cm`);
            lines.push(`Corrected mean: ${f(result.mean)} cm`, `Ruler: 40.00 cm; mean error: ${f(result.error)} cm`);
            message = 'Five repeatable readings compared. Noise pattern repeats so changing one setting is a fair comparison; real noise varies.';
            break;
          }
          case 5: {
            const result = models.motor(number('left'), number('right'), number('seconds'));
            lines = [`Left speed: ${f(result.left)} cm/s`, `Right speed: ${f(result.right)} cm/s`, `Forward speed: ${f(result.speed)} cm/s`, `Turn rate: ${f(result.omega)} rad/s`, `Final pose: x=${f(result.end.x)} cm, y=${f(result.end.y)} cm, heading=${f(result.end.heading)}°`];
            message = 'Ideal motion calculated. Equal power maps to equal speed only in this simplified model.';
            drawPath(lab, result.path);
            break;
          }
          case 6: {
            if (history.length >= 30) { message = '30 updates recorded. Reset to start another experiment.'; lines = history; break; }
            const before = state.state;
            state = models.stateStep(state, value('clear') === 'true');
            history.push(`Update ${history.length + 1}: ${before} → ${state.state}; drive steps=${state.driveSteps}; motor=${state.motorOn ? 'ON' : 'OFF'}`);
            lines = history;
            message = `State ${state.state}. Motor ${state.motorOn ? 'on for the next interval' : 'off'}.`;
            break;
          }
          case 7: {
            const cm = number('reading'), expected = cm > 20, actual = value('operator') === 'gte' ? cm >= 20 : cm > 20;
            lines = [`Input: ${cm} cm`, `Expected: ${expected ? 'CLEAR' : 'WAIT'}`, `Actual: ${actual ? 'CLEAR' : 'WAIT'}`];
            message = expected === actual ? 'This test passes. Check the other boundary inputs before deciding the bug is fixed.' : 'Mismatch found! This input exposes the boundary bug. Change one thing and retest.';
            break;
          }
          case 8: {
            const result = models.correction(number('gain'));
            lines = result.trace.map(row => `Step ${row.step}: x=${f(row.x)} cm; error=${f(row.error)} cm`);
            message = result.reached ? `Target reached within 2 cm after ${result.trace.length - 1} steps.` : `Step limit reached after 30 steps. Goal missed; final error ${f(100 - result.x)} cm.`;
            break;
          }
          case 9: {
            const result = models.runPlan(value('plan'));
            lines = result.trace.map(row => `${row.command}: (${f(row.x)}, ${f(row.y)}) cm, heading ${f(row.heading)}°`);
            lines.push(`Travel length: ${f(result.pathLength)} cm`);
            message = result.error || (result.reached ? `Delivered and stopped! Target error ${f(result.distance)} cm.` : `Stopped ${f(result.distance)} cm from the target. Use the trace to choose one correction.`);
            lab.dispatchEvent(new CustomEvent('mission-result', { detail: result }));
            break;
          }
        }
        status.textContent = message;
        trace.textContent = lines.join('\n');
      } catch (error) {
        if (lab.dataset.lab === '9') lab.dispatchEvent(new Event('mission-clear'));
        status.textContent = `Plan not run: ${error.message}`;
        trace.textContent = 'Fix the plan and try again. No commands from this attempt were executed.';
      }
    });
    lab.querySelector('.lab-reset').addEventListener('click', () => {
      form.reset(); state = { state: 'WAIT', driveSteps: 0 }; history = [];
      status.textContent = 'Lab reset. Predict the result before running.';
      trace.textContent = 'Results will appear here.';
      lab.querySelector('.motion-plot')?.remove();
      if (lab.dataset.lab === '9') lab.dispatchEvent(new Event('mission-clear'));
    });
  }
  function drawPath(lab, path) {
    lab.querySelector('.motion-plot')?.remove();
    const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 400 260'); svg.setAttribute('role', 'img'); svg.classList.add('motion-plot');
    svg.setAttribute('aria-label', 'Top view of the ideal wheel-driven path. Start is a dot; end is a square. Coordinates and heading are listed in the trace. Plot automatically scales to fit.');
    const xs = path.map(p => p.x), ys = path.map(p => p.y);
    const minX = Math.min(0, ...xs), maxX = Math.max(0, ...xs), minY = Math.min(0, ...ys), maxY = Math.max(0, ...ys);
    const scale = Math.min(340 / Math.max(10, maxX - minX), 190 / Math.max(10, maxY - minY));
    const point = p => [30 + (p.x - minX) * scale, 220 - (p.y - minY) * scale];
    const line = document.createElementNS(ns, 'polyline');
    line.setAttribute('points', path.map(p => point(p).join(',')).join(' '));
    line.setAttribute('fill', 'none'); line.setAttribute('stroke', '#267f6e'); line.setAttribute('stroke-width', '3');
    svg.append(line);
    const start = document.createElementNS(ns, 'circle'), end = document.createElementNS(ns, 'rect');
    const [sx, sy] = point(path[0]), [ex, ey] = point(path.at(-1));
    start.setAttribute('cx', sx); start.setAttribute('cy', sy); start.setAttribute('r', '5'); start.setAttribute('fill', '#173e35');
    end.setAttribute('x', ex - 5); end.setAttribute('y', ey - 5); end.setAttribute('width', '10'); end.setAttribute('height', '10'); end.setAttribute('fill', '#c85329');
    const label = document.createElementNS(ns, 'text'); label.setAttribute('x', '20'); label.setAttribute('y', '20'); label.setAttribute('font-size', '12'); label.textContent = 'Top view · dot=start · square=end · auto-scaled';
    svg.append(start, end, label); lab.append(svg);
  }
})();
