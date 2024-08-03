package com.anjali.todolist.services;

import com.anjali.todolist.model.Task;
import com.anjali.todolist.repo.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepo repo;
    public Task addTask(@RequestBody Task task) {
        return this.repo.save(task);
    }

    public List<Task> getTask() {
        return repo.findAll();
    }

    // TaskService.java
    public Task updateTask(Task task) {
            return repo.save(task);

    }

    public boolean deleteTask(int id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}
