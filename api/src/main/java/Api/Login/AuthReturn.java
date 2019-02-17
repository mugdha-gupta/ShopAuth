package Api.Login;

import io.swagger.annotations.ApiModelProperty;

import java.sql.Time;

public class AuthReturn {
    @ApiModelProperty(notes = "If the user is allowed to use this machine")
    private boolean authenticated;
    @ApiModelProperty(notes = "Does the user need a witness at this moment")
    private boolean needWitness;
    @ApiModelProperty(notes = "How much time does the user have on machine")
    private Time time;

    public AuthReturn(){
    }

    public boolean isAuthenticated() {
        return authenticated;
    }

    public void setAuthenticated(boolean authenticated) {
        this.authenticated = authenticated;
    }

    public boolean isNeedWitness() {
        return needWitness;
    }

    public void setNeedWitness(boolean needWitness) {
        this.needWitness = needWitness;
    }

    public Time getTime() {
        return time;
    }

    public void setTime(Time time) {
        this.time = time;
    }

    @Override
    public String toString() {
        return "{" +
                "authenticated=" + authenticated +
                ", needWitness=" + needWitness +
                ", time=" + time +
                '}';
    }
}
