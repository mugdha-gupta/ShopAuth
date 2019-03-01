package Api.Auth;

public class AuthCreator {
    private Long userId;
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
