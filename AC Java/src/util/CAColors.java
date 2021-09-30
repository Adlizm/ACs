package util;

import core.RulesConfig;
import core.WildfiresCA.Types;
import core.WildfiresCA.State;
import javafx.scene.paint.Color;
import ui.Controllers.ViewController;

public class CAColors {
    private static final Color[] fireColorPalette = new Color[]{
            Color.rgb(82,  9,   0),
            Color.rgb(226, 69,  0),
            Color.rgb(253, 142, 0),
            Color.rgb(253, 254, 88),
            Color.rgb(255, 255, 207)
    };

    private static final Color colorMaxFuel = Color.rgb(0,70,0);
    private static final Color colorMinFuel = Color.rgb(179,189,28);

    private static final Color colorMaxHumidity = Color.rgb(0,0,255);
    private static final Color colorMinHumidity = Color.rgb(220,220,255);

    private static final Color colorRoad = Color.rgb(30, 18, 18);
    private static final Color colorAshe = Color.rgb(30, 30, 30);

    public static Color getColor(State state, int typeOfView) {
        if (typeOfView == ViewController.HUMIDITY_VIEW)
            return colorMinHumidity.interpolate(colorMaxHumidity, state.humidity);

        switch (state.type){
            case Types.WATER:
                return colorMaxHumidity;
            case Types.ROAD:
                return colorRoad;
            case Types.GROUND:
                return colorMinFuel.interpolate(colorMaxFuel, state.fuel);
            case Types.ASHE:
                return colorAshe;
        }

        double x = state.time / (double) RulesConfig.FIRE_TIME;
        double scalar = RulesConfig.useFireIntensity ? state.fireIntensity : 4*(-x*x + x);
        scalar = Math.min(1, Math.max(0,scalar));

        int indexColorFire = scalar == 1 ? fireColorPalette.length - 1:
                (int) Math.floor(scalar*fireColorPalette.length);

        return fireColorPalette[indexColorFire];
    }
}
