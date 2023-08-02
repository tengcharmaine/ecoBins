import React from 'react';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import PasswordUpdate from '../components/passwordupdate';


describe('passwordUpdate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });
  test('renders correctly', () => {
    const tree = renderer.create(<PasswordUpdate />).toJSON();
    
    // Check if the required elements are rendered
    expect(tree).toMatchSnapshot();
  });


test('updates password successfully', async () => {
    const tree = renderer.create(<PasswordUpdate />);
    const instance = tree.getInstance();
  
    // Set the password to be updated
    instance.setState({ password: 'newPassword' });
  
    // Simulate the update password button click
    await act(async () => {
      await instance.handlePasswordUpdate();
    });
  
    // Check if the loading state is set to false after password update
    expect(instance.state.loading).toBe(false);
  });
  
  test('displays error message for empty password', async () => {
    const tree = renderer.create(<PasswordUpdate />);
    const instance = tree.getInstance();
  
    // Set an empty password
    instance.setState({ password: '' });
  
    // Simulate the update password button click
    await act(async () => {
      await instance.handlePasswordUpdate();
    });
  
    // Check if the error message is displayed
    expect(instance.state.errMsg).toBe('Password cannot be empty');
  });

  test('toggles password visibility', () => {
    const tree = renderer.create(<PasswordUpdate />);
    const instance = tree.getInstance();
  
    // Initial state of password visibility
    expect(instance.state.passwordVisible).toBe(false);
  
    // Simulate the toggle password visibility button click
    instance.togglePasswordVisibility();
  
    // Check if password visibility is toggled
    expect(instance.state.passwordVisible).toBe(true);
  });

  test('toggles password visibility back to hidden', () => {
    const tree = renderer.create(<PasswordUpdate />);
    const instance = tree.getInstance();
  
    // Initial state of password visibility
    expect(instance.state.passwordVisible).toBe(false);
  
    // Simulate the toggle password visibility button click twice
    instance.togglePasswordVisibility();
    instance.togglePasswordVisibility();
  
    // Check if password visibility is toggled back to hidden
    expect(instance.state.passwordVisible).toBe(false);
  });
  
});