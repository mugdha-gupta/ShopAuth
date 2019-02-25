package Api.Auth;

import Api.MachineType.MachineType;
import Api.User.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
public class Auth {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @ApiModelProperty(notes = "The auto generated id of the auth")
    @JsonIgnore
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name="user", nullable=false)
    @ApiModelProperty(notes = "The id of the type of the machine")
    private User user;

    @NotNull
    @ManyToOne
    @JoinColumn(name="type", nullable=false)
    @ApiModelProperty(notes = "The id of the type of the machine")
    private MachineType type;

    public Auth() {  }

    public Auth(@NotNull User user, @NotNull MachineType type) {
        this.user = user;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public MachineType getType() {
        return type;
    }

    public void setType(MachineType type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "Auth{" +
                "user=" + user +
                ", type=" + type +
                '}';
    }


}
