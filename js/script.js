//Variables
const url = 'https://randomuser.me/api/?results=12&nat=gb';
const searchContainer = document.querySelector('.search-container');
const gallery = document.getElementById('gallery');
const usersArray = [];



//Adding the elements to the DOM

//Appending the form to the search Container
const searchHtml = `
<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>`;

searchContainer.insertAdjacentHTML('beforeend',searchHtml);



//Function for Appending the cards  to the gallery
function createCard(user){
    const galleryHtml = `
        <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${user.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
        </div>
        </div>`;
    
    gallery.insertAdjacentHTML('beforeend',galleryHtml);
}

//Function for Appending the modals to the body
function createModal(user,userIndex,arr){
const body = document.querySelector('body');

//Declaring the date the user was born
const date = new Date(user.dob.date);

const modalHtml = `
    <div class="modal-container">

        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${user.name.first}</h3>
                <p class="modal-text">${user.email}</p>
                <p class="modal-text cap">${user.location.city}</p>
                <hr>
                <p class="modal-text">${formatCellNumber(user.cell)}</p>
                <p class="modal-text">${user.location.street.number}, ${user.location.street.name}, ${user.location.country}, ${user.location.postcode}</p>
                <p class="modal-text">Birthday: ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}</p> 
            </div>
        </div>

        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>`;

    //Function for formating the cell number as is is expected
    function formatCellNumber(str){
        //Filter only numbers from the input
      let cleaned = ('' + str).replace(/\D/g, '');
      
      //Check if the input is of correct length
      let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    
      if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
      };
    
      return null;
    }

    body.insertAdjacentHTML('beforeend',modalHtml);

    //Declaring modal variables
    const currentMod = document.querySelector('.modal-container');
    const closeBtn = document.querySelector('.modal-close-btn');
    const next = document.querySelector('.modal-next');
    const previous = document.querySelector('.modal-prev');

    //Checking if it is the first or the last element of the array to hide the appropriate next or prev button

    if ( userIndex === arr.length - 1){
        next.style.display = 'none';
    }else{
        next.style.display = 'block';
    }

    if ( userIndex === 0){
        previous.style.display = 'none';
    }else{
        previous.style.display = 'block';
    }

    //Adding event listeners to close next and previous buttons

    next.addEventListener('click',() =>{
        userIndex++;
        currentMod.remove();
        createModal(arr[userIndex],userIndex,arr);
    })

    previous.addEventListener('click',() =>{
        userIndex--;
        currentMod.remove();
        createModal(arr[userIndex],userIndex,arr);
    })

    closeBtn.addEventListener('click',() =>{
        currentMod.remove();
    })

    currentMod.addEventListener('click',(e) =>{
        if (e.target.className === 'modal-container'){
            currentMod.remove();
        }else{
            null;
        }
    })
}





//Make a request to the random user API and get back a promise
async function getUsers (url) {

    const response = await fetch(url);
    const users = await response.json()
    return users.results;

}

//Fill the users array,call the createcard function and call the appendEventListeners function
getUsers(url)
    .then(data => data.forEach(user => { createCard(user),usersArray.push(user) }))
    .then(appendEventListeners)
    .catch( () => gallery.innerHTML += `<h3>There was an error fetching your data</h3>`);


//Append event listeners to all the cards in our page  and create a modal when we click in one card

function appendEventListeners () {
    const usersCards = document.querySelectorAll(".card");
  
    for (let i = 0; i < usersCards.length; i++) {
        
        usersCards[i].addEventListener("click", () => {
                createModal(usersArray[i],i,usersArray);
        })
    }
}

//Search section
//Declaring the cariables for the input and the submit button
const input = document.getElementById('search-input');
const submit = document.getElementById('search-submit');

//Creating the search function to filter the users that matches with the input
function search(input,users){
    const filteredUsers = [];

    for (let i=0;i<users.length;i++){
        let userName = `${users[i].name.first.toLowerCase()}  ${users[i].name.last.toLowerCase()}`;

        if (input.length > 0 && userName.includes(input.toLowerCase().trim(""))){
            filteredUsers.push(users[i]);
        }
    }
    return filteredUsers;
}

//Creating the final search function to display the correct users or error message to the screen
function finalSearch(str,users){
    //if the input form is empty we display all the fetched users
    if(str.length===0){
        gallery.innerHTML = "";
        usersArray.forEach(user=> createCard(user));
        appendEventListeners();
        return false;
    } 
    //if the array of filtered users is empty which means that the input value did not match any user we display an error message
    else if( users.length ===0){
        gallery.innerHTML = "";
        gallery.innerHTML = " <h3>No search results!</h3>";
        return false;
    }
    
    //else we display the matched user cards
    else{
        gallery.innerHTML = "";
        users.forEach(user=> createCard(user));
        return true;
    }
}

//Event listeners for the input and the submit button
input.addEventListener('keyup',() => {
    const filter = search(input.value,usersArray);

    if (finalSearch(input.value,filter)){
        appendEventListeners(filter);
    }else{
        null;
    }


})

submit.addEventListener('click', (e) => {
    e.preventDefault();
})

