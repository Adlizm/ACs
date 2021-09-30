package core;

import core.WildfiresCA.State;

public class GeneratorWCA {
    public static class HomogeneousWCA {
        public static WildfiresCA create() {
            int rows = RulesConfig.rows, cols = RulesConfig.rows;

            State[][] states = new State[rows][cols];

            for (int i = 0; i < rows; i++) {
                for (int j = 0; j < cols; j++) {
                    states[i][j] = new State(
                            WildfiresCA.Types.GROUND, 0, 0,
                            RulesConfig.INIT_HOMOGENOUS_FUEL,
                            RulesConfig.INIT_HOMOGENOUS_HUMIDITY);
                }
            }
            return new WildfiresCA(rows, cols, states);
        }
    }
}

