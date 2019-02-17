package Api.MachineType;

import io.swagger.annotations.ApiModelProperty;

import javax.persistence.*;
import java.sql.Time;

@Entity
public class MachineType {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @ApiModelProperty(notes = "The auto generated id of the machine type")
    private Long id;

    @ApiModelProperty(notes = "The name displayed to users for identification")
    private String displayname;

    @ApiModelProperty(notes = "The default time a user is given for these type of machines")
    private Time time1;

    public MachineType(){};

    public MachineType(String displayname, Time time1) {
        this.setDisplayname(displayname);
        this.setTime1(time1);
    }

    public MachineType(Long id, String displayname, Time time1) {
        this.setId(id);
        this.setDisplayname(displayname);
        this.setTime1(time1);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDisplayname() {
        return displayname;
    }

    public void setDisplayname(String displayname) {
        this.displayname = displayname;
    }

    public Time getTime1() {
        return time1;
    }

    public void setTime1(Time time1) {
        this.time1 = time1;
    }

    @Override
    public String toString() {
        return "Type{" +
                "id=" + id +
                ", displayname='" + displayname + '\'' +
                ", time1='" + time1.toString() + '\'' +
                '}';
    }
}
