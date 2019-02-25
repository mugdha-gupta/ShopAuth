package Api.Log;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<Log, LogPrimaryKey> {

    List<Log> findByMachineId(Long machineId);
    List<Log> findByUserId(Long userId);
}
