$(document).ready(onReady);

function onReady() {
  console.log('jquery is loaded!');
  $('#addButton').on('click', addTask);
  $(document).on("click", "#deleteButton", deleteTask);
  $(document).on("click", "#updateButton", update);
  getHistory();

} //end onReady

//-------POST---------------------
function addTask(event) {
  let name = $('#taskNameIn').val();
  let notes = $('#notesIn').val();
  console.log(notes);
  let due = $('#dueDate').val();

  if (due === '' || due === null) {
    due = undefined;
  }

  console.log(due);
  let now = new Date();
  let dueMilli = new Date(due);

  let setDate = dueMilli.getTime();
  let nowDate = now.getTime();

  let taskObj = {
    name: name,
    notes: notes,
    date: 'Not Completed', //default for new task
    due: due,
  };
  //getTime turns them to millseconds and then compares numbers
  if ((setDate < nowDate) && name !== '' && due !== undefined) { //do not let user enter past date for due date
    event.preventDefault(); //stops page from "passing by" swalAlert
    swal({
      position: 'top-end',
      icon: 'error',
      title: 'Past dates cannot be entered',
      // showConfirmButton: false,
      timer: 3000,
    })

  }
  else if (name !== '' && name !== undefined && ((setDate >= nowDate) || due === undefined)) {
    $('#taskNameIn').val('');//clears input
    $('#notesIn').val('');
    $('#dueDate').val('');

    $.ajax({
      method: 'POST',
      url: '/todo',
      data: taskObj,
    }).then(function (response) {
      //it made it!
      console.log('Server received task!');
      getHistory(); //update DOM
    }).catch(function (response) {
      alert('Task not found');
      console.log(taskObj);
    });

  }
  else {
    event.preventDefault();
    swal({
      position: 'top-end',
      icon: 'error',
      title: 'Please enter a task name before submitting',
      // showConfirmButton: false,
      timer: 3000,
    })
  }
} //end func addTask

//---------GET----------------------
function getHistory() {
  $.ajax({
    type: 'GET',
    url: '/todo'
  }).then(function (response) {
    // append data to the DOM

    $('#viewTodoList').empty(); //empty the DOM

    for (let i = 0; i < response.length; i++) {
      let task = response[i];

      let formattedDue = new Date(task.due)
      formattedDue = formatDate(formattedDue); //make it into a more friendly format


      let rowElement = $('<tr></tr>');
      if (task.date === 'Not Completed' && (formattedDue === 'Wed Dec 31 1969' || task.due === null)) { //no due date specified by user
        rowElement.append(`<td scope='row'>${task.name}</td>`);
        rowElement.append(`<td>${task.notes}</td>`);
        rowElement.append(`<td style='text-align:center'>Due Date Not Specified</td>`)
        rowElement.append(`<td style='text-align:center' id = 'status'>${task.date}</td>`);
        rowElement.append(`<td><button class='btn btn-success btn-sm' id="updateButton" data-id='${task.id}'>Mark Complete</button></td>`);
        rowElement.append(`<td class ='lastColumn'><button class="btn btn-danger btn-sm" id='deleteButton' data-id='${task.id}'>Delete Task</button></td>`);
      }
      else if (task.date === 'Not Completed') {  //gives proper due date format when due date is entered by user
        rowElement.append(`<td scope='row'>${task.name}</td>`);
        rowElement.append(`<td>${task.notes}</td>`);
        rowElement.append(`<td style='text-align:center'>${formattedDue}</td>`)
        rowElement.append(`<td style='text-align:center' id = 'status'>${task.date}</td>`);
        rowElement.append(`<td><button class='btn btn-success btn-sm' id="updateButton" data-id='${task.id}'>Mark Complete</button></td>`);
        rowElement.append(`<td class ='lastColumn'><button class="btn btn-danger btn-sm" id='deleteButton' data-id='${task.id}'>Delete Task</button></td>`);
      }
      else { //allows green checkmark to appear upon task completed
        rowElement.append(`<td>${task.name}</td>`);
        rowElement.append(`<td>${task.notes}</td>`);
        rowElement.append(`<td></td>`)
        rowElement.append(`<td style='text-align:center' id = 'status'>${task.date}</td>`);
        rowElement.append(`<td><img src='images/checkmark_trim.png' id="checkmark"/></td>`);
        rowElement.append(`<td class ='lastColumn'><button class="btn btn-danger btn-sm" id="deleteButton" data-id='${task.id}'>Delete Task</button></td>`);
      }
      $('#viewTodoList').append(rowElement);

    } //end for loop

  }) //.then 
}//end getHistory

//-------DELETE---------------------------
function deleteTask() {
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
      swal("Task not deleted");
      return;
    }
  });
}//end deleteTask

//----PUT-------
function update() {
  const element = event.target;
  let taskId = $(element).data().id;
  let date = new Date(); //get current date
  console.log(date);
  date = date.toString(); //make sure it is a string

  date = date.slice(0, 15); //cuts off time stamp (DAY MON Do YYYY)

  let updateObj = {
    id: taskId,
    date: date,
  }
  $.ajax({
    type: "PUT",
    url: "/todo/" + taskId,
    data: updateObj,

  }).then(function (response) {
    console.log("marked as read");
    location.reload();
  });
}

//-------TIME STUFF BELOW--------------------------------
function formatDate(due) {
  let weekDay = getWeekDay(due);
  let month = getMonth(due);
  let year = due.getFullYear();
  let day = due.getDate();

  if (day <= 9) {
    let strDate = (`${weekDay} ${month} 0${day} ${year}`); //make sure it matches other format
    return strDate;
  } else {
    let strDate = (`${weekDay} ${month} ${day} ${year}`);
    return strDate;
  }
}

function getWeekDay(due) {
  //Create an array containing each day, starting with Sunday.
  let weekdays = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
  ];
  //Use the getDay() method to get the day.
  let day = due.getDay();
  day = weekdays[day];
  //Return the element that corresponds to that index.
  return day;
}

function getMonth(due) {
  let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  let month = due.getMonth();
  month = months[month];
  return month;
}