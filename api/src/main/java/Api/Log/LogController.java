package Api.Log;

import Api.Exceptions.ResourceNotFoundException;
import Api.Machine.MachineRepository;
import Api.MachineType.MachineTypeCreator;
import Api.MachineType.SearchMachineTypeBody;
import Api.User.UserRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/log")
@Api(value = "Log", description="Operations for reading and writing logs", tags = {"Log"})
public class LogController {

    @Autowired
    private LogRepository logRepository;

    @Autowired
    private MachineRepository machineRepository;

    @Autowired
    private UserRepository userRepository;

    @ApiOperation(value = "Get a list of all logs")
    @GetMapping("")
    public List<Log> index(){
        return logRepository.findAll();
    }


    @ApiOperation(value = "Get a a list of logs for certain user")
    @PostMapping("/findByUser")
    public List<Log> findByUser(@Valid @RequestBody Long userId){
        return logRepository.findByUserId(userId);
    }

    @ApiOperation(value = "Get a a list of auths for certain type of machine")
    @PostMapping("/findByMachine")
    public List<Log> findByMachine(@Valid @RequestBody Long machineId){
        return logRepository.findByMachineId(machineId);
    }

    @ApiOperation(value = "Create a new log")
    @PostMapping("")
    public Log create(@Valid @RequestBody LogCreator body){
        //Get machine
        return machineRepository.findById(body.getMachine()).map(machine -> {
            //Get User
            return userRepository.findById(body.getUser()).map(user -> {
                Log newLog = new Log(body.getStart_time(), body.getEnd_time(), user, machine, body.getWitness());
                return logRepository.save(newLog);
                //If User not found throw error
            }).orElseThrow(() -> new ResourceNotFoundException("userId " + body.getUser() + " not found"));
            //If machine  not found throw error
        }).orElseThrow(() -> new ResourceNotFoundException("machineId " + body.getMachine() + " not found"));
    }

    @ApiOperation(value = "Get newest log of user")
    @GetMapping("/{id}")
    public List<Log> getNewest(@PathVariable Long id){
        return logRepository.findTop1ByUserIdOrderByStarttimeDesc(id);
    }
}