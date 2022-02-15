$(readyNow);

function readyNow(){
    console.log('document is ready!');
    displayTasks();
    handleClickListeners();
}

function handleClickListeners(){
    $('#submit').on('click', addNewTask);
    $('#to-do-list').on('click', '.status', changeStatus); //Q: How can I make a click listener for un-checking the checkbox?
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
                <td class="other-cells">${task.new_deadline}</td>
                <td class="other-cells">
                <input type="checkbox" id="completed" class="status" data-status="${task.is_completed}" checked>
                <label for="completed">Completed</label>
                </td>
                <td class="other-cells">${task.new_completed_date}</td>
                <td class="other-cells">
                <button class="delete">Delete</button>
                </td>
            </tr>`);
        } else {
            $('#to-do-list').append(`
            <tr data-id="${task.id}">
                <td class="task-cell"><li>${task.task}</li></td>
                <td class="other-cells">${task.new_deadline}</td>
                <td class="other-cells">
                <input type="checkbox" id="completed" class="status" data-status="${task.is_completed}">
                <label for="completed">Completed</label>
                </td>
                <td class="other-cells">
                </td>
                <td class="other-cells">
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
    const status = $(this).data().status; //false
    console.log('in changeStatus', id, status);
    $.ajax({
        type: 'PUT',
        url: `/todo/${id}`,
        data: {
            newStatus: !status
        }
    }).then(function (response){
        displayTasks();
    }).catch(function (error) {
        console.log('Error in PUT', error)
    });
}


//delete the task if delete button is clicked

function deleteTask(){
    if(confirm('Are you sure you want to delete this task?')){
        console.log('The task is deleted');
        let id = $(this).closest('tr').data().id;
        $.ajax({
            type: 'DELETE',
            url:`/todo/${id}`
        }).then(function (response) {
            displayTasks();
        }).catch(function (error) {
            console.log('Error making DELETE request', error);
        });
    } else {
        console.log('The task is not deleted');  
    }
}