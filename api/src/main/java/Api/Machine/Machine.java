package Api.Machine;

import Api.MachineType.MachineType;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
public class Machine {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @ApiModelProperty(notes = "The auto generated id of the machine")
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name="type")
    @ApiModelProperty(notes = "The id of the type of the machine")
    private MachineType type;

    @NotNull
    @ApiModelProperty(notes = "The name displayed to users for identification")
    private String displayname;

    public Machine() {  }

    public Machine(String displayname, MachineType type) {
        this.setDisplayname(displayname);
        this.setType(type);
    }

    public Machine(String displayname) {
        this.setDisplayname(displayname);
    }

    public Machine(Long id, String displayname, MachineType type) {
        this.setId(id);
        this.setDisplayname(displayname);
        this.setType(type);
    }

    public Machine(Long id, String displayname) {
        this.setId(id);
        this.setDisplayname(displayname);
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

    public MachineType getType() {
        return type;
    }

    public void setType(MachineType type) {
        this.type = type;
    }

    @Override
    public String toString() {
        if(type == null){
            return "Machine{" +
                    "id=" + id +
                    ", displayname='" + displayname + '\'' +
                    ", type='null\'" +
                    '}';
        }
        return "Machine{" +
                "id=" + id +
                ", displayname='" + displayname + '\'' +
                ", type='" + type.toString() + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) return false;
        if (!(obj instanceof Machine))
            return false;
        return this.getId() == ((Machine) obj).getId();
    }

    @Override
    public int hashCode() {
        return id.intValue();
    }

}
