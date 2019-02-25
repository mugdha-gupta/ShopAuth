package Api.Log;

import io.swagger.annotations.ApiModelProperty;
import org.springframework.lang.NonNull;

import java.sql.Timestamp;

public class LogCreator {
    @NonNull
    @ApiModelProperty(notes = "The time the user started using the machine", dataType = "java.lang.String", example = "YYYY-MM-DD HH:MI:SS")
    private Timestamp start_time;

    @ApiModelProperty(notes = "The time the user finished using the machine", dataType = "java.lang.String", example = "YYYY-MM-DD HH:MI:SS")
    private Timestamp end_time;

    @NonNull
    @ApiModelProperty(notes = "The id of the user who used the machine machine")
    private Long user;

    @NonNull
    @ApiModelProperty(notes = "The id of the machine used")
    private Long machine;

    @ApiModelProperty(notes = "The scan string of the witness")
    private String witness;

    public LogCreator() {
    }

    public LogCreator(Timestamp start_time, Timestamp end_time, Long user, Long machine, String witness) {
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

    public Long getUser() {
        return user;
    }

    public void setUser(Long user) {
        this.user = user;
    }

    public Long getMachine() {
        return machine;
    }

    public void setMachine(Long machine) {
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
