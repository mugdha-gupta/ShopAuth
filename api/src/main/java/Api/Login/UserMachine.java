package Api.Login;

import Api.Machine.Machine;
import Api.User.User;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

public class UserMachine {
    @NotNull
    @ApiModelProperty(notes = "The user using the machine")
    private User user;

    @NotNull
    @ApiModelProperty(notes = "The machine being used")
    private Machine machine;

    public UserMachine(@NotNull User user, @NotNull Machine machine) {
        this.user = user;
        this.machine = machine;
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

    @Override
    public String toString() {
        return "UserMachine{" +
                "user=" + user +
                ", machine=" + machine +
                '}';
    }
}
