package ui;

import javafx.animation.AnimationTimer;
import javafx.application.Application;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.Scene;
import javafx.scene.control.ScrollPane;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.HBox;
import javafx.stage.Stage;


public class Main extends Application {
    public static final int WIDTH = 700;
    public static final int HEIGHT = 500;
    public static final int CANVAS_WIDTH = 500;
    public static final int CANVAS_HEIGHT = 500;

    @Override
    public void start(Stage primaryStage) throws Exception{
        Canvas canvas = new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        GraphicsContext ctx = canvas.getGraphicsContext2D();

        MainController mainController = new MainController();
        canvas.addEventHandler(MouseEvent.MOUSE_PRESSED, mouseEvent -> {
            mainController.setFirePoint(mouseEvent.getX(), mouseEvent.getY());
        });

        ScrollPane scrollPane = new ScrollPane();
        scrollPane.setPrefSize(200, 500);
        scrollPane.setContent(mainController);
        HBox root = new HBox(scrollPane, canvas);

        primaryStage.setTitle("AC Fires Tool");
        primaryStage.setScene(new Scene(root, WIDTH, HEIGHT));
        primaryStage.show();

        new AnimationTimer(){
            @Override
            public void handle(long now) {
                mainController.drawCA(ctx);
                if (mainController.isRun()){
                    mainController.updateCA();
                }
            }
        }.start();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
