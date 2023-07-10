import React from 'react';
// import { render, fireEvent } from '@testing-library/react-native';
import renderer from 'react-test-renderer';
import HomeScreen from '../components/profile';




jest.mock('../lib/supabase', () => ({
    supabase: {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'mockUserId' } },
        }),
      },
      from: () => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { email: 'johndoe@example.com', profile: 'mockProfilePicture' },
        }),
      }),
    },
  }));

describe('HomeScreen', () => {
  test('renders correctly', async () => {
    const tree = renderer.create(<HomeScreen />).toJSON();
    expect(tree).toMatchSnapshot();
    const instance = renderer.create(<HomeScreen />).getInstance();
    const welcomeText = `Welcome, ${instance.state.email}!`;

    // Assert that the welcome message contains the expected email value
    expect(tree.children[1].children[0].children[0]).toEqual(welcomeText);
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
