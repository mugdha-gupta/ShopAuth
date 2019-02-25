package Api.Log;

import java.io.Serializable;
import java.sql.Timestamp;

public class LogPrimaryKey implements Serializable {
    protected String witness;
    protected Timestamp start_time;

    public LogPrimaryKey() {
    }

    public LogPrimaryKey(String witness, Timestamp end_time) {

        this.witness = witness;
        this.start_time = end_time;
    }

    public String getWitness() {
        return witness;
    }

    public void setWitness(String witness) {
        this.witness = witness;
    }

    public Timestamp getEnd_time() {
        return start_time;
    }

    public void setEnd_time(Timestamp end_time) {
        this.start_time = end_time;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LogPrimaryKey)) return false;

        LogPrimaryKey that = (LogPrimaryKey) o;

        if (!getWitness().equals(that.getWitness())) return false;
        return getEnd_time().equals(that.getEnd_time());
    }

    @Override
    public int hashCode() {
        int result = getWitness().hashCode();
        result = 31 * result + getEnd_time().hashCode();
        return result;
    }
}
