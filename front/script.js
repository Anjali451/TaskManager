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

  fetch('http://localhost:8080/api/task', {
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
    document.getElementById('taskName').value = ''; // Clear the task name field
    document.getElementById('taskDetail').value = ''; // Clear the task detail field
    fetchTasks(); // Refresh the task list after adding a new task
  })
  .catch(error => {
    console.error('Error adding task:', error);
  });
}


// Function to convert ISO 8601 date string to IST
function convertToIST(dateString) {
  const date = new Date(dateString);
  const utcTimestamp = date.getTime();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTimestamp = utcTimestamp + istOffset;
  const istDate = new Date(istTimestamp);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Intl.DateTimeFormat('en-IN', options).format(istDate);
}

// Function to convert ISO 8601 date string to IST
function convertToIST(dateString) {
  const date = new Date(dateString);
  const utcTimestamp = date.getTime();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTimestamp = utcTimestamp + istOffset;
  const istDate = new Date(istTimestamp);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Intl.DateTimeFormat('en-IN', options).format(istDate);
}

// Function to show task details in modal
function showTaskDetails(task) {
  document.getElementById('taskCreationDate').innerText = `Created on: ${convertToIST(task.creationDate)}`;
  document.getElementById('editTaskName').value = task.taskName;
  document.getElementById('editTaskDetail').value = task.taskDetail;

  $('#taskDetailModal').data('taskId', task.id); // Store task ID in modal data

  const taskDetailModal = new bootstrap.Modal(document.getElementById('taskDetailModal'));
  taskDetailModal.show();
}

document.getElementById('saveTaskChanges').addEventListener('click', function() {
  const taskId = $('#taskDetailModal').data('taskId');
  const updatedTaskName = document.getElementById('editTaskName').value;
  const updatedTaskDetail = document.getElementById('editTaskDetail').value;

  const updatedTask = {
    taskName: updatedTaskName,
    taskDetail: updatedTaskDetail,
    completed: false // Adjust completed state as needed
  };

  fetch(`http://localhost:8080/api/task/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedTask),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Task updated successfully:', data);
    $('#taskDetailModal').modal('hide'); // Hide the modal
    fetchTasks(); // Refresh the task list
  })
  .catch(error => console.error('Error updating task:', error));
});


// Function to open task detail
function openTaskDetail(id) {
  fetch(`http://localhost:8080/api/task/${id}`, {
    method: 'GET',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(task => {
    showTaskDetails(task); // Use showTaskDetails to display modal
  })
  .catch(error => {
    console.error('Error fetching task details:', error);
  });
}


// Function to update task list
function updateTaskList(tasks) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = ''; // Clear existing tasks

  tasks.forEach(task => {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item task-item'; // Add task-item class
    listItem.setAttribute('data-task-id', task.id); // Set data-task-id attribute
    listItem.innerHTML = `
      <input class="form-check-input me-1 task-checkbox" type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
      <label class="form-check-label" for="task-${task.id}">${task.taskName}</label>
      <span class="task-date">${convertToIST(task.creationDate)}</span>
      <button type="button" class="btn btn-danger" style="float: right;" onclick="deleteTask(${task.id})">Delete</button>
    `;
    taskList.appendChild(listItem);

    const checkbox = listItem.querySelector('.task-checkbox');
    if (task.completed) {
      listItem.classList.add('checked'); // Add checked class if task is completed
    }

    checkbox.addEventListener('change', function() {
      if (checkbox.checked) {
        listItem.classList.add('checked'); // Add checked class when checkbox is checked
      } else {
        listItem.classList.remove('checked'); // Remove checked class when checkbox is unchecked
      }

      updateTask(task.id, checkbox.checked);
    });

    listItem.addEventListener('click', function(event) {
      if (event.target !== checkbox) {
        openTaskDetail(task.id); // Open task details modal
      }
    });
  });
}

// Function to fetch tasks
function fetchTasks() {
  fetch('http://localhost:8080/api/tasks')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Tasks fetched successfully:', data); // Log fetched data
      updateTaskList(data); // Update the UI with the fetched tasks
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
    });
}

// Function to update a task
function updateTask(taskId, isChecked) {
  fetch(`http://localhost:8080/api/task/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ completed: isChecked }),
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

// Function to delete a task
function deleteTask(taskId) {
  fetch(`http://localhost:8080/api/task/${taskId}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
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
