package RepositoryTests;

import Api.MainApplicationClass;
import Api.User.User;
import Api.User.UserRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@DataJpaTest
@ContextConfiguration(classes = MainApplicationClass.class)
public class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void whenFindById_thenReturnUser() {
        // given
        User chris = new User("1234","Chris","Chris@gmail.com",2);
        entityManager.persist(chris);
        entityManager.flush();

        // when
        User found = userRepository.findById(chris.getId()).get();

        // then
        assertThat(found)
                .isEqualTo(chris);
    }

}