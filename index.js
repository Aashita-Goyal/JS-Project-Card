//Parent element to store card
const taskContainer = document.querySelector(".task__container");

//Global store
let globalStore = [];

const generateNewCard = (taskData) => `
<div class="col-md-6 col-lg-4">
                        <div class="card mb-4">
                            <div class="card-header d-flex justify-content-end gap-2">
                                <button type="button" class="btn btn-success" id=${taskData.id} onclick= "editCard.apply(this, arguments)">
                                <i class="fas fa-pencil-alt" id=${taskData.id} onclick= "editCard.apply(this, arguments)"></i>
                                </button>

                                <button type="button" class="btn btn-danger" id=${taskData.id} onclick= "deleteCard.apply(this, arguments)">
                                <i class="fas fa-trash-alt" id=${taskData.id} onclick= "deleteCard.apply(this, arguments)"></i>
                                </button>
                            </div>
                            <img src="${taskData.imageUrl}" class="card-img-top" alt="card__image">
                            <div class="card-body">
                              <h5 class="card-title">${taskData.taskTitle}</h5>
                              <p class="card-text">${taskData.taskDescription}</p>
                              <a href="#" class="btn btn-primary">${taskData.taskType}</a>
                            </div>
                            <div class="card-footer ">
                                <button type="button" id=${taskData.id} class="btn btn-primary float-end" id="open__task">Open Task</button>
                            </div> 
                          </div>
                      </div>
                      
`

const loadInitialCardData = () => {
    //local storage to get tasky data
    const getCardData = localStorage.getItem("tasky");

    //converting from string to normal object
    const {cards} = JSON.parse(getCardData);

    //loop over the array (card) to create HTML card and inject it to DOM
    cards.map((cardObject) => {
        taskContainer.insertAdjacentHTML("beforeend", generateNewCard(cardObject));
  
        //update out globalstore
        globalStore.push(cardObject);
    })
};

const updateLocalStorage = () => {
    localStorage.setItem("tasky", JSON.stringify({ cards:globalStore }));  //an object
};


const saveChanges = () => 
{
    const taskData = {
        id: `${Date.now()}`,  //unique number for id
        imageUrl: document.getElementById("imageurl").value,
        taskTitle: document.getElementById("tasktitle").value,
        taskType: document.getElementById("tasktype").value,
        taskDescription: document.getElementById("taskdescription").value,
    };

    taskContainer.insertAdjacentHTML("beforeend", generateNewCard(taskData));
  
    globalStore.push(taskData);

    //localStorage.setItem("tasky", JSON.stringify({cards:globalStore})); 
    updateLocalStorage();
};


const deleteCard = (event) => {

    event = window.event;  //event contains all browser related properties (window is parent of browser)
                           //It also contains the HTML element (of the card)

    //accessing id
    const targetID = event.target.id;
    const tagname = event.target.tagName;  //BUTTON


    globalStore = globalStore.filter((cardObject) => cardObject.id !== targetID);
    //localStorage.setItem("tasky", JSON.stringify({cards:globalStore}));  //an object
    updateLocalStorage();

   // globalStore = newUpdatedArray;

    //contacting parent

    if(tagname=="BUTTON"){
       return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode);
    }else{
        return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
    }
   // taskContainer.removeChild(getElementById(targetID));



};


const editCard = (event) => {
    event = window.event; 
    const targetID = event.target.id;
    const tagname = event.target.tagName;  //BUTTON

    //let taskTitle = document.querySelector(".card-title");
    // the above code has an issue. Here our code will read all cards alike.
    //therefore, correcting thi issue, we write,

    let parentElement;

    if(tagname === "BUTTON"){
        parentElement = event.target.parentNode.parentNode;
    }else{
        parentElement = event.target.parentNode.parentNode.parentNode;
    }

    let taskTitle = parentElement.childNodes[5].childNodes[1];
    let taskDescription = parentElement.childNodes[5].childNodes[3];
    let taskType = parentElement.childNodes[5].childNodes[5];

    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");

    //Now changing the Open task button to Save changes
    let submitButton = parentElement.childNodes[7].childNodes[1];

   
    submitButton.innerHTML = "Save Changes";
    submitButton.setAttribute(  //onvlivking the save changes button, it will enter SaveEditChanges
        "onclick",
        "saveEditChanges.apply(this, arguments)"
    );



   /* We log the parent elements to get the index of childnodes 
   in console on webpage. But we do not need to show this to the user,
   therefore console.log is disabled
    console.log(taskTitle);
    console.log(taskDescription);
    console.log(taskType); */
};



//Now we need to be able to save the changes done on editing

const saveEditChanges = (event) => {
    event = window.event; 
    const targetID = event.target.id;
    const tagname = event.target.tagName;  

    let parentElement;

    if(tagname === "BUTTON"){
        parentElement = event.target.parentNode.parentNode;
    }else{
        parentElement = event.target.parentNode.parentNode.parentNode;
    }

    let taskTitle = parentElement.childNodes[5].childNodes[1];
    let taskDescription = parentElement.childNodes[5].childNodes[3];
    let taskType = parentElement.childNodes[5].childNodes[5];
    let submitButton = parentElement.childNodes[7].childNodes[1];

    const updatedData = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML,
    };

    //console.log({ updatedData });  - to print the saved data in console

    
    //Our data is now being saved to local storage array
    //Now we need to save it to the global store array as well
    globalStore = globalStore.map((task) =>{
        if (task.id === targetID){
            return{
                id: task.id,  //this is not being edited by us, it remains same
                imageUrl: task.imageUrl, //this is also not being edited
                taskTitle: updatedData.taskTitle,
                taskDescription: updatedData.taskDescription,
                taskType: updatedData.taskType,
            }
        }
        return task;  //IMPORTANT 
        /* the above return only returns the matched data. 
                therefore we also NEED to write this return so that it returns 
                all data, even the one that did not match the above 
                condition i.e. the one which was NOT edited */
    });

    updateLocalStorage(); 
    //console.log(globalStore);


    /*Even after we are saving our changes, then, without clicking the
    'editing pencil' icon again, we can still edit the data on our card.
    However, we should Not be able to edit it again unless the pencil icon
    is clicked. Therefore, solving this issue, we apply setAttribute 
    contenteditable to false instead of tre */
    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");

    //Now changing the Save Changes button BACK TO open task
    submitButton.innerHTML = "Open Task";

    //After saving, if we click the save changes/open task button again,
    //it can again enter into the editing function, therefore,
    //to remove that, we se removeAttribute for submitButton 
    //(this happens after our edited changes are saved)
    submitButton.removeAttribute = ("onclick");


};



