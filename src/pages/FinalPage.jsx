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
        // 상위 12개 상품 정보 가져오기 (4x3 그리드)
        const allProducts = recommendationData.data.recommendations.slice(0, 12);
        const productDetails = await Promise.all(
          allProducts.map(async (rec) => {
            const productResponse = await fetch(`http://localhost:8000/api/products/${rec.product_id}`);
            const productData = await productResponse.json();
            return {
              ...rec,
              ...productData.data,
              similarity: rec.score // 추천 점수
            };
          })
        );

        // GPT 최종 성격 분석 결과 사용
        const personalityAnalysis = recommendationData.data.personality_analysis || {
          personality_type: "매력적인 개성",
          description: "당신만의 특별한 매력이 돋보입니다."
        };

        // 백엔드에서 받은 실제 trait 점수 사용
        const actualTraits = recommendationData.data.traits || {};
        
        console.log('=== 차트 데이터 디버깅 ===');
        console.log('recommendationData.data:', recommendationData.data);
        console.log('actualTraits:', actualTraits);
        console.log('actualTraits 키들:', Object.keys(actualTraits));
        
        // 만약 actualTraits가 비어있다면 더미 데이터 사용
        const traitsData = Object.keys(actualTraits).length > 0 ? actualTraits : {
          // Big-Five
          "Openness": 0.7,
          "Conscientiousness": 0.6,
          "Extraversion": 0.8,
          "Agreeableness": 0.75,
          "Neuroticism": 0.4,
          // Style
          "Elegant": 0.65,
          "Cute": 0.7,
          "Modern": 0.8,
          "Luxurious": 0.5,
          "Warm": 0.85,
          "Vivid": 0.6,
          "Sharp": 0.45,
          // Others
          "OSL": 0.3,
          "CNFU": 0.7,
          "MVS": 0.6,
          "CVPA": 0.75
        };
        
        console.log('최종 사용될 traits 데이터:', traitsData);
        
        setFinalData({
          personality_type: personalityAnalysis.personality_type,
          description: personalityAnalysis.description,
          user_name: recommendationData.data.user_name,
          recommendations: productDetails,
          traits: traitsData
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
        {/* 좌측: 결과 텍스트 */}
        <div className="result-content">
          <div className="result-header">
            <p className="result-subtitle">테스트 결과</p>
            <h1 className="result-title">
              당신은<br />
              '<span className="personality-type">{finalData.personality_type}</span>' 입니다.
            </h1>
            <p className="result-description">
              {finalData.description}
            </p>
          </div>

        </div>

        {/* 우측: 추천 상품 이미지들 */}
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
      </main>

      {/* 상세 분석 화살표 */}
      <div className="analysis-arrow-container">
        <button 
          className="analysis-arrow-btn"
          onClick={() => setShowResultRatio(true)}
        >
          <img src="/Polygon 1.png" alt="상세 분석" className="center-arrow" />
        </button>
      </div>

      {/* 하단: 추천 상품 목록 */}
      <section className="products-section">
        <h2 className="products-title">{finalData.user_name ? finalData.user_name.replace(/님$/, '') + '님' : '고객님'}의 취향을 겨냥한 선물을 추천해드릴게요.</h2>
        <p className="products-subtitle">선물의 상세 정보가 궁금하다면 상품 이미지를 클릭해보세요!</p>
        
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
              {/* 상단 2개 차트 */}
              <div className="top-charts">
                {/* Big-Five 차트 */}
                <div className="chart-section">
                  <h4 className="chart-title">BIG5</h4>
                  <div className="chart-container">
                    <div className="y-axis">
                      <span className="y-label">100</span>
                      <span className="y-label">80</span>
                      <span className="y-label">60</span>
                      <span className="y-label">40</span>
                      <span className="y-label">20</span>
                      <span className="y-label">0</span>
                    </div>
                    <div className="bar-chart">
                      <div className="chart-grid">
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                      </div>
                      {['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'].map((trait) => (
                        <div key={trait} className="chart-bar-container">
                          <div className="chart-bar" style={{ height: `${Math.max((finalData.traits[trait] || 0) * 100, 5)}%` }}></div>
                          <span className="chart-label">{trait}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 스타일 특성 차트 */}
                <div className="chart-section">
                  <h4 className="chart-title">STYLE</h4>
                  <div className="chart-container">
                    <div className="y-axis">
                      <span className="y-label">100</span>
                      <span className="y-label">80</span>
                      <span className="y-label">60</span>
                      <span className="y-label">40</span>
                      <span className="y-label">20</span>
                      <span className="y-label">0</span>
                    </div>
                    <div className="bar-chart">
                      <div className="chart-grid">
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                      </div>
                      {['Elegant', 'Cute', 'Modern', 'Luxurious', 'Warm', 'Vivid', 'Sharp'].map((trait) => (
                        <div key={trait} className="chart-bar-container">
                          <div className="chart-bar" style={{ height: `${Math.max((finalData.traits[trait] || 0) * 100, 5)}%` }}></div>
                          <span className="chart-label">{trait}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 4개 단일 막대 차트 */}
              <div className="bottom-charts">
                {/* OSL 차트 */}
                <div className="chart-section single-chart">
                  <h4 className="chart-title">OSL</h4>
                  <div className="chart-container">
                    <div className="y-axis">
                      <span className="y-label">100</span>
                      <span className="y-label">80</span>
                      <span className="y-label">60</span>
                      <span className="y-label">40</span>
                      <span className="y-label">20</span>
                      <span className="y-label">0</span>
                    </div>
                    <div className="bar-chart single-bar">
                      <div className="chart-grid">
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                      </div>
                    <div className="chart-bar-container">
                      <div className="chart-bar" style={{ height: `${Math.max((finalData.traits['OSL'] || 0) * 100, 5)}%` }}></div>
                      <span className="chart-label">OSL</span>
                    </div>
                    </div>
                  </div>
                </div>

                {/* CNFU 차트 */}
                <div className="chart-section single-chart">
                  <h4 className="chart-title">CNFU</h4>
                  <div className="chart-container">
                    <div className="y-axis">
                      <span className="y-label">100</span>
                      <span className="y-label">80</span>
                      <span className="y-label">60</span>
                      <span className="y-label">40</span>
                      <span className="y-label">20</span>
                      <span className="y-label">0</span>
                    </div>
                    <div className="bar-chart single-bar">
                      <div className="chart-grid">
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                      </div>
                    <div className="chart-bar-container">
                      <div className="chart-bar" style={{ height: `${Math.max((finalData.traits['CNFU'] || 0) * 100, 5)}%` }}></div>
                      <span className="chart-label">CNFU</span>
                    </div>
                    </div>
                  </div>
                </div>

                {/* MVS 차트 */}
                <div className="chart-section single-chart">
                  <h4 className="chart-title">MVS</h4>
                  <div className="chart-container">
                    <div className="y-axis">
                      <span className="y-label">100</span>
                      <span className="y-label">80</span>
                      <span className="y-label">60</span>
                      <span className="y-label">40</span>
                      <span className="y-label">20</span>
                      <span className="y-label">0</span>
                    </div>
                    <div className="bar-chart single-bar">
                      <div className="chart-grid">
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                      </div>
                    <div className="chart-bar-container">
                      <div className="chart-bar" style={{ height: `${Math.max((finalData.traits['MVS'] || 0) * 100, 5)}%` }}></div>
                      <span className="chart-label">MVS</span>
                    </div>
                    </div>
                  </div>
                </div>

                {/* CVPA 차트 */}
                <div className="chart-section single-chart">
                  <h4 className="chart-title">CVPA</h4>
                  <div className="chart-container">
                    <div className="y-axis">
                      <span className="y-label">100</span>
                      <span className="y-label">80</span>
                      <span className="y-label">60</span>
                      <span className="y-label">40</span>
                      <span className="y-label">20</span>
                      <span className="y-label">0</span>
                    </div>
                    <div className="bar-chart single-bar">
                      <div className="chart-grid">
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                        <div className="grid-line"></div>
                      </div>
                    <div className="chart-bar-container">
                      <div className="chart-bar" style={{ height: `${Math.max((finalData.traits['CVPA'] || 0) * 100, 5)}%` }}></div>
                      <span className="chart-label">CVPA</span>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
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