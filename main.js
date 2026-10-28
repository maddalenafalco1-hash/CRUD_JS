//Evento che attende che il DOM sia completamente caricato prima di eseguire il codice
document.addEventListener('DOMContentLoaded', () => {
    //endpoint servito dalla libreria json-server
    const API_URL = 'http://localhost:3000/todos';
    //questa è la ul
    const taskList = document.getElementById('task-list');
    //questa è l input
    const newTaskInput = document.getElementById('new-task');
    //questa è del button add task
    const addTaskBtn = document.getElementById('add-task');
    
    function fetchTasks(){ 
        fetch(API_URL)
        .then(res => res.json()) //converte la risposta in formato json
        .then(data => { // una volta ottenuto i dati
            //console.log(data);
            //svuotare la tabella
            taskList.innerHTML = ""; //innesto all html -> in questo caso nulla quindi svuoto
            //serve un ciclo per andare a costruire dinamicamente
            //ogni riga di ogni singolo task che avrà con sè il propri bottoni di edit e delete
            //quindi per ogni task ricevuto dall endopoint devo creare un tag <li> dentro all <ul> dell html
            //CHIAMATA GET IMPLICITA -> RECUPERA I DATI DEI TASK
            data.forEach(task => {
                //creo un nuovo elemento <li>
                const li = document.createElement('li');
                const span = document.createElement('span');
                //aggiungo il titolo del task allo span
                span.textContent = task.title;
                
                //bottone di flag complete
                const editBtn = document.createElement('button');
                editBtn.classList.add('toggle');
                editBtn.textContent = '✅';
                
                //bottone di edit
                const toggleBtn = document.createElement('button');
                toggleBtn.classList.add('toggle');
                toggleBtn.textContent = '🖊️';
                toggleBtn.onclick = () => editTask(task);
                
                //bottone di delete
                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('toggle');
                deleteBtn.textContent = '🗑️';
                deleteBtn.onclick = () => deleteTask(task.id);
                
                //btnGroup
                const btnGroup = document.createElement('div');
                btnGroup.append(editBtn, toggleBtn, deleteBtn);
                
                //appendo all html il titolo del task
                li.append(span, btnGroup);
                taskList.appendChild(li);
            });
        });
    }

    addTaskBtn.addEventListener('click', () => {
        //prendo il valore dall input e tolgo gli spazi( con il .trim())
        const title = newTaskInput.value.trim(); 
        if(title){
            fetch(API_URL, {
                method: 'POST', //METODO CHE CREA UN TITOLO
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({title}) //crea il task
            }).then(() =>{
                newTaskInput.value = '';//
                //ricarico i tasks con il nuovo task aggiunto
                fetchTasks();
            });
        }
    });

    //FUNZIONE DI UPDATE (MODIFICA) (MODIFICARE IL TITOLO DL TASK)
    function editTask(task){
        //chiedo il nuovo titolo all utente tramite prompt
        const nuovoTitolo = prompt('Modifica il titolo del task: ', task.title);
        if(nuovoTitolo !== null && nuovoTitolo.trim() !== ''){
            // backtick `` necessari per le variabili nell'URL
            fetch(`${API_URL}/${task.id}`, {
                method: 'PUT', //METODO CHE MODIFICA UN TITOLO
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({...task, title: nuovoTitolo.trim()}) //crea il task
            }).then(() =>{
                //ricarico i tasks con il nuovo task aggiunto
                fetchTasks();
            });
        }
    }

    function deleteTask(id){
        //  backtick `` necessari per le variabili nell'URL
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE', //METODO CHE CANCELLA UN TASK
        }).then(() =>{
            //ricarico i tasks con il nuovo task aggiunto
            fetchTasks();
        });
    }

    fetchTasks();
});