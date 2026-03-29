import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const PurpleTheme: ThemeTypes = {
  name: 'PurpleTheme',
  dark: false,
  variables: {
    'border-color': '#eef2f6',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#1e88e5',
    secondary: '#5e35b1',
    info: '#03c9d7',
    success: '#00c853',
    accent: '#FFAB91',
    warning: '#ffc107',
    error: '#f44336',
    lightprimary: '#eef2f6',
    lightsecondary: '#ede7f6',
    lightsuccess: '#b9f6ca',
    lighterror: '#f9d8d8',
    lightwarning: '#fff8e1',
    darkText: '#212121',
    lightText: '#616161',
    darkprimary: '#1565c0',
    darksecondary: '#4527a0',
    borderLight: '#d0d0d0',
    inputBorder: '#e0e0e0',
    containerBg: '#eef2f6',
    surface: '#fff',
    background: '#f4f6f8',
    'on-surface-variant': '#fff',
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#fafafa',
    primary200: '#90caf9',
    secondary200: '#b39ddb'
  }
};

const DarkTheme: ThemeTypes = {
  name: 'DarkTheme',
  dark: true,
  variables: {
    'border-color': '#2d334d',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#4f8ef7', 
    secondary: '#7c5cfc',
    info: '#03c9d7',
    success: '#00e676',
    accent: '#ff8a65',
    warning: '#ffc107',
    error: '#ff5252',
    
    // Profundo modo nocturno "Ocean Deep"
    background: '#0a0e1a', 
    surface: '#111827', 
    containerBg: '#0a0e1a',
    'on-background': '#ffffff',
    'on-surface': '#e5e7eb',
    
    // Variantes
    lightprimary: '#1e293b',
    lightsecondary: '#1e1b4b',
    lightsuccess: '#064e3b',
    lighterror: '#450a0a',
    lightwarning: '#451a03',
    
    // Textos mejorados
    darkText: '#f3f4f6', 
    lightText: '#9ca3af', 
    borderLight: '#1f2937',
    inputBorder: '#374151',
    
    'on-surface-variant': '#1f2937',
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#111827',
    primary200: '#2563eb',
    secondary200: '#4f46e5'
  }
};

export { PurpleTheme, DarkTheme };
