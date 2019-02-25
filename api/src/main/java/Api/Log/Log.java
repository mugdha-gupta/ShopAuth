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
    private Timestamp start_time;

    @ApiModelProperty(notes = "The time the user finished using the machine", dataType = "java.lang.String", example = "YYYY-MM-DD HH:MI:SS")
    private Timestamp end_time;

    @NotNull
    @ManyToOne
    @JoinColumn(name="user", nullable=false)
    @ApiModelProperty(notes = "The id of the user who used the machine machine")
    private User user;

    @Id
    @NotNull
    @ManyToOne
    @JoinColumn(name="machine", nullable=false)
    @ApiModelProperty(notes = "The id of the machine used")
    private Machine machine;

    @NonNull
    @ApiModelProperty(notes = "The scan string of the witness")
    private String witness;

    public Log() {
    }

    public Log(Timestamp start_time, Timestamp end_time, @NotNull User user, @NotNull Machine machine, String witness) {
        this.start_time = start_time;
        this.end_time = end_time;
        this.user = user;
        this.machine = machine;
        this.witness = witness;
    }

    @Override
    public String toString() {
        return "Log{" +
                "start_time=" + start_time +
                ", end_time=" + end_time +
                ", user=" + user +
                ", machine=" + machine +
                ", witness='" + witness + '\'' +
                '}';
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
