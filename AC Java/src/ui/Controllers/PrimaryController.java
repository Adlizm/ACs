package ui.Controllers;

import core.RulesConfig;
import javafx.geometry.Insets;
import javafx.scene.control.CheckBox;
import ui.MainController;

import javafx.scene.control.Label;
import javafx.scene.control.Spinner;
import javafx.scene.control.SpinnerValueFactory;
import javafx.scene.layout.VBox;

public class PrimaryController  extends VBox {
    private Spinner<Integer> rowsSpinner, iterationsSpinner;

    public PrimaryController(MainController mainControl) {
        super();
        this.setPadding(mainControl.padding);;

        this.rowsSpinner = new Spinner<Integer>();
        this.rowsSpinner.setValueFactory(
                new SpinnerValueFactory.IntegerSpinnerValueFactory(0, 500, RulesConfig.rows));

        this.iterationsSpinner = new Spinner<Integer>();
        this.iterationsSpinner.setValueFactory(
                new SpinnerValueFactory.IntegerSpinnerValueFactory(0, 500, RulesConfig.iterations));

        this.getChildren().addAll(
                new Label("Rows: "), this.rowsSpinner,
                new Label("Iterations: "), this.iterationsSpinner);
    }

    public void setRulesConfig() {
        RulesConfig.rows = this.rowsSpinner.getValue();
        RulesConfig.iterations = this.iterationsSpinner.getValue();
    }
}
