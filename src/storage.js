import {  } from "./tasks";

export function updateTasks(tasks){
    let newTasks=JSON.stringify(tasks);
    localStorage.removeItem('tasks');
    localStorage.tasks=newTasks;
}

export function updateProjects(projects){
    let newProjects=JSON.stringify(projects);
    localStorage.removeItem("projects");
    localStorage.projects=newProjects;
}

export function getTasks(){
    if(localStorage.getItem("tasks")){
        return JSON.parse(localStorage.tasks);
    }
    else return [];
}

export function getProjects(){
    if(localStorage.getItem("projects")){
        return JSON.parse(localStorage.projects);
    }
    else return [];
}