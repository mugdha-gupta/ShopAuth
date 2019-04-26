package Api.Log;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<Log, LogPrimaryKey> {

    List<Log> findByMachine(String machineName);
    List<Log> findByUser(String userName);
    List<Log> findTop1ByUserOrderByStarttimeDesc(String userName);
}
