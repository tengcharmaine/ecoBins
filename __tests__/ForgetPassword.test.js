import React from 'react';
import renderer from 'react-test-renderer';
import Register from '../components/register';
import { act } from 'react-dom/test-utils';
import PasswordUpdate from '../components/passwordupdate';
import ForgetPasswordScreen from '../components/forgetpassword';


describe('Register', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });
  test('renders correctly', () => {
    const tree = renderer.create(<ForgetPasswordScreen />).toJSON();
    
    // Check if the required elements are rendered
    expect(tree).toMatchSnapshot();
  });

  test('displays error messages for empty credentials', () => {
    const component = renderer.create(<Register />);
    const instance = component.getInstance();

    // Simulate form submission without entering any values
    instance.handleSubmit();

    act(() => {
      // Advance timers manually
      jest.advanceTimersByTime(1000); // Advances timers by 1 second
    });

    // Check if the error messages are displayed
    expect(instance.state.emailErrMsg).toBe('Email cannot be empty');
    expect(instance.state.passwordErrMsg).toBe('Password cannot be empty');
  });

  test('sends email with a valid email address', async () => {
    const tree = renderer.create(<ForgetPasswordScreen />);
    const instance = tree.getInstance();
  
    // Set a valid email address
    const validEmail = 'example@example.com';
    instance.setState({ email: validEmail });
  
    // Simulate the "Continue" button click
    await act(async () => {
      await instance.handleSendEmail();
    });
  
    // Check if the loading state is set to false after email sending
    expect(instance.state.loading).toBe(false);
  });
  
  test('displays error message for empty email address', async () => {
    const tree = renderer.create(<ForgetPasswordScreen />);
    const instance = tree.getInstance();
  
    // Set an empty email address
    const emptyEmail = '';
    instance.setState({ email: emptyEmail });
  
    // Simulate the "Continue" button click
    await act(async () => {
      await instance.handleSendEmail();
    });
  
    // Check if the error message for empty email address is displayed
    expect(instance.state.emailErrMsg).toBe('Email cannot be empty');
  });

  test('verifies OTP with a valid OTP', async () => {
    const tree = renderer.create(<ForgetPasswordScreen />);
    const instance = tree.getInstance();
  
    // Set a valid OTP
    const validOTP = '123456';
    instance.setState({ otp: validOTP, isEmailSent: true });
  
    // Simulate the "Verify OTP" button click
    await act(async () => {
      await instance.handleVerifyOTP();
    });
  
    // Check if the loading state is set to false after OTP verification
    expect(instance.state.loading).toBe(false);
  });

  test('displays error message for invalid OTP', async () => {
    const tree = renderer.create(<ForgetPasswordScreen />);
    const instance = tree.getInstance();
  
    // Set an invalid OTP
    const invalidOTP = '987654';
    instance.setState({ email: 'test@gmail.com', otp: invalidOTP, isEmailSent: true });
  
    // Simulate the "Verify OTP" button click
    await act(async () => {
      await instance.handleVerifyOTP();
    });
  
    // Check if the error message for invalid OTP is displayed
    expect(instance.state.error).toBe('Token has expired or is invalid');
  });
  
  
  
});