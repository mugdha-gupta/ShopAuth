package Api.Log;

import Api.Exceptions.ResourceNotFoundException;
import Api.Machine.MachineRepository;
import Api.User.UserRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    @GetMapping()
    public List<Log> index(){
        return logRepository.findAll();
    }

    @ApiOperation(value = "Get a page of logs")
    @PostMapping("/getPage")
    public List<Log> page(@RequestParam("page") int page,
                          @RequestParam("size") int size){
        Pageable pageable = PageRequest.of(page, size);
        return logRepository.findAll(pageable).getContent();
    }

    @ApiOperation(value = "Create a new log")
    @PostMapping("")
    public Log create(@Valid @RequestBody LogCreator body){
        Log newLog = new Log(body.getStart_time(), body.getEnd_time(), body.getUser(), body.getMachine(), body.getWitness());
        return logRepository.save(newLog);
    }
}