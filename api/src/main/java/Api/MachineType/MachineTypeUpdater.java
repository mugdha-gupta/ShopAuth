package Api.MachineType;

import io.swagger.annotations.ApiModelProperty;
import org.springframework.lang.NonNull;

import java.sql.Time;

public class MachineTypeUpdater {
    @ApiModelProperty(notes = "The name displayed to users for identification")
    private String displayname;

    @ApiModelProperty(notes = "The default time a user is given for these type of machines", dataType = "java.lang.String", example = "HH:MM:SS")
    private Time time1;

    public MachineTypeUpdater(){};

    public MachineTypeUpdater(String displayname, Time time1) {
        this.setDisplayname(displayname);
        this.setTime1(time1);
    }

    public String getDisplayname() {
        return displayname;
    }

    public void setDisplayname(String displayname) {
        this.displayname = displayname;
    }

    public Time getTime1() {
        return time1;
    }

    public void setTime1(Time time1) {
        this.time1 = time1;
    }

    public MachineType toMachineType(){
        return new MachineType(displayname, time1);
    }

}
