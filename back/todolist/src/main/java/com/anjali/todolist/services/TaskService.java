package com.anjali.todolist.services;

import com.anjali.todolist.model.Task;
import com.anjali.todolist.repo.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

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

    public Task updateTask(int id, Task updatedTask) {
        Optional<Task> optionalTask = repo.findById(id);
        if (optionalTask.isPresent()) {
            Task existingTask = optionalTask.get();
            // Update only if the field is not null in the updatedTask
            if (updatedTask.getTaskName() != null) {
                existingTask.setTaskName(updatedTask.getTaskName());
            }
            if (updatedTask.getTaskDetail() != null) {
                existingTask.setTaskDetail(updatedTask.getTaskDetail());
            }
            existingTask.setCompleted(updatedTask.isCompleted());
            return repo.save(existingTask);
        }
        return null;
    }

    public boolean deleteTask(int id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    public Task findById(int id) {
        return repo.findById(id).orElse(null);
    }
}
