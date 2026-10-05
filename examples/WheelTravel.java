import java.util.Locale;

public class WheelTravel {
    public static void main(String[] args) {
        double ticks = 2160;
        double ticksPerMotorTurn = 360;
        double reduction = 3;
        double wheelDiameterCm = 10;
        double wheelTurns = ticks / ticksPerMotorTurn / reduction;
        double distanceCm = wheelTurns * Math.PI * wheelDiameterCm;
        System.out.printf(Locale.ROOT, "Wheel turns: %.1f%n", wheelTurns);
        System.out.printf(Locale.ROOT, "Distance: %.2f cm%n", distanceCm);
    }
}
