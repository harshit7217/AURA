package com.project.aura.controller;

import com.project.aura.entity.Employee;
import com.project.aura.repository.EmployeeRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {
    private final EmployeeRepository repository;

    public EmployeeController(EmployeeRepository repository){
        this.repository = repository;
    }

    @PostMapping
    public Employee createEmployee(@Valid @RequestBody Employee employee){
        return repository.save(employee);
    }

    @GetMapping
    public List<Employee> getAllEmployeeDetails() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable Long id){
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable Long id, @Valid @RequestBody Employee updateEmployee){
        return repository.findById(id)
                .map(employee -> {
                    employee.setName(updateEmployee.getName());
                    employee.setDepartment(updateEmployee.getDepartment());
                    employee.setSalary(updateEmployee.getSalary());
                    return repository.save(employee);
                })
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable Long id){
        repository.deleteById(id);
    }
}
