package ui.Controllers;

import core.RulesConfig;
import javafx.geometry.Insets;
import ui.MainController;

import javafx.scene.control.CheckBox;
import javafx.scene.control.Label;
import javafx.scene.control.Slider;
import javafx.scene.control.Spinner;
import javafx.scene.control.SpinnerValueFactory;
import javafx.scene.layout.VBox;

public class VegetationController extends VBox {
    public CheckBox useVegetation, useVegetationRecovery;
    public Slider initFuelSlider;
    Spinner<Integer> delayRecovery, timeRecovery;

    public VegetationController(MainController mainControl) {
        super();
        this.setPadding(mainControl.padding);

        this.useVegetation = new CheckBox("Vegetation");
        this.useVegetation.setSelected(RulesConfig.useVegetation);

        this.initFuelSlider = new Slider(0, 1, RulesConfig.INIT_HOMOGENOUS_FUEL);
        this.initFuelSlider.setShowTickMarks(true);
        this.initFuelSlider.setShowTickLabels(true);
        this.initFuelSlider.setMajorTickUnit(0.25f);
        this.initFuelSlider.setBlockIncrement(0.1f);

        this.useVegetationRecovery = new CheckBox("Vegetation Recovery:");
        this.delayRecovery = new Spinner<Integer>();
        this.delayRecovery.setValueFactory(
                new SpinnerValueFactory.IntegerSpinnerValueFactory(0, 100, RulesConfig.delayVegetationBorn));
        this.timeRecovery = new Spinner<Integer>();
        this.timeRecovery.setValueFactory(
                new SpinnerValueFactory.IntegerSpinnerValueFactory(0, 100, RulesConfig.timeVegetationRecovery));

        this.getChildren().addAll(
                this.useVegetation,
                new Label("Init Fuel(Homo): "), this.initFuelSlider,
                this.useVegetationRecovery,
                new Label("Delay Recovery: "), this.delayRecovery,
                new Label("Time Recovery: "), this.timeRecovery);
    }

    public void setRulesConfig() {
        RulesConfig.useVegetation =  this.useVegetation.isSelected();
        RulesConfig.useVegetationRecovery =  this.useVegetationRecovery.isSelected();
        RulesConfig.INIT_HOMOGENOUS_FUEL = this.initFuelSlider.getValue();
        RulesConfig.delayVegetationBorn = this.delayRecovery.getValue();
        RulesConfig.timeVegetationRecovery = this.timeRecovery.getValue();
    }
}
