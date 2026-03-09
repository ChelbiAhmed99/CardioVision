import { Heart, Activity, LineChart, AlertTriangle, CheckCircle, Info, Brain, Clock, Target, Zap } from 'lucide-react';

export function CardiacInfo() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Previous sections remain unchanged */}
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=2000&q=80"
          alt="Echocardiography"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 flex items-center bg-blue-900/80">
          <div className="px-8">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">Understanding Echocardiography Metrics</h1>
            <p className="text-xl text-blue-100">Essential measurements for heart function assessment via Ultrasound</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* What is Echocardiography */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center mb-4 space-x-3">
            <Heart className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-semibold tracking-tight text-blue-950">
              What is an Echocardiogram?
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            An echocardiogram (Echo) is a non-invasive diagnostic test that uses high-frequency sound waves (ultrasound) to create real-time images of the heart's anatomy and hemodynamics.
          </p>
          <ul className="mt-4 space-y-2 text-gray-700">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <span>Quantify Chamber Volumes and Ejection Fraction</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <span>Assess Valvular Function and Myocardial Strain</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <span>Detect Subclinical Systolic Dysfunction</span>
            </li>
          </ul>
        </div>

        {/* Volume Measurements */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center mb-4 space-x-3">
            <Activity className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-semibold tracking-tight text-blue-950">
              Understanding Cardiac Volumes
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">End-Diastolic Volume (EDV)</h3>
              <p className="text-gray-700">Maximum ventricular volume at the end of filling (diastole) - ASE standard measurement.</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">End-Systolic Volume (ESV)</h3>
              <p className="text-gray-700">Minimum ventricular volume at the end of contraction (systole).</p>
            </div>
          </div>
        </div>

        {/* Ejection Fraction Calculator */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center mb-4 space-x-3">
            <LineChart className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-semibold tracking-tight text-blue-950">
              Ejection Fraction (EF) Calculation
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Standard Formula</h3>
              <div className="text-lg text-center p-4 font-mono bg-white rounded border border-gray-200">
                EF = ((EDV - ESV) / EDV) × 100
              </div>
              <p className="mt-2 text-gray-700">
                Calculated via <b>Simpson's Biplane Method of Disks</b> (AHA/ASE Standard Recommendation).
              </p>
            </div>
          </div>
        </div>

        {/* Health Implications */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center mb-4 space-x-3">
            <AlertTriangle className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-semibold tracking-tight text-blue-950">
              Clinical EF Categorization (ASE 2015)
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg border-l-4 border-red-500 bg-red-50">
              <h3 className="font-semibold text-red-900">Reduced EF (≤ 40%)</h3>
              <p className="text-gray-700">Indicates <b>HFrEF</b> (Heart Failure with Reduced Ejection Fraction). The heart is unable to pump sufficient blood to meet demand.</p>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-emerald-500 bg-emerald-50">
              <h3 className="font-semibold text-emerald-900">Normal EF (52-72%)</h3>
              <p className="text-gray-700">Normal range for adults. Note: Symptoms may still indicate <b>HFpEF</b> (Preserved EF) due to diastolic stiffness.</p>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50">
              <h3 className="font-semibold text-yellow-900">Hyperdynamic EF (&gt; 75%)</h3>
              <p className="text-gray-700">May indicate Hypertrophic Cardiomyopathy (HCM) or a high cardiac output state.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center mb-4 space-x-3">
          <Info className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-semibold tracking-tight text-blue-950">
            Professional Resources
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a href="https://www.asecho.org/guidelines/" target="_blank" className="block p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-50 hover:from-blue-100 hover:to-blue-100 transition-colors">
            <h3 className="font-semibold text-gray-900 mb-2">ASE Guidelines</h3>
            <p className="text-gray-700 text-sm">Official chamber quantification recommendations and standards.</p>
          </a>

          <a href="https://med.stanford.edu/echonetdynamic.html" target="_blank" className="block p-4 rounded-lg bg-gradient-to-br from-blue-50 to-pink-50 hover:from-blue-100 hover:to-pink-100 transition-colors">
            <h3 className="font-semibold text-gray-900 mb-2">EchoNet-Dynamic</h3>
            <p className="text-gray-700 text-sm">Learn about the deep learning protocol used for automated EF estimation.</p>
          </a>

          <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10623504/" target="_blank" className="block p-4 rounded-lg bg-gradient-to-br from-pink-50 to-red-50 hover:from-pink-100 hover:to-red-100 transition-colors">
            <h3 className="font-semibold text-gray-900 mb-2">Myocardial Strain</h3>
            <p className="text-gray-700 text-sm">Understanding Global Longitudinal Strain (GLS) in clinical practice.</p>
          </a>
        </div>
      </div>

      {/* Challenges and AI Solution Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center mb-6 space-x-3">
          <Brain className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-semibold tracking-tight text-blue-950">
            Transforming Cardiac Care with AI
          </h2>
        </div>

        {/* Current Challenges */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Challenges in Traditional Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h4 className="font-semibold text-red-900">High Error Rates</h4>
              </div>
              <p className="text-gray-700">Up to 70% of diagnostic errors in pediatric echocardiography impact clinical management, with 33% being preventable.</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <h4 className="font-semibold text-orange-900">Time Constraints</h4>
              </div>
              <p className="text-gray-700">Manual interpretation leads to delays in reporting, particularly in complex cases, affecting treatment timelines.</p>
            </div>
          </div>
        </div>

        {/* Our Solution */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Our AI-Powered Solution</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold text-blue-900">Instant Analysis</h4>
              </div>
              <p className="text-gray-700">Automated processing provides results in minutes, accelerating diagnosis and treatment decisions.</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-pink-50 rounded-lg border border-blue-100">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold text-blue-900">Enhanced Accuracy</h4>
              </div>
              <p className="text-gray-700">AI algorithms reduce diagnostic errors by identifying subtle abnormalities consistently.</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold text-green-900">Smart Insights</h4>
              </div>
              <p className="text-gray-700">Provides detailed analysis and recommendations based on comprehensive data interpretation.</p>
            </div>
          </div>

          {/* Impact Statistics */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 via-blue-50 to-pink-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Real-World Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-md">
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">60% Faster</h4>
                  <p className="text-gray-700">Review time reduction</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-md">
                  <Target className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Enhanced Precision</h4>
                  <p className="text-gray-700">Early detection of anomalies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}