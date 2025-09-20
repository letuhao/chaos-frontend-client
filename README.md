# Chaos World - Cultivation RPG

A cultivation RPG inspired by "Tale of Immortal", built with Unity WebGL + HTML/CSS hybrid approach for optimal performance and development efficiency.

## 🎮 Project Overview

**Chaos World** is an indie cultivation RPG that combines the power of Unity's game engine with modern web technologies. Players embark on a journey of cultivation, building their character from a mortal to an immortal being through various realms and challenges.

### Key Features
- **Hybrid Architecture**: Unity WebGL for game world + HTML/CSS for UI
- **Mobile Optimized**: Responsive design for all screen sizes
- **Steam Integration**: Full Steam features support
- **Progressive Web App**: Installable on mobile devices
- **Cross-Platform**: Works on Windows, Mac, Linux, and mobile

## 🏗️ Project Structure

```
chaos-frontend-client/
├── 📁 unity-project/                    # Unity project
│   ├── 📁 Assets/
│   │   ├── 📁 Scripts/                  # C# scripts
│   │   │   ├── 📁 Core/                 # Core game systems
│   │   │   ├── 📁 UI/                   # Unity UI scripts
│   │   │   ├── 📁 Hybrid/               # Unity-HTML bridge
│   │   │   ├── 📁 Cultivation/          # Cultivation system
│   │   │   ├── 📁 Combat/               # Combat system
│   │   │   ├── 📁 Inventory/            # Inventory system
│   │   │   └── 📁 World/                # World/exploration
│   ├── 📁 Scenes/                       # Unity scenes
│   ├── 📁 Prefabs/                      # Unity prefabs
│   ├── 📁 Materials/                    # Unity materials
│   ├── 📁 Textures/                     # Unity textures
│   ├── 📁 Audio/                        # Audio files
│   ├── 📁 Animations/                   # Unity animations
│   └── 📁 StreamingAssets/              # Streaming assets
├── 📁 web-assets/                       # HTML/CSS/JS assets
│   ├── 📁 src/                          # Source files
│   │   ├── 📁 css/                      # CSS stylesheets
│   │   ├── 📁 js/                       # JavaScript files
│   │   ├── 📁 html/                     # HTML templates
│   │   └── 📁 assets/                   # Web assets
│   └── 📁 dist/                         # Built web assets
├── 📁 builds/                           # Build outputs
│   ├── 📁 webgl/                        # WebGL build
│   ├── 📁 webgl-mobile/                 # Mobile-optimized build
│   ├── 📁 steam/                        # Steam builds
│   └── 📁 testing/                      # Test builds
├── 📁 scripts/                          # Build and deployment scripts
├── 📁 config/                           # Configuration files
├── 📁 tests/                            # Testing files
├── 📁 tools/                            # Development tools
└── 📁 docs/                             # Documentation
```

## 🚀 Quick Start

### Prerequisites
- **Unity 2023.3.0f1** or later
- **Node.js 18+** and npm
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/chaos-world-game.git
   cd chaos-world-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Unity project**
   - Open `unity-project` in Unity 2023.3.0f1
   - Import required packages
   - Configure build settings for WebGL

4. **Build the game**
   ```bash
   npm run build:all
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   The development server will start on http://localhost:3200

## 🛠️ Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build web assets |
| `npm run build:unity` | Build Unity WebGL |
| `npm run build:all` | Build everything |
| `npm run deploy` | Deploy to production |
| `npm run test` | Run all tests |
| `npm run test:unit` | Run unit tests |
| `npm run test:integration` | Run integration tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:performance` | Run performance tests |
| `npm run lint` | Lint JavaScript |
| `npm run lint:css` | Lint CSS |
| `npm run format` | Format code |
| `npm run analyze` | Analyze bundle size |

### Development Workflow

1. **Unity Development**
   - Work in `unity-project/` directory
   - Use Unity's built-in tools for game logic
   - Test WebGL builds regularly

2. **Web Development**
   - Work in `web-assets/src/` directory
   - Use modern web technologies
   - Test on multiple devices

3. **Integration Testing**
   - Test Unity-HTML communication
   - Verify mobile performance
   - Check Steam integration

## 🎯 Architecture

### Unity WebGL + HTML/CSS Hybrid

This project uses a hybrid approach that combines:

- **Unity WebGL**: Game world, physics, rendering, core game logic
- **HTML/CSS**: UI, menus, inventory, character stats
- **JavaScript**: Communication bridge, Steam integration, analytics

### Benefits of Hybrid Approach

- **Better Performance**: HTML UI is lighter than Unity UI
- **Easier Development**: CSS is more flexible than Unity UI
- **Mobile Optimized**: Responsive design for all screen sizes
- **Web Technologies**: Use any CSS framework or JavaScript library
- **SEO Friendly**: HTML content can be indexed by search engines

### Communication Flow

```
Unity WebGL ←→ JavaScript Bridge ←→ HTML/CSS UI
     ↓
Steam Integration
     ↓
Analytics & Cloud Saves
```

## 📱 Mobile Optimization

### Responsive Design
- CSS Grid and Flexbox for layouts
- Media queries for different screen sizes
- Touch-friendly UI elements (44px minimum)

### Performance
- Optimized textures and audio
- Lazy loading of assets
- Efficient Unity WebGL settings

### PWA Features
- Installable on mobile devices
- Offline support with service worker
- App-like experience

## 🎮 Steam Integration

### Features
- **Achievements**: 5+ achievements configured
- **Cloud Saves**: Automatic save synchronization
- **Friends**: Social features integration
- **Overlay**: Custom overlay for WebGL

### Configuration
Edit `config/steam-config.json` to configure:
- Steam App ID
- Achievement definitions
- Cloud save settings
- Friend features

## 🧪 Testing

### Test Types
- **Unit Tests**: Individual component testing
- **Integration Tests**: Unity-HTML communication
- **E2E Tests**: Full game flow testing
- **Performance Tests**: Mobile performance validation

### Running Tests
```bash
# All tests
npm run test

# Specific test types
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:performance
```

## 🚀 Deployment

### Web Deployment
- **Netlify**: Automatic deployment from Git
- **Vercel**: Alternative deployment option
- **Custom Server**: Any static hosting service

### Steam Deployment
- Build Steam version using `npm run build:steam`
- Upload to Steam using Steamworks SDK
- Configure Steam features

### Mobile Deployment
- PWA installation on mobile devices
- App store distribution (future)

## 📚 Documentation

- [Quick Start Guide](docs/quick-start.md)
- [Setup Guide](docs/setup-guide.md)
- [Game Architecture](docs/game-architecture.md)
- [Mobile Optimization](docs/mobile-optimization.md)
- [Steam Integration](docs/steam-integration.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/chaos-world-game/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/chaos-world-game/discussions)
- **Discord**: [Join our Discord](https://discord.gg/chaos-world)

## 🙏 Acknowledgments

- Inspired by "Tale of Immortal" by GSQ Games
- Built with Unity WebGL
- Powered by modern web technologies
- Community contributions and feedback

---

**Happy Cultivating! 🌟**