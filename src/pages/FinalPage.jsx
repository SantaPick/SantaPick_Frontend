import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/FinalPage.css';

const FinalPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [finalData, setFinalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResultRatio, setShowResultRatio] = useState(false);
  const [showProductInfo, setShowProductInfo] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const sessionId = location.state?.sessionId;

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }
    fetchFinalResult();
  }, [sessionId]);

  const fetchFinalResult = async () => {
    try {
      // 추천 결과 가져오기
      const recommendationResponse = await fetch(`http://localhost:8000/api/recommendation/${sessionId}`);
      const recommendationData = await recommendationResponse.json();
      
      if (recommendationData.success) {
        // 상위 3개 상품 정보 가져오기
        const topProducts = recommendationData.data.recommendations.slice(0, 3);
        const productDetails = await Promise.all(
          topProducts.map(async (rec) => {
            const productResponse = await fetch(`http://localhost:8000/api/products/${rec.product_id}`);
            const productData = await productResponse.json();
            return {
              ...rec,
              ...productData.data
            };
          })
        );

        // GPT를 통한 최종 성격 분석 (임시로 더미 데이터 사용)
        setFinalData({
          personality_type: "창의적인 감성주의자",
          description: "당신은 예술적 감각이 뛰어나고 감정이 풍부한 사람입니다. 새로운 경험을 추구하며 타인의 감정에 공감하는 능력이 뛰어납니다.",
          recommendations: productDetails,
          traits: {
            "개방성": 0.85,
            "성실성": 0.65,
            "외향성": 0.72,
            "친화성": 0.88,
            "신경성": 0.35
          }
        });
      } else {
        console.error('추천 결과 조회 실패:', recommendationData.error);
        navigate('/');
      }
    } catch (error) {
      console.error('API 호출 오류:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductInfo(true);
  };

  const handleRestart = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="final-page">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          최종 결과를 분석하는 중...
        </div>
      </div>
    );
  }

  if (!finalData) {
    return (
      <div className="final-page">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          결과를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="final-page">
      {/* 헤더 */}
      <header className="final-header">
        <img src="/santapick-logo.png" alt="SantaPick Logo" className="header-logo" />
        <img src="/prometheus-team.png" alt="Prometheus Team" className="header-team" />
      </header>

      {/* 메인 컨텐츠 */}
      <main className="final-main">
        {/* 좌측: 추천 상품 이미지들 */}
        <div className="recommendation-images">
          {finalData.recommendations.slice(0, 3).map((product, index) => (
            <div 
              key={product.product_id} 
              className={`recommendation-image ${index === 0 ? 'large' : index === 1 ? 'medium' : 'small'}`}
              onClick={() => handleProductClick(product)}
            >
              <img 
                src={`http://localhost:8000/static/${product.image_path}`} 
                alt={product.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="image-placeholder" style={{ display: 'none' }}>
                {index + 1}순위
              </div>
            </div>
          ))}
        </div>

        {/* 우측: 결과 텍스트 */}
        <div className="result-content">
          <div className="result-header">
            <p className="result-subtitle">당신은</p>
            <h1 className="result-title">
              '<span className="personality-type">{finalData.personality_type}</span>' 입니다.
            </h1>
            <p className="result-description">
              {finalData.description}
            </p>
          </div>

          {/* 상세 분석 버튼 */}
          <button 
            className="detail-analysis-btn"
            onClick={() => setShowResultRatio(true)}
          >
            <span>상세 분석 결과</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </main>

      {/* 하단: 추천 상품 목록 */}
      <section className="products-section">
        <h2 className="products-title">이런분의 취향을 겨냥한 선물을 추천해드릴게요.</h2>
        <p className="products-subtitle">선물을 클릭하면 상세 정보를 확인할 수 있어요!</p>
        
        <div className="products-grid">
          {finalData.recommendations.map((product) => (
            <div 
              key={product.product_id}
              className="product-card"
              onClick={() => handleProductClick(product)}
            >
              <div className="product-image">
                <img 
                  src={`http://localhost:8000/static/${product.image_path}`} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="image-placeholder" style={{ display: 'none' }}>
                  상품 이미지
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₩{product.price?.toLocaleString() || '가격 정보 없음'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 성격 분석 결과 모달 */}
      {showResultRatio && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>상세 분석 결과</h3>
              <button
                onClick={() => setShowResultRatio(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            
            <div className="traits-analysis">
              {Object.entries(finalData.traits).map(([trait, score]) => (
                <div key={trait} className="trait-item">
                  <div className="trait-header">
                    <span className="trait-name">{trait}</span>
                    <span className="trait-score">{(score * 100).toFixed(0)}%</span>
                  </div>
                  <div className="trait-bar">
                    <div 
                      className="trait-progress" 
                      style={{ width: `${score * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 상품 정보 모달 */}
      {showProductInfo && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content product-modal">
            <div className="modal-header">
              <h3>상품 정보</h3>
              <button
                onClick={() => setShowProductInfo(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            
            <div className="product-detail">
              <div className="product-detail-image">
                <img 
                  src={`http://localhost:8000/static/${selectedProduct.image_path}`} 
                  alt={selectedProduct.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="image-placeholder" style={{ display: 'none' }}>
                  상품 이미지
                </div>
              </div>
              
              <div className="product-detail-info">
                <h4>{selectedProduct.name}</h4>
                <p className="detail-price">₩{selectedProduct.price?.toLocaleString() || '가격 정보 없음'}</p>
                <p className="similarity-score">
                  추천도: {(selectedProduct.similarity * 100).toFixed(1)}%
                </p>
                
                <div className="product-description">
                  <h5>상품 설명</h5>
                  <p>{selectedProduct.description || '이 상품은 당신의 성격 특성에 매우 잘 맞는 선물입니다.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalPage;