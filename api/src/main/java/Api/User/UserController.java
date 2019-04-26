package Api.User;

import Api.Auth.Auth;
import Api.Auth.AuthRepository;
import Api.Exceptions.ResourceNotFoundException;
import Api.Log.LogRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/user")
@Api(value = "User", description="Operations pertaining to the users of the system", tags = {"User"})
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthRepository authRepository;

    @ApiOperation(value = "Get a list of users")
    @GetMapping("")
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    @ApiOperation(value = "Get a page of users")
    @PostMapping("/getPage")
    public List<User> page(@RequestParam("page") int page,
                          @RequestParam("size") int size){
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable).getContent();
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
    public User update(@PathVariable Long id, @Valid @RequestBody UserUpdater postRequest){
        return userRepository.findById(id).map(user -> {
            if(postRequest.getName()!=null) {
                user.setName(postRequest.getName());
            }
            if(postRequest.getEmail()!=null) {
                user.setEmail(postRequest.getEmail());
            }
            if(postRequest.getScanString()!=null) {
                user.setScanString(postRequest.getScanString());
            }
            if(postRequest.getAdmin_level()!=-1) {
                user.setAdmin_level(postRequest.getAdmin_level());
            }
            return userRepository.save(user);
        }).orElseThrow(() -> new ResourceNotFoundException("UserId " + id + " not found"));
    }

    @ApiOperation(value = "Delete a user by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        for(Auth auth : authRepository.findByUserId(id)){
            authRepository.delete(auth);
        }
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok().build();
        }).orElseThrow(() -> new ResourceNotFoundException("UserId " + id + " not found"));
    }


}