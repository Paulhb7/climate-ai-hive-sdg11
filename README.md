# 🌍🐝 Climate Hive

**AI-Powered Urban Climate Adaptation Platform**

Climate Hive is an innovative platform designed to support cities in their climate adaptation journey by aligning with UN Sustainable Development Goal 11. The platform combines AI agents, real-time climate data, and interactive 3D mapping to provide personalized recommendations for urban resilience.

## 🎯 Mission

- 🌡️ **Analyze climate change impacts** on cities worldwide
- 🏙️ **Provide personalized recommendations** for urban resilience
- 🏛️ **Showcase UN projects** and initiatives for sustainable cities
- 📋 **Help cities understand and implement** SDG 11 targets

## ⚡ Technology Stack

### Frontend
- **Next.js 15** with TypeScript
- **React 19** with modern hooks
- **Mapbox GL JS** for 3D interactive mapping
- **Tailwind CSS** for styling
- **Glassmorphism UI** design

### Backend
- **FastAPI** (Python) for API endpoints
- **BeeAI Framework** with WatsonX and Granite models
- **Groq API** for LLM inference
- **Wikipedia Tool** for research data
- **OpenMeteo API** for weather data

### AI Agents
- **Researcher Agent**: Analyzes climate change impacts
- **Weather Forecaster Agent**: Provides weather trends and anomalies
- **Data Synthesizer Agent**: Combines research and weather data
- **Urban Advisor Agent**: Provides SDG11-aligned recommendations
- **UN Project Expert Agent**: Highlights relevant UN initiatives
- **SDG11 Validation Agent**: Validates proposals against SDG11 criteria

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- Groq API key

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ApisLazuli
```

### 2. Frontend Setup
```bash
cd climate-front
npm install
```

### 3. Backend Setup
```bash
# Install Python dependencies
pip install fastapi uvicorn beeai-framework

# Set your Groq API key
export GROQ_API_KEY="your_groq_api_key_here"
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd /path/to/ApisLazuli
uvicorn api:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd climate-front
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 🏗️ Architecture

```
ApisLazuli/
├── climate-front/          # Next.js frontend
│   ├── src/app/
│   │   ├── page.tsx       # Main application
│   │   ├── Mapbox3DMap.tsx # 3D map component
│   │   └── layout.tsx     # App layout
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── agents.py              # AI agents implementation
├── api.py                 # FastAPI backend
├── onu.py                 # UN data utilities
└── README.md             # This file
```

## 🎮 Features

### 1. Interactive 3D Map
- **Real-time city search** with autocomplete
- **Geolocation detection** for automatic city identification
- **3D terrain visualization** with Mapbox GL JS
- **Responsive design** for all devices

### 2. AI-Powered Analysis
- **Climate Impact Analysis**: Detailed assessment of climate change effects
- **SDG11 Recommendations**: Actionable advice aligned with UN goals
- **Weather Trend Analysis**: Current and projected weather patterns
- **UN Project Showcase**: Real initiatives and best practices

### 3. Interactive Q&A
- **Follow-up Questions**: Ask specific questions about recommendations
- **SDG11 Validation**: Check if proposals meet UN criteria
- **Real-time Responses**: Instant AI-powered answers

### 4. User Experience
- **Glassmorphism UI**: Modern, translucent design
- **Progressive Disclosure**: Step-by-step information flow
- **Loading States**: Clear feedback during AI processing
- **Error Handling**: Graceful error management

## 🔧 API Endpoints

### Climate Impact Analysis
```http
POST /climate-impact
Content-Type: application/json

{
  "city": "Paris"
}
```

### SDG11 Recommendations
```http
POST /recommendations
Content-Type: application/json

{
  "city": "Paris",
  "question": "Does installing solar panels meet SDG11 criteria?"
}
```

### UN Projects
```http
POST /un-projects
Content-Type: application/json

{
  "city": "Paris"
}
```

## 🎨 UI Components

### Main Interface
- **Intro Modal**: Project overview and mission statement
- **Search Bar**: City input with geolocation button
- **3D Map**: Interactive Mapbox visualization
- **Results Modal**: AI analysis and recommendations

### Interactive Elements
- **Glassmorphism Cards**: Translucent, modern design
- **Loading Animations**: Smooth transitions
- **Responsive Layout**: Mobile-first approach
- **Accessibility**: ARIA labels and keyboard navigation

## 🔒 Environment Variables

Create a `.env.local` file in the `climate-front` directory:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For the backend, set:

```bash
export GROQ_API_KEY="your_groq_api_key"
```

## 🧪 Development

### Frontend Development
```bash
cd climate-front
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Code linting
```

### Backend Development
```bash
uvicorn api:app --reload --port 8000  # Development server
uvicorn api:app --host 0.0.0.0 --port 8000  # Production server
```

### Code Structure
- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Tailwind**: Utility-first CSS

## 🌐 Deployment

### Frontend (Vercel/Netlify)
```bash
cd climate-front
npm run build
# Deploy the .next folder
```

### Backend (Railway/Heroku)
```bash
# Set environment variables
GROQ_API_KEY=your_key
# Deploy with uvicorn
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **UN Sustainable Development Goals** for the framework
- **BeeAI Framework** for the AI agent infrastructure
- **Mapbox** for the mapping technology
- **OpenMeteo** for climate data
- **Groq** for LLM inference

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for a sustainable future by Paul BARBASTE, Louise CAIGNAERT and Tristan DARRIGOL** 
