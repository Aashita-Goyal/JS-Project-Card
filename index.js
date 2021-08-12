//Parent element to store card
const taskContainer = document.querySelector(".task__container");

//Global store
let globalStore = [];

const generateNewCard = (taskData) => `
<div class="col-md-6 col-lg-4">
                        <div class="card">
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
                                <button type="button" class="btn btn-primary float-end" id="open__task">Open Task</button>
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

    

}


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

    localStorage.setItem("tasky", JSON.stringify({cards:globalStore})); 
};


const deleteCard = (event) => {

    event = window.event;  //event contains all browser related properties (window is parent of browser)
                           //It also contains the HTML element (of the card)

    //accessing id
    const targetID = event.target.id;
    const tagname = event.target.tagName;  //BUTTON


    globalStore = globalStore.filter((cardObject) => cardObject.id !== targetID);
    localStorage.setItem("tasky", JSON.stringify({cards:globalStore}));  //an object

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



   /* We log the parent elements to get the index of childnodes 
   in console on webpage. But we do not need to show this to the user,
   therefore console.log is disabled
    console.log(taskTitle);
    console.log(taskDescription);
    console.log(taskType); */
};