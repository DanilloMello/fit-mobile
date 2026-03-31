import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SignInForm } from './SignInForm';

describe('SignInForm', () => {
  const defaultProps = {
    isLoading: false,
    onSignIn: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders brand heading with ConnectHealth split', () => {
    const { getByText } = render(<SignInForm {...defaultProps} />);
    expect(getByText('Connect')).toBeTruthy();
    expect(getByText('health')).toBeTruthy();
  });

  it('renders subtitle text', () => {
    const { getByText } = render(<SignInForm {...defaultProps} />);
    expect(getByText('Sign in to access your health hub.')).toBeTruthy();
  });

  it('renders email and password fields', () => {
    const { getByPlaceholderText } = render(<SignInForm {...defaultProps} />);
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
  });

  it('calls onSignIn with trimmed email and password', async () => {
    const onSignIn = jest.fn().mockResolvedValue(undefined);
    const { getByPlaceholderText, getByRole } = render(
      <SignInForm {...defaultProps} onSignIn={onSignIn} />,
    );

    fireEvent.changeText(getByPlaceholderText('Enter your email'), '  user@test.com  ');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'secret123');
    fireEvent.press(getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(onSignIn).toHaveBeenCalledWith('user@test.com', 'secret123');
    });
  });

  it('shows loading indicator when isLoading is true', () => {
    const { queryByText, getByRole } = render(
      <SignInForm {...defaultProps} isLoading />,
    );
    expect(queryByText('Sign In')).toBeNull();
    const btn = getByRole('button', { name: 'Sign in' });
    expect(btn.props.accessibilityState.busy).toBe(true);
    expect(btn.props.accessibilityState.disabled).toBe(true);
  });

  it('renders "Forgot password?" link when onForgotPassword is provided', () => {
    const onForgotPassword = jest.fn();
    const { getByRole } = render(
      <SignInForm {...defaultProps} onForgotPassword={onForgotPassword} />,
    );
    const link = getByRole('button', { name: 'Forgot password?' });
    fireEvent.press(link);
    expect(onForgotPassword).toHaveBeenCalledTimes(1);
  });

  it('does not render "Forgot password?" when onForgotPassword is absent', () => {
    const { queryByRole } = render(<SignInForm {...defaultProps} />);
    expect(queryByRole('button', { name: 'Forgot password?' })).toBeNull();
  });

  it('renders Google and Apple social buttons', () => {
    const { getByRole } = render(<SignInForm {...defaultProps} />);
    expect(getByRole('button', { name: 'Continue with Google' })).toBeTruthy();
    expect(getByRole('button', { name: 'Continue with Apple' })).toBeTruthy();
  });

  it('calls onSocialSignIn with correct provider', () => {
    const onSocialSignIn = jest.fn();
    const { getByRole } = render(
      <SignInForm {...defaultProps} onSocialSignIn={onSocialSignIn} />,
    );
    fireEvent.press(getByRole('button', { name: 'Continue with Google' }));
    expect(onSocialSignIn).toHaveBeenCalledWith('google');

    fireEvent.press(getByRole('button', { name: 'Continue with Apple' }));
    expect(onSocialSignIn).toHaveBeenCalledWith('apple');
  });
});
