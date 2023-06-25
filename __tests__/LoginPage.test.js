// LoginPage.test.js

import React from 'react';
import renderer from 'react-test-renderer';
import LoginPage from '../components/login';

describe('LoginPage', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<LoginPage />).toJSON();
    
    // Check if the required elements are rendered
    expect(tree).toMatchSnapshot();
  });

  test('displays error messages for empty email', () => {
    const component = renderer.create(<LoginPage />);
    const instance = component.getInstance();

    // Simulate form submission without entering any values
    instance.handleSubmit();

    // Check if the error messages are displayed
    expect(instance.state.emailErrMsg).toBe('Email cannot be empty');
    expect(instance.state.passwordErrMsg).toBe('Password cannot be empty');
  });

  // Add more tests for different scenarios and edge cases
  
  // test('handles successful login', () => {
  //   ...
  // });

  // test('handles login failure', () => {
  //   ...
  // });

  // test('displays loading indicator during login', () => {
  //   ...
  // });
});


// import React from 'react';
// import renderer from 'react-test-renderer';
// import Intro from '../components/intro';

// test('renders correctly', () => {
//   const tree = renderer.create(<Intro />).toJSON();
//   expect(tree).toMatchSnapshot();
// });