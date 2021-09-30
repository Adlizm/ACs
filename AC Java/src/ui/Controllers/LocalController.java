package ui.Controllers;

import core.RulesConfig;
import javafx.geometry.Insets;
import ui.MainController;

import javafx.scene.control.CheckBox;
import javafx.scene.control.Label;
import javafx.scene.control.Slider;
import javafx.scene.layout.VBox;

public class LocalController  extends VBox {
    private Slider initHumiditySlider, initAltitudeSlider;
    private CheckBox useHumidity, useAltitude;

    public LocalController(MainController mainControl) {
        super();
        this.setPadding(mainControl.padding);

        this.useHumidity = new CheckBox("Humidity");
        this.useHumidity.setSelected(RulesConfig.useHumidity);

        this.initHumiditySlider = new Slider(0, 1, RulesConfig.INIT_HOMOGENOUS_HUMIDITY);
        this.initHumiditySlider.setShowTickMarks(true);
        this.initHumiditySlider.setShowTickLabels(true);
        this.initHumiditySlider.setMajorTickUnit(0.25f);
        this.initHumiditySlider.setBlockIncrement(0.1f);

        this.getChildren().addAll(
                this.useHumidity,
                new Label("Init Humidity(Homo): "), this.initHumiditySlider);
    }

    public void setRulesConfig() {
        RulesConfig.useHumidity = this.useHumidity.isSelected();
        RulesConfig.INIT_HOMOGENOUS_HUMIDITY = this.initHumiditySlider.getValue();
    }
}
