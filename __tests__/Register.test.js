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
});