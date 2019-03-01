package Api.Login;

import Api.Machine.Machine;
import Api.Machine.MachineRepository;
import Api.Exceptions.ResourceNotFoundException;
import Api.User.User;
import Api.User.UserRepository;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.concurrent.ConcurrentHashMap;

@CrossOrigin
@RestController
@RequestMapping("/login")
@Api(description="Operations pertaining to logging students into machines", tags = {"Login"})
public class LoginController {

    private boolean adminPresent = false;
    private ConcurrentHashMap<Machine, User> status = new ConcurrentHashMap<Machine, User>();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MachineRepository machineRepository;

    @ApiOperation(value = "View a status of who is using each machine")
    @GetMapping("")
    public ConcurrentHashMap<Machine, User> showall(){
        return status;
    }


    @ApiOperation(value = "See who is using a certain machine by ID")
    @GetMapping("/{id}")
    public User show(@PathVariable Long id){
        return machineRepository.findById(id).map(machine -> status.get(machine)).orElseThrow(() -> new ResourceNotFoundException("machineId " + id + "not found"));
    }

    @ApiOperation(value = "Authenticate a user by scan string for a certain machine by ID")
    @PostMapping("/auth")
    public AuthReturn authenticate(@Valid @RequestBody AuthBody body){
        AuthReturn authReturn = new AuthReturn();
        return machineRepository.findById(body.getMachine_id()).map(machine ->
                userRepository.findByScanString(body.getScan_string()).map(user -> {
                status.put(machine, user);
                authReturn.setAuthenticated(true);
                authReturn.setNeedWitness(!adminPresent);
                authReturn.setTime(machine.getType().getTime1());
                return authReturn;
            }).orElseThrow(() -> new ResourceNotFoundException("No user found with scan string " + body.getScan_string()))
        ).orElseThrow(() -> new ResourceNotFoundException("MachineId " + body.getMachine_id() + " not found"));
    }

    @ApiOperation(value = "Set whether or not an admin is currently present")
    @PostMapping("/setadmin")
    public boolean setadmin(@RequestBody Boolean admin){
        adminPresent = admin;
        return true;
    }

    @ApiOperation(value = "Get whether or not an admin is currently present")
    @PostMapping("/getadmin")
    public boolean getadmin(){
        return adminPresent;
    }

}