package Api.Machine;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {

    List<Machine> findByDisplaynameContaining(String displayname);
    List<Machine> findByTypeId(Long typeId);

}
