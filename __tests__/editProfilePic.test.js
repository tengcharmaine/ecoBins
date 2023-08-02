import React from 'react';
import renderer from 'react-test-renderer';
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import editprofilepic from '../components/editprofilepic';

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: false, assets: [{ uri: "mocked-image-uri" }] })),
}));

jest.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: { id: "mocked-user-id" } } })),
    },
    storage: {
      from: () => ({
        upload: jest.fn(() => Promise.resolve({ data: { path: "mocked-uploaded-path" } })),
        getPublicUrl: jest.fn(() => Promise.resolve({ data: { publicUrl: "mocked-public-url" } })),
      }),
    },
    from: () => ({
      update: jest.fn(() => Promise.resolve({ data: { profile: "mocked-profile-url" } })),
    }),
  },
}));

// jest.mock("@react-navigation/compat", () => ({
//   withNavigation: (Component) => (props) => <Component {...props} navigation={{ navigate: jest.fn() }} />,
// }));

describe('EditProfilePic', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<editprofilepic />).toJSON();

    // Check if the required elements are rendered
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly with an initial image', () => {
    // Set an initial value for the image state
    const initialImage = 'https://example.com/default-profile-pic.jpg';

    // Render the component with the initialImage as a prop
    const tree = renderer.create(<editprofilepic image={initialImage} />).toJSON();

    // Check if the required elements are rendered
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly with an error message', () => {
    // Set an error message for the error state
    const errorMessage = 'Error uploading image';

    // Render the component with the errorMessage as a prop
    const tree = renderer.create(<editprofilepic error={errorMessage} />).toJSON();

    // Check if the required elements are rendered, including the error message
    expect(tree).toMatchSnapshot();
  });

});
