public class TrafficLight {
    public static void main(String[] args) {
        String light = "green";
        for (int lap = 0; lap < 3; lap++) {
            if ("green".equals(light)) {
                System.out.println("MOVE " + lap);
            } else {
                System.out.println("WAIT " + lap);
            }
        }
    }
}
