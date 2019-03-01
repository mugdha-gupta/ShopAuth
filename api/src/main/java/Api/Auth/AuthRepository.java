package Api.Auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthRepository extends JpaRepository<Auth, Long> {

    List<Auth> findByUserId(Long userId);
    List<Auth> findByTypeId(Long typeId);
    Optional<Auth> findByUserIdAndTypeId(Long userId, Long typeId);

    @Transactional
    void deleteByUserIdAndTypeId(Long userId, Long typeId);


}
