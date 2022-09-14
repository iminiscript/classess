'use strict';


//const run1 = new Running([39, -12], 5, 30, 178);
// const run2 = new Running([39, -12], 5.3, 24, 178);
//console.log(run1);
// console.log(run2);

const form = document.querySelector('.jsForm');
const formSubmit = document.querySelector('.jsFormBtn');
const containerWorkouts = document.querySelector('.jsWorkouts');
const containerItem = document.querySelector('.workout');
const inputType = document.querySelector('.jsInputType');
const inputDistance = document.querySelector('.jsInputDistance');
const inputDuration = document.querySelector('.jsInputDuration');
const inputCadence = document.querySelector('.jsInputCadence');
const error = document.querySelector('.jsError');

// Parent Workout Class
class Workout {
    date = new Date();
    id = ( Date.now() + '').slice(-10);

    constructor(coords, distance, duration) {
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
        this._setDescOfWorkout();
    }

    _setDescOfWorkout() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.descrption = `Running on ${months[this.date.getMonth()]} ${this.date.getDate()}`
    }
}

//Child Running class extended from
class Running extends Workout {
    
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this.calcSpeed();
    }

    calcPace() {
        this.pace = this.duration / this.distance;
        return this.pace;
    }

    calcSpeed() {
        this.speed = (this.distance / this.duration * 60 );
        return this.speed;
    }
} 

// Main App Class 
class App {
    // Private Protected objects 
    #map;
    #mapEvent;
    #workout = [];

    constructor(){
        this._getPosition();
        form.addEventListener('submit' , this._newWorkout.bind(this));
    }

    _getPosition(){
        if(navigator.geolocation) {
            // This function take two arguments - Sucess and Failed 
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function() {
                    console.log('Error')
                }
            )
        }
    }

    _loadMap(position){
        // Loading Maps from External Library - Leaflet
            const { latitude } = position.coords;
            const { longitude }  = position.coords;
            console.log(latitude, longitude);
            this.#map = L.map('map').setView([latitude, longitude], 13);
        
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.#map);

            this.#map.on('click', this._showForm.bind(this));
    }
    // Show form based on click
    _showForm(mapE) {
            this.#mapEvent = mapE;
            form.classList.remove('hidden');
            inputDistance.focus();

    }
    // Hide form once form is submitted 
    _hideForm() {
        inputDistance.value = inputDuration.value = '';
        form.classList.add('hidden');
    }

    // Add New workout on the map
    _newWorkout(event) {

        // Check if Number is entered with Arrow Function 
        const validData = (...inputs) => inputs.every(inp => Number.isFinite(inp));

        // to check postive number is entered with Arrow function 
        const validPostive = (...inputs) => inputs.every(inp => inp > 0);
        
        event.preventDefault();

        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const {lat, lng} = this.#mapEvent.latlng;
       // const cadence = +inputCadence.value;
        let workout;
        
        // Guard class with Passing data validation functions 
        if( !validData(distance, duration) || 
            !validPostive(distance, duration)
        ) {
            // Showing Error messages and hide automatically after 2 sec
            error.classList.add('visible');
            setTimeout(() => {
                error.classList.remove('visible');
            },2000);
            return;
        }
        // Adding new workout 
        workout = new Running([lat, lng],distance, duration );
        this.#workout.push(workout);

        this._renderWorkoutMap(workout);

        this._renderWorkoutList(workout);

        this._hideForm();
        
    }
    // Rendering workout on Map 
    _renderWorkoutMap(workout) {
        L.marker(workout.coords)
        .addTo(this.#map)
        .bindPopup(L.popup({
            maxWidth: 200,
            autoClose: false,
            closeOnClick: false,
            className: 'running-popup',
        })
        ).setPopupContent(`🏃‍♂️ ${workout.descrption}`).openPopup();
    }
    // Rendering workout in list 
    _renderWorkoutList(workout) {
        const $html = `
        <li class="workout workout--running" data-id="${workout.id}">
            <h2 class="workout__title">${workout.descrption}</h2>
            <div class="workout__details">
            <span class="workout__icon">Distance:</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
            <span class="workout__icon">Time:</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
            </div>
            <div class="workout__details">
            <span class="workout__icon">Pace:</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
            <span class="workout__icon">Speed:</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/hr</span>
            </div>
        </li>
        `
        form.insertAdjacentHTML('afterend', $html);
    }
}
// Calling the class 
const app = new App();


