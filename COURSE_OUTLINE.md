# Course outline

## Philosophy

**Sense → Think → Act → Check → Correct.** Every concept should quickly make something observable happen. Prefer short instructions, a prediction, an experiment, and a reflection over long lectures. Mistakes are evidence. Progress is understanding, not speed.

Students begin without hardware or prior programming experience. Module 1 takes approximately 30–45 minutes, with flexible time for discussion. Future lesson lengths should be set after student testing, not assumed from this roadmap.

## Learning path

| Module | Ideas | Hands-on mission | Evidence of understanding | Status |
| --- | --- | --- | --- | --- |
| 1. Meet the Robot Brain | Programs, commands, sequence, variables, methods, first decision | Compare two delivery plans; predict final coordinates | Explain why order changes the route; identify a variable and an if/else choice | Lesson and sequence activity available |
| 2. Java for Robot Builders | Numbers, booleans, if/else, loops, reusable methods | Traffic-light robot and repeatable patrol | Write a small routine and trace its decisions | Planned |
| 3. Sensors Are Robot Senses | Touch, distance, color/light, encoders, gyro/IMU, noise, delay, calibration | Compare readings with known distances | Distinguish measurement from interpretation; identify unreliable readings | Planned |
| 4. Position & Geometry | Coordinates, headings, degrees, distance, triangles, turning radius | Reach a target by two different routes | Predict position and calculate a correction | Geometry Bench prototype available; lesson planned |
| 5. Motors & Movement | Power vs. speed, direction, wheel size, gear ratios, motor mismatch | Compare equal-power and unequal-wheel runs | Explain why power alone does not guarantee straight travel | Planned |
| 6. Automation in Action | Inputs, decisions, actions, timers, sequences, state machines | Wait → detect → move → check routine | Trace state changes and describe a stopping condition | Planned |
| 7. Debug Like a Builder | Expected vs. actual, logging, test cases, one-change experiments | Repair a broken delivery mission | Use a log and test evidence to justify a fix | Planned |
| 8. Check & Correct | Position estimates, feedback, tolerance, bounded retries | Make repeated small corrections toward a goal | Explain tolerance and prevent endless correction | Planned |
| 9. Your Autonomous Mission | Combine Java, sensors, geometry, motors, and testing | Student-designed delivery challenge | Demonstrate a mission and explain improvements from recorded tests | Planned |

The early plan firmly named Modules 1–3 and proposed the remaining topics in several orders. This roadmap groups those topics into a progressive path; the final capstone and feedback module extend that plan. Future work should keep these topics while adjusting pacing from student and mentor feedback.

## Module 1 lesson sequence

1. **Give a command:** explain `robot.forward(20)` and `robot.stop()` using the imaginary teaching API. Try precise instructions with a partner.
2. **Order matters:** predict two command sequences starting at (0, 0), facing east. Run both and compare the endpoint with (20, 20).
3. **Name a number:** use `int distanceCm = 20`; predict what changes when it becomes 30.
4. **Make a decision:** trace `boolean pathClear` through an if/else. Explain that later a sensor can inform this decision.
5. **Check and correct:** answer reflection questions, compare with mentor hints, and change one thing in a new experiment.
6. **Transfer:** use the Geometry Bench to turn 90°, drive 20 cm, and describe which coordinate changes.

## Browser bench roadmap

**Now:** a sequence comparison activity and an ideal 200 × 200 cm coordinate field with turn/drive controls, three targets, path history, live measurements, geometry hints, and a Java-style notebook. Screen-reader users receive textual measurements and action feedback; all controls work by keyboard.

**Next:** editable command sequences with bounded execution, sensor noise and calibration experiments, differential-drive motor modeling, a finite-state automation bench, and a debugging bench. Keep simulation behavior explicit and keep Java teaching examples separate from actual browser execution. These are future ideas, not current capabilities.

## First student pilot

- Can a learner explain the difference between a turn and a drive?
- Can they predict both sequence endpoints without copying the result?
- Can they find a target and explain the correction they made?
- Can they use the controls on a small screen and by keyboard?
- Where do they need a mentor’s explanation or a clearer instruction?

Record observations and revise the lesson before expanding the curriculum.
