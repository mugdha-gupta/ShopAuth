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
    @ApiModelProperty(notes = "The time the user started using the machine", dataType = "java.lang.String", example = "YYYY-MM-DD HH:MI:SS")
    private Timestamp starttime;

    @ApiModelProperty(notes = "The time the user finished using the machine", dataType = "java.lang.String", example = "YYYY-MM-DD HH:MI:SS")
    private Timestamp endtime;

    @ManyToOne
    @JoinColumn(name="user", nullable=false)
    @ApiModelProperty(notes = "The id of the user who used the machine machine")
    private User user;


    @ManyToOne
    @JoinColumn(name="machine", nullable=false)
    @ApiModelProperty(notes = "The id of the machine used")
    private Machine machine;

    @Id
    @NonNull
    @ApiModelProperty(notes = "The scan string of the witness")
    private String witness;

    public Log() {
    }

    public Log(Timestamp starttime, Timestamp endtime, @NotNull User user, @NotNull Machine machine, String witness) {
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Machine getMachine() {
        return machine;
    }

    public void setMachine(Machine machine) {
        this.machine = machine;
    }

    public String getWitness() {
        return witness;
    }

    public void setWitness(String witness) {
        this.witness = witness;
    }
}
