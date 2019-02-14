package User;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String scan_string;
    private String name;
    private String email;

    public User() {  }

    public User(String scan_string, String name, String email) {
        this.setScan_string(scan_string);
        this.setEmail(email);
        this.setName(name);
    }

    public User(int id, String scan_string, String name, String email) {
        this.setId(id);
        this.setScan_string(scan_string);
        this.setEmail(email);
        this.setName(name);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getScan_string() {
        return scan_string;
    }

    public void setScan_string(String scan_string) {
        this.scan_string = scan_string;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", scan_string='" + scan_string + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
