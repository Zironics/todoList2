import { toggleDisplay,displayInbox,clearInputs,listenDelete,displayProject,listenAddTask,currentProject,isProject} from "./display";
import closelogo from './images/icons8-close-24.png';
import { deleteTask } from "./tasks";
import { updateProjects,getProjects } from "./storage";
export let projectsList=getProjects();
export let globalId=0;

let addp=document.querySelector(".addP");
addp.addEventListener("click",addProject);

export function project(name){
    this.name=name;
    this.tasks=[];
}

export let addTaskToProject=function(pr,task){
   pr.tasks.push(task);
   updateProjects(projectsList);
}


function appendProject(name) {
    let projects=document.querySelector('.projects');
    let div=document.createElement('div');
    div.className='project';
    let div1 = document.createElement('div');
    div1.className='text-content';
    div1.textContent=name;
    let div2=document.createElement('div');
    div2.className='delete';
    let img=new Image();
    img.src=closelogo;
    div2.append(img);
    div.append(div1,div2);
    projects.append(div);
    listenProjets();
    clearInputs();
    listenProjets();
    listenDelete();
}

function appendExistingProjects(){
    for(let i=0;i<projectsList.length;i++){
        appendProject(projectsList[i].name);
    }
}
appendExistingProjects();

export function deleteProject(div) {
   let name=div.firstChild.textContent;
   let x;
   let i;
   for(i=0;i<projectsList.length;i++){
     if(projectsList[i].name==name){
        x=projectsList[i];
        break;
     }
   }
   for(let j=0;j<x.tasks.length;j++){
       deleteTask(x.tasks[j]);
   }
   
   if(isProject)
   {
    if(currentProject==x){
    displayInbox();
    }
   }  
   else
   {
    displayInbox();
   }
   projectsList.splice(i,1);  

   div.remove();
   updateProjects(projectsList);
   
}

export function deleteTaskFromProject(task){
    let project=task.project;
    let x;
    for(let i=0;i<project.tasks.length;i++){
        if(project.tasks[i]===task){
            x=i;
            break;
        }
    }
    project.tasks.splice(x,1);
    updateProjects(projectsList);
}

function checkProjectName(name){
    for(let i=0;i<projectsList.length;i++){
        if(projectsList[i].name==name) return false;
    }

    return true;
}

function projectClick(p){
    let div=p.firstChild;
    let x;
    let name=div.textContent;
    for(let i=0;i<projectsList.length;i++){
        if(projectsList[i].name==name){
           x=projectsList[i];
            break;
        }
    }
    displayProject(x);
    listenAddTask();
}

function addProject() {
    let input=document.querySelector(".add-options > input");
    let name=input.value;
    if(name) {
        if(checkProjectName(name))
        {
            appendProject(name);
            toggleDisplay();
        }
        else {
            alert('a project with this name already exists');
        }
    }

    let newPr=new project(name);
    projectsList.push(newPr);
    updateProjects(projectsList);
}

function listenProjets(){
    let projects=document.querySelectorAll('.project');
    projects.forEach(x => {
       x.addEventListener('click',handleClickProject);
    });
}

function handleClickProject(e){
    if(e.target.tagName!='IMG')
            projectClick(e.target);
}