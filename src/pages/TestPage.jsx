import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TestPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: API에서 질문 데이터 가져오기
    // 임시 더미 데이터
    const dummyQuestions = [
      {
        question_id: 1,
        question_text: "새로운 경험을 시도하는 것을 좋아한다",
        target_node: "Openness",
        answer_options: ["전혀 그렇지 않다", "그렇지 않다", "보통이다", "그렇다", "매우 그렇다"]
      },
      {
        question_id: 2,
        question_text: "계획을 세우고 체계적으로 일을 처리한다",
        target_node: "Conscientiousness",
        answer_options: ["전혀 그렇지 않다", "그렇지 않다", "보통이다", "그렇다", "매우 그렇다"]
      }
    ];
    setQuestions(dummyQuestions);
    setLoading(false);
  }, []);

  const handleAnswer = (answer) => {
    const newAnswer = {
      question_id: questions[currentQuestion].question_id,
      answer: answer,
      target_node: questions[currentQuestion].target_node
    };
    
    setAnswers(prev => [...prev, newAnswer]);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      
      // 중간 점검 (예: 50% 완료 시)
      if (currentQuestion + 1 === Math.floor(questions.length / 2)) {
        navigate('/intermediate');
        return;
      }
    } else {
      // 마지막 질문 완료
      console.log('모든 답변 완료:', [...answers, newAnswer]);
      // TODO: 답변 제출
      navigate('/final');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>질문을 불러오는 중...</div>;
  }

  if (questions.length === 0) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>질문을 불러올 수 없습니다.</div>;
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          width: '100%', 
          height: '10px', 
          backgroundColor: '#e0e0e0', 
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${progress}%`, 
            height: '100%', 
            backgroundColor: '#4CAF50',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          {currentQuestion + 1} / {questions.length}
        </p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2>{questions[currentQuestion].question_text}</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {questions[currentQuestion].answer_options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            style={{
              padding: '15px 20px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              backgroundColor: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#f5f5f5';
              e.target.style.borderColor = '#4CAF50';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.borderColor = '#ddd';
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TestPage;