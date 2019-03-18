package Api.Machine;

import Api.Exceptions.ResourceNotFoundException;
import Api.MachineType.MachineTypeRepository;
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
@RequestMapping("/machine")
@Api(value = "Machine", description="Operations pertaining to machines that can be logged into", tags = {"Machine"})
public class MachineController {

    @Autowired
    private MachineRepository machineRepository;

    @Autowired
    private MachineTypeRepository machineTypeRepository;

    @ApiOperation(value = "Get a list of all machines")
    @GetMapping("")
    public List<Machine> index(){
        return machineRepository.findAll();
    }

    @ApiOperation(value = "Get a certain machine by ID")
    @GetMapping("/{id}")
    public Machine show(@PathVariable Long id){
        System.out.println(id);
        return machineRepository.findById(id).map(machine -> machine).orElseThrow(() -> new ResourceNotFoundException("machineId " + id + " not found"));
    }

    @ApiOperation(value = "Get a certain machine by name")
    @PostMapping("/search")
    public List<Machine> search(@Valid @RequestBody SearchMachineBody body){
        return machineRepository.findByDisplaynameContaining(body.getName());
    }

    @ApiOperation(value = "Get a a list of machines of a certain type")
    @PostMapping("/filter")
    public List<Machine> filter(@Valid @RequestBody FilterBody body){
        return machineRepository.findByTypeId(body.getTypeId());
    }

    @ApiOperation(value = "Create a new machine")
    @PostMapping("")
    public Machine create(@Valid @RequestBody MachineCreator body){
        //Check if type was given
        if(body.getType()==null){
            Machine newMachine = new Machine(body.getDisplayname());
            return machineRepository.save(newMachine);
        }
        return machineTypeRepository.findById(body.getType()).map(machineType -> {
            Machine newMachine = new Machine(body.getDisplayname(), machineType);
            return machineRepository.save(newMachine);
        }).orElseThrow(() -> new ResourceNotFoundException("machineTypeId " + body.getType() + " not found"));
    }

    @ApiOperation(value = "Update an existing machine")
    @PutMapping("/{id}")
    public Machine update(@PathVariable Long id, @Valid @RequestBody MachineCreator body){
        return machineRepository.findById(id).map(machine -> {
            machine.setDisplayname(body.getDisplayname());
            if(body.getType()==null) {
                machine.setType(null);
                return machineRepository.save(machine);
            }
            return machineTypeRepository.findById(body.getType()).map(machineType -> {
                machine.setType(machineType);
                return machineRepository.save(machine);
            }).orElseThrow(() -> new ResourceNotFoundException("machineTypeId " + body.getType() + " not found"));
        }).orElseThrow(() -> new ResourceNotFoundException("machineId " + id + " not found"));
    }

    @ApiOperation(value = "Delete a certain machine by id")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        return machineRepository.findById(id).map(machine -> {
            machineRepository.delete(machine);
            return ResponseEntity.ok().build();
        }).orElseThrow(() -> new ResourceNotFoundException("machineId " + id + " not found"));
    }

    @ApiOperation(value = "Get a page of logs")
    @PostMapping("/getPage")
    public List<Machine> page(@RequestParam("page") int page,
                          @RequestParam("size") int size){
        Pageable pageable = PageRequest.of(page, size);
        return machineRepository.findAll(pageable).getContent();
    }

}