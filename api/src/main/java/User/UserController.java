package User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class UserController {

    private boolean adminPresent = false;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user")
    public List<User> index(){
        return userRepository.findAll();
    }

    @GetMapping("/user/{id}")
    public User show(@PathVariable String id){
        int userId = Integer.parseInt(id);
        Optional<User> user = this.userRepository.findById(userId);
        if (user.isPresent()) {
            return user.get();
        } else {
            return null;
        }
    }

    @PostMapping("/user/search")
    public List<User> search(@RequestBody Map<String, String> body){
        String searchTerm = body.get("email");
        return userRepository.findByEmailContaining(searchTerm);
    }

    @PostMapping("/user/admin")
    public boolean admin(@RequestBody Map<String, String> body){
        adminPresent = Boolean.parseBoolean(body.get("admin"));
        return true;
    }

    @PostMapping("/user/getadmin")
    public boolean getadmin(){
        return adminPresent;
    }

    @PostMapping("/user")
    public User create(@RequestBody Map<String, String> body){
        String email = body.get("email");
        String scan_string = body.get("scan_string");
        String name = body.get("name");
        return userRepository.save(new User(scan_string, name, email));
    }

    @PutMapping("/user/{id}")
    public User update(@PathVariable String id, @RequestBody Map<String, String> body){
        int userId = Integer.parseInt(id);
        // getting user
        User user;
        Optional<User> userRet = this.userRepository.findById(userId);
        if (!userRet.isPresent()) {
            return null;
        }
        user = userRet.get();
        user.setScanString(body.get("scan_string"));
        user.setEmail(body.get("email"));
        user.setName(body.get("name"));
        return userRepository.save(user);
    }

    @DeleteMapping("user/{id}")
    public boolean delete(@PathVariable String id){
        int userId = Integer.parseInt(id);
        userRepository.deleteById(userId);
        return true;
    }


}