let taskForm = document.forms.taskForm;
let main = document.querySelector('.main');
let tasksUl = document.querySelector('#tasks')
let newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.autofocus = true;
let navLists = document.querySelector('#leftPanel');
let nav = document.querySelector('nav');
let newList = document.createElement('input');
    newList.id = "newList";
    newList.type = 'text';
let addListButton = document.createElement('button');
    addListButton.textContent = 'add';
    addListButton.addEventListener('click', (e) => {
        localStorage[e.target.parentNode.firstChild.value] = JSON.stringify([]);
        renderTaskLists();
    })
let currentlist = 'mainList';


if (!localStorage[currentlist]) {
    localStorage[currentlist] = JSON.stringify([]);
}

renderTaskLists();
renderList();

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(taskForm.taskText.value);
    taskForm.taskText.value = '';
})

function addTask(task) {
    let newTask = {text: task, complete: false};
    let tasks = JSON.parse(localStorage[currentlist]);
    tasks[tasks.length] = newTask;
    localStorage[currentlist] = JSON.stringify(tasks);
    
    tasksUl.appendChild(createTaskLi(newTask));
}

function renderList(listName) {
    let tasks;
    try {
        tasks = listName ? JSON.parse(localStorage[listName.target.getAttribute('text')]) : JSON.parse(localStorage[currentlist]);
        currentlist = listName.target.getAttribute('text');
    } catch {
        tasks = JSON.parse(localStorage[currentlist] || localStorage['mainList']);
    }
    let list = document.createElement('ul');
    list.id = 'tasks'

    tasks.forEach(element => {
        list.appendChild(createTaskLi(element));
    });
    
    main.replaceChild(list, tasksUl);
    tasksUl = list;

    for (let i = 0; i < navLists.childNodes.length; i++) {
        if (navLists.childNodes[i].getAttribute('text') == currentlist) {
            navLists.childNodes[i].classList.add('active');
        } else {
            navLists.childNodes[i].classList.remove('active');
        }
      }
    
}

function createTaskLi(task) {
    let li = document.createElement('li');
    let deleteB = document.createElement('button');
    let completeB = document.createElement('input');
    deleteB.textContent = 'DELETE';
    deleteB.addEventListener('click', deleteTask);
    completeB.type = 'checkbox';
    completeB.checked = task.complete;
    completeB.classList.add('complete-check');
    completeB.addEventListener('change', completeTask);

    li.textContent = task.text;
    li.setAttribute('complete', task.complete) ;
    li.setAttribute('text', task.text) ;
    li.style.cursor = 'pointer';
    li.classList.add('task');
    li.addEventListener('click', changeTask);
    
    li.appendChild(deleteB);
    li.appendChild(completeB);
    return li;
}

function deleteTask(event) {
    event.stopPropagation();
    event = event.target.parentNode;
    tasksUl.removeChild(event);
    let tasks = JSON.parse(localStorage[currentlist]);
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].text == event.getAttribute('text')) {
            tasks.splice(i, 1);
            break;
        }
    }

    localStorage[currentlist] = JSON.stringify(tasks);
    
}

function completeTask(event) {
    
    event.stopPropagation();
    event = event.target.parentNode;
    event.setAttribute('complete', !event.getAttribute('complete'));
    let tasks = JSON.parse(localStorage[currentlist]);
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].text == event.getAttribute('text')) {
            tasks[i].complete = !tasks[i].complete;
            break;
        }
    }

    localStorage[currentlist] = JSON.stringify(tasks);
    renderList()
}

function changeTask(event) {
    if (event.target.getAttribute != 'li') {return;}
    
    let newText = prompt('Write new text', event.target.getAttribute('text'));

    if (!newText) {return};

    let tasks = JSON.parse(localStorage[currentlist]);
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].text == event.target.getAttribute('text')) {
            tasks[i].text = newText;
            break;
        }
    }

    localStorage[currentlist] = JSON.stringify(tasks);
    renderList();
}

function renderTaskLists() {
    let lists = document.createElement('ul');
    lists.id = 'leftPanel';


    for ( var i = 0, len = localStorage.length; i < len; ++i ) {
        let li = document.createElement('li');
        li.onclick = renderList;
        li.setAttribute('text', localStorage.key( i ));
        li.textContent = localStorage.key( i );
        li.classList.add('nav-element')
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'DELETE';
        deleteButton.addEventListener('click', deleteList);
        li.appendChild(deleteButton);

        lists.appendChild(li);
    }

    let lastLi = document.createElement('li');
    lastLi.appendChild(newInput);
    lastLi.appendChild(addListButton);
    lastLi.classList.add('nav-element')
    lists.appendChild(lastLi);

    nav.replaceChild(lists, navLists);
    navLists = lists;
}

function deleteList(event) {
    localStorage.removeItem(event.target.parentNode.getAttribute('text'));
    renderTaskLists();
}

