const taskContainer = document.querySelector(".task__container");

const globalStore = [];

const generateNewCard = (taskData) => `
<div class="col-md-6 col-lg-4 id=${taskData.id}">
                        <div class="card">
                            <div class="card-header d-flex justify-content-end gap-2">
                                <button type="button" class="btn btn-success"><i class="fas fa-pencil-alt"></i></button>
                                <button type="button" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>
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