import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [questions, setQuestions] = useState([]);
  const [isLoad, setIsLoad] = useState(true);
  const [isResult, setIsResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setQurrentQuestion] = useState(0);
  const [isQuizEnded, setIsQuizEnded] = useState(localStorage.getItem('isQuizEnded') !== 'true');
  const [result, setResult] = useState(0);
  const selectAnswer = (e) => {
    const temp = [...answers];
    temp[currentQuestion] = e;
    setAnswers(temp);
    localStorage.setItem('answers', JSON.stringify(temp));
  }
  const nums = [];
  for (let i = 0; i < 50; i++) {
    nums[i] = i;
  }
  const end = () => {
    setIsLoad(true);
    const arr = [];
    for (let i = 0; i < 50; i++) {
      arr[i] = {
        index: questions[i].index,
        answer: answers[i]
      }
      axios.post('http://localhost:8080/check', { arr: arr })
        .then((result) => {
          setResult(result.data);
          setIsLoad(false);
          setIsResult(true);
          localStorage.setItem('isQuizEnded', 'false');
          localStorage.setItem('questions', []);
          localStorage.setItem('answers', []);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  useEffect(() => {
    if (isQuizEnded) {
      axios
        .get('https://tester-back.vercel.app/questions')
        .then((result) => {
          setQuestions(result.data);
          localStorage.setItem('isQuizEnded', 'true');
          localStorage.setItem('questions', JSON.stringify(result.data));
          localStorage.setItem('answers', JSON.stringify([]));
          setIsLoad(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setAnswers(JSON.parse(localStorage.getItem('answers')));
      setQuestions(JSON.parse(localStorage.getItem('questions')));
      setIsLoad(false);
    }

  }, []);

  return (
    <div className="App">
      {isLoad ?
        <div>
          Loading...
        </div>
        : isResult ?
          <div>
            <h1>Your result: {result}/50</h1>
          </div>
          :
          <div>
            <div>Question: {currentQuestion + 1}/50</div>
            <h1>{questions[currentQuestion].question}</h1>
            {questions[currentQuestion].options.map((e) => {
              return (<div className={answers[currentQuestion] == e ? 'option' : ''} key={e} onClick={() => { selectAnswer(e) }}>
                <div>{String.fromCharCode('A'.charCodeAt() + questions[currentQuestion].options.indexOf(e))}</div>
                {e}
              </div>);
            })}
            <div onClick={() => {
              if (currentQuestion != 49) {
                setQurrentQuestion(currentQuestion + 1)
              }
            }}>Next</div>
            <div onClick={() => {
              if (currentQuestion != 0) {
                setQurrentQuestion(currentQuestion - 1)
              }
            }}>Previous</div>
            <div onClick={end} >End Quiz</div>
            <div>

            </div>
          </div>
      }
    </div>
  );
}

export default App;
