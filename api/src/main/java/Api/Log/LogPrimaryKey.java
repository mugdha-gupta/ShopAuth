package Api.Log;

import java.io.Serializable;
import java.sql.Timestamp;

public class LogPrimaryKey implements Serializable {
    protected String witness;
    protected Timestamp starttime;

    public LogPrimaryKey() {
    }

    public LogPrimaryKey(String witness, Timestamp starttime) {

        this.witness = witness;
        this.starttime = starttime;
    }

    public String getWitness() {
        return witness;
    }

    public void setWitness(String witness) {
        this.witness = witness;
    }

    public Timestamp getStarttime() {
        return starttime;
    }

    public void setStarttime(Timestamp starttime) {
        this.starttime = starttime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LogPrimaryKey)) return false;

        LogPrimaryKey that = (LogPrimaryKey) o;

        if (!getWitness().equals(that.getWitness())) return false;
        return getStarttime().equals(that.getStarttime());
    }

    @Override
    public int hashCode() {
        int result = getWitness().hashCode();
        result = 31 * result + getStarttime().hashCode();
        return result;
    }
}
