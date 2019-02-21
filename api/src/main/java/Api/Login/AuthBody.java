package Api.Login;

import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

public class AuthBody {
    @NotNull
    @ApiModelProperty(notes = "The string generated by user scanning comet card")
    private String scan_string;
    @NotNull
    @ApiModelProperty(notes = "The auto generated id of a machine")
    private Long machine_id;

    public AuthBody(){
    }

    public AuthBody(String scan_string, Long machine_id) {
        this.scan_string = scan_string;
        this.machine_id = machine_id;
    }

    public String getScan_string() {
        return scan_string;
    }

    public void setScan_string(String scan_string) {
        this.scan_string = scan_string;
    }

    public Long getMachine_id() {
        return machine_id;
    }

    public void setMachine_id(Long machine_id) {
        this.machine_id = machine_id;
    }

    @Override
    public String toString() {
        return "{" +
                "scan_string='" + scan_string + "\'" +
                ", machine_id=" + machine_id +
                '}';
    }
}
