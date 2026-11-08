const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
const socket = new WebSocket(`${protocol}//${location.host}`);

socket.onopen = () => {
    console.log('WebSocket connected!');
};

socket.onmessage = async (event) => {
    if (event.data === 'updated') {
        databaseData = await getData();
        createDivs();
    }
};

async function getData() {
    const response = await fetch('/data');
    const data = await response.json();

    console.log(data);
    return data;
}

let databaseData = await getData();

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

let inputBox = document.querySelector('.inputBox');
let postButton = document.querySelector('.btn2');

postButton.addEventListener('click', async () => {
    await fetch('/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
            {   
                who: inputBox.value,
                what: "filler"
            })
    });
});

function createDivs() {

    document.querySelectorAll('.dataRow').forEach(div => div.remove());

    databaseData.forEach(row => {
        const div = document.createElement('div');
        const whoDiv = document.createElement('div');
        const whatDiv = document.createElement('div');
        const button = document.createElement('button');

        div.id = row.id;
        div.className = 'dataRow';
        whatDiv.className = 'whatDiv';

        whoDiv.textContent = row.who;
        whatDiv.textContent = row.what;
        button.textContent = 'Edit';

        let isEditing = false;

        button.addEventListener('click', async () => {
            if (!isEditing) {
                isEditing = true;

                const parent = button.parentElement;
                const whatDiv = parent.querySelector('.whatDiv');

                const input = document.createElement('input');
                input.value = whatDiv.textContent;

                whatDiv.replaceWith(input);

                button.textContent = 'Save';
                return;
            }
            else {

                const input = button.parentElement.querySelector('input');
                const newValue = input.value;
                const response = await fetch(`/data/${row.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        who: row.who,
                        what: newValue
                    })
                });

                input.replaceWith(whatDiv);
                whatDiv.textContent = newValue;

                if (!response.ok) return;

                isEditing = false;
                button.textContent = 'Edit';
            }
        });

        div.appendChild(whoDiv);
        div.appendChild(whatDiv);
        div.appendChild(button);

        document.body.appendChild(div);
    });
}

createDivs();

