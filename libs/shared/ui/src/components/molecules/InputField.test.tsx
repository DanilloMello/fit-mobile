import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { InputField } from './InputField';

describe('InputField', () => {
  const defaultProps = {
    label: 'Email',
    value: '',
    onChangeText: jest.fn(),
    placeholder: 'Enter your email',
  };

  it('renders label and placeholder', () => {
    const { getByText, getByPlaceholderText } = render(
      <InputField {...defaultProps} />,
    );
    expect(getByText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
  });

  it('calls onChangeText when user types', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <InputField {...defaultProps} onChangeText={onChangeText} />,
    );
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    expect(onChangeText).toHaveBeenCalledWith('test@example.com');
  });

  it('renders rightLabel when provided', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <InputField
        {...defaultProps}
        rightLabel={{ text: 'Forgot password?', onPress }}
      />,
    );
    const rightLabel = getByText('Forgot password?');
    expect(rightLabel).toBeTruthy();
    fireEvent.press(rightLabel);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders eye toggle button when showSecureToggle is true', () => {
    const onToggleSecure = jest.fn();
    const { getByRole } = render(
      <InputField
        {...defaultProps}
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        showSecureToggle
        onToggleSecure={onToggleSecure}
      />,
    );
    const eyeButton = getByRole('button', { name: 'Show password' });
    expect(eyeButton).toBeTruthy();
    fireEvent.press(eyeButton);
    expect(onToggleSecure).toHaveBeenCalledTimes(1);
  });

  it('eye button label changes based on secureTextEntry state', () => {
    const { getByRole, rerender } = render(
      <InputField
        {...defaultProps}
        secureTextEntry
        showSecureToggle
        onToggleSecure={jest.fn()}
      />,
    );
    expect(getByRole('button', { name: 'Show password' })).toBeTruthy();

    rerender(
      <InputField
        {...defaultProps}
        secureTextEntry={false}
        showSecureToggle
        onToggleSecure={jest.fn()}
      />,
    );
    expect(getByRole('button', { name: 'Hide password' })).toBeTruthy();
  });

  it('does not render eye button when showSecureToggle is false', () => {
    const { queryByRole } = render(
      <InputField {...defaultProps} showSecureToggle={false} />,
    );
    expect(queryByRole('button', { name: /password/i })).toBeNull();
  });

  it('applies accessibilityLabel to the text input', () => {
    const { getByLabelText } = render(
      <InputField
        {...defaultProps}
        accessibilityLabel="Email address field"
      />,
    );
    expect(getByLabelText('Email address field')).toBeTruthy();
  });
});
