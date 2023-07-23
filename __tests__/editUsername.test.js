import React from 'react';
import renderer from 'react-test-renderer';
import editusername from '../components/editusername';


describe('Register', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });
  test('renders correctly', () => {
    const tree = renderer.create(<editusername />).toJSON();
    
    // Check if the required elements are rendered
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly with no errors and initial value', () => {
    // Set an initial value for the name state
    const initialName = 'initialUsername';
  
    // Render the component with the initialName as a prop
    const tree = renderer.create(<editusername name={initialName} />).toJSON();
  
    // Check if the required elements are rendered
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly with an error message', () => {
    // Set an error message for the error state
    const errorMessage = 'Username is already taken';
  
    // Render the component with the errorMessage as a prop
    const tree = renderer.create(<editusername error={errorMessage} />).toJSON();
  
    // Check if the required elements are rendered, including the error message
    expect(tree).toMatchSnapshot();
  });

});