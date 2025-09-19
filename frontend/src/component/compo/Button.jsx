import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';


const Button = () => {

  const navigate = useNavigate();
  
  const handleExploreNow = () => {
    // Clear any existing chat ID to force new chat creation
    localStorage.removeItem('chatId');
    navigate('/main');
  };
  
  return (
    <StyledWrapper>
      <button className="Btn-Container bg-transparent" onClick={handleExploreNow}>
              <span className="text bg-transparent">Explore Now </span>
        <span className="icon-Container bg-transparent">
          <svg width={16} className='bg-transparent' height={19} viewBox="0 0 16 19" fill="nones" xmlns="http://www.w3.org/2000/svg">
            <circle cx="1.61321" cy="1.61321" r="1.5" fill="black" />
            <circle cx="5.73583" cy="1.61321" r="1.5" fill="black" />
            <circle cx="5.73583" cy="5.5566" r="1.5" fill="black" />
            <circle cx="9.85851" cy="5.5566" r="1.5" fill="black" />
            <circle cx="9.85851" cy="9.5" r="1.5" fill="black" />
            <circle cx="13.9811" cy="9.5" r="1.5" fill="black" />
            <circle cx="5.73583" cy="13.4434" r="1.5" fill="black" />
            <circle cx="9.85851" cy="13.4434" r="1.5" fill="black" />
            <circle cx="1.61321" cy="17.3868" r="1.5" fill="black" />
            <circle cx="5.73583" cy="17.3868" r="1.5" fill="black" />
          </svg>
        </span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .Btn-Container {
    display: flex;
    width: 200px;
    height: fit-content;
    background-color: rgba(29, 33, 41, 0);
    border-radius: 40px;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #1447e6;
    cursor: pointer;
  }
  .icon-Container {
    width: 45px;
    height: 45px;
    background-color: #2097ffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 3px solid rgba(29, 35, 41, 1);
  }
  .text {
    width: calc(170px - 45px);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-left:20px;
    font-size: 1.3em;
    letter-spacing: 1.1px;
  }
  .icon-Container svg {
    transition-duration: 1.5s;
  }
  .Btn-Container:hover .icon-Container svg {
    transition-duration: 1.5s;
    animation: arrow 1s linear infinite;
  }
  @keyframes arrow {
    0% {
      opacity: 0;
      margin-left: 0px;
    }
    100% {
      opacity: 1;
      margin-left: 10px;
    }
  }`;

export default Button;
