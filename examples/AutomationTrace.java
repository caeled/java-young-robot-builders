public class AutomationTrace {
    enum State { WAIT, DRIVE, DONE }

    public static void main(String[] args) {
        boolean[] pathClear = {false, true, true, true, true, true};
        State state = State.WAIT;
        int driveSteps = 0;
        for (boolean clear : pathClear) {
            switch (state) {
                case WAIT:
                    if (clear) state = State.DRIVE;
                    break;
                case DRIVE:
                    driveSteps++;
                    if (!clear || driveSteps >= 3) state = State.DONE;
                    break;
                case DONE:
                    break;
            }
            boolean motorOn = state == State.DRIVE;
            System.out.println(state + ": motor=" + motorOn);
        }
    }
}
