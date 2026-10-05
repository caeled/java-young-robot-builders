import java.util.Locale;

public class GeometryRoute {
    public static void main(String[] args) {
        double dx = 140 - 40;
        double dy = 120 - 40;
        double distanceCm = Math.hypot(dx, dy);
        double headingDeg = Math.toDegrees(Math.atan2(dy, dx));
        System.out.printf(Locale.ROOT, "Distance: %.2f cm%n", distanceCm);
        System.out.printf(Locale.ROOT, "Heading: %.2f degrees%n", headingDeg);
    }
}
