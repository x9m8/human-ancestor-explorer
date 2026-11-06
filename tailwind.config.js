export default {
        content: ["./index.html","./App.tsx","./index.tsx","./components/**/*.tsx"],
        theme: {
          extend: {
            colors: {
              'park-water': '#4ea6a9',
              'park-water-light': '#66bfc1',
              'park-water-dark': '#3a878a',
              'park-water-bg': '#54b0b2',
              'park-land': '#b5d774',
              'park-land-dark': '#97be56',
              'park-land-light': '#c8e48b',
              'park-sand': '#f6f3e5',
              'park-tree': '#2b585c',
              'park-trunk': '#735238',
              'park-card': '#fcfbf7',
              'park-card-muted': '#f4f1e6',
              'park-card-border': '#e5e1d3',
              'park-ink': '#1f3835',
              'park-ink-muted': '#567a72',
              'park-ink-light': '#8daaa3',
              'park-border-green': '#87bd52',
              'park-accent-yellow': '#f5a623',
              'park-accent-orange': '#e67e22',
              'park-accent-coral': '#f43f5e',
              'park-accent-blue': '#0284c7',
              'park-accent-green': '#10b981',
              'park-bus': '#e74c3c',
            },
            fontFamily: {
              hand: ['"Gaegu"', 'cursive', 'sans-serif'],
              rounded: ['"M PLUS Rounded 1c"', '"Nunito"', 'sans-serif'],
              sans: ['"Nunito"', '"Quicksand"', '"M PLUS Rounded 1c"', 'sans-serif'],
              mono: ['"Roboto Mono"', 'monospace'],
            }
          }
        }
      }
