package Api.Machine;

import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

public class SearchMachineBody {
    @NotNull
    @ApiModelProperty(notes = "The name of a machine")
    private String name;

    public SearchMachineBody(){
    }

    public SearchMachineBody(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "{" +
                "name='" + name + "\'" +
                '}';
    }
}
