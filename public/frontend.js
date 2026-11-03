async function getData() {
    const response = await fetch('/data');
    const data = await response.json();

    console.log(data);
    return data;
}

const databaseData = await getData();

let changeWord = databaseData[0].what; // Assuming you want to change the text to the 'name' field of the first row
let changeWord2 = databaseData[0].who; // Assuming you want to change the text to the 'name' field of the first row
const thingToChange = document.querySelector('.smallBox');

thingToChange.textContent = changeWord;

let button = document.querySelector('.btn');
let boolClicked = false;

button.addEventListener('click', () => {
    if (!boolClicked) {
        thingToChange.textContent = changeWord2;
        boolClicked = true;
    } else {
        thingToChange.textContent = changeWord;
        boolClicked = false;
    }
});