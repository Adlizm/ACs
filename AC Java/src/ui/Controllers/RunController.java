package ui.Controllers;

import javafx.geometry.Insets;
import ui.MainController;

import javafx.scene.control.Button;
import javafx.scene.layout.HBox;

public class RunController extends HBox {
    private Button btnCreate,  btnStart, btnPause;

    public RunController(MainController mainControl){
        super();
        this.setPadding(mainControl.padding);

        this.btnCreate = new Button("Create");
        this.btnCreate.setOnMouseClicked(mouseEvent -> mainControl.createCA());
        this.btnStart = new Button("Start");
        this.btnStart.setOnMouseClicked(mouseEvent -> mainControl.startCA());
        this.btnPause = new Button("Pause");
        this.btnPause.setOnMouseClicked(mouseEvent -> mainControl.pauseCA());

        this.getChildren().addAll(this.btnCreate, this.btnPause, this.btnStart);
    }
}
