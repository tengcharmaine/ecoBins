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

  test('displays error messages for empty credentials', () => {
    const component = renderer.create(<LoginPage />);
    const instance = component.getInstance();

    // Simulate form submission without entering any values
    instance.handleSubmit();

    // Check if the error messages are displayed
    expect(instance.state.emailErrMsg).toBe('Email cannot be empty');
    expect(instance.state.passwordErrMsg).toBe('Password cannot be empty');
  });

  // test('handles login failure', async () => {
  //   const mockSignInWithPassword = jest.fn(() =>
  //     Promise.reject(new Error('Invalid email or password'))
  //   );

  //   const component = renderer.create(<LoginPage />);
  //   const instance = component.getInstance();

  //   // Mock the signInWithPassword function with a failed response
  //   instance.handleSubmit = jest.fn(() => {
  //     instance.setState({ loading: true });

  //     return mockSignInWithPassword()
  //       .then(() => {
  //         instance.setState({ loading: false });
  //       })
  //       .catch((error) => {
  //         instance.setState({ loading: false, errMsg: error.message });
  //       });
  //   });

  //   // Set the email and password fields
  //   instance.setState({ email: 'invalid@example.com', password: 'wrongpassword' });

  //   // Trigger the form submission
  //   await instance.handleSubmit();

  //   // Check if the loading state is reset
  //   expect(instance.state.loading).toBe(false);

  //   // Check if the error message is set
  //   expect(instance.state.errMsg).toBe('Invalid email or password');
  // });
});