package User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@RestController
public class LoginController {

    private boolean adminPresent = false;
    private ConcurrentHashMap<Machine, User> status = new ConcurrentHashMap<Machine, User>();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MachineRepository machineRepository;

    @GetMapping("/login")
    public ConcurrentHashMap<Machine, User> showall(){
        return status;
    }

    @GetMapping("/login/{id}")
    public User show(@PathVariable String id){
        int machineId = Integer.parseInt(id);
        Optional<Machine> machine = this.machineRepository.findById(machineId);
        if (machine.isPresent()) {
            return status.get(machine.get());
        } else {
            return null;
        }
    }

    @PostMapping("/login/auth")
    public boolean authenticate(@RequestBody Map<String, String> body){
        String scan_string = body.get("scan_string");
        int machineId = Integer.parseInt(body.get("machine_id"));
        Machine machine;
        Optional<Machine> machineOpt = this.machineRepository.findById(machineId);
        if (machineOpt.isPresent()) {
            machine =  machineOpt.get();
        } else {
            return false;
        }
        User user = userRepository.findByScanString(scan_string);
        status.put(machine,user);
        return true;
    }

    @PostMapping("/login/setadmin")
    public boolean setadmin(@RequestBody Map<String, String> body){
        adminPresent = Boolean.parseBoolean(body.get("admin"));
        return true;
    }

    @PostMapping("/login/getadmin")
    public boolean getadmin(){
        return adminPresent;
    }

}