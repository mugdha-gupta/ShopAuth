package User;

import javax.persistence.*;
import java.sql.Time;
import java.util.Set;

@Entity
public class Machine_type {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String displayname;
    private Time time1;

    @OneToMany(mappedBy = "type")
    private Set<Machine> machineSet;

    public Machine_type(){};

    public Machine_type(String displayname, Time time1) {
        this.setDisplayname(displayname);
        this.setTime1(time1);
    }

    public Machine_type(int id, String displayname, Time time1) {
        this.setId(id);
        this.setDisplayname(displayname);
        this.setTime1(time1);
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
