$(readyNow);

function readyNow(){
    console.log('document is ready!');
    displayTasks();
    handleClickListeners();
}

function handleClickListeners(){
    $('#submit').on('click', addNewTask);
    $('#to-do-list').on('click', '.status', changeStatus);
    $('#to-do-list').on('click', '.delete', deleteTask);
}

//request data and display it to DOM
function displayTasks(){
    console.log('in displayTasks');
    $.ajax({
        type: 'GET',
        url:'/todo'
    }).then(function (response) {
        console.log('GET /todo', response);
        renderToDOM(response);
    }).catch(function (err) {
        console.log('Error getting tasks', err);
    });
};

//render response to DOM
function renderToDOM(tasks){
    $('#to-do-list').empty();
    for (let task of tasks){
        if(task.is_completed === true){ //change background-color if the task is completed
            $('#to-do-list').append(`
            <tr class=blue-background data-id="${task.id}">
                <td class="task-cell"><li>${task.task}</li></td>
                <td>${task.deadline}</td>
                <td>
                <input type="checkbox" id="completed" class="status" checked>
                <label for="completed">Completed</label>
                </td>
                <td>
                <button class="delete">Delete</button>
                </td>
            </tr>`);
        } else {
            $('#to-do-list').append(`
            <tr data-id="${task.id}">
                <td class="task-cell"><li>${task.task}</li></td>
                <td>${task.deadline}</td>
                <td>
                <input type="checkbox" id="completed" class="status">
                <label for="completed">Completed</label>
                </td>
                <td>
                <button class="delete">Delete</button>
                </td>
            </tr>`);
        }
    }        
}

//make a request to save new data and get the latest data 

function addNewTask(){
   let newTask = $('#task').val();
   console.log(newTask);
   
   let deadline = $('#deadline').val();
   console.log(deadline);
   
   let dataToSend = {
    task: newTask,
    deadline: deadline,
   }
   $.ajax({
       type: 'POST',
       url: '/todo',
       data: dataToSend
   }).then(function (response) {
       console.log('Response from server', response);
       displayTasks();
   }).catch(function (error) {
       console.log('Error in Post', error);
   });
}

//update the status when the checkbox is checked-off

function changeStatus(){
    let id = $(this).closest('tr').data().id;
    console.log(id);
    $.ajax({
        type: 'PUT',
        url: `/todo/${id}`
    }).then(function (response){
        displayTasks();
    }).catch(function (error) {
        console.log('Error in PUT', error)
    });
}


//delete the task if delete button is clicked

function deleteTask(){
    let id = $(this).closest('tr').data().id;
    $.ajax({
        type: 'DELETE',
        url:`/todo/${id}`
    }).then(function (response) {
        displayTasks();
    }).catch(function (error) {
        console.log('Error making DELETE request', error);
    });
}