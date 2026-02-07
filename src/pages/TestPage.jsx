import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/TestPage.css';

const TestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  // LandingPage에서 전달받은 sessionId
  const sessionId = location.state?.sessionId;
  // IntermediateResultPage에서 돌아왔는지 확인
  const resumeFromIntermediate = location.state?.resumeFromIntermediate;

  useEffect(() => {
    // sessionId가 없으면 랜딩 페이지로 리다이렉트
    if (!sessionId) {
      navigate('/');
      return;
    }
    
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/test/questions');
        const data = await response.json();
        
        if (data.success) {
          setQuestions(data.data.questions);
          
          // 중간 결과에서 돌아온 경우 질문 번호 설정
          if (resumeFromIntermediate) {
            setCurrentQuestion(22); // 22번째 질문 다음부터 시작 (23번째 질문)
          }
        } else {
          console.error('질문 로드 실패:', data);
        }
      } catch (error) {
        console.error('API 호출 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const submitIntermediateAnswers = async (allAnswers) => {
    console.log('중간 답변 제출 시작:', allAnswers.length, '개 답변');
    try {
      const response = await fetch('http://localhost:8000/api/test/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          answers: allAnswers,
          progress: {
            current_step: currentQuestion + 1,
            total_steps: questions.length,
            is_final: false
          }
        })
      });

      const data = await response.json();
      console.log('중간 답변 제출 응답:', data);
      
      if (data.success) {
        console.log('중간 결과 페이지로 이동:', sessionId);
        // 중간 결과 페이지로 이동
        navigate('/intermediate', { state: { sessionId } });
      } else {
        console.error('중간 답변 제출 실패:', data.error);
      }
    } catch (error) {
      console.error('API 호출 오류:', error);
    }
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    const newAnswer = {
      question_id: questions[currentQuestion].id,
      answer: selectedAnswer,
      target_node: questions[currentQuestion].target_node
    };
    
    setAnswers(prev => [...prev, newAnswer]);
    
    if (currentQuestion < questions.length - 1) {
      // 중간 점검 (예: 50% 완료 시) - currentQuestion 증가 전에 체크
      console.log(`현재 질문: ${currentQuestion + 1}, 전체: ${questions.length}, 중간점: ${Math.floor(questions.length / 2)}`);
      
      // 중간 결과에서 돌아온 경우가 아니고, 22번째 질문 완료 시에만 중간 결과로 이동
      if (!resumeFromIntermediate && currentQuestion + 1 === 22) {
        console.log('22번째 질문 완료, 중간 결과 페이지로 이동 시작');
        // 중간 결과 제출
        submitIntermediateAnswers([...answers, newAnswer]);
        return;
      }
      
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null); // 다음 질문으로 넘어갈 때 선택 초기화
    } else {
      // 마지막 질문 완료
      console.log('모든 답변 완료:', [...answers, newAnswer]);
      // TODO: 답변 제출
      navigate('/final', { state: { sessionId } });
    }
  };

  // 질문 유형별 UI 렌더링
  const renderQuestionUI = (question) => {
    const { question_type, choices } = question;

    // 4-choice: 세로 4개 버튼
    if (question_type === '4_choice_question') {
      return (
        <div className="choice-4-container">
          {choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(choice)}
              className={`choice-4-button ${selectedAnswer === choice ? 'selected' : ''}`}
            >
              {choice}
            </button>
          ))}
        </div>
      );
    }

    // 2-choice, O-X: 가로 2개 버튼
    if (question_type === '2_choice_question' || question_type === 'O_X_question') {
      return (
        <div className="choice-2-container">
          {choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(choice)}
              className={`choice-2-button ${selectedAnswer === choice ? 'selected' : 'unselected'}`}
            >
              {choice}
            </button>
          ))}
        </div>
      );
    }

    // 5-point: 원형 5개 버튼만
    if (question_type === '5_point_question') {
      return (
        <div className="choice-5-container">
          <span className="choice-5-label">아니다</span>
          
          <div className="choice-5-buttons">
            {choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(choice)}
                className={`choice-5-button ${selectedAnswer === choice ? 'selected' : ''} ${index === 2 ? 'center' : ''}`}
              >
                {index === 0 && <img src="/arrow-big-left.png" alt="Left" style={{width: '30px', height: '30px'}} />}
                {index === 1 && <img src="/arrow-big-left.png" alt="Left" style={{width: '30px', height: '30px'}} />}
                {index === 2 && ''}
                {index === 3 && <img src="/arrow-big-right.png" alt="Right" style={{width: '30px', height: '30px'}} />}
                {index === 4 && <img src="/arrow-big-right.png" alt="Right" style={{width: '30px', height: '30px'}} />}
              </button>
            ))}
          </div>
          
          <span className="choice-5-label">맞다</span>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>질문을 불러오는 중...</div>;
  }

  if (questions.length === 0) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>질문을 불러올 수 없습니다.</div>;
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="test-page">
      {/* 헤더 */}
      <header className="test-header">
        <img src="/santapick-logo.png" alt="SantaPick Logo" className="header-logo" />
        <img src="/prometheus-team.png" alt="Prometheus Team" className="header-team" />
      </header>


      {/* 메인 컨테이너 */}
      <main className="test-main">
        {/* 위쪽 컨테이너: 문항번호 + 질문&선택지 */}
        <div className="question-container">
          <div className="question-number">
            {currentQuestion + 1}
          </div>
          
          <div className="question-and-choices">
            <h2 className="question-text">
              {questions[currentQuestion].question}
            </h2>

            {renderQuestionUI(questions[currentQuestion])}
          </div>
        </div>

        {/* 아래쪽 컨테이너: 다음으로 버튼 */}
        <div className="button-container">
          <button 
            className="next-button"
            onClick={handleNext}
            disabled={!selectedAnswer}
          >
            다음으로
          </button>
        </div>
      </main>
    </div>
  );
};

export default TestPage;