package com.anjali.todolist.controller;

import com.anjali.todolist.model.Task;
import com.anjali.todolist.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/task")
    @CrossOrigin
    public ResponseEntity<Task> addTask(@RequestBody Task task) {
        System.out.println("Received task: " + task); // Debugging log
        Task savedTask = taskService.addTask(task);
        System.out.println("Saved task: " + savedTask); // Debugging log
        return new ResponseEntity<>(savedTask, HttpStatus.CREATED);
    }

    @GetMapping("/tasks")
    public  ResponseEntity<List<Task>> getAllTask(){
        List<Task> tasks = taskService.getTask();
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }
    // TaskController.java
    @PutMapping("/task")
    public ResponseEntity<Task> updateTask(@RequestBody Task task) {
        Task updatedTask = taskService.updateTask(task);
        if (updatedTask != null) {
            return new ResponseEntity<>(updatedTask, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @DeleteMapping("/task/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable int id) {
        // Perform the delete operation
        boolean isDeleted = taskService.deleteTask(id); // Assuming you have a deleteTask method

        if (isDeleted) {
            return ResponseEntity.ok("Deleted"); // Return plain text response
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        }
    }
}
