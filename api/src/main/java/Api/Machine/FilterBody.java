package Api.Machine;

import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

public class FilterBody {
    @NotNull
    @ApiModelProperty(notes = "The type of machines desired")
    private Long typeId;

    public FilterBody(){
    }

    public FilterBody(Long typeId) {
        this.typeId = typeId;
    }

    public Long getTypeId() {
        return typeId;
    }

    public void setTypeId(Long typeId) {
        this.typeId = typeId;
    }

    @Override
    public String toString() {
        return "{" +
                "typeId=" + typeId +
                '}';
    }
}
