package Api.Machine;

import io.swagger.annotations.ApiModelProperty;
import org.springframework.lang.NonNull;

public class MachineCreator {
    @ApiModelProperty(notes = "The id of the type of the machine")
    private Long type;

    @NonNull
    @ApiModelProperty(notes = "The name displayed to users for identification")
    private String displayname;

    public MachineCreator() {  }

    public MachineCreator(String displayname, Long type) {
        this.setDisplayname(displayname);
        this.setType(type);
    }

    public MachineCreator(String displayname) {
        this.setDisplayname(displayname);
    }


    public String getDisplayname() {
        return displayname;
    }

    public void setDisplayname(String displayname) {
        this.displayname = displayname;
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }
}
