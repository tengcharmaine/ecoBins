import React from 'react';
import renderer from 'react-test-renderer';
import Register from '../components/register';

describe('Register', () => {
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

    // Check if the error messages are displayed
    expect(instance.state.emailErrMsg).toBe('Email cannot be empty');
    expect(instance.state.passwordErrMsg).toBe('Password cannot be empty');
  });
});