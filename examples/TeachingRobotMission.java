import java.util.Locale;

public class TeachingRobotMission {
    static class TeachingRobot {
        private double xCm = 40;
        private double yCm = 40;
        private double headingDeg = 0;
        private boolean stopped = true;

        void forward(double distanceCm) {
            if (!Double.isFinite(distanceCm) || Math.abs(distanceCm) > 200) {
                throw new IllegalArgumentException("Distance outside teaching limit");
            }
            double radians = Math.toRadians(headingDeg);
            double nextX = xCm + distanceCm * Math.cos(radians);
            double nextY = yCm + distanceCm * Math.sin(radians);
            if (nextX < -1e-9 || nextX > 200 + 1e-9
                    || nextY < -1e-9 || nextY > 200 + 1e-9) {
                throw new IllegalArgumentException("Move leaves the field");
            }
            xCm = nextX;
            yCm = nextY;
            stopped = false;
        }

        void turnLeft(double degrees) {
            if (!Double.isFinite(degrees) || Math.abs(degrees) > 360) {
                throw new IllegalArgumentException("Turn outside teaching limit");
            }
            headingDeg = ((headingDeg + degrees) % 360 + 360) % 360;
        }

        void stop() { stopped = true; }
    }

    public static void main(String[] args) {
        TeachingRobot robot = new TeachingRobot();
        robot.forward(100);
        robot.turnLeft(90);
        robot.forward(80);
        robot.stop();
        double errorCm = Math.hypot(140 - robot.xCm, 120 - robot.yCm);
        boolean delivered = robot.stopped && errorCm <= 5;
        System.out.printf(Locale.ROOT, "Final pose: (%.1f, %.1f) cm%n", robot.xCm, robot.yCm);
        System.out.println("Delivered and stopped: " + delivered);
        if (!delivered) throw new AssertionError("Delivery missed");
    }
}
