import React, { forwardRef } from 'react';
import styled from 'styled-components';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectBoxProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'options'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  fullWidth?: boolean;
  placeholder?: string;
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

const SelectContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledSelect = styled.select<{ $hasError: boolean }>`
  width: 100%;
  height: 40px;
  appearance: none; /* Ẩn mũi tên mặc định của trình duyệt */
  background-color: ${({ disabled }) => (disabled ? '#e9ecef' : '#ffffff')};
  border: 1px solid ${({ $hasError }) => ($hasError ? '#dc3545' : '#ced4da')};
  border-radius: 6px;
  padding: 0 36px 0 12px;
  font-size: 14px;
  color: #495057;
  outline: none;
  transition: all 0.2s ease-in-out;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? '#dc3545' : '#80bdff')};
    box-shadow: 0 0 0 3px ${({ $hasError }) => ($hasError ? 'rgba(220, 53, 69, 0.25)' : 'rgba(0, 123, 255, 0.25)')};
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const ChevronIcon = styled.svg`
  position: absolute;
  right: 12px;
  width: 16px;
  height: 16px;
  color: #6c757d;
  pointer-events: none; /* Để click xuyên qua mũi tên trúng vào select */
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #dc3545;
  margin-top: 4px;
`;

const SelectBox = forwardRef<HTMLSelectElement, SelectBoxProps>(
  ({ label, error, options, fullWidth = true, placeholder, className, disabled, ...props }, ref) => {
    return (
      <Wrapper $fullWidth={fullWidth} className={className}>
        {label && <Label>{label}</Label>}
        <SelectContainer>
          <StyledSelect ref={ref} $hasError={!!error} disabled={disabled} {...props}>
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </StyledSelect>
          <ChevronIcon fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" />
          </ChevronIcon>
        </SelectContainer>
        {error && <ErrorText>{error}</ErrorText>}
      </Wrapper>
    );
  }
);

SelectBox.displayName = 'SelectBox';
export default SelectBox;
