public class SensorNotebook {
    public static void main(String[] args) {
        double[] rawCm = {41, 47, 45, 49, 43};
        double biasCm = 5;
        double sum = 0;
        for (double raw : rawCm) {
            if (!Double.isFinite(raw)) {
                throw new IllegalArgumentException("Invalid sensor reading");
            }
            sum += raw - biasCm;
        }
        if (rawCm.length == 0) {
            throw new IllegalArgumentException("Need at least one reading");
        }
        System.out.println("Mean corrected cm: " + sum / rawCm.length);
    }
}
