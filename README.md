# Enterprise Architecture Application

A comprehensive Enterprise Architecture visualization and management platform built with React, TypeScript, and modern web technologies.

## 🚀 Features

- **Architecture Visualization**: Interactive Mermaid.js diagrams for various architecture views
- **AI-Powered Chat**: Integration with OpenAI for intelligent assistance
- **Multi-Industry Support**: Support for different industry-specific architectures (NYK, Shipping, etc.)
- **Real-time Collaboration**: Voice chat and real-time updates
- **EA Automation**: Automated EA review processes and reporting
- **Analytics Dashboard**: Comprehensive analytics and insights
- **Maturity Assessment**: EA maturity surveys and evaluation tools
- **TOGAF Framework**: Built-in TOGAF methodology support

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS
- **Diagrams**: Mermaid.js
- **AI Integration**: OpenAI API
- **Backend**: Node.js, Express
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js 18+ and npm
- OpenAI API key (for AI features)

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/tcs-imokawa-masanori/enterprise.git
cd enterprise
```

2. Install dependencies:
```bash
npm install
cd server
npm install
cd ..
```

3. Set up environment variables:
   - Copy `server/env.example` to `server/.env`
   - Add your OpenAI API key and other configuration

4. Start the application:

**Option 1: Using the start script (Windows)**
```bash
start-servers.bat
```

**Option 2: Manual start**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5175
- Backend: http://localhost:3001

## 📁 Project Structure

```
├── src/
│   ├── components/          # React components
│   ├── contexts/           # React context providers
│   ├── data/               # Data models and datasets
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and service integrations
│   └── utils/              # Utility functions
├── server/                 # Backend server
├── pic/                    # Images and screenshots
└── dist/                   # Production build (generated)
```

## 🚢 Deployment

### AWS Deployment
See [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md) for detailed AWS deployment instructions.

### EC2 Deployment
```bash
# On your EC2 instance
bash deploy-to-ec2.sh
```

## 📖 Documentation

- [Voice Chat Setup](./VOICE_CHAT_README.md)
- [EA Maturity Survey](./EA_MATURITY_SURVEY.md)
- [Mermaid Auto Generation](./MERMAID_AUTO_GENERATION.md)
- [Nginx Configuration](./nginx-troubleshooting.md)

## 🔐 Security

**Important**: Never commit API keys or sensitive credentials to the repository. Use environment variables and the `.env` file (which is gitignored).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👥 Authors

TCS - Imokawa Masanori

## 🙏 Acknowledgments

- TOGAF Framework
- OpenAI for AI capabilities
- Mermaid.js for diagram rendering
- React and TypeScript communities

