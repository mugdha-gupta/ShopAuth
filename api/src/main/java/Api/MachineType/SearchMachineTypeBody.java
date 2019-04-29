package Api.MachineType;

import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

public class SearchMachineTypeBody {
    @NotNull
    @ApiModelProperty(notes = "The name of a machine type to search for")
    private String name;

    public SearchMachineTypeBody(){
    }

    public SearchMachineTypeBody(String name) {
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
