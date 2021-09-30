package ui.Controllers;

import core.RulesConfig;
import javafx.geometry.Insets;
import ui.MainController;


import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.scene.control.CheckBox;
import javafx.scene.control.Label;
import javafx.scene.control.Slider;
import javafx.scene.control.Spinner;
import javafx.scene.control.SpinnerValueFactory;
import javafx.scene.layout.VBox;

public class WindController  extends VBox {
    private CheckBox useWind;
    private Slider windPowerSlider;
    private Spinner<String> windDirection;

    public WindController(MainController mainControl) {
        super();
        this.setPadding(mainControl.padding);

        ObservableList<String> directions = FXCollections.observableArrayList(
                "N", "NE", "E", "SE", "S", "SW", "W", "NW");

        this.useWind = new CheckBox("Wind");
        this.useWind.setSelected(RulesConfig.useWind);

        this.windPowerSlider = new Slider(0, 1, 0.5);
        this.windPowerSlider.setShowTickMarks(true);
        this.windPowerSlider.setShowTickLabels(true);
        this.windPowerSlider.setMajorTickUnit(0.25f);
        this.windPowerSlider.setBlockIncrement(0.1f);

        this.windDirection = new Spinner<String>();
        this.windDirection.setValueFactory(
                new SpinnerValueFactory.ListSpinnerValueFactory<String>(directions));

        this.getChildren().addAll(
                this.useWind,
                new Label("Wind Power"), this.windPowerSlider,
                new Label("Wind Direction"), this.windDirection);
    }

    public void setRulesConfig() {
        char[] directionString = windDirection.getValue().toCharArray();

        boolean normalized = !(RulesConfig.useFireIntensity || RulesConfig.useVegetation);
        int direction = 0;
        switch (directionString[0]){
            case 'N': direction |= RulesConfig.WindMatrix.NORTH;
                break;
            case 'E': direction |= RulesConfig.WindMatrix.EAST;
                break;
            case 'S': direction |= RulesConfig.WindMatrix.SOUTH;
                break;
            case 'W': direction |= RulesConfig.WindMatrix.WEST;
                break;
        }
        if (directionString.length == 2){
            if (directionString[1] == 'E')
                direction |= RulesConfig.WindMatrix.EAST;
            else
                direction |= RulesConfig.WindMatrix.WEST;
        }

        RulesConfig.useWind = this.useWind.isSelected();
        RulesConfig.WindMatrix.calculateWindMatrix(direction, windPowerSlider.getValue(), normalized);
        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++)
                System.out.println(RulesConfig.WindMatrix.data[i][j]);
    }
}
