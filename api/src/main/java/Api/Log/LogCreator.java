package Api.Log;

import io.swagger.annotations.ApiModelProperty;
import org.springframework.lang.NonNull;

import java.sql.Timestamp;

public class LogCreator {
    @NonNull
    @ApiModelProperty(notes = "The time the user started using the machine", dataType = "java.lang.String", example = "YYYY-MM-DDTHH:MI:SS")
    private Timestamp start_time;

    @ApiModelProperty(notes = "The time the user finished using the machine", dataType = "java.lang.String", example = "YYYY-MM-DDTHH:MI:SS")
    private Timestamp end_time;

    @NonNull
    @ApiModelProperty(notes = "The id of the user who used the machine")
    private String user;

    @NonNull
    @ApiModelProperty(notes = "The id of the machine used")
    private String machine;

    @ApiModelProperty(notes = "The scan string or name of the witness")
    private String witness;

    public LogCreator() {
    }

    public LogCreator(Timestamp start_time, Timestamp end_time, String user, String machine, String witness) {
        this.start_time = start_time;
        this.end_time = end_time;
        this.user = user;
        this.machine = machine;
        this.witness = witness;
    }

    public Timestamp getStart_time() {
        return start_time;
    }

    public void setStart_time(Timestamp start_time) {
        this.start_time = start_time;
    }

    public Timestamp getEnd_time() {
        return end_time;
    }

    public void setEnd_time(Timestamp end_time) {
        this.end_time = end_time;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getMachine() {
        return machine;
    }

    public void setMachine(String machine) {
        this.machine = machine;
    }

    public String getWitness() {
        if(witness==null){
            return "null";
        }
        return witness;
    }

    public void setWitness(String witness) {
        this.witness = witness;
    }
}
