# WanderGo - Travel Activity Finder

## 🧰 Technologies Used

**Framework:** React Native (via Expo) for cross-platform development.

**Navigation:** React Navigation (Native Stack) for seamless screen transitions.

**Database:** expo-sqlite for local persistence of saved activities.

**Maps & Geolocation:** react-native-maps for displaying interactive maps and markers.

**UI & Styling:**
- expo-linear-gradient for dynamic background gradients.
- expo-vector-icons (Octicons, MaterialCommunityIcons) for a consistent icon set.
- Custom StyleSheets and Design.

**Fonts:** @expo-google-fonts/roboto for clean and modern typography.

**APIs:**
- Google Maps Geocoding API to convert addresses into geographic coordinates.
- Amadeus Travel API to fetch tourist activities based on location.

**Utilities:**
- react-native-render-html to display formatted activity descriptions.
- react-native-safe-area-context to handle device notches and UI insets.

## 🎨 Enhanced UI & Experience

### **Theming & Design System**
- **@callstack/react-theme-provider** – Comprehensive theming solution for managing design tokens, colors, and UI consistency.

### **Material Design Components**
- **react-native-paper** – Modern, Material Design UI components including cards, buttons, dialogs, chips, and surfaces.

### **Multimedia Experience**
- **expo-audio** – Advanced audio playback capabilities for sound effects and voice-guided tours.

### **Advanced Animations**
- **react-native-reanimated** – High-performance animation library for smooth 60fps transitions and complex gesture interactions.

### **Onboarding & First-Time Experience**
- **react-native-app-intro-slider** – Beautiful, customizable onboarding screens for first-time users.

### **Interactive Media Galleries**
- **react-native-swiper** – Feature-rich image carousels for displaying activity photos with intuitive swipe gestures.

### **High-Performance UI**
- **react-native-worklets** – Enables smooth, jank-free animations by running UI logic on a separate thread.

## 🚀 Key Features

### **1. Smart Activity Discovery**
- **Location-based Search** – Find activities near any address or popular destination
- **Popular Tags** – Quick access to trending destinations and activity types
- **Real-time Filtering** – Dynamic filtering based on user preferences

### **2. Rich Activity Details**
- **Image Galleries** – Swipeable image carousels showcasing activity visuals
- **Interactive Maps** – Pinpoint locations with zoom and pan functionality
- **Audio Descriptions** – Text-to-speech for accessibility and convenience
- **HTML-rich Content** – Formatted descriptions with styling and media

### **3. Personalized Experience**
- **Favorite System** – Save activities for later with heart animations
- **Theming Support** – Consistent UI across different themes
- **Onboarding Flow** – Guided introduction for new users
- **Local Storage** – Offline access to saved activities
