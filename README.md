# Java for Young Robot Builders

**Sensors, Automation & Robot Geometry** — a kid-friendly, hands-on introduction to Java robotics.

Build, test, observe, fix, repeat. Every activity follows **Sense → Think → Act → Check → Correct**. Students make predictions, run small experiments, and use evidence to improve a plan.

## Start exploring

- [Workshop home](index.html): landing page and first steps.
- [Course map](course.html): learning outcomes and the nine-module roadmap.
- [Module 1](module-1.html): a 30–45 minute lesson on commands, sequence, variables, methods, and decisions, including an interactive command-order experiment.
- [Geometry Bench](geometry-bench.html): turn and drive a simulated robot, explore coordinates, compare predictions with measurements, and reach three targets.

Module 1 and the Geometry Bench prototype are available now. Modules 2–9 are planned; their descriptions are not completed lessons. See [the detailed course outline](COURSE_OUTLINE.md).

## Run locally

Open `index.html` directly in a modern browser. No build, package installation, framework, external fonts, or network requests are required for the course itself.

For a local server, if Python is installed, run this from the repository directory:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`. This is optional; all links and assets also work from local files.

## Host it

Upload the repository’s HTML files and `assets/` directory to any static host, preserving the directory structure. All internal paths are relative, so subdirectory hosting works.

For GitHub Pages, after merging the course into the default branch, open the repository’s **Settings → Pages**, choose **Deploy from a branch**, select the default branch and **/(root)**, then save. GitHub provides the published address. This repository does not automatically deploy changes.

## Teaching model and limits

- Java snippets use an **imaginary teaching API**, not FTC, FRC, or another robot SDK. `forward(distanceCm)` completes a move before the next command; `turnLeft(angleDegrees)` changes heading in place; `stop()` ends motion. Bench notebook negative values mean reverse travel or a right turn.
- The browser activities use JavaScript. They do **not compile or run Java**, and no student code is evaluated.
- Geometry uses centimeters: x points east, y points north, 0° faces east, and positive angles turn counterclockwise. The field runs from 0 to 200 on each axis.
- The robot is an ideal point: no collision footprint, inertia, wheel slip, motor lag, or sensor noise. A drive outside the field is rejected in full. A target is reached within a 5 cm radius.
- Geometry hints use Euclidean distance and `atan2`; displayed numbers are rounded to one decimal. Internal calculations retain precision. A notebook holds up to 100 accepted commands per experiment.
- No accounts, analytics, persistence, or backend. Resetting the page starts a new experiment.
- A real robot needs its hardware SDK, tested motor/sensor configuration, and adult supervision. These snippets are conceptual teaching examples.

## Mentor rhythm

1. Ask the student to predict the result and explain why.
2. Run one small experiment.
3. Compare the result with the prediction.
4. Change one thing and try again.
5. Let the student explain what the evidence taught them.

Reading support or a mentor can help beginners. No prior Java experience is assumed. Students can use paper sketches alongside the browser.

## Project structure

```text
index.html               Landing page
course.html              Course map
module-1.html            First lesson and sequence activity
geometry-bench.html      Coordinate practice lab
assets/styles.css        Responsive shared styles
assets/geometry.js       Pure geometry calculations
assets/bench.js          Geometry Bench interaction
assets/sequence.js       Module 1 interaction
tests/geometry.test.cjs   Geometry regression tests
COURSE_OUTLINE.md         Curriculum and future bench roadmap
```

## Validate changes

With Node.js installed, run `node --test tests/geometry.test.cjs`. Tests cover cardinal movement, wraparound, reversing, boundary rejection, and target guidance. No dependencies are needed.

Manually check keyboard navigation, both sequence plans, each target mission, reset, negative movements, rejected out-of-field moves, and narrow-screen layout. Keep the static site usable without JavaScript for lesson reading; interactive activities require JavaScript.
