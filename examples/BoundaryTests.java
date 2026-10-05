public class BoundaryTests {
    static boolean isClear(double cm) {
        return Double.isFinite(cm) && cm > 20;
    }

    public static void main(String[] args) {
        double[] readings = {19, 20, 21, Double.NaN};
        boolean[] expected = {false, false, true, false};
        for (int i = 0; i < readings.length; i++) {
            if (isClear(readings[i]) != expected[i]) {
                throw new AssertionError("Failed at " + readings[i]);
            }
        }
        System.out.println("4 boundary/invalid-reading tests passed");
    }
}
