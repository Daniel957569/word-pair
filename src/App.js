import './App.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

function App() {
    const [buttonColor, setButtonColor] = useState('white');
    const [wordData, setWordData] = useState(null);


    useEffect(() => {
        axios.get('http://localhost:8080/get_words')
            .then(response => setWordData(response.data))
            .catch(error => console.error(error));
    }, []);

    function handleClick() {
        const newColor = buttonColor === 'white' ? 'red' : 'white';
        setButtonColor(newColor);
    }

    return (
        <div className="button-container">
            <div className="button-set">
                <button className="button" style={{backgroundColor: buttonColor}} onClick={handleClick}>Hond</button>
                <button className="button">Kat</button>
                <button className="button">Vogel</button>
            </div>
            <div className="button-set">
                <button className="button">Dog</button>
                <button className="button">Cat</button>
                <button className="button">Bird</button>
            </div>
            <div className='button-set'>
                <audio id='player' src='./Beslissen.mp3' />
                <button className="button" onClick={(e) => {
                    let vid = document.getElementById("player");
                    vid.volume = 0.05;
                    vid.play();
                }}>Play</button>
                <button className="button">Cat</button>
                <button className="button">Bird</button>
            </div>
        </div >
    );
}

export default App;



// <button onClick={(e) => > Play</ button>
