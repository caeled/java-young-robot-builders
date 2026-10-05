import java.util.Locale;

public class BoundedCorrection {
    public static void main(String[] args) {
        double positionCm = 5;
        double goalCm = 100;
        double gain = 0.5;
        int steps = 0;
        while (Math.abs(goalCm - positionCm) > 2 && steps < 30) {
            double requested = gain * (goalCm - positionCm);
            double correction = Math.max(-20, Math.min(20, requested));
            positionCm += correction;
            steps++;
        }
        boolean reached = Math.abs(goalCm - positionCm) <= 2;
        System.out.println("Reached: " + reached);
        System.out.println("Steps: " + steps);
        System.out.printf(Locale.ROOT, "Position: %.3f cm%n", positionCm);
    }
}
