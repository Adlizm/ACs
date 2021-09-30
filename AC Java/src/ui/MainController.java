package ui;

import core.GeneratorWCA;
import core.RulesConfig;
import core.WildfiresCA;
import data.ExportWCATransitions;

import javafx.geometry.Insets;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.layout.VBox;
import ui.Controllers.*;


public class MainController extends VBox {
    public Insets padding = new Insets(15, 0, 5, 15);
    private String exportFile;
    private WildfiresCA CA;

    private boolean run = false;
    private int currentIteration = 0, samples = 0;

    private PrimaryController primaryControl;
    private WindController windControl;
    private LocalController localControl;
    private FireController fireControl;
    private VegetationController vegetationControl;
    private ViewController viewControl;
    private RunController runControl;

    public MainController(){
        super();

        this.primaryControl = new PrimaryController(this);
        this.windControl = new WindController(this);
        this.localControl = new LocalController(this);
        this.fireControl = new FireController(this);
        this.vegetationControl = new VegetationController(this);
        this.viewControl = new ViewController(this);
        this.runControl = new RunController(this);

        this.createCA();
        this.getChildren().addAll(this.runControl, this.viewControl, this.primaryControl, this.windControl,
                this.localControl, this.fireControl, this.vegetationControl);
    }

    private void setRulesConfig(){
        this.primaryControl.setRulesConfig();
        this.windControl.setRulesConfig();
        this.localControl.setRulesConfig();
        this.fireControl.setRulesConfig();
        this.vegetationControl.setRulesConfig();
    }

    public void createCA(){
        ExportWCATransitions.finaliseExports();

        this.setRulesConfig();
        this.CA = GeneratorWCA.HomogeneousWCA.create();

        this.samples++;
        this.currentIteration = 0;
        this.exportFile = "exportCA_sample" + samples + ".txt";

        ExportWCATransitions.exportInitialConfig(exportFile, CA);
    }
    public void startCA(){
        if(!this.run){
            this.run = true;
            this.currentIteration = 0;
        }
    }
    public void pauseCA(){ run = false; }

    public void drawCA(GraphicsContext ctx) {
        CA.draw(ctx, this.viewControl.getTypeView());
    }
    public void updateCA() {
        if (!run)
            return;
        if (currentIteration > RulesConfig.iterations) {
            run = false;
        }else{
            currentIteration++;
            CA.next();
            ExportWCATransitions.exportNextTransition(CA);
        }
    }

    public boolean isRun() { return run; }
    public void setFirePoint(double x, double y) {
        double wh = Main.CANVAS_WIDTH / (double) RulesConfig.rows;
        int row = (int) (x/wh);
        int col = (int) (y/wh);
        if(!run)
            this.CA.setFire(row, col);
    }
}
