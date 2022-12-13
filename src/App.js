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
    if (  temp[currentQuestion] ===e){
  
temp[currentQuestion]='nothing'
  
    }
    else{
      temp[currentQuestion]=e
    }
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
        answer: answers[i] ?? "nothing"
      }
    }
    console.log(JSON.stringify(arr));
    axios.post('https://tester-back.vercel.app/check', { arr: arr })
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
    <div className="quiz">
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
             <div className='navigation'>
              {nums.map((e)=>{
                return (<div onClick={()=>{setQurrentQuestion(e)}} key={e} className='navigation__number'>{e+1}</div>)
              })}
            </div>
            <div >Question: {currentQuestion + 1}/50</div>
            <h1 className='question'>{questions[currentQuestion].question}</h1>
       <div className='answer'>
            {questions[currentQuestion].options.map((e) => {
              return (<div key={e} >
       
      <div className='answers'>
                <div className={answers[currentQuestion] == e ? 'answer-letter1 ' : 'answer-letter'}  onClick={() => { selectAnswer(e) }}>{String.fromCharCode('A'.charCodeAt() + questions[currentQuestion].options.indexOf(e))}</div>
                <div className='answer-text'>{e} </div>
                
         </div>
      </div>
                );
         
            })}
</div>
<div className='button'>
            <div className='btn'onClick={() => {
              if (currentQuestion != 49) {
                setQurrentQuestion(currentQuestion + 1)
              }
            }}>Next</div>
            <div className='btn'onClick={() => {
              if (currentQuestion != 0) {
                setQurrentQuestion(currentQuestion - 1)
              }
            }}>Previous</div>
            <div onClick={end} className='btn-end'>End Quiz</div>
            </div>
         
          </div>

      }
    </div>
  );
}

export default App;
