package Api.User;

import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

public class SearchUserBody {
    @NotNull
    @ApiModelProperty(notes = "The email of the desired user")
    private String email;

    public SearchUserBody(){
    }

    public SearchUserBody(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "{" +
                "email='" + email + "\'" +
                '}';
    }
}
