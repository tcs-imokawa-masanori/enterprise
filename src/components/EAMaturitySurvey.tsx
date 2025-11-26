import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Send, 
  Users, 
  BarChart3, 
  Download, 
  Mail, 
  Plus,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Copy
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SurveyQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  scores: number[];
}

interface SurveyResponse {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  responses: { [key: string]: number };
  completedAt: Date;
  status: 'completed' | 'pending';
}

interface SurveyInvitation {
  id: string;
  email: string;
  name: string;
  sentAt: Date;
  status: 'pending' | 'completed';
  completedAt?: Date;
}

const EAMaturitySurvey: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'survey' | 'results' | 'send'>('overview');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: number }>({});
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);
  const [invitations, setInvitations] = useState<SurveyInvitation[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [surveyLink, setSurveyLink] = useState('');
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  // EA Maturity Survey Questions
  const surveyQuestions: SurveyQuestion[] = [
    {
      id: 'q1_ea_documentation',
      category: 'Architecture Documentation',
      question: '1. To what extent is your Enterprise Architecture documented and accessible?',
      options: [
        'No formal EA documentation exists - Architecture knowledge is tribal and undocumented',
        'Basic documentation exists but is outdated or incomplete - Some architecture artifacts available in various formats',
        'Comprehensive EA documentation is maintained - Current state architecture is well-documented, regularly updated, and easily accessible to stakeholders'
      ],
      scores: [0, 3, 5]
    },
    {
      id: 'q2_governance',
      category: 'EA Governance',
      question: '2. How mature is your Enterprise Architecture governance framework?',
      options: [
        'No formal EA governance - Architecture decisions are made ad-hoc without oversight or standards',
        'Basic governance structure exists - Some architecture review processes in place but inconsistently applied',
        'Mature EA governance framework - Formal Architecture Review Board, clear decision-making processes, and compliance tracking mechanisms'
      ],
      scores: [0, 3, 5]
    },
    {
      id: 'q3_business_alignment',
      category: 'Business Alignment',
      question: '3. How well does your EA align with business strategy and objectives?',
      options: [
        'No alignment - IT and business operate independently with minimal strategic coordination',
        'Partial alignment - Business strategy is considered but EA initiatives often lag or misalign with business priorities',
        'Strong alignment - EA directly supports business strategy with clear traceability from business goals to architecture decisions and IT investments'
      ],
      scores: [0, 3, 5]
    },
    {
      id: 'q4_architecture_principles',
      category: 'Architecture Standards',
      question: '4. Are architecture principles and standards defined and enforced across the organization?',
      options: [
        'No defined principles - Each project follows its own approach with no consistency',
        'Principles documented but not enforced - Architecture standards exist but compliance is optional or inconsistent',
        'Well-defined and enforced principles - Clear architecture principles guide all initiatives with mandatory compliance and regular audits'
      ],
      scores: [0, 3, 5]
    },
    {
      id: 'q5_technology_portfolio',
      category: 'Technology Management',
      question: '5. How effectively do you manage your technology portfolio and application landscape?',
      options: [
        'No portfolio management - Limited visibility into applications, technologies, or technical debt',
        'Basic portfolio tracking - Application inventory exists but lacks integration details, lifecycle management, or rationalization processes',
        'Comprehensive portfolio management - Complete application/technology catalog with lifecycle management, TCO analysis, and active rationalization initiatives'
      ],
      scores: [0, 3, 5]
    },
    {
      id: 'q6_integration_architecture',
      category: 'Integration & Interoperability',
      question: '6. What is the maturity level of your integration architecture and data management?',
      options: [
        'Point-to-point integrations - No integration strategy, custom connections, data silos across systems',
        'Emerging integration platform - Some standard integration patterns and tools in use but not enterprise-wide',
        'Enterprise integration platform - Standardized integration architecture (API/ESB), data governance, and master data management practices'
      ],
      scores: [0, 3, 5]
    },
    {
      id: 'q7_cloud_modernization',
      category: 'Cloud & Modernization',
      question: '7. How advanced is your cloud adoption and application modernization strategy?',
      options: [
        'On-premise legacy systems - No cloud strategy, applications remain on traditional infrastructure',
        'Initial cloud adoption - Some workloads migrated (lift-and-shift) with basic cloud services utilization',
        'Cloud-native architecture - Strategic cloud-first approach with containerization, microservices, and continuous modernization roadmap'
      ],
      scores: [0, 3, 5]
    },
    {
      id: 'q8_security_architecture',
      category: 'Security & Compliance',
      question: '8. How mature is your enterprise security architecture and compliance framework?',
      options: [
        'Reactive security - Security addressed on ad-hoc basis, no consistent security architecture or compliance tracking',
        'Basic security controls - Standard security measures implemented but limited enterprise-wide security architecture or automation',
        'Comprehensive security architecture - Zero-trust model, automated security controls, continuous compliance monitoring, and security by design principles'
      ],
      scores: [0, 3, 5]
    },
    {
      id: 'q9_ea_capability',
      category: 'EA Capability & Skills',
      question: '9. What is the maturity of your Enterprise Architecture team and organizational capability?',
      options: [
        'No dedicated EA function - Architecture responsibilities distributed across IT with no formal EA practice',
        'Emerging EA capability - Small EA team established but limited influence, tools, or organizational recognition',
        'Mature EA organization - Well-staffed EA team with clear roles, executive sponsorship, advanced tools (modeling, repository), and recognized value across the organization'
      ],
      scores: [0, 3, 5]
    },
    {
      id: 'q10_transformation_roadmap',
      category: 'Transformation & Roadmap',
      question: '10. How effectively do you plan and execute EA transformation initiatives?',
      options: [
        'No transformation roadmap - Changes are reactive and project-driven without strategic architecture direction',
        'Basic roadmap exists - Multi-year technology plans documented but execution is inconsistent and lacks measurable outcomes',
        'Strategic transformation management - Clear target architecture, sequenced roadmap with business case, KPIs tracked, and regular progress reviews with stakeholders'
      ],
      scores: [0, 3, 5]
    }
  ];

  // Calculate radar chart data
  const calculateRadarData = (responseData: { [key: string]: number }) => {
    const categories: { [key: string]: { total: number; count: number } } = {};
    
    surveyQuestions.forEach(q => {
      if (responseData[q.id] !== undefined) {
        if (!categories[q.category]) {
          categories[q.category] = { total: 0, count: 0 };
        }
        categories[q.category].total += responseData[q.id];
        categories[q.category].count += 1;
      }
    });

    return Object.keys(categories).map(category => ({
      category: category,
      value: categories[category].count > 0 
        ? Math.round((categories[category].total / categories[category].count) * 10) / 10 
        : 0,
      fullMark: 5
    }));
  };

  // Handle survey response
  const handleAnswer = (score: number) => {
    const question = surveyQuestions[currentQuestionIndex];
    setResponses({ ...responses, [question.id]: score });
  };

  // Navigate questions
  const handleNext = () => {
    if (currentQuestionIndex < surveyQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit survey
  const handleSubmitSurvey = () => {
    const newResponse: SurveyResponse = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'Current User',
      userEmail: 'user@example.com',
      responses: responses,
      completedAt: new Date(),
      status: 'completed'
    };
    
    const updatedResponses = [...surveyResponses, newResponse];
    setSurveyResponses(updatedResponses);
    localStorage.setItem('ea-survey-responses', JSON.stringify(updatedResponses));
    
    // Show completion message
    setShowCompletionMessage(true);
    
    // Show success message and switch to results
    setTimeout(() => {
      setShowCompletionMessage(false);
      setActiveTab('results');
    }, 2000);
    
    // Reset survey state for next time
    setTimeout(() => {
      setResponses({});
      setCurrentQuestionIndex(0);
    }, 2500);
  };

  // Send invitation
  const handleSendInvitation = () => {
    if (!emailInput || !nameInput) return;

    const newInvitation: SurveyInvitation = {
      id: Date.now().toString(),
      email: emailInput,
      name: nameInput,
      sentAt: new Date(),
      status: 'pending'
    };

    setInvitations([...invitations, newInvitation]);
    localStorage.setItem('ea-survey-invitations', JSON.stringify([...invitations, newInvitation]));
    
    // Generate survey link
    const link = `${window.location.origin}/survey/${newInvitation.id}`;
    setSurveyLink(link);
    
    setEmailInput('');
    setNameInput('');
  };

  // Copy survey link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyLink);
  };

  // Load saved data
  useEffect(() => {
    const savedResponses = localStorage.getItem('ea-survey-responses');
    const savedInvitations = localStorage.getItem('ea-survey-invitations');
    
    if (savedResponses) {
      setSurveyResponses(JSON.parse(savedResponses));
    }
    if (savedInvitations) {
      setInvitations(JSON.parse(savedInvitations));
    }
  }, []);

  // Calculate aggregate results
  const aggregateResults = surveyResponses.length > 0 
    ? calculateRadarData(
        surveyResponses.reduce((acc, resp) => {
          Object.keys(resp.responses).forEach(key => {
            acc[key] = (acc[key] || 0) + resp.responses[key];
          });
          return acc;
        }, {} as { [key: string]: number })
      ).map(item => ({
        ...item,
        value: item.value / surveyResponses.length
      }))
    : [];

  const currentQuestion = surveyQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / surveyQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === surveyQuestions.length - 1;
  const allQuestionsAnswered = Object.keys(responses).length === surveyQuestions.length;

  return (
    <div className={`h-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              EA Maturity Assessment
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Measure and track Enterprise Architecture maturity across key dimensions
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('survey')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'survey'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Take Survey
            </button>
            <button
              onClick={() => setActiveTab('send')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'send'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Send className="w-4 h-4 inline mr-2" />
              Send Survey
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'results'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Results
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-auto h-[calc(100vh-180px)]">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Responses</p>
                    <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {surveyResponses.length}
                    </p>
                  </div>
                  <Users className="w-12 h-12 text-blue-500" />
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Invitations Sent</p>
                    <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {invitations.length}
                    </p>
                  </div>
                  <Mail className="w-12 h-12 text-green-500" />
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completion Rate</p>
                    <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {invitations.length > 0 
                        ? Math.round((invitations.filter(i => i.status === 'completed').length / invitations.length) * 100)
                        : 0}%
                    </p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-purple-500" />
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
                    <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {invitations.filter(i => i.status === 'pending').length}
                    </p>
                  </div>
                  <Clock className="w-12 h-12 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Aggregate Results */}
            {surveyResponses.length > 0 && (
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Aggregate Maturity Assessment
                </h2>
                <div className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={aggregateResults}>
                      <PolarGrid stroke={isDarkMode ? '#4B5563' : '#E5E7EB'} />
                      <PolarAngleAxis 
                        dataKey="category" 
                        tick={{ fill: isDarkMode ? '#D1D5DB' : '#6B7280', fontSize: 12 }}
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 5]} 
                        tick={{ fill: isDarkMode ? '#D1D5DB' : '#6B7280' }}
                      />
                      <Radar 
                        name="Average Score" 
                        dataKey="value" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.6} 
                      />
                      <Legend />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                          border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                          borderRadius: '0.5rem',
                          color: isDarkMode ? '#F3F4F6' : '#111827'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Survey Categories */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Assessment Categories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from(new Set(surveyQuestions.map(q => q.category))).map(category => (
                  <div 
                    key={category}
                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                  >
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {category}
                    </h3>
                    <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {surveyQuestions.filter(q => q.category === category).length} question(s)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Survey Tab */}
        {activeTab === 'survey' && (
          <div className="max-w-4xl mx-auto">
            {/* Completion Message */}
            {showCompletionMessage && (
              <div className="mb-6 p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg animate-pulse">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  <div>
                    <h3 className="text-xl font-bold text-green-800 dark:text-green-300">
                      Survey Completed Successfully! 🎉
                    </h3>
                    <p className="text-green-700 dark:text-green-400 mt-1">
                      Thank you for completing the EA Maturity Assessment. Redirecting to your results...
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Question {currentQuestionIndex + 1} of {surveyQuestions.length}
                  </span>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {currentQuestion.category}
                </div>
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentQuestion.question}
                </h2>

                {/* Options */}
                <div className="space-y-4">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(currentQuestion.scores[index])}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        responses[currentQuestion.id] === currentQuestion.scores[index]
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : isDarkMode
                          ? 'border-gray-700 bg-gray-700 hover:border-gray-600'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                          responses[currentQuestion.id] === currentQuestion.scores[index]
                            ? 'border-blue-600 bg-blue-600'
                            : isDarkMode
                            ? 'border-gray-600'
                            : 'border-gray-300'
                        }`}>
                          {responses[currentQuestion.id] === currentQuestion.scores[index] && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                        <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                          {option}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    currentQuestionIndex === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  } ${
                    isDarkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>

                {isLastQuestion && allQuestionsAnswered ? (
                  <button
                    onClick={handleSubmitSurvey}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Submit Survey
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!responses[currentQuestion.id]}
                    className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                      !responses[currentQuestion.id]
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    } bg-blue-600 text-white hover:bg-blue-700`}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Send Survey Tab */}
        {activeTab === 'send' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Send Invitation Form */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Send Survey Invitation
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter recipient name"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter email address"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
                <button
                  onClick={handleSendInvitation}
                  disabled={!emailInput || !nameInput}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Invitation
                </button>
              </div>

              {surveyLink && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
                    Survey link generated!
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={surveyLink}
                      readOnly
                      className={`flex-1 px-3 py-2 rounded text-sm ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Invitations List */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Sent Invitations ({invitations.length})
              </h2>
              <div className="space-y-3">
                {invitations.length === 0 ? (
                  <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No invitations sent yet
                  </p>
                ) : (
                  invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className={`p-4 rounded-lg border ${
                        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {invitation.name}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              invitation.status === 'completed'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            }`}>
                              {invitation.status}
                            </span>
                          </div>
                          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {invitation.email}
                          </p>
                          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Sent: {invitation.sentAt.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {invitation.status === 'pending' && (
                            <Clock className="w-5 h-5 text-yellow-500" />
                          )}
                          {invitation.status === 'completed' && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {surveyResponses.length === 0 ? (
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-12 text-center border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <BarChart3 className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  No Survey Responses Yet
                </h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Take the survey or send invitations to start collecting data
                </p>
              </div>
            ) : (
              <>
                {/* Individual Responses */}
                {surveyResponses.map((response) => {
                  const radarData = calculateRadarData(response.responses);
                  return (
                    <div
                      key={response.id}
                      className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {response.userName}
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {response.userEmail} • Completed: {response.completedAt.toLocaleString()}
                          </p>
                        </div>
                        <button
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            isDarkMode
                              ? 'bg-gray-700 text-white hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Download className="w-4 h-4" />
                          Export
                        </button>
                      </div>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData}>
                            <PolarGrid stroke={isDarkMode ? '#4B5563' : '#E5E7EB'} />
                            <PolarAngleAxis 
                              dataKey="category" 
                              tick={{ fill: isDarkMode ? '#D1D5DB' : '#6B7280', fontSize: 11 }}
                            />
                            <PolarRadiusAxis 
                              angle={90} 
                              domain={[0, 5]} 
                              tick={{ fill: isDarkMode ? '#D1D5DB' : '#6B7280' }}
                            />
                            <Radar 
                              name="Score" 
                              dataKey="value" 
                              stroke="#EC4899" 
                              fill="#EC4899" 
                              fillOpacity={0.6} 
                            />
                            <Legend />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                                border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                                borderRadius: '0.5rem',
                                color: isDarkMode ? '#F3F4F6' : '#111827'
                              }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EAMaturitySurvey;

