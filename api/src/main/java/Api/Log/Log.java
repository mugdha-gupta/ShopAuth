package Api.Log;

import Api.Machine.Machine;
import Api.User.User;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.lang.NonNull;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;

@Entity
@IdClass(LogPrimaryKey.class)
public class Log {
    @Id
    @ApiModelProperty(notes = "The time the user started using the machine", dataType = "java.lang.String", example = "YYYY-MM-DDTHH:MI:SS")
    private Timestamp starttime;

    @ApiModelProperty(notes = "The time the user finished using the machine", dataType = "java.lang.String", example = "YYYY-MM-DDTHH:MI:SS")
    private Timestamp endtime;

    @ApiModelProperty(notes = "The name of the user who used the machine")
    private String user;

    @ApiModelProperty(notes = "The name of the machine used")
    private String machine;

    @Id
    @NonNull
    @ApiModelProperty(notes = "The name or scan string of the witness")
    private String witness;

    public Log() {
    }

    public Log(Timestamp starttime, Timestamp endtime, String user, String machine, String witness) {
        this.starttime = starttime;
        this.endtime = endtime;
        this.user = user;
        this.machine = machine;
        this.witness = witness;
    }

    @Override
    public String toString() {
        return "Log{" +
                "starttime=" + starttime +
                ", endtime=" + endtime +
                ", user=" + user +
                ", machine=" + machine +
                ", witness='" + witness + '\'' +
                '}';
    }

    public Timestamp getStarttime() {
        return starttime;
    }

    public void setStarttime(Timestamp starttime) {
        this.starttime = starttime;
    }

    public Timestamp getEndtime() {
        return endtime;
    }

    public void setEndtime(Timestamp endtime) {
        this.endtime = endtime;
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
