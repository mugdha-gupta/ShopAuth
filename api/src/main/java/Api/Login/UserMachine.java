package Api.Login;

import Api.Machine.Machine;
import Api.User.User;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.lang.NonNull;

import javax.validation.constraints.NotNull;
import java.sql.Timestamp;

public class UserMachine {
    @NotNull
    @ApiModelProperty(notes = "The user using the machine")
    private User user;

    @NotNull
    @ApiModelProperty(notes = "The machine being used")
    private Machine machine;

    @NotNull
    @ApiModelProperty(notes = "The time the user started using the machine", dataType = "java.lang.String", example = "YYYY-MM-DDTHH:MI:SS")
    private Timestamp start_time;

    public UserMachine(@NotNull User user, @NotNull Machine machine) {
        this.user = user;
        this.machine = machine;
        this.start_time = new Timestamp(System.currentTimeMillis());
    }

    public UserMachine() {
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

    public Timestamp getStart_time() {
        return start_time;
    }

    public void setStart_time(Timestamp start_time) {
        this.start_time = start_time;
    }

    @Override
    public String toString() {
        return "UserMachine{" +
                "user=" + user +
                ", machine=" + machine +
                '}';
    }
}
