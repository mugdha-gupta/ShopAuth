package Api.Log;

import Api.Machine.Machine;

import java.io.Serializable;
import java.sql.Timestamp;

public class LogPrimaryKey implements Serializable {
    protected Machine machine;;
    protected Timestamp start_time;

    public LogPrimaryKey() {
    }

    public LogPrimaryKey(Machine machine, Timestamp end_time) {

        this.machine = machine;
        this.start_time = end_time;
    }

    public Machine getMachine() {
        return machine;
    }

    public void setMachine(Machine machine) {
        this.machine = machine;
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

        if (!getMachine().equals(that.getMachine())) return false;
        return getEnd_time().equals(that.getEnd_time());
    }

    @Override
    public int hashCode() {
        int result = getMachine().hashCode();
        result = 31 * result + getEnd_time().hashCode();
        return result;
    }
}
