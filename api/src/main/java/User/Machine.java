package User;

import javax.persistence.*;

@Entity
public class Machine {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne
    @JoinColumn(name="type", nullable=false)
    private Machine_type type;
    private String displayname;

    public Machine() {  }

    public Machine(String displayname, Machine_type type) {
        this.setDisplayname(displayname);
        this.setType(type);
    }

    public Machine(String displayname) {
        this.setDisplayname(displayname);
    }

    public Machine(int id, String displayname, Machine_type type) {
        this.setId(id);
        this.setDisplayname(displayname);
        this.setType(type);
    }

    public Machine(int id, String displayname) {
        this.setId(id);
        this.setDisplayname(displayname);
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDisplayname() {
        return displayname;
    }

    public void setDisplayname(String displayname) {
        this.displayname = displayname;
    }

    public Machine_type getType() {
        return type;
    }

    public void setType(Machine_type type) {
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
        return id;
    }

}
