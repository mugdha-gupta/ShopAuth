package Api.MachineType;

import Api.Exceptions.ResourceNotFoundException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/machinetype")
@Api(value = "MachineType", description="Operations pertaining to types of machines", tags = {"MachineType"})
public class MachineTypeController {

    @Autowired
    private MachineTypeRepository machineTypeRepository;

    @ApiOperation(value = "Get a list of all machines types")
    @GetMapping("")
    public List<MachineType> index(){
        return machineTypeRepository.findAll();
    }

    @ApiOperation(value = "Get a certain machine type by ID")
    @GetMapping("/{id}")
    public MachineType show(@PathVariable Long id){
        return machineTypeRepository.findById(id).map(machineType -> machineType).orElseThrow(() -> new ResourceNotFoundException("machineTypeId " + id + " not found"));
    }

    @ApiOperation(value = "Get a certain machine type by name")
    @PostMapping("/search")
    public List<MachineType> search(@Valid @RequestBody SearchMachineTypeBody body){
        return machineTypeRepository.findByDisplaynameContaining(body.getName());
    }

    @ApiOperation(value = "Create a new machine type")
    @PostMapping("")
    public MachineType create(@Valid @RequestBody MachineTypeCreator body){
        return machineTypeRepository.save(body.toMachineType());
    }

    @ApiOperation(value = "Update an existing machine type")
    @PutMapping("/{id}")
    public MachineType update(@PathVariable Long id, @Valid @RequestBody MachineTypeCreator body){
        return machineTypeRepository.findById(id).map(machineType -> {
            machineType.setDisplayname(body.getDisplayname());
            machineType.setTime1(body.getTime1());
            return machineTypeRepository.save(machineType);
        }).orElseThrow(() -> new ResourceNotFoundException("machineTypeId " + id + " not found"));
    }

    @ApiOperation(value = "Delete a certain machine type by id")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        return machineTypeRepository.findById(id).map(machineType -> {
            machineTypeRepository.delete(machineType);
            return ResponseEntity.ok().build();
        }).orElseThrow(() -> new ResourceNotFoundException("machineTypeId " + id + " not found"));
    }


}