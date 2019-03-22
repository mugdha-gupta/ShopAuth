package Api.Auth;

import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

public class Id {
    @NotNull
    @ApiModelProperty(notes = "The email of the desired user")
    private long id;

    public Id() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Id{" +
                "id=" + id +
                '}';
    }
}
