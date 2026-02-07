import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/IntermediateResultPage.css';

const IntermediateResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [intermediateData, setIntermediateData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // URL에서 session_id 가져오기 (TestPage에서 전달받음)
  const sessionId = location.state?.sessionId;

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }
    
    fetchIntermediateResult();
  }, [sessionId]);

  const fetchIntermediateResult = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/intermediate/${sessionId}`);
      const data = await response.json();
      
      if (data.success) {
        setIntermediateData(data.data);
      } else {
        console.error('중간 결과 조회 실패:', data.error);
        navigate('/');
      }
    } catch (error) {
      console.error('API 호출 오류:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSimilar = () => {
    // 기능 제거 - 클릭해도 아무 동작 없음
  };

  const handleDifferent = () => {
    // 기능 제거 - 클릭해도 아무 동작 없음
  };

  const handleContinue = () => {
    // 나머지 질문을 계속하기 위해 TestPage로 돌아가기
    navigate('/test', { state: { sessionId, resumeFromIntermediate: true } });
  };

  if (loading) {
    return (
      <div className="intermediate-page">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          중간 결과를 분석하는 중...
        </div>
      </div>
    );
  }

  if (!intermediateData) {
    return (
      <div className="intermediate-page">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          결과를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="intermediate-page">
      {/* 헤더 */}
      <header className="intermediate-header">
        <img src="/santapick-logo.png" alt="SantaPick Logo" className="header-logo" />
        <img src="/prometheus-team.png" alt="Prometheus Team" className="header-team" />
      </header>

      {/* 배경 아이콘 */}
      <img src="/background-icon.png" alt="Background" className="background-icon" />

      {/* 메인 컨테이너 */}
      <main className="intermediate-main">
        <div className="result-container">
          <p className="result-subtitle">중간결과 - 당신은 어떤 사람인가요?</p>
          
          <h1 className="result-title">
            당신은<br />
            '<span className="personality-type">{intermediateData.personality_type}</span>' 입니다. 
            <span className="question-mark">?</span>
          </h1>
          
          <p className="result-description">
            {intermediateData.description}
          </p>
          
          <div className="feedback-buttons">
            <button className="feedback-btn similar-btn" onClick={handleSimilar}>
              나와 비슷해요
            </button>
            <button className="feedback-btn different-btn" onClick={handleDifferent}>
              나와 달라요
            </button>
          </div>
          
          <button className="continue-btn" onClick={handleContinue}>
            다음으로 넘어가기
          </button>
        </div>
      </main>
    </div>
  );
};

export default IntermediateResultPage;