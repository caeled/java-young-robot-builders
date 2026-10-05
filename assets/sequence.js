(() => {
  'use strict';
  const plan = document.getElementById('sequence-plan');
  const result = document.getElementById('sequence-result');
  const programs = {
    correct: 'robot.forward(20);\nrobot.turnLeft(90);\nrobot.forward(20);\nrobot.stop();',
    wrong: 'robot.turnLeft(90);\nrobot.forward(20);\nrobot.forward(20);\nrobot.stop();'
  };
  plan.addEventListener('change', () => {
    document.getElementById('sequence-code').textContent = programs[plan.value];
    result.textContent = 'New plan selected. Predict its final position, then run it.';
  });
  document.getElementById('run-sequence').addEventListener('click', () => {
    result.textContent = plan.value === 'correct'
      ? 'Delivery reached! (0, 0) → (20, 0) → turn north → (20, 20) → stop. Your final heading is 90°.'
      : 'You ended at (0, 40), facing north (90°). Turning first sent both moves north. Compare this with the delivery spot at (20, 20), then change the order.';
  });
})();
