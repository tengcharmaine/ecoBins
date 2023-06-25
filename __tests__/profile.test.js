// import React from 'react';
// import renderer from 'react-test-renderer';
// import HomeScreen from '../components/profile';
// import { render } from '@testing-library/react-native';

// describe('Profile', () => {
//   test('renders correctly', () => {
//     const tree = renderer.create(<HomeScreen />).toJSON();
    
//     // Check if the required elements are rendered
//     expect(tree).toMatchSnapshot();
//   });

//   test('displays the username', () => {
//     const username = 'John Doe';
//     const { getByText } = render(<HomeScreen username={username} />);
//     const usernameText = getByText(/Welcome, John Doe!/i);
//     expect(usernameText).toBeTruthy();
//   });

//   test('displays the remaining points', () => {
//     const remainingPoints = 100;
//     const { getByText } = render(<HomeScreen remainingPoints={remainingPoints} />);
//     const pointsText = getByText(/You have 100 points accumulated so far./i);
//     expect(pointsText).toBeTruthy();
//   });
// });

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
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

describe('Profile', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<HomeScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

//   test('displays the username in the welcome message', async () => {
//     const { getByText } = render(<HomeScreen />);
//     const welcomeText = getByText('Welcome, johndoe@example.com!');
//     expect(welcomeText).toBeTruthy();
//   });

//   test('displays the remaining points', () => {
//     const { getByText } = render(<HomeScreen />);
//     const remainingPoints = 100;
//     const pointsText = getByText(`You have ${remainingPoints} points accumulated so far.`);
//     expect(pointsText).toBeTruthy();
//   });

//   test('calls navigation.navigate when edit profile picture icon is pressed', () => {
//     const navigate = jest.fn();
//     const { getByTestId } = render(<HomeScreen navigation={{ navigate }} />);
//     const editProfilePictureIcon = getByTestId('edit-profile-picture-icon');
//     fireEvent.press(editProfilePictureIcon);
//     expect(navigate).toHaveBeenCalledWith('editprofilepic');
//   });

//   test('calls navigation.navigate when edit username icon is pressed', () => {
//     const navigate = jest.fn();
//     const { getByTestId } = render(<HomeScreen navigation={{ navigate }} />);
//     const editUsernameIcon = getByTestId('edit-username-icon');
//     fireEvent.press(editUsernameIcon);
//     expect(navigate).toHaveBeenCalledWith('editusername');
//   });
});
