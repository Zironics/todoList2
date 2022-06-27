import { globalTask,checkExpiredTask,setTask,task,addTask,deleteTask,getTaskId,searchTask} from "./tasks";
import { deleteProject } from "./projects";
import closelogo from './images/icons8-close-24.png';
import calendar from './images/icons8-calendar-48.png';
import { isToday, parseISO,isThisWeek,isThisMonth } from "date-fns";
import { } from "./storage";

export let isProject=false;

export let currentProject;
let m=0;
let addO=document.querySelector(".add-option");
let addOs = document.querySelector(".add-options");
let addCancel=document.querySelector(".cancel");
let inbox=document.querySelector(".inbox");
let today=document.querySelector(".today");
let month=document.querySelector(".month");
let week=document.querySelector(".week");

addO.addEventListener('click',toggleDisplay);
addCancel.addEventListener('click',toggleDisplay);
inbox.addEventListener("click",displayInbox);
today.addEventListener("click",displayToday);
week.addEventListener("click",displayWeek);
month.addEventListener("click",displayMonth);

 
export function addTaskDisplay(task){
    let task_content=document.querySelector('.tasks-container');
    let div_task=document.createElement('div');
    if(checkExpiredTask(task)){
        div_task.classList.add("expired");
    }
    div_task.classList.add("task");
    div_task.setAttribute("id",`${task.id}`);
    let task_info=document.createElement('div');
    task_info.classList.add("task-info");
    let pr=document.createElement("div");
    pr.classList.add("pr");
    switch (task.priority) {
        case 0: pr.classList.add("pr0");
            
            break;
        case 1: pr.classList.add("pr1"); break;
        case 2: pr.classList.add("pr2"); break;
        case 3: pr.classList.add("pr3"); break;
        default:
            break;
    }

    let task_name=document.createElement("div");
    task_name.classList.add("task-name");
    task_name.textContent=task.name;
    task_info.append(pr,task_name);
    let task_date=document.createElement("div");
    task_date.className="task-date";
    let dateicon=document.createElement("label");
    dateicon.className="date-icon";
    dateicon.setAttribute("for",`set${m}`);
    let dateinput=document.createElement("input");
    dateinput.setAttribute("type","date");
    dateinput.className="setDate";
    dateinput.id=`set${m}`;
    m++;
    let calendarimg=new Image();
    calendarimg.src=calendar;
    dateicon.append(calendarimg,dateinput);
    
    let date_value=document.createElement("div");
    date_value.className="date-value";
    if(task.date)
    {
    date_value.textContent=task.date;
    }
    else {
        date_value.textContent="no date";
    }
    task_date.append(dateicon,date_value);
    
    let delet=document.createElement("div");
    delet.className="delete";
    let img=new Image();
    img.src=closelogo;

    delet.append(img);

    div_task.append(task_info,task_date,delet);
    task_content.append(div_task);
    listenSetDate();
}

export function displayAddOptions(task_content){
    
    let addTaskbtn=document.createElement("button");
    addTaskbtn.className='addT display';
    addTaskbtn.textContent='Add Task';

    let taskAddOptions=document.createElement('div');
    taskAddOptions.className='taskAddOptions';

    let textLabel=document.createElement('label');
    textLabel.setAttribute('for','text');
    textLabel.textContent="name:";
    let taskInput = document.createElement('input');
    taskInput.setAttribute('type','text');
    taskInput.setAttribute('id','text');
    taskInput.setAttribute('maxlength','30');

    let dateLabel=document.createElement('label');
    dateLabel.setAttribute('for','date');
    dateLabel.textContent="due date:";

    let dateInput=document.createElement('input');
    dateInput.setAttribute('type','date');
    dateInput.setAttribute('id','date');
    let taskAddButtons=document.createElement('div');
    taskAddButtons.className='taskAddButtons';

    let addTask=document.createElement('button');
    addTask.className='addTask';
    addTask.textContent='Add task';

    let cancelAdd = document.createElement('button');
    cancelAdd.className='cancelAdd';
    cancelAdd.textContent='Cancel';
   
    let labelSelect=document.createElement('label');
    labelSelect.setAttribute('for','pr');
    labelSelect.textContent="select priority";
    let select=document.createElement('select');
    select.setAttribute("name","pr");

    let option=document.createElement('option');
    option.setAttribute("value","0");
    option.textContent="0";
    let option2=document.createElement('option');
    option2.setAttribute("value","1");
    option2.textContent="1";
    let option3=document.createElement('option');
    option3.setAttribute("value","2");
    option3.textContent="2";
    let option4=document.createElement('option');
    option4.setAttribute("value","3");
    option4.textContent="3";
    
    select.append(option,option2,option3,option4);


    taskAddButtons.append(addTask,cancelAdd);

    taskAddOptions.append(textLabel,taskInput,dateLabel,dateInput,labelSelect,select,taskAddButtons);

    task_content.append(addTaskbtn,taskAddOptions);

    listenAdd();
}

function clearContent(){
    let tasks=document.querySelector('.tasks');
    tasks.replaceChildren();
    isProject=false;
}

