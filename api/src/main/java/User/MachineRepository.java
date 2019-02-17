package User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Integer> {

    List<Machine> findByDisplaynameContaining(String displayname);
    List<Machine> findByType(int typeId);

}
