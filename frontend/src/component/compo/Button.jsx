import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';


const Button = () => {

  const navigate = useNavigate();
  
  const handleExploreNow = () => {
    // Clear any existing chat ID to force new chat creation
    // This ensures "Explore Now" always creates a fresh new chat
    localStorage.removeItem('chatId');
    navigate('/main');
  };
  
  return (
    <StyledWrapper>
      <button className="Btn-Container bg-transparent" onClick={handleExploreNow}>
              <span className="text bg-transparent">Explore Now </span>
        <span className="icon-Container bg-transparent">
          <svg width={20} className='bg-transparent' height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 7L18 12L13 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 12H18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .Btn-Container {
    display: flex;
    width: 220px;
    height: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50px;
    justify-content: space-between;
    align-items: center;
    border: none;
    cursor: pointer;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .Btn-Container::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  .Btn-Container:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }
  
  .Btn-Container:hover::before {
    left: 100%;
  }
  
  .Btn-Container:active {
    transform: translateY(0);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  }
  
  .icon-Container {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    margin-right: 15px;
    transition: all 0.3s ease;
  }
  
  .Btn-Container:hover .icon-Container {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
  
  .text {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.4em;
    font-weight: 600;
    letter-spacing: 1.2px;
    margin-left: 20px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .icon-Container svg {
    transition: all 0.3s ease;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
  
  .Btn-Container:hover .icon-Container svg {
    animation: bounce 0.6s ease infinite alternate;
  }
  
  @keyframes bounce {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(3px);
    }
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .Btn-Container {
      width: 200px;
      height: 55px;
    }
    
    .text {
      font-size: 1.2em;
    }
    
    .icon-Container {
      width: 45px;
      height: 45px;
    }
  }
`;

export default Button;
