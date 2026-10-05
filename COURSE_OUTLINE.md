# Course outline

## Philosophy

**Sense → Think → Act → Check → Correct.** Prefer a short explanation, a prediction, an experiment, and a reflection over long lectures. Mistakes are evidence. Progress means understanding, not speed.

Students begin without hardware or prior programming experience. Module 1 suggests 30–45 minutes with flexible discussion time. Set other lesson lengths after student testing, and split a mission into smaller sessions when useful.

## Learning path

All nine modules include introductory lesson content and practice, with explicit model limits.

| Module | Ideas | Browser activity | Evidence of understanding |
| --- | --- | --- | --- |
| [1. Meet the Robot Brain](module-1.html) | Commands, order, variables, methods, first decision | Two delivery plans | Explain why order changes position |
| [2. Java for Robot Builders](module-2.html) | Numbers, booleans, if/else, loops, methods | Traffic light and repeats | Trace each pass and decision |
| [3. Sensors Are Robot Senses](module-3.html) | Touch, distance, color/light, encoders, gyro/IMU, bias, noise | Calibrate readings against a ruler | Separate noise, offset, and interpretation |
| [4. Position & Geometry](module-4.html) | Pose, headings, coordinates, radians, triangles | Geometry Bench routes | Predict pose and explain route length |
| [5. Motors & Movement](module-5.html) | Power vs. speed, wheel size, gears, differential drive | Straight, curved, and in-place motion | Explain unequal real-wheel behavior |
| [6. Automation in Action](module-6.html) | States, inputs/outputs, timers, transitions | WAIT → DRIVE → DONE | Explain activation, blockage, timeout, and reset |
| [7. Debug Like a Builder](module-7.html) | Expected/actual, logs, boundaries, one-change tests | >= versus > | Identify the revealing test input |
| [8. Check & Correct](module-8.html) | Error, gain, tolerance, clamps, step budgets | Convergence versus oscillation | Distinguish success from a limit |
| [9. Your Autonomous Mission](module-9.html) | Plan, geometry, stop conditions, test evidence | Student delivery route | Explain the route and justify a correction |

Each new module contains three concept sections with Java fragments, a browser experiment, three suggested trials, a reflection question with mentor hints, and links to the Java reference and complete examples. Lessons remain readable without scripting and link forward/back through the course.

## Builder’s bookshelf

[Java reference](java-reference.html) has 38 entries in Basics, Control flow, Objects & methods, Data & collections, Robot math, and Testing & tools. Search matches explanations, code, and keywords. Each entry includes a common mistake, a lesson link, and official documentation. Concurrency, networking, and full vendor SDKs remain separate subjects.

[Example code](examples.html) has eight complete Java 17-compatible desktop programs: decisions, calibration, geometry, encoder conversion, state transitions, boundary tests, bounded feedback, and an ideal teaching robot. Every example has expected output and a one-change experiment. No hardware or external library is needed.

[Discover](discover.html) connects lessons to youth/teen/adult competitions, manufacturing photos, and a brief Python comparison. It is optional and uses internet resources.

## First student pilot

- Can learners explain a turn versus a drive and predict sequence endpoints?
- Can they interpret sensor samples without treating a measurement as a guarantee?
- Can they distinguish power from speed and predict a wheel-driven curve?
- Can they trace a state transition and explain why DONE remains stopped?
- Can they find a boundary bug with a deliberate test?
- Can they distinguish success from exhausting a step limit?
- Can they design a delivery route and use a trace to justify a correction?
- Can they find a Java idea through search and explain where its snippet belongs?
- Can they navigate by keyboard and on mobile, with reading support if needed?

Record where students need clarification; revise pacing and language from those observations before expanding complexity. This first complete course remains a teaching prototype until that pilot is done.

## Future work

Consider obstacles and robot footprints, sensor delay/missing readings, controlled random noise, motor load/slip, and hardware-specific tracks after choosing the robot ecosystem. Preserve explicit units, predictable reset, bounded execution, and accessible text results. A full Java editor/compiler is a separate project decision; the current benches never evaluate arbitrary student code.
