# Java for Young Robot Builders

**Sensors, Automation & Robot Geometry** — a kid-friendly, hands-on introduction to Java robotics.

Build, test, observe, fix, repeat. Every activity follows **Sense → Think → Act → Check → Correct**. Students predict a result, try a small experiment, and use evidence to improve a plan.

## Explore

- [Workshop home](index.html) and [course map](course.html).
- [Modules 1–9](course.html): commands, Java basics, sensors, geometry, motors, automation, debugging, feedback, and a delivery capstone. Each includes explanations, code, experiments, and mentor hints.
- [Geometry Bench](geometry-bench.html): coordinates, turn/drive commands, three targets, trail, hints, and a Java-style notebook.
- [Java reference](java-reference.html): 38 searchable entries about syntax, objects, collections, robot math, timing, validation, and debugging, with filters, common mistakes, lesson links, and official documentation links.
- [Example code](examples.html): eight complete Java programs with download/copy controls, expected output, and suggested experiments. Java 17-compatible; no SDK or dependencies.
- [Discover](discover.html): child, teen, and adult competition videos, credited manufacturing photographs, and a Python comparison.

All nine introductory modules are available. These are teaching prototypes, not a classroom curriculum validated by student trials. See the [course outline](COURSE_OUTLINE.md) for outcomes and a first-pilot checklist.

## Run and host

Open `index.html` in a modern browser. No build step, framework, packages, external fonts, or server is required. Core lessons, search, and benches work offline. Discover’s media and external documentation links need internet access.

Optionally, run `python -m http.server 8000` in the repository and visit `http://localhost:8000`. Copy buttons use the clipboard API; if unavailable, select the code or download its file. All lessons and reference/example content remain readable without JavaScript; filters and labs require it.

Upload the HTML files, `assets/`, and `examples/` to any static host, preserving their structure. Paths are relative and support subdirectory hosting. For GitHub Pages, choose **Settings → Pages → Deploy from a branch → main → /(root)**. GitHub supplies the published address. Repository updates do not enable hosting automatically.

## Practice labs and limits

| Module | Activity | Teaching assumptions |
| --- | --- | --- |
| 1 | Compare command order | Two fixed delivery plans |
| 2 | Traffic light and repetition | 1–10 loop passes; only green requests movement |
| 3 | Sensor calibration | Five repeatable readings; known distance 40 cm; bias, balanced noise, calibration |
| 4 | Geometry Bench | Ideal point robot; 200 × 200 cm field; 5 cm target tolerance |
| 5 | Differential drive | Constant wheel speeds; full power = 50 cm/s; 20 cm wheel spacing; top-view path |
| 6 | State machine | Manual one-second updates; WAIT → DRIVE → DONE; blockage or three drive intervals stops |
| 7 | Boundary debugging | Compare >= and > with “clear above 20 cm” |
| 8 | Bounded correction | Start x = 5 cm; goal 100 cm; 2 cm tolerance; correction capped at 20 cm; 30-step budget |
| 9 | Delivery planner | TURN/DRIVE/STOP language; 20-command limit; full syntax check before execution; boundary trace |

Java snippets use an **imaginary teaching API**, not FTC, FRC, or another SDK. `forward(distanceCm)` completes an ideal move, `turnLeft(angleDegrees)` turns in place, and `stop()` marks the routine stopped. Negative values mean reverse travel or a right turn. Browser labs use JavaScript: they do not compile or evaluate Java or arbitrary student code.

Geometry uses centimeters, x east, y north, east = 0°, and counterclockwise positive angles. Out-of-field drives are rejected. There is no footprint, collision, inertia, wheel slip, or motor lag. Sensor noise is a deterministic balanced sample for fair comparisons; real noise and finite sample means vary. Automation time advances only when stepping the lab. Feedback is an ideal calculation, not a hardware controller.

Internal math retains precision; displays round values. No accounts, analytics, saved progress, or backend. Reloading resets experiments. Real robots require their own SDK, configuration, sensing conventions, stopping behavior, and supervised trials.

## Downloadable Java programs

Each file in `examples/` supplies its own class and main method. With a JDK 17 or later:

```sh
javac examples/TrafficLight.java
java -cp examples TrafficLight
```

Replace TrafficLight with the chosen class name. `TeachingRobotMission` implements the imaginary robot as a complete desktop simulation. Other examples print calculations or traces. None control hardware. Generated `.class` files are ignored by Git.

## Validation

```sh
node --test tests/geometry.test.cjs tests/lab-models.test.cjs
python tests/check-site.py
python tests/check-java.py
```

No packages are needed. The Java check requires a JDK on PATH or `--jdk-bin` pointing to its bin directory. It compiles with `--release 17`, runs all eight examples, and compares exact output with `tests/java-expected.json`. Thirteen JavaScript tests cover geometry, calibration, wheel motion, automation stopping, feedback convergence/failure, and mission validation. Static checks verify local links, assets, anchors, copy targets, and navigation across 15 pages.

Browser checks should include search/topic combinations, no matches, clear filters, deep links, example copying/downloads, all lab normal/failure cases, reset, keyboard use, and mobile layouts. Lessons, reference, and examples remain readable with scripting disabled.

## Free reuse

This project uses the same license setup as Nerd Heaven: **MIT** for original code, Java examples, CSS, and SVG artwork; **CC BY 4.0** for original lessons and educational content. Reuse and modification, including commercial use, are permitted under those licenses. Keep the required notices and credit, and indicate changes to educational material.

See [LICENSE](LICENSE), [LICENSE-CONTENT.md](LICENSE-CONTENT.md), and [THIRD-PARTY.md](THIRD-PARTY.md). External videos, manufacturing photos, and linked documentation keep their own terms.

## Mentor rhythm and contributions

Ask for a prediction and reason, run one experiment, compare the result, change one thing, then have the learner explain the evidence. Paper sketches and a builder’s notebook help. Introduce the reference as a lookup tool, not a memorization list.

The site is plain HTML/CSS/JavaScript. Lesson files are `module-1.html` through `module-9.html`. Search content is static in `java-reference.html` and `examples.html`, enhanced by `assets/search.js`. Pure calculations live in `assets/geometry.js` and `assets/lab-models.js`; interactions are in `assets/bench.js`, `assets/sequence.js`, and `assets/labs.js`. Keep snippets and downloadable programs clearly distinguished, and rerun relevant checks when changing model behavior.
