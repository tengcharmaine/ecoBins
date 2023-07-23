import React from 'react';
import renderer from 'react-test-renderer';
import Register from '../components/register';
import { act } from 'react-dom/test-utils';


describe('Register', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });
  test('renders correctly', () => {
    const tree = renderer.create(<Register />).toJSON();
    
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

  test('displays error message for short password', () => {
    const component = renderer.create(<Register />);
    const instance = component.getInstance();
  
    // Set a short password
    instance.setState({ password: 'short' });
    instance.setState({ email: 'test@test.com' });
  
    // Simulate form submission
    instance.handleSubmit();
  
    act(() => {
      jest.advanceTimersByTime(1000);
    });
  
    // Check if the error message for short password is displayed
    expect(instance.state.passwordErrMsg).toBe('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit. Please make sure that there is no special characters in your password.');
  });
  
  test('displays error message for password confirmation mismatch', () => {
    const component = renderer.create(<Register />);
    const instance = component.getInstance();
  
    // Set different passwords
    instance.setState({ password: 'Password123!', confirmPassword: 'DifferentPassword123!' });
  
    // Simulate form submission
    instance.handleSubmit();
  
    act(() => {
      jest.advanceTimersByTime(1000);
    });
  
    // Check if the error message for password confirmation mismatch is displayed
    expect(instance.state.cfmpasswordErrMsg).toBe('Passwords do not match');
  });
  
  test('toggles password visibility', () => {
    const component = renderer.create(<Register />);
    const instance = component.getInstance();
  
    // Initially, passwordVisible should be false
    expect(instance.state.passwordVisible).toBe(false);
  
    // Simulate toggling password visibility
    instance.togglePasswordVisibility();
  
    // After toggling, passwordVisible should be true
    expect(instance.state.passwordVisible).toBe(true);
  
    // Simulate toggling password visibility again
    instance.togglePasswordVisibility();
  
    // After toggling again, passwordVisible should be false
    expect(instance.state.passwordVisible).toBe(false);
  });
  
});