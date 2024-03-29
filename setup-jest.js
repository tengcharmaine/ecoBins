import '@react-native-async-storage/async-storage/jest/async-storage-mock';
import 'react-native/Libraries/Animated/Animated';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native/Libraries/Animated/Animated', () => {
  return {
    ...jest.requireActual('react-native/Libraries/Animated/Animated'),
    timing: (value, config) => {
      return {
        start: (callback) => {
          value.setValue(config.toValue);
          callback && callback();
        },
      };
    },
  };
});

// function setupTimeTravelForRNAnimated() {
//   const MockDate = require('mockdate');
//   const frameTime = 10;
//   global.withAnimatedTimeTravelEnabled = (func) => {
//       MockDate.set(0);
//       jest.useFakeTimers();
//       func();
//       MockDate.reset();
//       jest.useRealTimers();
//   }
//   global.requestAnimationFrame = (callback) => {
//       setTimeout(callback, frameTime);
//   }
//   global.timeTravel = (time = frameTime) => {
//       const tickTravel = () => {
//           const now = Date.now();
//           MockDate.set(new Date(now + frameTime));
//           // Run the timers forward
//           jest.advanceTimersByTime(frameTime);
//       }
//       // Step through each of the frames
//       const frames = time / frameTime;
//       for (let i = 0; i < frames; i++) {
//           tickTravel();
//       }
//   }
// }
// setupTimeTravelForRNAnimated();

