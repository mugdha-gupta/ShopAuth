package User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
public class MachineController {

    @Autowired
    private MachineRepository machineRepository;

    @Autowired
    private MachineTypeRepository machineTypeRepository;

    @GetMapping("/machine")
    public List<Machine> index(){
        return machineRepository.findAll();
    }

    @GetMapping("/machine/{id}")
    public Machine show(@PathVariable int id){
        return machineRepository.findById(id).map(machine -> machine).orElseThrow(() -> new ResourceNotFoundException("machineId " + id + "not found"));
    }

    @PostMapping("/machine/search")
    public List<Machine> search(@RequestBody Map<String, String> body){
        String searchTerm = body.get("name");
        return machineRepository.findByDisplaynameContaining(searchTerm);
    }

    @PostMapping("/machine/filter")
    public List<Machine> filter(@RequestBody Map<String, String> body){
        int searchTerm = Integer.parseInt(body.get("type"));
        return machineRepository.findByType(searchTerm);
    }

    @PostMapping("/machine")
    public Machine create(@Valid @RequestBody Machine body){
        return machineRepository.save(body);
    }

    @PutMapping("/machine/{id}")
    public Machine update(@PathVariable int id, @Valid @RequestBody Machine body){
        return machineRepository.findById(id).map(machine -> {
            machine.setDisplayname(body.getDisplayname());
            machine.setType(body.getType());
            return machineRepository.save(machine);
        }).orElseThrow(() -> new ResourceNotFoundException("machineId " + id + "not found"));
    }

    @DeleteMapping("machine/{id}")
    public boolean delete(@PathVariable String id){
        int machineId = Integer.parseInt(id);
        machineRepository.deleteById(machineId);
        return true;
    }


}