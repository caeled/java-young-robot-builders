/* Shared pure geometry functions. Coordinates are centimeters, y increases north. */
(function (root) {
  'use strict';
  const normalize = angle => ((angle % 360) + 360) % 360;
  const turn = (pose, angle) => ({ ...pose, heading: normalize(pose.heading + angle) });
  function drive(pose, distance) {
    const radians = pose.heading * Math.PI / 180;
    return { ...pose, x: pose.x + distance * Math.cos(radians), y: pose.y + distance * Math.sin(radians) };
  }
  function guidance(pose, target) {
    const dx = target.x - pose.x;
    const dy = target.y - pose.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 1e-9) return { distance: 0, heading: pose.heading, turn: 0 };
    const heading = normalize(Math.atan2(dy, dx) * 180 / Math.PI);
    return { distance, heading, turn: ((heading - pose.heading + 540) % 360) - 180 };
  }
  const inField = pose => Number.isFinite(pose.x) && Number.isFinite(pose.y) && pose.x >= -1e-9 && pose.x <= 200 + 1e-9 && pose.y >= -1e-9 && pose.y <= 200 + 1e-9;
  const api = { normalize, turn, drive, guidance, inField };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.RobotGeometry = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
