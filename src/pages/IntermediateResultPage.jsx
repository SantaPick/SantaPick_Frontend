import React from 'react';
import { useNavigate } from 'react-router-dom';

const IntermediateResultPage = () => {
  const navigate = useNavigate();
  
  // TODO: API에서 중간 결과 데이터 가져오기
  const intermediateResult = {
    progress_result: "현재까지 감성적 성향이 강해요",
    completion_rate: 40
  };

  const handleContinue = () => {
    console.log('테스트 계속하기');
    navigate('/test');
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '600px', 
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h1>중간 결과</h1>
      
      <div style={{ 
        backgroundColor: '#f8f9fa',
        padding: '30px',
        borderRadius: '12px',
        margin: '30px 0'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#4CAF50',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white',
            fontWeight: 'bold'
          }}>
            {intermediateResult.completion_rate}%
          </div>
        </div>
        
        <h2 style={{ color: '#333', marginBottom: '20px' }}>
          {intermediateResult.progress_result}
        </h2>
        
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5' }}>
          지금까지의 답변을 분석한 결과입니다.<br/>
          더 정확한 추천을 위해 나머지 질문도 답변해주세요.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button
          onClick={handleContinue}
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          테스트 계속하기
        </button>
        
        <button
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            backgroundColor: 'white',
            color: '#666',
            border: '2px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          잠시 쉬기
        </button>
      </div>
    </div>
  );
};

export default IntermediateResultPage;