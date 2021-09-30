package ui.Controllers;

import javafx.geometry.Insets;
import ui.MainController;

import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.scene.layout.HBox;

public class ViewController extends VBox {
    public static final int FIRE_VIEW = 0;
    public static final int HUMIDITY_VIEW = 1;

    private Button btnFire, btnHumidity;
    private int viewSelected;

    public ViewController(MainController mainControl) {
        super();
        this.setPadding(mainControl.padding);

        this.btnFire = new Button("Fires");
        this.btnFire.setOnMouseClicked(mouseEvent -> this.viewSelected = FIRE_VIEW);
        this.btnHumidity = new Button("Humidity");
        this.btnHumidity.setOnMouseClicked(mouseEvent -> this.viewSelected = HUMIDITY_VIEW);

        this.viewSelected = FIRE_VIEW;
        this.getChildren().addAll(new Label("View CA"),
                new HBox(this.btnFire, this.btnHumidity));
    }

    public int getTypeView(){ return this.viewSelected; }
}
