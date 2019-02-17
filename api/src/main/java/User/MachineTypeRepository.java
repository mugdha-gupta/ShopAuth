package User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MachineTypeRepository extends JpaRepository<Machine_type, Integer> {

    List<Machine_type> findByDisplaynameContaining(String displayname);
}
