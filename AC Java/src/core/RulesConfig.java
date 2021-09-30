package core;

public class RulesConfig {
    public static int iterations = 100;
    public static int rows = 100;

    public static double INIT_HOMOGENOUS_FUEL = 1.0;
    public static double INIT_HOMOGENOUS_HUMIDITY = 0.5;

    public static boolean useHumidity = false;
    public static boolean useVegetation = false;

    public static boolean useFireIntensity = false;
    public static int FIRE_TIME = 5;

    public static boolean useInstantFire = false;
    public static double probInstantFire = 0.001;

    public static boolean useVegetationRecovery = false;
    public static int delayVegetationBorn = 5;
    public static int timeVegetationRecovery = 5;

    public static boolean useWind = false;
    public static class WindMatrix {
        public static double[][] data = new double[3][3];

        public static final int NORTH = 1;
        public static final int SOUTH = 2;
        public static final int WEST = 4;
        public static final int EAST = 8;

        public static void calculateWindMatrix(int windDirection, double force, boolean normalized) {
            double windX = 0;
            double windY = 0;
            if ((windDirection & EAST) != 0)
                windX = 1;
            else if ((windDirection & WEST) != 0)
                windX = -1;
            if ((windDirection & NORTH) != 0)
                windX = 1;
            else if ((windDirection & SOUTH) != 0)
                windX = -1;

            double length = Math.sqrt(windX*windX + windY*windY);
            if (length == 0)
                return;

            windX /= length;
            windY /= length;

            double normalizerDirect = normalized ? 0.25 * force : force;
            double normalizerDispersive = normalized ? 0.125 * (1 - force) : 0.5 * (1 - force);

            for(int x = -1; x <= 1; x++){
                for(int y = -1; y <= 1; y++){
                    length = Math.sqrt(x*x + y*y);
                    if(length != 0){
                        double vecX = x / length;
                        double vecY = y / length;

                        double forceInDirection = (windX*vecX + windY*vecY + 1) / 2;
                        data[y + 1][x + 1] =  forceInDirection * normalizerDirect + normalizerDispersive;
                    }else{
                        data[y + 1][x + 1] = 0;
                    }
                }
            }
        }
    }

}
