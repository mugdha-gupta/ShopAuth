package User;

import org.springframework.beans.factory.annotation.Value;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @NotNull
    @Column(name = "scan_string", unique=true)
    private String scanString;
    @NotNull
    private String name;
    @NotNull
    private String email;
    @Value("0")
    private int admin_level;

    public User() {  }

    public User(String scanString, String name, String email) {
        this.setScanString(scanString);
        this.setEmail(email);
        this.setName(name);
        this.setAdmin_level(0);
    }

    public User(int id, String scanString, String name, String email) {
        this.setId(id);
        this.setScanString(scanString);
        this.setEmail(email);
        this.setName(name);
        this.setAdmin_level(0);
    }

    public User(String scanString, String name, String email, int admin_level) {
        this.setScanString(scanString);
        this.setEmail(email);
        this.setName(name);
        this.setAdmin_level(admin_level);
    }

    public User(int id, String scanString, String name, String email, int admin_level) {
        this.setId(id);
        this.setScanString(scanString);
        this.setEmail(email);
        this.setName(name);
        this.setAdmin_level(admin_level);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getScanString() {
        return scanString;
    }

    public void setScanString(String scanString) {
        this.scanString = scanString;
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

    public int getAdmin_level() {
        return admin_level;
    }

    public void setAdmin_level(int admin_level) {
        this.admin_level = admin_level;
    }


    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", scanString='" + scanString + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", admin_level='" + admin_level + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) return false;
        if (!(obj instanceof User))
            return false;
        return this.getId() == ((Machine) obj).getId();
    }

    @Override
    public int hashCode() {
        return id;
    }
}
