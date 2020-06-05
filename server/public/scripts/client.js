$(document).ready(onReady);

function onReady(){
    console.log('jquery is loaded!');
    $('#addButton').on('click', addTask);
    $(document).on("click", "#deleteButton", deleteTask);
    getHistory();
} //end onReady


function addTask(){
    let name = $('#taskNameIn').val();
    let notes = $('#notesIn').val();

    let taskObj ={
        name: name,
        notes: notes,
        date: 'Not Completed', //default for new task
    };
    if (name !=='' && name !==undefined ){
        $('#taskNameIn').val('');//clears input
        $('#notesIn').val('');
        
        $.ajax({
            method: 'POST',
            url: '/todo', 
            data: taskObj,
        }).then(function(response) {
            //it made it!
            console.log('Server received task!');
            getHistory(); //update DOM
        }).catch(function(response) {
            alert ('Task not found');
            console.log(taskObj);
        });
        
    } else {
        alert('Please enter task name before submitting'); 
    }


} //end func addTask

function getHistory(){
    $.ajax({
        type: 'GET',
        url: '/todo'
    }).then(function (response) {
        // append data to the DOM
        
        $('#viewTodoList').empty(); //empty the DOM
        
        for (let i = 0; i < response.length; i++) {
            let task = response[i];
            
            let rowElement = $('<tr class = "row"></tr>');
                rowElement.append(`<td>${task.name}</td>`);
                rowElement.append(`<td>${task.notes}</td>`);
                rowElement.append(`<td id = 'status'>${task.date}</td>`);
                rowElement.append(`<td><button class="update-button" data-id='${task.id}'>Mark as Completed</button></td>`);
                rowElement.append(`<td class ='lastColumn'><button id="deleteButton" data-id='${task.id}'>Delete Task</button></td>`);

            $('#viewTodoList').append(rowElement);
        } //end for loop

    }) //.then 
}//end getHistory


function deleteTask(){
    const element = event.target;
    let taskId = $(element).data().id;
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this task!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        $.ajax({
          type: "DELETE",
          url: "/todo/" + taskId,
        }).then(function (response) {
          $(element).parent().parent().remove();
          console.log("Task deleted");
          getHistory();
        });
        swal("Task deleted", {
          icon: "success",
        });
      } else {
        swal("Task remains");
        return;
      }
    });
}