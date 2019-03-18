package Api.Auth;

import Api.Exceptions.ResourceNotFoundException;
import Api.MachineType.MachineTypeRepository;
import Api.User.UserRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/auth")
@Api(value = "Auth", description="Operations pertaining to user machine authorizations", tags = {"Auth"})
public class AuthController {

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private MachineTypeRepository machineTypeRepository;

    @Autowired
    private UserRepository userRepository;

    @ApiOperation(value = "Get a list of all authorizations")
    @GetMapping("")
    public List<Auth> index(){
        return authRepository.findAll();
    }

    @ApiOperation(value = "Get a page of auths")
    @PostMapping("/getPage")
    public List<Auth> page(@RequestParam("page") int page,
                          @RequestParam("size") int size){
        Pageable pageable = PageRequest.of(page, size);
        return authRepository.findAll(pageable).getContent();
    }

    @ApiOperation(value = "Get a a list of auths for certain user")
    @PostMapping("/findByUser")
    public List<Auth> findByUser(@Valid @RequestBody Id userId){
        return authRepository.findByUserId(userId.getId());
    }

    @ApiOperation(value = "Get a a list of auths for certain type of machine")
    @PostMapping("/findByType")
    public List<Auth> findByType(@Valid @RequestBody Id typeId){
        return authRepository.findByTypeId(typeId.getId());
    }

    @ApiOperation(value = "Create a new authorization")
    @PostMapping("")
    public Auth create(@Valid @RequestBody AuthCreator body){
        //Get machine type
        return machineTypeRepository.findById(body.getTypeId()).map(machineType -> {
            //Get User
            return userRepository.findById(body.getUserId()).map(user -> {
                Auth newAuth = new Auth(user, machineType);
                return authRepository.save(newAuth);
                //If User not found throw error
            }).orElseThrow(() -> new ResourceNotFoundException("userId " + body.getUserId() + " not found"));
            //If Machine Type not found throw error
        }).orElseThrow(() -> new ResourceNotFoundException("machineTypeId " + body.getTypeId() + " not found"));
    }

    @ApiOperation(value = "Delete a certain auth by ids")
    @DeleteMapping("")
    public ResponseEntity<?> delete(@Valid @RequestBody AuthCreator body){
        authRepository.deleteByUserIdAndTypeId(body.getUserId(), body.getTypeId());
        return ResponseEntity.ok().build();
    }

}