package core;

import ui.Main;
import util.CAColors;

import java.util.Random;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.paint.Color;
import javafx.scene.paint.Paint;

public class WildfiresCA {
    private static Random random = new Random();

    public static class State{
        public int type, time;
        public double fireIntensity, fuel, height, humidity;

        public State(int type, int time, double fireIntensity, double fuel, double humidity) {
            this.type = type;
            this.time = time;
            this.fireIntensity = fireIntensity;
            this.fuel = fuel;
            this.humidity = humidity;
        }
    }

    public static class Types {
        public static final int WATER = 0;
        public static final int ROAD = 1;
        public static final int GROUND = 2;
        public static final int FIRE = 3;
        public static final int ASHE = 4;
    }

    public int rows;
    public int columns;
    public State[][] states;

    public WildfiresCA(int rows, int columns, State[][] states) {
        this.rows = rows;
        this.columns = columns;
        this.states = states;
    }

    private WildfiresCA copy(){
        State[][] copyStates = new State[this.rows][this.columns];

        for(int i = 0; i < this.rows; i++){
            for(int j = 0; j < this.columns; j++){
                copyStates[i][j] =
                    new State(this.states[i][j].type, this.states[i][j].time, this.states[i][j].fireIntensity,
                              this.states[i][j].fuel, this.states[i][j].humidity);
            }
        }

        return new WildfiresCA(this.rows, this.columns, copyStates);
    }

    public void next(){
        State[][] next = new State[this.rows][this.columns];

        for (int i = 0; i < this.rows; i++)
            for (int j = 0; j < this.columns; j++)
                next[i][j] = this.nextState(i, j);

        this.states = next;
    }

    private State nextState(int i, int j){
        State now = this.states[i][j];
        now.time++;

        switch (now.type){
            case Types.WATER:
            case Types.ROAD:
                return now;

            case Types.ASHE:
                if (RulesConfig.useVegetationRecovery){
                    if (now.time == RulesConfig.delayVegetationBorn)
                        return new State(Types.GROUND, 0, 0, 0, 0);
                    return now;
                }
                return now;

            case Types.FIRE:
                if (!RulesConfig.useFireIntensity){
                    if (now.time >= RulesConfig.FIRE_TIME)
                        return new State(Types.ASHE, 0, 0, 0, 0);
                    return now;
                }

                double hasFuel = now.fuel > 0 ? 1 : -1;

                now.fireIntensity += hasFuel/RulesConfig.FIRE_TIME;
                now.fuel -= RulesConfig.INIT_HOMOGENOUS_FUEL/RulesConfig.FIRE_TIME;
                now.fuel = now.fuel > 0 ? now.fuel : 0;

                if(now.fireIntensity < 0)
                    return new State(Types.ASHE, 0, 0,0, now.humidity);
                return now;

            case Types.GROUND:
                double grow = RulesConfig.INIT_HOMOGENOUS_FUEL/RulesConfig.timeVegetationRecovery;
                if (RulesConfig.useVegetationRecovery)
                    now.fuel = now.fuel + grow >= 1 ? 1 : now.fuel + grow;

                if (RulesConfig.useInstantFire && random.nextDouble() <= RulesConfig.probInstantFire)
                    return new State(Types.FIRE, 0, 0, now.fuel, 0);

                int minRows = (i - 1) <= 0 ? 0 : -1;
                int maxRows = (i + 1) >= this.rows ? 0 : 1;
                int minColumns = (j - 1) <= 0 ? 0 : -1;
                int maxColumns = (j + 1) >= this.columns ? 0 : 1;

                double p = 0;
                for (int di = minRows; di <= maxRows; di++){
                    for (int dj = minColumns; dj <= maxColumns; dj++){
                        if (di == 0 && dj == 0)
                            break;
                        p += this.probabilityToFire(i, j, di, dj);
                    }
                }

                if (random.nextDouble() <= p)
                    return new State(Types.FIRE, 0, 0, now.fuel, 0);
                return now;
        }
        return now;
    }

    public void setFire(int row, int col) {
        this.states[row][col].type = Types.FIRE;
        this.states[row][col].fireIntensity = 0;
        this.states[row][col].time = 0;
        this.states[row][col].humidity = 0;
    }
    private double probabilityToFire(int i, int j, int di, int dj) {
        if(this.states[i + di][j + dj].type != Types.FIRE)
            return 0;

        boolean useNothing = !(RulesConfig.useFireIntensity || RulesConfig.useHumidity ||
                RulesConfig.useWind || RulesConfig.useVegetation);

        if (useNothing)
            return 1.0/8.0;

        double p = 1;
        if (RulesConfig.useFireIntensity)
            p *= this.states[i + di][j + dj].fireIntensity;
        if (RulesConfig.useVegetation)
            p *= this.states[i][j].fuel;
        if (RulesConfig.useWind)
            p *= RulesConfig.WindMatrix.data[di + 1][dj + 1];
        if (RulesConfig.useHumidity)
            p *= 1 - this.states[i][j].humidity;

        return p;
    }

    public void draw(GraphicsContext ctx, int typeOfView){
        double wh = (Main.CANVAS_WIDTH / (double) rows);

        Paint fill = Color.WHITE;
        ctx.setFill(fill);
        ctx.clearRect(0, 0, Main.CANVAS_WIDTH, Main.CANVAS_HEIGHT);

        for(int y = 0; y < this.columns; y++){
            for (int x = 0; x < this.rows; x++){
                fill = CAColors.getColor(this.states[x][y], typeOfView);
                ctx.setFill(fill);
                ctx.fillRect(x*wh, y*wh, wh, wh);
            }
        }
    }
}
