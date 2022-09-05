localStorage.clear()

async function getRepos(requestText){
    try {
        let response = await fetch(`https://api.github.com/search/repositories?q=${requestText}`);
        let responseRepos = await response.json();
        let repositories = [];
        for (let i = 0; i < 5; i++ ){
            let repo = {
                name: responseRepos['items'][i]['name'],
                owner: responseRepos['items'][i]['owner']['login'],
                stars: responseRepos['items'][i]['stargazers_count']
            }
            repositories.push(repo);
        }
        localStorage.setItem('currentRepos', JSON.stringify(repositories));
    } catch (error) {
        console.log(error);
    }
}

function renderAutocomplete(elements){
    let parent = document.querySelector(`.autocomplete--container`);
    clearOldRepos();
    if (searchInput.value){
        elements.forEach((element, index) => {
            let li = document.createElement('li');
            li.classList.add('autocomplete--item');
            li.textContent = element['name'];
            li.setAttribute('repoId', index);
            parent.appendChild(li);
            li.addEventListener('click', ()=> {
                renderSavedRepo(elements[index]);
                clearOldRepos();
            });
        });
    };
};

function renderSavedRepo(element){
    let parent = document.querySelector(`.added-repos--container`);
    let template = document.getElementById('repos-item');
    template.content.querySelector('.name-value').textContent = element['name'];
    template.content.querySelector('.owner-value').textContent = element['owner'];
    template.content.querySelector('.stars-value').textContent = element['stars'];
    let li = template.content.cloneNode(true);
    parent.appendChild(li);
    searchInput.value = '';
};

function debounce(fn, debounceTime) {
    let timeout; 

    return function (...rest){
        clearTimeout(timeout)
        timeout = setTimeout(fn.bind(null, ...rest), debounceTime)
    }
}

function clearOldRepos(){
    let oldRepos = document.querySelectorAll('.autocomplete--item');
    if (oldRepos) {
        for (let oldRepo of oldRepos){
            oldRepo.remove()
        }
    }
}

const search =  (value) => {
    getRepos(value)
    .then(() => {   
        const curRepos = localStorage.getItem('currentRepos');
        renderAutocomplete(JSON.parse(curRepos));
     });
}
const searchDebounced = debounce(search, 600);

const searcInputHandler = (event) => {
    const value = event.target.value;
    if (value.length > 0){
        searchDebounced(value);
    } else {
        clearOldRepos();
    };
};

const searchInput = document.getElementById('search');
const addedReposContainer = document.querySelector('.added-repos--container');

  
searchInput.addEventListener('input', searcInputHandler);

addedReposContainer.addEventListener('click', event => {
    let target = event.target;
    if (target.tagName == 'BUTTON' || target.tagName == 'IMG'){
        const li = target.closest('li');
        li.remove()
    };
}) ; 




