const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

function renderCafe(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let deleteButton = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    deleteButton.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(deleteButton);
    
    cafeList.appendChild(li);

    // delete a particular data
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        let id = event.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    });
}

async function getAllCafes() {
    let cafes = await db.collection('cafes').orderBy('name').get();

    cafes.docs.forEach(doc => {
        renderCafe(doc);
    });
}

async function getCafeBy(field, condition, val) {
    let cafes = await db.collection('cafes').where(field, condition, val).orderBy('name').get();

    cafes.docs.forEach(doc => {
        renderCafe(doc);
    });
}

function getCafeRealTime() {
    db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == 'added') {
                renderCafe(change.doc);
            }
            else if (change.type == 'removed') {
                let li = cafeList.querySelector(`[data-id=${change.doc.id}]`);
                cafeList.removeChild(li);
            }
        });
    });
}

getCafeRealTime();
// getAllCafes();
// getCafeBy('city', '==', 'Surabaya');



// save data to database
form.addEventListener('submit', (event) => {
    event.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    })
    form.name.value = '';
    form.city.value = '';
});