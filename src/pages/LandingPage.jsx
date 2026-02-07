import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: '',
    gender: '',
    age: '',
    city: '',
    date: '',
    time: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('사용자 정보:', userInfo);
    
    try {
      // 사용자 정보를 백엔드에 저장하고 sessionId 받기
      const response = await fetch('http://localhost:8000/api/user/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userInfo.name,
          gender: userInfo.gender,
          age: parseInt(userInfo.age),
          city: "서울", // 기본값
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0]
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // sessionId와 함께 TestPage로 이동
        navigate('/test', { state: { sessionId: data.data.session_id } });
      } else {
        console.error('사용자 정보 저장 실패:', data.error);
        alert('사용자 정보 저장에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('API 호출 오류:', error);
      alert('서버 연결에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="landing-page">
      {/* 헤더 */}
      <header className="landing-header">
        <img 
          src="/santapick-logo.png" 
          alt="SantaPick Logo" 
          className="header-logo"
        />
        <img 
          src="/prometheus-team.png" 
          alt="Prometheus 8팀" 
          className="header-team"
        />
      </header>

      {/* 메인 콘텐츠 */}
      <main className="landing-main">
        {/* 배경 아이콘 */}
        <img 
          src="/background-icon.png" 
          alt="Background Icon" 
          className="background-icon"
        />

        {/* 콘텐츠 영역 */}
        <div className="landing-content">
          {/* 텍스트 섹션 */}
          <div>
            {/* 서브 텍스트 */}
            <p className="sub-text">
              당신은 어떤 사람인가요?
            </p>

            {/* 메인 제목 */}
            <h1 className="main-title">
              숨겨진 취향을 알아내는<br />
              선물 추천 심리테스트
            </h1>

            {/* 설명 텍스트 */}
            <p className="description-text">
            평소에 어떤 선물을 고를지 오랫동안 고민하셨던 경험 없으신가요?
            SantaPick을 통해 몰랐던, 취향에 맞는 선물을 추천 받아보세요.<br />
            심리테스트를 기반으로 선물을 추천해드립니다!
            </p>
          </div>

          {/* 입력 폼 */}
          <form onSubmit={handleSubmit} className="landing-form">
            <div className="form-fields">
              <div className="form-field">
                <label>이름</label>
                <input
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div className="form-field">
                <label>성별</label>
                <select
                  name="gender"
                  value={userInfo.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your gender</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>
              </div>
              
              <div className="form-field age-field">
                <label>나이</label>
                <input
                  type="number"
                  name="age"
                  value={userInfo.age}
                  onChange={handleInputChange}
                  placeholder="Select your Age"
                  min="1"
                  max="100"
                  required
                />
              </div>
            </div>

            <button type="submit" className="start-button">
              심리테스트 시작하기
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;