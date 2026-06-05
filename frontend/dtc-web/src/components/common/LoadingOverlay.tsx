import React from 'react';
import styled from 'styled-components';

export interface LoadingOverlayProps {
  active: boolean;
  children: React.ReactNode;
  text?: string;
  fullScreen?: boolean;
}

const Wrapper = styled.div<{ $fullScreen: boolean }>`
  position: ${({ $fullScreen }) => ($fullScreen ? 'fixed' : 'relative')};
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${({ $fullScreen }) => ($fullScreen ? 9999 : 1)};
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(1px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: inherit;
`;

const Spinner = styled.div`
  border: 3px solid rgba(0, 86, 179, 0.15);
  border-left-color: #0056b3;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  margin-top: 12px;
  font-weight: 500;
  color: #0056b3;
  font-size: 13px;
  letter-spacing: 0.3px;
`;

export default function LoadingOverlay({ 
  active, 
  children, 
  text = 'Đang tải dữ liệu...', 
  fullScreen = false 
}: LoadingOverlayProps) {
  return (
    <Wrapper $fullScreen={fullScreen}>
      {children}
      {active && (
        <Overlay>
          <Spinner />
          {text && <LoadingText>{text}</LoadingText>}
        </Overlay>
      )}
    </Wrapper>
  );
}
