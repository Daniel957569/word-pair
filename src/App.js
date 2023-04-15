import './App.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';



function App() {
    const [wordData, setWordData] = useState(null);
    const [currentWordData, setCurrentWordData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [correctCounts, setCorrectCounts] = useState({count: 0, top_count: 10});
    const [wordsClicked, setWordsClicked] = useState({
        dutch_Id: -1,
        english_id: -1,
        count: 0
    });
    const [triggerChange, setTriggerChange] = useState(false);

    useEffect(() => {
        if (triggerChange) {
            changeCurrentPairWords(correctCounts.top_count + 10)
            setTriggerChange(false);
        }

    }, [triggerChange])

    useEffect(() => {
        if (wordData == null) {
            axios.get('http://localhost:3070/get_words')
                .then(response => {
                    setWordData(response.data);

                    const dutch = shuffle(response.data.dutch.slice(0, 10));
                    const english = shuffle(response.data.english.slice(0, 10));

                    setCurrentWordData({dutch, english});

                    setIsLoading(false);
                })
                .catch(error => console.error(error));
        }
    }, []);

    useEffect(() => {
        if (isGenerating) {
            console.log("generating...");
            axios.get('http://localhost:3070/generate_sounds')
                .then(setIsGenerating(false))
                .catch(error => console.error(error));
            setIsGenerating(false);
        }
    }, [isGenerating])

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getWordById(array, id) {
        for (let index = 0; index < array.length; index++) {
            if (array[index].id == id) {
                return index;
            }
        }
    }

    function changeCurrentPairWords(count) {
        const dutch = shuffle(wordData.dutch.slice(count - 10, count));
        const english = shuffle(wordData.english.slice(count - 10, count));

        setCurrentWordData({dutch, english});
    }

    function handleDutchClick(event) {
        const buttonIndex = event.target.getAttribute("data-index");
        const newWordData = {...wordData};
        let obj = newWordData.dutch[buttonIndex];

        if (obj.color == 'green') {
            return;
        }

        if (wordsClicked.count == 0) {
            setWordsClicked({
                dutch_Id: obj.id,
                english_Id: -1,
                count: 1,
            });
            newWordData.dutch[buttonIndex].color = "red";
        } else if (wordsClicked.english_id != -1) {
            if (obj.id === wordsClicked.english_id) {
                // correct pair
                obj.color = "green";
                newWordData.english[getWordById(newWordData.english, obj.id)].color = "green";

                setWordsClicked({
                    dutch_Id: -1,
                    english_Id: -1,
                    count: 0,
                });
            }
        } else {
            return;
        }
        setWordData(newWordData);

    }

    function handleEnglishClick(event) {
        const buttonIndex = event.target.getAttribute("data-index");
        const newWordData = {...wordData};
        let obj = newWordData.english[buttonIndex];


        if (obj.color == 'green') {
            return;
        }


        if (wordsClicked.dutch_Id != -1) {
            if (obj.id === wordsClicked.dutch_Id) {
                // correct pair
                obj.color = "green";
                newWordData.dutch[getWordById(newWordData.dutch, obj.id)].color = "green";


                setWordsClicked({
                    dutch_Id: -1,
                    english_Id: -1,
                    count: 0,
                });

                const count = correctCounts.count + 1;
                if (correctCounts.top_count == count) {
                    setTriggerChange(true);
                    setCorrectCounts({count, top_count: correctCounts.top_count + 10});
                } else {
                    setCorrectCounts({count, top_count: correctCounts.top_count});
                }
                console.log(count, count / 2 + 1);

                // filled all of the pair, setting next pairs of wods.
            }
        } else {
            return;
        }

        setWordData(newWordData);
    }


    function handleGenerateClick() {
        setIsGenerating(true);
    }

    function handleNextWords() {
        setCorrectCounts({count: correctCounts.top_count, top_count: correctCounts.top_count + 10})
        setTriggerChange(true);
    }

    return (
        <div >
            <button onClick={handleNextWords} style={{marginLeft: "45.5%"}} className='generate-button'>Next</button>
            {
                isGenerating ? <h1>Generating sounds...</h1> :
                    <div className="button-container">
                        {isLoading && <p>Loading...</p>}
                        {!isLoading && (
                            <div className="button-set">
                                {currentWordData.dutch.map((obj, index) => (
                                    <div key={index}>
                                        <audio id={`${obj.word}`} src={`./sounds/${obj.word}.mp3`}></audio>
                                        <button
                                            key={obj.word}
                                            className="button"
                                            style={{backgroundColor: obj.color}}
                                            onClick={(e) => {
                                                let vid = document.getElementById(`${obj.word}`);
                                                vid.volume = 0.05;
                                                vid.play();
                                                handleDutchClick(e);
                                            }}
                                            data-index={obj.id - 1}

                                        >
                                            {obj.word}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {isLoading && <p>Loading...</p>}
                        {!isLoading && (
                            <div className="button-set">
                                {currentWordData.english.map((obj, index) => (
                                    <button
                                        key={index}
                                        className="button"
                                        style={{backgroundColor: obj.color}}
                                        onClick={handleEnglishClick}
                                        data-index={obj.id - 1}
                                    >
                                        {obj.word}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div >
            }
            <button
                className="generate-button"
                disabled={isGenerating}
                onClick={handleGenerateClick}
            >
                generate
            </button>
        </div >
    );
}

export default App;



// <button onClick={(e) => > Play</ button>
