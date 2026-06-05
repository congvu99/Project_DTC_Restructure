import React from 'react';
import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'success';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const ButtonStyled = styled.button<{ $variant: ButtonVariant; $size: ButtonSize; $isLoading: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family, 'Inter', sans-serif);
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: ${({ disabled, $isLoading }) => (disabled || $isLoading ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.65 : 1)};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  gap: 8px;
  white-space: nowrap;

  /* Kích thước chuẩn */
  ${({ $size }) => {
    switch ($size) {
      case 'small':
        return css`
          height: 32px;
          padding: 0 12px;
          font-size: 13px;
        `;
      case 'large':
        return css`
          height: 48px;
          padding: 0 24px;
          font-size: 16px;
        `;
      default: // medium
        return css`
          height: 40px;
          padding: 0 16px;
          font-size: 14px;
        `;
    }
  }}

  /* Biến thể màu sắc */
  ${({ $variant }) => {
    switch ($variant) {
      case 'secondary':
        return css`
          background-color: #6c757d;
          color: white;
          &:hover:not(:disabled) { background-color: #5a6268; box-shadow: 0 4px 6px rgba(108, 117, 125, 0.2); }
        `;
      case 'danger':
        return css`
          background-color: #dc3545;
          color: white;
          &:hover:not(:disabled) { background-color: #c82333; box-shadow: 0 4px 6px rgba(220, 53, 69, 0.2); }
        `;
      case 'success':
        return css`
          background-color: #28a745;
          color: white;
          &:hover:not(:disabled) { background-color: #218838; box-shadow: 0 4px 6px rgba(40, 167, 69, 0.2); }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: #0056b3;
          border-color: #0056b3;
          &:hover:not(:disabled) { background-color: #f0f7ff; }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: #495057;
          &:hover:not(:disabled) { background-color: #f8f9fa; color: #212529; }
        `;
      default: // primary
        return css`
          background-color: #0056b3;
          color: white;
          &:hover:not(:disabled) { background-color: #004494; box-shadow: 0 4px 8px rgba(0, 86, 179, 0.3); transform: translateY(-1px); }
          &:active:not(:disabled) { transform: translateY(0); box-shadow: none; }
        `;
    }
  }}

  &:focus-visible {
    outline: 2px solid #80bdff;
    outline-offset: 2px;
  }
`;

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  isLoading = false,
  leftIcon,
  rightIcon,
  ...props 
}: ButtonProps) {
  return (
    <ButtonStyled $variant={variant} $size={size} $isLoading={isLoading} {...props}>
      {isLoading ? (
        <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em" style={{ animation: 'spin 1s linear infinite' }}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </svg>
      ) : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </ButtonStyled>
  );
}
