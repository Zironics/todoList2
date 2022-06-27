import {parseISO,isToday,isFuture, add} from 'date-fns';
import {isProject,currentProject} from './display';
import { deleteTaskFromProject,addTaskToProject } from './projects';
import { getTasks,updateTasks } from './storage';
export let globalTask=getTasks();
let globalId=0;


export function task(name) {
    this.id=globalId;
    globalId++;
    this.name=name;
    this.date="";
    this.priority=0;
    this.done=false;
    this.project="";
}


export function addTask(task){
    if(isProject){
        task.project=currentProject.name;
        addTaskToProject(currentProject,task);
    }
    globalTask.push(task);
    updateTasks(globalTask);
}


export function deleteTask(task){
    let i=searchTask(task.id);
    deleteTaskGlobal(i);
    if(task.project){
    deleteTaskFromProject(task);
    }
    updateTasks(globalTask);
}

function deleteTaskGlobal(i){
    globalTask.splice(i,1);
}

export function searchTask(id){
    for(let i=0;i<globalTask.length;i++){
        if(globalTask[i].id==id){
            return i;
        }
    }
}

export function getTaskId(div){
    return div.id;
}

export function setTask(div,value){
    let id=getTaskId(div);
    let i=searchTask(id);
    let task=globalTask[i];
    
    task.date=value;
    if(checkExpiredTask(task)){
        div.classList.add("expired");
    }
    else {
        div.classList.remove("expired");
    }
    let task_date=div.childNodes[1].childNodes[1];
    task_date.textContent=value;
    updateTasks(globalTask);
}


export function checkExpiredTask(task){
    if(task.date!=""){
       return !isFuture(parseISO(task.date)) && !isToday(parseISO(task.date)); 
    }
    return false;
}

