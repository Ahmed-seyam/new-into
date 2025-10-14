module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    borderRadius: {
      DEFAULT: '8px',
      xs: '2px',
      sm: '4px',
      md: '8px',
      lg: '15px',
      xl: '20px',
      full: '9999px',
    },
    boxShadow: {
      DEFAULT: '0px 0px 4px rgba(0, 0, 0, 0.1)',
    },
    container: {
      maxWidth: {
        DEFAULT: '100%',
      },
      screens: {
        DEFAULT: '100%',
        sm: '100%',
        md: '100%',
        lg: '100%',
        xl: '100%',
        '2xl': '100%',
      },
    },
    fontFamily: {
      sans: '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    fontSize: {
      // 9px
      xxs: [
        '0.675rem',
        {
          letterSpacing: '0.0em',
          lineHeight: '1.1',
        },
      ],
      // 12px
      xs: [
        '0.75rem',
        {
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
        },
      ],
      // 14px
      sm: [
        '0.875rem',
        {
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
        },
      ],
      // 16px
      md: [
        '1rem',
        {
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
        },
      ],
      //18px
      lg: [
        '1.125rem',
        {
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
        },
      ],
      // 24px
      xl: [
        '1.5rem',
        {
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
        },
      ],
      // 36px
      '2xl': [
        '2.25rem',
        {
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
        },
      ],
      // 54px
      '3xl': [
        '3.375rem',
        {
          letterSpacing: '-0.03em',
          lineHeight: '1',
        },
      ],
      // 74px
      '4xl': [
        '4.625rem',
        {
          letterSpacing: '-0.03em',
          lineHeight: '1',
        },
      ],
      // 110px
      '5xl': [
        '6.875rem',
        {
          letterSpacing: '-0.03em',
          lineHeight: '1',
        },
      ],
    },
    fontWeight: {
      bold: 700,
      medium: 500,
    },
    letterSpacing: {
      normal: '-0.03em',
    },
    lineHeight: {
      none: '1',
      field: '1.25',
      caption: '1.25',
      paragraph: '1.6',
    },
    extend: {
      animation: {
        pulse: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '4/6': '4 / 6',
      },
      colors: {
        panelBg: '#FBFBFB',
        darkGray: '#757575',

        lightGray: '#F3F3F3',
        offBlack: '#2B2E2E',
        peach: '#FFE1D1',
        shopPay: '#5A31F4',
        theme: '#25824f',
        themeLight: '#DAFFEA',
        filter1: {
          DEFAULT: '#747474',
          100: '#747474',
          200: '#5F5F5F',
        },
        gray: {
          DEFAULT: '#E7E7E7',
          100: '#E7E7E7',
          200: '#D1D1D1',
        },
        green: {
          DEFAULT: '##43a047',
          100: '#43a047',
          200: '#2e7d32',
        },
        brown: {
          DEFAULT: '#6d4c41',
          100: '#6d4c41',
          200: '#5d4034',
        },
        yellow: {
          DEFAULT: '#ffeb3b',
          100: '#ffeb3b',
          200: '#fdd835',
        },
        purple: {
          DEFAULT: '#673ab7',
          100: '#673ab7',
          200: '#512da8',
        },
        orange: {
          DEFAULT: '#ff9800',
          100: '#ff9800',
          200: '#fb8c00',
        },
        gold: {
          DEFAULT: '#cb9900',
          100: '#cb9900',
          200: '#b38a00',
        },
        beige: {
          DEFAULT: '#e0d7a9',
          100: '#e0d7a9',
          200: '#c9c28a',
        },
        pink: {
          DEFAULT: '#f8bbd0',
          100: '#f8bbd0',
          200: '#f48fb1',
        },
        silver: {
          DEFAULT: '#9e9e9e',
          100: '#9e9e9e',
          200: '#757575',
        },
        cream: {
          DEFAULT: '##fff8e1',
          100: '#fff8e1',
          200: '#fff3c4',
        },
        red: {
          DEFAULT: '#e53935',
          100: '#e53935',
          200: '#d32f2f',
        },
        blue: {
          DEFAULT: '#1e88e5',
          100: '#1e88e5',
          200: '#1976d2',
        },
      },
      maxWidth: {
        '8xl': '90rem',
        '9xl': '100rem',
        '10xl': '110rem',
        '11xl': '120rem',
        '12xl': '130rem',
        '3/4': '75%',
      },
      height: {
        'header-sm': '4.375rem',
        'header-lg': '6.25rem',
        screen: '100vh',
      },
      keyframes: {
        pulse: {
          '0%, 100%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.75,
          },
        },
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px',
        11: '44px',
        12: '48px',
        13: '52px',
        14: '56px',
        15: '60px',
        16: '64px',
        17: '68px',
        18: '72px',
        19: '76px',
        20: '80px',
        21: '84px',
        22: '88px',
        23: '92px',
        24: '96px',
        25: '100px',
        26: '104px',
        27: '108px',
        28: '112px',
        29: '116px',
        30: '120px',
        31: '124px',
        32: '128px',
        33: '132px',
        34: '136px',
        35: '140px',
        36: '144px',
        37: '148px',
        38: '152px',
        39: '156px',
        40: '160px',
        '11/12': '91.666667%',
        overlap: '20px',
      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      backgroundOpacity: ['active'],
    },
  },
};
