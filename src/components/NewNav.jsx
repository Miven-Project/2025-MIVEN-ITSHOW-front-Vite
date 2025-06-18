import React from "react";

const Nav = ({ showBackGradient = false, coverColor = "#6b9bd8", onNavigate }) => {
    const handleNavigation = (path, state = null) => {
        if (onNavigate) {
            onNavigate(path, state);
        } else {
            console.log(`Navigate to: ${path}`, state ? `with state: ${JSON.stringify(state)}` : '');
        }
    };

    const navItems = [
        { label: "Home", path: "/home" },
        { label: "Write", path: "/booksearch" },
        { label: "Book Gallery", path: "/bookgallery" },
        { label: "Book Search", path: "/booksearch", state: { from: "nav" } },
        { label: "My Page", path: "/mypage" }
    ];

    return (
        <div className="nav-container">
            {/* Background Gradient */}
            {showBackGradient && (
                <div
                    className="nav-background-gradient"
                    style={{
                        background: `linear-gradient(90deg, ${coverColor} 0%, rgba(255, 255, 255, 0.8) 100%)`
                    }}
                />
            )}

            {/* Navigation Content */}
            <div className="nav-content">
                {/* Logo */}
                <div className="nav-logo" onClick={() => handleNavigation("/")}>
                    <div className="logo-text">LOGO</div>
                </div>

                {/* Navigation Items */}
                <nav className="nav-items">
                    {navItems.map((item, index) => (
                        <div
                            key={index}
                            className="nav-item"
                            onClick={() => handleNavigation(item.path, item.state)}
                        >
                            <span className="nav-item-text">{item.label}</span>
                            <div className="nav-item-gradient" />
                        </div>
                    ))}
                </nav>
            </div>

            <style>{`
        .nav-container {
          position: fixed;
          left: 0;
          top: 0;
          width: 280px;
          height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          overflow: hidden;
        }

        .nav-background-gradient {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.3;
          z-index: 1;
        }

        .nav-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 40px 30px;
        }

        .nav-logo {
          margin-bottom: 60px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .nav-logo:hover {
          transform: scale(1.05);
        }

        .logo-text {
          font-size: 36px;
          font-weight: 700;
          color: #4a90e2;
          text-align: center;
          background: linear-gradient(135deg, #4a90e2 0%, #357abd 50%, #2c5282 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 2px;
          text-shadow: 0 2px 4px rgba(74, 144, 226, 0.2);
        }

        .nav-items {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .nav-item {
          position: relative;
          padding: 16px 20px;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        .nav-item:hover {
          transform: translateX(8px);
          box-shadow: 0 8px 25px rgba(74, 144, 226, 0.15);
          background: rgba(255, 255, 255, 0.9);
        }

        .nav-item-text {
          position: relative;
          z-index: 3;
          font-size: 16px;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #6b7280 0%, #4a90e2 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 3s ease-in-out infinite;
        }

        .nav-item:hover .nav-item-text {
          font-weight: 600;
          background-position: 100% 100%;
          animation-duration: 1s;
        }

        .nav-item-gradient {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(74, 144, 226, 0.1) 50%, 
            transparent 100%
          );
          transition: left 0.5s ease;
        }

        .nav-item:hover .nav-item-gradient {
          left: 100%;
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-container {
            width: 250px;
          }
          
          .nav-content {
            padding: 30px 20px;
          }
          
          .logo-text {
            font-size: 28px;
          }
          
          .nav-item-text {
            font-size: 14px;
          }
        }

        /* Additional subtle animations */
        .nav-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, 
            rgba(74, 144, 226, 0.05) 0%, 
            transparent 50%, 
            rgba(74, 144, 226, 0.05) 100%
          );
          animation: shimmer 4s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes shimmer {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
};

// 사용 예시 컴포넌트
const ExamplePage = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* 기본 사용 - 배경 그라데이션 없음 */}
            <Nav />

            {/* 메인 콘텐츠 영역 */}
            <div style={{
                marginLeft: '280px',
                flex: 1,
                padding: '40px',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
            }}>
                <h1 style={{ color: '#333', marginBottom: '20px' }}>페이지 콘텐츠</h1>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                    네비게이션이 첫 번째 이미지처럼 세로형으로 변경되었습니다.
                    MyPage와 SelectBook 페이지에서는 showBackGradient=true와 coverColor를 전달하면
                    배경에 그라데이션이 적용됩니다.
                </p>

                <div style={{ marginTop: '30px', padding: '20px', background: '#f1f5f9', borderRadius: '8px' }}>
                    <h3 style={{ color: '#4a90e2', marginBottom: '15px' }}>사용법:</h3>
                    <code style={{ background: '#e2e8f0', padding: '10px', borderRadius: '4px', display: 'block' }}>
                        {`// 기본 사용
<Nav />

// MyPage나 SelectBook에서
<Nav showBackGradient={true} coverColor="#your-color" />`}
                    </code>
                </div>
            </div>
        </div>
    );
};

export default ExamplePage;