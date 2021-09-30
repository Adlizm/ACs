package data;

import core.RulesConfig;
import core.WildfiresCA;
import core.WildfiresCA.State;

import java.io.File;
import java.io.FileOutputStream;

public class ExportWCATransitions {
    private static File fileExport;
    private static FileOutputStream fos;
    private static final int TOTAL_BYTES_CONFIG = 4*5 + (3 + 9)*8 + 5;

    public static void exportInitialConfig(String exportFile, WildfiresCA ca) {
        fileExport = new File(exportFile);

        ByteBuffer bb = new ByteBuffer(TOTAL_BYTES_CONFIG);
        bb.put(RulesConfig.iterations);
        bb.put(RulesConfig.rows);
        bb.put(RulesConfig.FIRE_TIME);
        bb.put(RulesConfig.delayVegetationBorn);
        bb.put(RulesConfig.timeVegetationRecovery);

        bb.put(RulesConfig.INIT_HOMOGENOUS_FUEL);
        bb.put(RulesConfig.INIT_HOMOGENOUS_HUMIDITY);
        bb.put(RulesConfig.probInstantFire);
        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++)
                bb.put(RulesConfig.WindMatrix.data[i][j]);

        bb.put(RulesConfig.useHumidity);
        bb.put(RulesConfig.useVegetation);
        bb.put(RulesConfig.useFireIntensity);
        bb.put(RulesConfig.useInstantFire);
        bb.put(RulesConfig.useVegetationRecovery);

        try {
            fos = new FileOutputStream(fileExport);
            fos.write(bb.getBytes(), 0, TOTAL_BYTES_CONFIG);
        }catch (Exception e){
            System.out.println("Error on export CA");
        }
        exportNextTransition(ca);
    }

    public static void exportNextTransition(WildfiresCA ca) {
        int totalBytesCA = 2 * 4 * RulesConfig.rows;
        totalBytesCA += (RulesConfig.useFireIntensity ? 8*RulesConfig.rows : 0);
        totalBytesCA += (RulesConfig.useVegetation ? 8*RulesConfig.rows : 0);
        totalBytesCA += (RulesConfig.useHumidity ? 8*RulesConfig.rows : 0);

        ByteBuffer bb = new ByteBuffer(totalBytesCA);
        State state;
        for (int i = 0; i < RulesConfig.rows; i++){
            bb.reset();
            for (int j = 0; j < RulesConfig.rows; j++){
                state = ca.states[i][j];
                bb.put(state.type);
                bb.put(state.time);
                if (RulesConfig.useFireIntensity)
                    bb.put(state.fireIntensity);
                if (RulesConfig.useHumidity)
                    bb.put(state.humidity);
                if (RulesConfig.useVegetation)
                    bb.put(state.fuel);
            }
            try {
                if (fos != null)
                    fos.write(bb.getBytes(), 0, totalBytesCA);
            }catch (Exception e){
                System.out.println("Error on export CA");
                return;
            }
        }

    }

    public static void finaliseExports(){
        try {
            if (fos != null)
                fos.close();
        }catch (Exception e){
            System.out.println("Error to finalise exports of CA");
        }
    }
}
