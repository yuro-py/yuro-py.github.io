const fs = require('fs');

// Mock browser globals
global.window = {};
global.document = {
  readyState: 'loading',
  addEventListener: (event, cb) => {
    if (event === 'DOMContentLoaded') {
      setTimeout(cb, 10);
    }
  },
  removeEventListener: () => {},
  getElementById: (id) => {
    // Return a mock element with standard properties
    return {
      id: id,
      classList: {
        add: () => {},
        remove: () => {},
        toggle: () => {},
        contains: () => false
      },
      addEventListener: () => {},
      removeEventListener: () => {},
      play: () => Promise.resolve(),
      pause: () => {},
      textContent: '',
      innerHTML: ''
    };
  }
};

try {
  // Load content-index.js
  const contentIndexCode = fs.readFileSync('content-index.js', 'utf8');
  eval(contentIndexCode);
  console.log('content-index.js evaluated successfully');
  
  // Load js/main.js
  const mainJsCode = fs.readFileSync('js/main.js', 'utf8');
  eval(mainJsCode);
  console.log('js/main.js evaluated successfully');
  
  // Wait for DOMContentLoaded to fire
  setTimeout(() => {
    console.log('All initializations completed without exceptions.');
    process.exit(0);
  }, 50);
} catch (e) {
  console.error('CRASH DETECTED:');
  console.error(e);
  process.exit(1);
}
