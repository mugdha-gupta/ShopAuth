package Api.Login;

import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

public class AdminBody {
    @NotNull
    @ApiModelProperty(notes = "The bool value representing if the admin is present or not")
    private Boolean adminPresent;

    public AdminBody() {}

    public AdminBody(@NotNull Boolean adminPresent) {
        this.adminPresent = adminPresent;
    }

    public Boolean getAdminPresent() {
        return adminPresent;
    }

    public void setAdminPresent(Boolean adminPresent) {
        this.adminPresent = adminPresent;
    }

    @Override
    public String toString() {
        return "AdminBody{" +
                "adminPresent=" + adminPresent +
                '}';
    }
}
