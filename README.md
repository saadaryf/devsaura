# Devsaura 🌌

A stunning 3D interactive web experience featuring neon aesthetics, matrix-style falling code, and dynamic particle systems. Built with React Three Fiber and WebGL shaders.

## ✨ Features

- **Interactive 3D Environment**: Fully navigable 3D space with orbit controls
- **Dynamic Neon Text**: Custom shader-based neon text effects with animations
- **Matrix-Style Code Rain**: Falling developer symbols with dynamic movement
- **Floating Keywords**: Programming keywords that float and rotate in space
- **Real-time Clock**: Dynamic time display integrated into the 3D environment
- **Particle System**: Advanced particle systems with trailing effects
- **Atmospheric Background**: Custom nebula shader with stars and dynamic colors
- **Loading Screen**: Smooth loading transition with progress indicator
- **Interactive Code Button**: Firebase-integrated click counter with smooth hover effects

## 🚀 Technologies Used

- React
- Three.js
- React Three Fiber
- React Three Drei
- WebGL Shaders (GLSL)
- Firebase Realtime Database

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/saadaryf/devsaura.git
cd devsaura
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project
   - Add your Firebase configuration in `src/config/firebase.config.js`

4. Start the development server:
```bash
npm start
```

## 📦 Project Structure

```
src/
├── components/
│   └── neon/
│       ├── CodeButton.js       # Interactive GitHub link button
│       ├── CodeParticle.js     # Individual falling code particles
│       ├── DevParticleSystem.js # Main particle system controller
│       ├── LoadingScreen.js    # 3D loading screen
│       ├── NeonScene.js        # Main scene composition
│       ├── NeonTrails.js       # Particle trail effects
│       ├── NeonWord.js         # Shader-based neon text
│       └── SceneAtmosphere.js  # Background nebula effect
├── shaders/
│   ├── nebulaShaders.js       # Background atmosphere shaders
│   └── neonShaders.js         # Neon text effect shaders
└── constants/
    └── devSymbols.js          # Symbol and keyword definitions
```

## 🎮 Controls

- **Orbit**: Click and drag to rotate the camera
- **Auto-Rotation**: Scene automatically rotates for ambient movement
- **Code Button**: Click to visit the GitHub repository and increment the counter

## ⚡ Performance Optimizations

- Efficient shader implementations
- Memoized components and materials
- Suspense for code splitting
- Optimized particle system with pooling
- Progressive loading with progress indicator

## 🎨 Customization

You can customize various aspects of the scene:

- Modify colors in the shader files
- Adjust particle counts and behaviors
- Change neon text content and effects
- Update the symbol and keyword lists
- Modify camera settings and controls

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ by saadaryf