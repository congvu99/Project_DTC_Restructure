import React, { forwardRef } from 'react';
import styled from 'styled-components';

export interface InputDateProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
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

const StyledDateInput = styled.input<{ $hasError: boolean }>`
  width: 100%;
  height: 40px;
  background-color: ${({ disabled }) => (disabled ? '#e9ecef' : '#ffffff')};
  border: 1px solid ${({ $hasError }) => ($hasError ? '#dc3545' : '#ced4da')};
  border-radius: 6px;
  padding: 0 12px;
  font-size: 14px;
  color: #495057;
  outline: none;
  transition: all 0.2s ease-in-out;
  font-family: inherit;

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? '#dc3545' : '#80bdff')};
    box-shadow: 0 0 0 3px ${({ $hasError }) => ($hasError ? 'rgba(220, 53, 69, 0.25)' : 'rgba(0, 123, 255, 0.25)')};
  }

  /* Tùy chỉnh icon lịch mặc định của trình duyệt (Webkit) */
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.6;
    transition: 0.2s;
  }

  &::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
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

const InputDate = forwardRef<HTMLInputElement, InputDateProps>(
  ({ label, error, fullWidth = true, className, ...props }, ref) => {
    return (
      <Wrapper $fullWidth={fullWidth} className={className}>
        {label && <Label>{label}</Label>}
        <StyledDateInput
          type="date"
          ref={ref}
          $hasError={!!error}
          {...props}
        />
        {error && <ErrorText>{error}</ErrorText>}
      </Wrapper>
    );
  }
);

InputDate.displayName = 'InputDate';
export default InputDate;
