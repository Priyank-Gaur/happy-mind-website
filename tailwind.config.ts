import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		screens: {
  			xs: '480px'
  		},
  		spacing: {
  			'4.5': '1.125rem',
  			'7.5': '1.875rem',
  			'10.5': '2.625rem',
  			'18': '4.5rem'
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			/* Brand accents - use sparingly, on top of the semantic tokens */
  			lavender: {
  				DEFAULT: 'hsl(var(--lavender))',
  				light: 'hsl(var(--lavender-light))',
  				medium: 'hsl(var(--lavender-medium))',
  				deep: 'hsl(var(--lavender-deep))'
  			},
  			aqua: {
  				DEFAULT: 'hsl(var(--aqua))',
  				deep: 'hsl(var(--aqua-deep))'
  			},
  			'pastel-blue': 'hsl(var(--pastel-blue))',
  			peach: 'hsl(var(--peach))',
  			mint: 'hsl(var(--mint))',
  			sand: 'hsl(var(--sand))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		keyframes: {
			'accordion-down': {
				from: {
					height: '0'
				},
				to: {
					height: 'var(--radix-accordion-content-height)'
				}
			},
			'accordion-up': {
				from: {
					height: 'var(--radix-accordion-content-height)'
				},
				to: {
					height: '0'
				}
			},
			'float': {
				'0%, 100%': {
					transform: 'translateY(0px)'
				},
				'50%': {
					transform: 'translateY(-8px)'
				}
			},
			'gradient-flow': {
				'0%, 100%': {
					backgroundPosition: '0% 50%'
				},
				'50%': {
					backgroundPosition: '100% 50%'
				}
			},
			'gradient-slow': {
				'0%, 100%': {
					opacity: '0.3',
					transform: 'translateX(-10%)'
				},
				'50%': {
					opacity: '0.6',
					transform: 'translateX(10%)'
				}
			},
			'mist-left': {
				'0%, 100%': {
					opacity: '0.6',
					transform: 'translateX(-5%)'
				},
				'50%': {
					opacity: '0.9',
					transform: 'translateX(5%)'
				}
			},
			'mist-left-slow': {
				'0%, 100%': {
					opacity: '0.4',
					transform: 'translateX(0%) scale(1)'
				},
				'50%': {
					opacity: '0.7',
					transform: 'translateX(10%) scale(1.05)'
				}
			},
			'mist-right': {
				'0%, 100%': {
					opacity: '0.6',
					transform: 'translateX(5%)'
				},
				'50%': {
					opacity: '0.9',
					transform: 'translateX(-5%)'
				}
			},
			'mist-right-slow': {
				'0%, 100%': {
					opacity: '0.4',
					transform: 'translateX(0%) scale(1)'
				},
				'50%': {
					opacity: '0.7',
					transform: 'translateX(-10%) scale(1.05)'
				}
			},
			'mist-pulse': {
				'0%, 100%': {
					opacity: '0.3'
				},
				'50%': {
					opacity: '0.6'
				}
			},
			'scroll-left': {
				'0%': {
					transform: 'translateX(100%)'
				},
				'100%': {
					transform: 'translateX(-100%)'
				}
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			'float': 'float 3s ease-in-out infinite',
			'gradient-flow': 'gradient-flow 8s ease-in-out infinite',
			'gradient-slow': 'gradient-slow 12s ease-in-out infinite',
			'mist-left': 'mist-left 6s ease-in-out infinite',
			'mist-left-slow': 'mist-left-slow 10s ease-in-out infinite',
			'mist-right': 'mist-right 6s ease-in-out infinite',
			'mist-right-slow': 'mist-right-slow 10s ease-in-out infinite',
			'mist-pulse': 'mist-pulse 4s ease-in-out infinite',
			'scroll-left': 'scroll-left 20s linear infinite'
		},
  		boxShadow: {
  			'2xs': 'var(--shadow-2xs)',
  			xs: 'var(--shadow-xs)',
  			sm: 'var(--shadow-sm)',
  			DEFAULT: 'var(--shadow)',
  			md: 'var(--shadow-md)',
  			lg: 'var(--shadow-lg)',
  			xl: 'var(--shadow-xl)',
  			'2xl': 'var(--shadow-2xl)',
  			soft: 'var(--shadow-soft)',
  			card: 'var(--shadow-card)',
  			glow: 'var(--shadow-glow)'
  		},
  		fontFamily: {
  			sans: [
  				'Nunito',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif',
  				'Apple Color Emoji',
  				'Segoe UI Emoji',
  				'Segoe UI Symbol',
  				'Noto Color Emoji'
  			],
  			serif: [
  				'Nunito',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'Nunito',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif'
  			]
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
