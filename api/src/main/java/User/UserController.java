package User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user")
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    @GetMapping("/user/{id}")
    public User show(@PathVariable int id){
        return userRepository.findById(id).map(user -> user).orElseThrow(() -> new ResourceNotFoundException("userId " + id + "not found"));
    }

    @PostMapping("/user/search")
    public List<User> search(@RequestBody Map<String, String> body){
        String searchTerm = body.get("email");
        return userRepository.findByEmailContaining(searchTerm);
    }

    @PostMapping("/user")
    public User create(@Valid @RequestBody User body){
        return userRepository.save(body);
    }

    @PutMapping("/user/{id}")
    public User update(@PathVariable int id, @Valid @RequestBody User postRequest){
        return userRepository.findById(id).map(user -> {
            user.setName(postRequest.getName());
            user.setEmail(postRequest.getEmail());
            user.setScanString(postRequest.getScanString());
            user.setAdmin_level(postRequest.getAdmin_level());
            return userRepository.save(user);
        }).orElseThrow(() -> new ResourceNotFoundException("UserId " + id + " not found"));
    }

    @DeleteMapping("user/{id}")
    public ResponseEntity<?> delete(@PathVariable int id){
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok().build();
        }).orElseThrow(() -> new ResourceNotFoundException("UserId " + id + " not found"));
    }


}