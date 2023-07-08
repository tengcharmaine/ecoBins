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
  });
});
