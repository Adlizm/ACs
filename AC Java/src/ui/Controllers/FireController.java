package ui.Controllers;

import core.RulesConfig;
import ui.MainController;

import javafx.scene.control.CheckBox;
import javafx.scene.control.Label;
import javafx.scene.control.Slider;
import javafx.scene.control.Spinner;
import javafx.scene.control.SpinnerValueFactory;
import javafx.scene.layout.VBox;

public class FireController  extends VBox {
    private Spinner<Integer> fireMeanTime;
    private Slider instantFireSlider;
    private CheckBox useFireIntensity, useInstantFire;

    public FireController(MainController mainControl) {
        super();
        this.setPadding(mainControl.padding);

        this.useFireIntensity = new CheckBox("Fire Intensity");
        this.useFireIntensity.setSelected(RulesConfig.useFireIntensity);

        this.fireMeanTime = new Spinner<Integer>();
        this.fireMeanTime.setValueFactory(
                new SpinnerValueFactory.IntegerSpinnerValueFactory(0, 100, RulesConfig.FIRE_TIME));

        this.useInstantFire = new CheckBox("Instant Fire");
        this.useInstantFire.setSelected(RulesConfig.useInstantFire);

        this.instantFireSlider = new Slider(0, 1, RulesConfig.probInstantFire);
        this.instantFireSlider.setShowTickMarks(true);
        this.instantFireSlider.setShowTickLabels(true);
        this.instantFireSlider.setMajorTickUnit(0.25f);
        this.instantFireSlider.setBlockIncrement(0.1f);


        this.getChildren().addAll(
                this.useFireIntensity,
                this.useInstantFire,
                new Label("P. Instant Fire: "), this.instantFireSlider,
                new Label("Fire Time: "), this.fireMeanTime);
    }

    public void setRulesConfig() {
        RulesConfig.useInstantFire = this.useInstantFire.isSelected();
        RulesConfig.useFireIntensity = this.useFireIntensity.isSelected();
        RulesConfig.probInstantFire = this.instantFireSlider.getValue();
        RulesConfig.FIRE_TIME = this.fireMeanTime.getValue();
    }
}
