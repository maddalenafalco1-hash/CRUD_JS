document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/todos';
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task');

    function fetchTasks(){ 
        fetch(API_URL)
        .then(res => res.json())
        .then(data => { 
            taskList.innerHTML = ""; 
            
            data.forEach(task => {
                const li = document.createElement('li');
                const span = document.createElement('span');
                span.textContent = task.title;
                
                // CORRETTO: Usa 'done' per corrispondere esattamente al CSS del professore
                if (task.completed) {
                    span.classList.add('done');
                }

                // Bottone di flag complete (✅)
                const editBtn = document.createElement('button');
                editBtn.classList.add('toggle');
                editBtn.textContent = '✅';
                editBtn.onclick = () => toggleComplete(task);

                // Bottone di edit (🖊️)
                const toggleBtn = document.createElement('button');
                toggleBtn.classList.add('toggle');
                toggleBtn.textContent = '🖊️';
                toggleBtn.onclick = () => editTask(task);
                
                // Bottone di delete (🗑️)
                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('toggle');
                deleteBtn.textContent = '🗑️';
                deleteBtn.onclick = () => deleteTask(task.id);
                
                const btnGroup = document.createElement('div');
                btnGroup.append(editBtn, toggleBtn, deleteBtn);
                
                li.append(span, btnGroup);
                taskList.appendChild(li);
            });
        });
    }

    addTaskBtn.addEventListener('click', () => {
        const title = newTaskInput.value.trim(); 
        if(title){
            fetch(API_URL, {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({title, completed: false}) // parte come non completato
            }).then(() =>{
                newTaskInput.value = '';
                fetchTasks();
            });
        }
    });

    function editTask(task){
        const nuovoTitolo = prompt('Modifica il titolo del task: ', task.title);
        if(nuovoTitolo !== null && nuovoTitolo.trim() !== ''){
            fetch(`${API_URL}/${task.id}`, {
                method: 'PUT',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({...task, title: nuovoTitolo.trim()})
            }).then(() =>{
                fetchTasks();
            });
        }
    }

    function deleteTask(id){
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        }).then(() =>{
            fetchTasks();
        });
    }

    function toggleComplete(task){
        
        fetch(`${API_URL}/${task.id}`, {
            method: 'PUT',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({...task, completed: !task.completed})
        }).then(() =>{
            fetchTasks();
        })
    }

    fetchTasks();
});