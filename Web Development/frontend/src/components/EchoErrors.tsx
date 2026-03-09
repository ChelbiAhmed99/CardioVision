import { CheckCircle, Brain, Users, Target, BookOpen } from 'lucide-react';

export function EchoErrors() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000&q=80"
          alt="Medical Imaging"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 flex items-center bg-blue-950/90">
          <div className="px-8">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">Reducing Echocardiography Errors</h1>
            <p className="text-xl text-blue-100">AI-powered solution for accurate cardiac assessments</p>
          </div>
        </div>
      </div>

      {/* Survey Demographics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border shadow-sm bg-white/90 backdrop-blur-sm rounded-xl border-slate-200">
          <div className="flex items-center mb-4 space-x-3">
            <Users className="w-8 h-8 text-blue-500" />
            <h2 className="text-xl font-semibold text-blue-600">Survey Participants</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4 italic">Demographics from JASE 2021 Survey (N=591)</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Sonographers</span>
              <span className="font-semibold text-blue-600">54.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Cardiologists</span>
              <span className="font-semibold text-blue-600">30.3%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Other Specialists</span>
              <span className="font-semibold text-blue-600">14.8%</span>
            </div>
          </div>
        </div>

        <div className="p-6 border shadow-sm bg-white/90 backdrop-blur-sm rounded-xl border-slate-200">
          <div className="flex items-center mb-4 space-x-3">
            <Target className="w-8 h-8 text-blue-500" />
            <h2 className="text-xl font-semibold text-blue-600">Clinical Impact</h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-500 mt-1" />
              <span className="text-gray-700">Reduced scan time by 40%</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-500 mt-1" />
              <span className="text-gray-700">Instant fully automated analysis</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-500 mt-1" />
              <span className="text-gray-700">Minimized inter-observer variability</span>
            </li>
          </ul>
        </div>

        <div className="p-6 border shadow-sm bg-white/90 backdrop-blur-sm rounded-xl border-slate-200">
          <div className="flex items-center mb-4 space-x-3">
            <Brain className="w-8 h-8 text-sky-500" />
            <h2 className="text-xl font-semibold text-sky-600">CNN Performance</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4 italic">Based on EchoNet-Dynamic Benchmark</p>
          <ul className="space-y-3">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-500 mt-1" />
              <span className="text-gray-700">Mean Absolute Error: 4.1%</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-500 mt-1" />
              <span className="text-gray-700">Consistent myocardial tracking</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-500 mt-1" />
              <span className="text-gray-700">Automated LVEF estimation</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Professional Distribution */}
      <div className="p-6 border shadow-sm bg-white/90 backdrop-blur-sm rounded-xl border-slate-200">
        <div className="flex items-center mb-6 space-x-3">
          <Users className="w-8 h-8 text-blue-500" />
          <h2 className="text-xl font-semibold text-blue-600">Professional Distribution</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Female Participants (N = 309)</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Sonographer</span>
                <span className="font-semibold">74.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cardiologist</span>
                <span className="font-semibold">16.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Other Specialists</span>
                <span className="font-semibold">8.7%</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Male Participants (N = 282)</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Sonographer</span>
                <span className="font-semibold">33.7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cardiologist</span>
                <span className="font-semibold">45.0%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Other Specialists</span>
                <span className="font-semibold">21.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Benefits */}
      <div className="p-6 border shadow-sm bg-white/90 backdrop-blur-sm rounded-xl border-slate-200">
        <div className="flex items-center mb-6 space-x-3">
          <Target className="w-8 h-8 text-emerald-500" />
          <h2 className="text-xl font-semibold text-emerald-600">AI Solution Benefits</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Accuracy Improvement</h3>
            <p className="text-gray-700">Reduces human error by providing consistent, AI-powered measurements and analysis</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Time Efficiency</h3>
            <p className="text-gray-700">Speeds up the diagnostic process while maintaining high accuracy standards</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Quality Assurance</h3>
            <p className="text-gray-700">Provides real-time validation and standardization of measurements</p>
          </div>
        </div>
      </div>

      {/* Citation Section */}
      <div className="p-6 border shadow-sm bg-white/90 backdrop-blur-sm rounded-xl border-slate-200">
        <div className="flex items-center mb-4 space-x-3">
          <BookOpen className="w-8 h-8 text-slate-500" />
          <h2 className="text-xl font-semibold text-slate-600">Research Reference</h2>
        </div>
        <div className="space-y-4">
          <p className="text-gray-700">Statistics and data sourced from:</p>
          <a
            href="https://onlinelibrary.wiley.com/doi/epdf/10.1111/echo.15550"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <p className="text-gray-800 font-medium">International survey of echocardiography practice: Impact of the COVID‐19 pandemic on service provision</p>
            <p className="text-gray-600 mt-2">Journal of the American Society of Echocardiography</p>
            <p className="text-blue-600 mt-2 hover:text-blue-700">View Full Paper →</p>
          </a>
        </div>
      </div>
    </div>
  );
}