package Api.User;

import Api.Exceptions.ResourceNotFoundException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/user")
@Api(value = "User", description="Operations pertaining to the users of the system", tags = {"User"})
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @ApiOperation(value = "Get a list of users")
    @GetMapping("")
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    @ApiOperation(value = "Get a certain user by ID")
    @GetMapping("/{id}")
    public User show(@PathVariable Long id){
        return userRepository.findById(id).map(user -> user).orElseThrow(() -> new ResourceNotFoundException("userId " + id + " not found"));
    }

    @ApiOperation(value = "Get a certain user by email")
    @PostMapping("/search")
    public List<User> search(@RequestBody SearchUserBody body){
        return userRepository.findByEmailContaining(body.getEmail());
    }

    @ApiOperation(value = "Create a new user")
    @PostMapping("")
    public User create(@Valid @RequestBody UserCreator body){
        return userRepository.save(body.toUser());
    }

    @ApiOperation(value = "Update an existing user")
    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @Valid @RequestBody UserCreator postRequest){
        return userRepository.findById(id).map(user -> {
            user.setName(postRequest.getName());
            user.setEmail(postRequest.getEmail());
            user.setScanString(postRequest.getScanString());
            user.setAdmin_level(postRequest.getAdmin_level());
            return userRepository.save(user);
        }).orElseThrow(() -> new ResourceNotFoundException("UserId " + id + " not found"));
    }

    @ApiOperation(value = "Delete a user by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok().build();
        }).orElseThrow(() -> new ResourceNotFoundException("UserId " + id + " not found"));
    }


}