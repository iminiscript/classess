'use strict';

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
        this.speed = (this.distance / this.duration / 60);
        return this.speed;
    }
} 

// const run1 = new Running([39, -12], 5.3, 24, 178);
// const run2 = new Running([39, -12], 5.3, 24, 178);
// console.log(run1);
// console.log(run2);

const form = document.querySelector('.form');
const formSubmit = document.querySelector('.formBtn');
const containerWorkouts = document.querySelector('.workouts');
const containerItem = document.querySelector('.workout');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
    #map;
    #mapEvent;
    #workout = [];

    constructor(){
        this._getPosition();
        form.addEventListener('submit' , this._newWorkout.bind(this));
        form.addEventListener('click', this._removeWorkOut.bind(this));
    }

    _getPosition(){
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function() {
                    console.log('Error')
                }
            )
        }
    }

    _loadMap(position){
        console.log(this);
            console.log(position);
    
            const { latitude } = position.coords;
            const { longitude }  = position.coords;
            console.log(latitude, longitude);
            this.#map = L.map('map').setView([latitude, longitude], 13);
    
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.#map);
            
            console.log(this);
            console.log(this.#map)
            this.#map.on('click', this._showForm.bind(this));
    }
    _showForm(mapE) {
            this.#mapEvent = mapE;
            form.classList.remove('hidden');
            inputDistance.focus();

    }

    _hideForm() {
        inputDistance.value = '';
        form.classList.add('hidden');
    }

    _toggleElevevation(){
        
    }

    _newWorkout(event) {

        const validData = (...inputs) => inputs.every(inp => Number.isFinite(inp));

        const validPostive = (...inputs) => inputs.every(inp => inp > 0);
        
        event.preventDefault();

        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const {lat, lng} = this.#mapEvent.latlng;
        const cadence = +inputCadence.value;
        let workout;
        
        if( !validData(distance, duration, cadence) || 
            !validPostive(distance, duration, cadence)
        ) {
            return alert('msg');
        }
        workout = new Running([lat, lng],distance, duration, cadence );
        this.#workout.push(workout);

        this._renderWorkoutMap(workout);

        this._renderWorkoutList(workout);

        this._hideForm();
        
    }

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

    _renderWorkoutList(workout) {
        const $html = `
        <li class="workout workout--running" data-id="${workout.id}">
            <h2 class="workout__title">${workout.descrption}</h2>
            <div class="workout__details">
            <span class="workout__icon">🏃‍♂️</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
            </div>
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
            </div>
        </li>
        `

        form.insertAdjacentHTML('afterend', $html);
    }

    _removeWorkOut(e) {
        console.log('workoutEl');
        const workoutEl = e.target.closest('.workout');
        console.log(workoutEl);
    }
}

const app = new App();


