import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Wrapper = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  margin-bottom: 16px;
  font-family: var(--font-family, 'Inter', sans-serif);
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #343a40;
  margin-bottom: 6px;
`;

const InputContainer = styled.div<{ $hasError: boolean; $disabled: boolean }>`
  display: flex;
  align-items: center;
  height: 40px;
  background-color: ${({ $disabled }) => ($disabled ? '#e9ecef' : '#ffffff')};
  border: 1px solid ${({ $hasError }) => ($hasError ? '#dc3545' : '#ced4da')};
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
  overflow: hidden;

  &:focus-within {
    border-color: ${({ $hasError }) => ($hasError ? '#dc3545' : '#80bdff')};
    box-shadow: 0 0 0 3px ${({ $hasError }) => ($hasError ? 'rgba(220, 53, 69, 0.25)' : 'rgba(0, 123, 255, 0.25)')};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  color: #6c757d;
`;

const StyledInput = styled.input<{ $hasLeft?: boolean; $hasRight?: boolean }>`
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  padding: 0 12px;
  font-size: 14px;
  color: #495057;
  outline: none;
  width: 100%;

  /* Xóa padding nếu có icon để nhìn cân đối hơn */
  ${({ $hasLeft }) => $hasLeft && css`padding-left: 0;`}
  ${({ $hasRight }) => $hasRight && css`padding-right: 0;`}

  &::placeholder {
    color: #adb5bd;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #dc3545;
  margin-top: 4px;
`;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, fullWidth = true, className, disabled, ...props }, ref) => {
    return (
      <Wrapper $fullWidth={fullWidth} className={className}>
        {label && <Label>{label}</Label>}
        <InputContainer $hasError={!!error} $disabled={!!disabled}>
          {leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
          <StyledInput
            ref={ref}
            disabled={disabled}
            $hasLeft={!!leftIcon}
            $hasRight={!!rightIcon}
            {...props}
          />
          {rightIcon && <IconWrapper>{rightIcon}</IconWrapper>}
        </InputContainer>
        {error && <ErrorText>{error}</ErrorText>}
      </Wrapper>
    );
  }
);

Input.displayName = 'Input';
export default Input;
