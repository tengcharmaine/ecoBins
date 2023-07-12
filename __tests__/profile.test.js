import React from 'react';
import renderer from 'react-test-renderer';
import { fireEvent, render, waitFor, cleanup } from '@testing-library/react-native';
import HomeScreen from '../components/profile';
import { supabase } from '../lib/supabase';

// Mock user data for testing
const mockUser = {
  id: 'user123',
  email: 'test@example.com',
  profile: 'profile.png',
};
 
// afterEach function runs after each test suite is executed
afterEach(() => {
  cleanup();
})

// jest.mock('../lib/supabase', () => ({
//     supabase: {
//       auth: {
//         getUser: jest.fn().mockResolvedValue({
//           data: { user: { id: 'mockUserId' } },
//         }),
//       },
//       from: () => ({
//         select: jest.fn().mockReturnThis(),
//         eq: jest.fn().mockReturnThis(),
//         single: jest.fn().mockResolvedValue({
//           data: { email: 'johndoe@example.com', profile: 'mockProfilePicture' },
//         }),
//       }),
//     },
//   }));

// Mock the HomeScreen component
// jest.mock('../components/profile', () => {
//   return jest.fn().mockImplementation(() => {
//     return {
//       fetchUsernameAndProfilePicture: jest.fn().mockImplementation(async () => {
//         this.setState({ username: 'test@example.com' });
//       }),
//     };
//   });
// });

describe('HomeScreen', () => {
  test('renders correctly', async () => {
     
    // Create a shallow renderer for the component
    const component = renderer.create(<HomeScreen />);

    // Get the instance of the component
    const instance = component.getInstance();

    // Manually trigger the fetchUsernameAndProfilePicture function
    instance.fetchUsernameAndProfilePicture();

    // Render the component
    const tree = component.toJSON();

    // Assert that the welcome message contains the username
    expect(tree).toMatchSnapshot();
    //expect(tree.children[1].children[0].children).toBe('Welcome, test@example.com!');

  //   const tree = renderer.create(<HomeScreen />).toJSON();
  //   expect(tree).toMatchSnapshot();
  //   // const instance = renderer.create(<HomeScreen />).getInstance();
  //   // const welcomeText = `Welcome, ${instance.state.email}!`;

  //   // // Assert that the welcome message contains the expected email value
  //   // expect(tree.children[1].children[0].children[0]).toEqual(welcomeText);
  // });
  
  // test('should display the username and remaining points', async () => {
  //   jest.spyOn(supabase.auth, 'getUser').mockResolvedValue({ data: { user: { id: 'user123' } } });
  //   jest.spyOn(supabase, 'from').mockReturnThis();
  //   supabase.select = jest.fn().mockReturnThis();
  //   supabase.eq = jest.fn().mockReturnThis();
  //   supabase.single = jest.fn().mockReturnThis();

  //   const { getByText } = render(<HomeScreen />);
  //   await waitFor(() => {
  //     expect(getByText(`Welcome, ${mockUser.email}!`)).toBeTruthy();
  //     expect(getByText('You have 0 points accumulated so far.')).toBeTruthy();
  //   });
   });

   test ('should display the username in the welcome message', async () => {
    const { getByText } = render(<HomeScreen user={mockUser}/>);

    // Wait for the component to finish rendering and updating the state
    await waitFor(() => {
      // Assert that the welcome message contains the username
      expect(getByText('Welcome, test@example.com!')).toBeTruthy();
    });
  });

});

// import React from 'react';
// import renderer from 'react-test-renderer';
// import HomeScreen from '../components/profile';

// jest.mock('../lib/supabase', () => ({
//   supabase: {
//     auth: {
//       getUser: jest.fn().mockResolvedValue({
//         data: { user: { id: 'mockUserId' } },
//       }),
//     },
//     from: () => ({
//       select: jest.fn().mockReturnThis(),
//       eq: jest.fn().mockReturnThis(),
//       single: jest.fn().mockResolvedValue({
//         email: 'johndoe@example.com', profile: 'mockProfilePicture'
//       }),
//     }),
//   },
// }));

// describe('HomeScreen', () => {
//   test('renders correctly with user email', async () => {
//     const tree = renderer.create(<HomeScreen />).toJSON();
//     expect(tree).toMatchSnapshot();

//     // Assert that the welcome message contains the user email
//     expect(tree.children[1].children[0]).toContain('Welcome, johndoe@example.com!');
//   });

//   test('renders correctly with user username', async () => {
//     const tree = renderer.create(<HomeScreen />).toJSON();
//     expect(tree).toMatchSnapshot();

//     // Modify the mockResolvedValue to include a username
//     jest.mock('../lib/supabase', () => ({
//       supabase: {
//         auth: {
//           getUser: jest.fn().mockResolvedValue({
//             data: { user: { id: 'mockUserId' } },
//           }),
//         },
//         from: () => ({
//           select: jest.fn().mockReturnThis(),
//           eq: jest.fn().mockReturnThis(),
//           single: jest.fn().mockResolvedValue({
//             data: { email: 'johndoe@example.com', profile: 'mockProfilePicture', username: 'JohnD' },
//           }),
//         }),
//       },
//     }));

//     // Re-render the component with the updated mock data
//     const updatedTree = renderer.create(<HomeScreen />).toJSON();

//     // Assert that the welcome message contains the user username
//     expect(updatedTree.children[1].children[0]).toContain('Welcome, JohnD!');
//   });
// });
