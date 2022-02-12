$(readyNow);

function readyNow(){
    console.log('document is ready!');
    displayTasks();
    handleClickListeners();
}

function handleClickListeners(){
    $('#submit').on('click', addNewTask);
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
    for (let task of tasks){
        $('#to-do-list').append(`
        <tr>
            <td>${task.task}</td>
            <td>${task.deadline}</td>
            <td>
            <input type="checkbox" id="completed" name="completed" class="status" value="true">
            <label for="completed">Completed</label>
            </td>
            <td>
            <button>Delete</button>
            </td>
        </tr>
        `);
    }
}

//make a request to save new data and get the latest data 

function 