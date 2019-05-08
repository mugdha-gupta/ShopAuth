package Api.Auth;

import io.swagger.annotations.ApiModelProperty;

public class AuthCreator {

    @ApiModelProperty(notes = "The id of the user authorized for a machine")
    private Long userId;

    @ApiModelProperty(notes = "The id of the type of the machine that the user is authorized for")
    private Long typeId;

    public AuthCreator() {
    }

    public AuthCreator(Long userId, Long typeId) {
        this.userId = userId;
        this.typeId = typeId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getTypeId() {
        return typeId;
    }

    public void setTypeId(Long typeId) {
        this.typeId = typeId;
    }
}
