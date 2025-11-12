package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Employeeentity;
import com.example.demo.repository.Employeerepo;

@RestController
@RequestMapping("/api/employee")  // 👈 base URL for all employee APIs
@CrossOrigin(origins = "http://localhost:5173") // allow React app
public class Employeecontroller {

    @Autowired
    private Employeerepo repo;

    // ✅ Add new employee
    @PostMapping
    public ResponseEntity<String> addEmployee(@RequestBody Employeeentity emp) {
        try {
            repo.save(emp);
            return ResponseEntity.ok("Employee added successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error adding employee: " + e.getMessage());
        }
    }

    // ✅ Get all employees
    @GetMapping
    public ResponseEntity<List<Employeeentity>> getAllEmployees() {
        try {
            List<Employeeentity> employees = repo.findAll();
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // ✅ Get employee by ID
    @GetMapping("/{id}")
    public ResponseEntity<Employeeentity> getEmployeeById(@PathVariable Long id) {
        Optional<Employeeentity> emp = repo.findById(id);
        return emp.map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Update employee
    @PutMapping("/{id}")
    public ResponseEntity<String> updateEmployee(@PathVariable Long id, @RequestBody Employeeentity updatedEmp) {
        Optional<Employeeentity> existingEmp = repo.findById(id);
        if (existingEmp.isPresent()) {
            Employeeentity emp = existingEmp.get();
            emp.setFirstname(updatedEmp.getFirstname());
            emp.setLastname(updatedEmp.getLastname());
            emp.setEmail(updatedEmp.getEmail());
            emp.setDepartment(updatedEmp.getDepartment());
            emp.setSalary(updatedEmp.getSalary());
            repo.save(emp);
            return ResponseEntity.ok("Employee updated successfully!");
        } else {
            return ResponseEntity.status(404).body("Employee not found!");
        }
    }

    // ✅ Delete employee
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long id) {
        try {
            if (repo.existsById(id)) {
                repo.deleteById(id);
                return ResponseEntity.ok("Employee deleted successfully!");
            } else {
                return ResponseEntity.status(404).body("Employee not found!");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error deleting employee!");
        }
    }
}