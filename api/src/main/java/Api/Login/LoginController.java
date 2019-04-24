package Api.Login;

import Api.Auth.AuthRepository;
import Api.Log.Log;
import Api.Log.LogCreator;
import Api.Log.LogRepository;
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
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;

@CrossOrigin
@RestController
@RequestMapping("/login")
@Api(description="Operations pertaining to logging students into machines", tags = {"Login"})
public class LoginController {

    private boolean adminPresent = false;
    private ConcurrentHashMap<Machine, UserMachine> status = new ConcurrentHashMap<>();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MachineRepository machineRepository;

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private LogRepository logRepository;

    @ApiOperation(value = "View a status of who is using each machine")
    @GetMapping("")
    public ArrayList<UserMachine> showall(){
        return new ArrayList<UserMachine>(status.values());
    }


    @ApiOperation(value = "See who is using a certain machine by ID")
    @GetMapping("/{id}")
    public User show(@PathVariable Long id){
        return machineRepository.findById(id).map(machine -> status.get(machine).getUser()).orElseThrow(() -> new ResourceNotFoundException("machineId " + id + "not found"));
    }

    @ApiOperation(value = "Authenticate a user by scan string for a certain machine by ID")
    @PostMapping("/auth")
    public AuthReturn authenticate(@Valid @RequestBody AuthBody body){
        AuthReturn authReturn = new AuthReturn();
        return machineRepository.findById(body.getMachine_id()).map(machine ->
                userRepository.findByScanString(body.getScan_string()).map(user -> {
                    boolean auth = authRepository.findByUserIdAndTypeId(user.getId(), machine.getType().getId()).isPresent();
                    if(auth) {
                        status.put(machine, new UserMachine(user, machine));
                    }
                    authReturn.setAuthenticated(auth);
                    authReturn.setNeedWitness(!adminPresent && user.getAdmin_level()!=2);
                    authReturn.setTime(machine.getType().getTime1());
                    return authReturn;
            }).orElseThrow(() -> new ResourceNotFoundException("No user found with scan string " + body.getScan_string()))
        ).orElseThrow(() -> new ResourceNotFoundException("MachineId " + body.getMachine_id() + " not found"));
    }

    @ApiOperation(value = "Authenticate a user by scan string for a certain machine by ID")
    @PostMapping("/logout")
    public Log logout(@Valid @RequestBody LogoutBody body){
        //Get machine
        return machineRepository.findById(body.getMachine_id()).map(machine -> {
            //check if the user has logged into the machine
            Timestamp startTime;
            if (status.containsKey(machine))
                //remove machine from status
                startTime = status.remove(machine).getStart_time();
            else
                //if the machine is not in use throw error
                throw new ResourceNotFoundException("MachineId " + body.getMachine_id() + " not in use currently");
            //Get User
            return userRepository.findByScanString(body.getScan_string()).map(user -> {

                Log newLog = new Log(startTime, new Timestamp(System.currentTimeMillis()), user, machine, body.getWitness());
                return logRepository.save(newLog);
                //If User not found throw error
            }).orElseThrow(() -> new ResourceNotFoundException("ScanString " + body.getScan_string() + " not found"));
            //If machine not found throw error
        }).orElseThrow(() -> new ResourceNotFoundException("MachineId " + body.getMachine_id() + " not found"));
    }


    @ApiOperation(value = "Set whether or not an admin is currently present")
    @PostMapping("/setadmin")
    public AdminBody setadmin(@RequestBody AdminBody admin){
        adminPresent = admin.getAdminPresent();
        return admin;
    }

    @ApiOperation(value = "Get whether or not an admin is currently present")
    @PostMapping("/getadmin")
    public AdminBody getadmin(){
        return new AdminBody(adminPresent);
    }

}