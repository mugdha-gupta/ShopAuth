package Api.MachineType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MachineTypeRepository extends JpaRepository<MachineType, Long> {

    List<MachineType> findByDisplaynameContaining(String displayname);
}
