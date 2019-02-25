package Api.Log;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<Log, LogPrimaryKey> {

    List<Log> findByMachineId(Long machineId);
    List<Log> findByUserId(Long userId);
    List<Log> findTop1ByUserIdOrderByStarttimeDesc(Long userId);
    Page<Log> findAll(Pageable pageable);
}
