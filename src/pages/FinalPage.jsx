import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FinalPage = () => {
  const navigate = useNavigate();
  const [showResultRatio, setShowResultRatio] = useState(false);
  const [showProductInfo, setShowProductInfo] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // TODO: API에서 최종 결과 데이터 가져오기
  const finalResult = {
    personality_type: "감성적인 로맨티스트",
    traits: {
      Openness: 0.8,
      Conscientiousness: 0.6,
      Extraversion: 0.7,
      Agreeableness: 0.9,
      Neuroticism: 0.3
    },
    recommendations: [
      { product_id: 1316, score: 0.450, rank: 1, name: "향수 세트", price: "89,000원" },
      { product_id: 2547, score: 0.420, rank: 2, name: "캔들 컬렉션", price: "45,000원" },
      { product_id: 3891, score: 0.395, rank: 3, name: "아로마 디퓨저", price: "120,000원" }
    ]
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductInfo(true);
  };

  const handleRestart = () => {
    console.log('처음부터 다시 시작');
    navigate('/');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>추천 결과</h1>
        <h2 style={{ color: '#4CAF50', marginBottom: '10px' }}>
          {finalResult.personality_type}
        </h2>
        <p style={{ color: '#666' }}>
          당신의 성격에 맞는 선물을 추천해드립니다
        </p>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <button
          onClick={() => setShowResultRatio(true)}
          style={{
            flex: 1,
            padding: '15px',
            backgroundColor: '#f8f9fa',
            border: '2px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          성격 분석 결과 보기
        </button>
        
        <button
          onClick={handleRestart}
          style={{
            flex: 1,
            padding: '15px',
            backgroundColor: 'white',
            border: '2px solid #4CAF50',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#4CAF50'
          }}
        >
          처음부터 다시하기
        </button>
      </div>

      <div>
        <h3 style={{ marginBottom: '20px' }}>추천 선물</h3>
        <div style={{ display: 'grid', gap: '20px' }}>
          {finalResult.recommendations.map((product) => (
            <div
              key={product.product_id}
              onClick={() => handleProductClick(product)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
                border: '2px solid #ddd',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#4CAF50';
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#ddd';
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <div style={{ 
                width: '80px', 
                height: '80px', 
                backgroundColor: '#e0e0e0', 
                borderRadius: '8px',
                marginRight: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#666'
              }}>
                이미지
              </div>
              
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{product.name}</h4>
                <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                  추천도: {(product.score * 100).toFixed(1)}%
                </p>
                <p style={{ margin: '0', fontWeight: 'bold', color: '#4CAF50' }}>
                  {product.price}
                </p>
              </div>
              
              <div style={{ 
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                #{product.rank}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 성격 분석 결과 모달 */}
      {showResultRatio && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>성격 분석 결과</h3>
              <button
                onClick={() => setShowResultRatio(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            
            {Object.entries(finalResult.traits).map(([trait, score]) => (
              <div key={trait} style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>{trait}</span>
                  <span>{(score * 100).toFixed(0)}%</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#e0e0e0', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${score * 100}%`, 
                    height: '100%', 
                    backgroundColor: '#4CAF50'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 상품 정보 모달 */}
      {showProductInfo && selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>상품 정보</h3>
              <button
                onClick={() => setShowProductInfo(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ 
                width: '200px', 
                height: '200px', 
                backgroundColor: '#e0e0e0', 
                borderRadius: '8px',
                margin: '0 auto 15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#666'
              }}>
                상품 이미지
              </div>
              <h4>{selectedProduct.name}</h4>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#4CAF50' }}>
                {selectedProduct.price}
              </p>
              <p style={{ color: '#666' }}>
                추천도: {(selectedProduct.score * 100).toFixed(1)}%
              </p>
            </div>
            
            <div>
              <h4>상품 설명</h4>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                이 상품은 당신의 성격 특성에 매우 잘 맞는 선물입니다. 
                특히 감성적이고 로맨틱한 성향을 가진 분들께 인기가 많습니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalPage;