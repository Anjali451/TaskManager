// Function to add a task
function addTask() {
    const taskName = document.getElementById('taskName').value;
    const taskDetail = document.getElementById('taskDetail').value;
  
    const task = {
      taskName: taskName,
      taskDetail: taskDetail,
      creationDate: new Date().toISOString()
    };
  
    console.log('Task to be added:', task); // Debugging log
  
    fetch('http://localhost:8080/api/task', { // Ensure this URL matches your Spring Boot server URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Task added successfully:', data);
      $('#exampleModal').modal('hide'); // Hide the modal after successful addition
      fetchTasks(); // Refresh the task list after adding a new task
    })
    .catch(error => {
      console.error('Error adding task:', error);
    });
  }
  
  // Function to fetch tasks
  function fetchTasks() {
    fetch('http://localhost:8080/api/tasks') // Ensure this URL matches your Spring Boot server URL
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Tasks fetched successfully:', data);
        updateTaskList(data); // Update the UI with the fetched tasks
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  }
  
  // Function to update the task list in the UI
  function updateTask(taskId, isChecked) {
    fetch(`http://localhost:8080/api/task`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: taskId, completed: isChecked }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => console.log('Task updated successfully:', data))
    .catch(error => console.error('Error updating task:', error));
  }
  

  function updateTaskList(tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Clear existing tasks

    tasks.forEach(task => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item task-item'; // Add task-item class
      listItem.setAttribute('data-task-id', task.id); // Set data-task-id attribute
      listItem.innerHTML = `
        <input class="form-check-input me-1 task-checkbox" type="checkbox" value="" id="task-${task.id}">
        <label class="form-check-label" for="task-${task.id}">${task.taskName}</label>
        <button type="button" class="btn btn-danger" style="float: right;" onclick="deleteTask(${task.id})">Delete</button>
      `;
      taskList.appendChild(listItem);

      // Set checkbox state based on task data (if applicable)
      const checkbox = listItem.querySelector('.task-checkbox');
      checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
          listItem.classList.add('checked'); // Add checked class when checkbox is checked
        } else {
          listItem.classList.remove('checked'); // Remove checked class when checkbox is unchecked
        }

        updateTask(task.id, checkbox.checked);
      });
    });
  }
  
  
  // Optionally, add a function to delete tasks
 // Function to delete a task
function deleteTask(taskId) {
    fetch(`http://localhost:8080/api/task/${taskId}`, { // Ensure this URL matches your Spring Boot server URL
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Check if response is not empty and attempt to read as text
      return response.text(); // Use text() instead of json() to handle non-JSON responses
    })
    .then(data => {
      console.log('Task deleted successfully:', data);
      fetchTasks(); // Refresh the task list after deleting
    })
    .catch(error => {
      console.error('Error deleting task:', error);
    });
  }
  
  
  // Fetch tasks on page load
  document.addEventListener('DOMContentLoaded', fetchTasks);
  