export function displayInbox() {
    clearContent();
    let task_content=document.querySelector(".tasks");
    let h1=document.createElement("h1");
    h1.textContent='INBOX';

    task_content.append(h1);
    let tasks_container=document.createElement('div');
    tasks_container.className='tasks-container';
    task_content.append(tasks_container);
    for (let i=0;i<globalTask.length;i++) {
        let task=globalTask[i];
        addTaskDisplay(task);
    }
    displayAddOptions(task_content);
    listenDelete();
    listenAddTask();
}


function toggleTaskAddDisplay() {
    let addtaskbtn=document.querySelector('.addT');
    addtaskbtn.classList.toggle('display');
    let addOptions=document.querySelector('.taskAddOptions');
    addOptions.classList.toggle('display');
}

export function toggleDisplay(){
    addO.classList.toggle('display');
    addOs.classList.toggle('display');
    clearInputs();
}

export function displayProject(project){
    clearContent();
    let task_content=document.querySelector(".tasks");
    let h1=document.createElement("h1");
    h1.textContent=project.name;
    task_content.append(h1);
    
    let tasks_container=document.createElement('div');
    tasks_container.className='tasks-container';
    task_content.append(tasks_container);

    for (let i=0;i<project.tasks.length;i++) {
        let task=project.tasks[i];
        addTaskDisplay(task);
    }

    displayAddOptions(task_content);

    isProject=true;
    currentProject=project;
}

function displayToday(){
    clearContent();
    let task_content=document.querySelector(".tasks");

    let h1=document.createElement("h1");
    h1.textContent="Today";
    task_content.append(h1);
    
    let tasks_container=document.createElement('div');
    tasks_container.className='tasks-container';
    task_content.append(tasks_container);

    for(let i=0;i<globalTask.length;i++){
        if(globalTask[i].date!=""){
            if(isToday(parseISO(globalTask[i].date))){
                addTaskDisplay(globalTask[i]);
            }
        }
    }
    listenDelete();
}

function displayWeek(){
    clearContent();
    let task_content=document.querySelector(".tasks");

    let h1=document.createElement("h1");
    h1.textContent="This week";
    task_content.append(h1);
    
    let tasks_container=document.createElement('div');
    tasks_container.className='tasks-container';
    task_content.append(tasks_container);

    for(let i=0;i<globalTask.length;i++){
        if(globalTask[i].date!=""){
            if(isThisWeek(parseISO(globalTask[i].date))){
                addTaskDisplay(globalTask[i]);
            }
        }
    }
    listenDelete();
}

function displayMonth(){
    clearContent();
    let task_content=document.querySelector(".tasks");

    let h1=document.createElement("h1");
    h1.textContent="This month";
    task_content.append(h1);
    
    let tasks_container=document.createElement('div');
    tasks_container.className='tasks-container';
    task_content.append(tasks_container);

    for(let i=0;i<globalTask.length;i++){
        if(globalTask[i].date!=""){
            if(isThisMonth(parseISO(globalTask[i].date))){
                addTaskDisplay(globalTask[i]);
            }
        }
    }
    listenDelete();
}

function removeTaskFromDisplay(div){
    div.remove();
}



//listners 

function listenAdd(){
    let addtaskbtn=document.querySelector('.addT');
    addtaskbtn.addEventListener('click',function(){
    toggleTaskAddDisplay();
    });
}

export function listenDelete(){
    let deletes=document.querySelectorAll('.delete');
    deletes.forEach(element => {
       element.addEventListener('click',handleDelete);
    });
}

function handleDelete(e){
    if(e.target.parentNode.parentNode.classList.contains('project')){
       deleteProject(e.target.parentNode.parentNode);
    }
    else {
     let id=getTaskId(e.target.parentNode.parentNode);
     let i=searchTask(id);
     let task=globalTask[i];
     deleteTask(task);
     removeTaskFromDisplay(e.target.parentNode.parentNode);
    }
}

function listenSetDate(){
    let inputs=document.querySelectorAll(".setDate");
    inputs.forEach(element => {
        element.addEventListener("change",handleSet);
    });
}

function handleSet(e){
    setTask(e.target.parentNode.parentNode.parentNode,e.target.value);
}

export function clearInputs(){
    let inputs=document.querySelectorAll("input");
    inputs.forEach(input => {
        input.value="";
    });
}

export function listenAddTask() {
    let addbtn=document.querySelector(".addTask");
    let cancelbtn=document.querySelector(".cancelAdd");
    addbtn.addEventListener('click',function(){
        let taskinput=document.querySelector('#text');
        let dateInput=document.querySelector("#date");
        let selectInput=document.querySelector('select[name="pr"]');
        if(taskinput.value && dateInput.value){
           let newtask=new task(taskinput.value);
           newtask.date=dateInput.value;
           newtask.priority=parseInt(selectInput.value);
           addTask(newtask);
           addTaskDisplay(newtask);
           toggleTaskAddDisplay();
           listenDelete();
           clearInputs();
        }
    });
    cancelbtn.addEventListener('click',function(){
        toggleTaskAddDisplay();
        clearInputs();
    });
}