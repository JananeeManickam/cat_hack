import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Mic, MicOff, Fuel, Clock, MapPin, User, Settings, Bell, Zap, Shield, Activity } from 'lucide-react';

const SmartOperatorAssistant = () => {
  const [selectedMachine, setSelectedMachine] = useState('EX001');
  const [dashboardData, setDashboardData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [proximityAlert, setProximityAlert] = useState(null);
  const [fuelPrediction, setFuelPrediction] = useState(null);
  const [timeEstimation, setTimeEstimation] = useState(null);
  const [tips, setTips] = useState([]);
  const [machines, setMachines] = useState([]);
  
  const chatEndRef = useRef(null);
  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    fetchMachines();
    fetchDashboardData();
    fetchTips();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      fetchDashboardData();
      checkProximity();
      fetchTips();
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedMachine]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const fetchMachines = async () => {
    try {
      const response = await fetch(`${API_BASE}/machines`);
      const data = await response.json();
      setMachines(data);
    } catch (error) {
      console.error('Error fetching machines:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE}/dashboard-data/${selectedMachine}`);
      const data = await response.json();
      setDashboardData(data);
      setAlerts(data.alerts);
      if (data.proximity.detected) {
        setProximityAlert(data.proximity);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchTips = async () => {
    try {
      const response = await fetch(`${API_BASE}/continuous-tips/${selectedMachine}`);
      const data = await response.json();
      setTips(data.tips);
    } catch (error) {
      console.error('Error fetching tips:', error);
    }
  };

  const checkProximity = async () => {
    try {
      const response = await fetch(`${API_BASE}/proximity-check`);
      const data = await response.json();
      if (data.detected) {
        setProximityAlert(data);
      } else {
        setProximityAlert(null);
      }
    } catch (error) {
      console.error('Error checking proximity:', error);
    }
  };

  const predictFuel = async (taskType, terrainType) => {
    try {
      const response = await fetch(`${API_BASE}/fuel-prediction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machine_id: selectedMachine,
          task_type: taskType,
          terrain_type: terrainType
        })
      });
      const data = await response.json();
      setFuelPrediction(data);
    } catch (error) {
      console.error('Error predicting fuel:', error);
    }
  };

  const estimateTime = async (taskType, terrainType) => {
    try {
      const response = await fetch(`${API_BASE}/time-estimation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machine_id: selectedMachine,
          task_type: taskType,
          terrain_type: terrainType
        })
      });
      const data = await response.json();
      setTimeEstimation(data);
    } catch (error) {
      console.error('Error estimating time:', error);
    }
  };

  const handleVoiceChat = async (message) => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    setChatHistory(prev => [...prev, { type: 'user', message, timestamp: new Date() }]);
    
    try {
      const response = await fetch(`${API_BASE}/voice-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          machine_id: selectedMachine
        })
      });
      const data = await response.json();
      
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        message: data.response, 
        timestamp: new Date() 
      }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        message: "I'm having trouble processing your request. Please try again.", 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      handleVoiceChat(chatMessage);
      setChatMessage('');
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real implementation, you would integrate with Web Speech API
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        const sampleQuestions = [
          "What's my current fuel level?",
          "How long will this excavation take?",
          "Why is the hydraulic pressure low?",
          "Should I take a break?",
          "What's the weather forecast?"
        ];
        const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
        setChatMessage(randomQuestion);
        setIsListening(false);
      }, 2000);
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'maintenance': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTipIcon = (type) => {
    switch (type) {
      case 'efficiency': return <Zap className="w-4 h-4" />;
      case 'safety': return <Shield className="w-4 h-4" />;
      case 'maintenance': return <Settings className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Smart Operator Assistant...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-yellow-600 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/caterpillar-logo.png" alt="CAT" className="w-12 h-12" />
            <h1 className="text-2xl font-bold">Smart Operator Assistant</h1>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedMachine} 
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              {machines.map(machine => (
                <option key={machine.machine_id} value={machine.machine_id}>
                  {machine.machine_id} - {machine.status}
                </option>
              ))}
            </select>
            <Bell className="w-6 h-6" />
          </div>
        </div>
      </header>

      {/* Proximity Alert */}
      {proximityAlert && (
        <div className="bg-red-600 text-white p-4 text-center animate-pulse">
          <div className="flex items-center justify-center space-x-2">
            <AlertTriangle className="w-6 h-6" />
            <span className="font-bold">PROXIMITY ALERT: {proximityAlert.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Machine Status */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Activity className="w-6 h-6 mr-2" />
              Machine Status - {selectedMachine}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 p-4 rounded">
                <div className="flex items-center justify-between">
                  <Fuel className="w-8 h-8 text-yellow-500" />
                  <span className="text-2xl font-bold">{dashboardData.machine.fuel_level}%</span>
                </div>
                <p className="text-sm text-gray-400">Fuel Level</p>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <div className="flex items-center justify-between">
                  <Clock className="w-8 h-8 text-blue-500" />
                  <span className="text-2xl font-bold">{dashboardData.machine.engine_hours}</span>
                </div>
                <p className="text-sm text-gray-400">Engine Hours</p>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <div className="flex items-center justify-between">
                  <Settings className="w-8 h-8 text-green-500" />
                  <span className="text-2xl font-bold">{dashboardData.machine.hydraulic_pressure}</span>
                </div>
                <p className="text-sm text-gray-400">Hydraulic PSI</p>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <div className="flex items-center justify-between">
                  <User className="w-8 h-8 text-purple-500" />
                  <span className="text-2xl font-bold">{dashboardData.machine.load_capacity}%</span>
                </div>
                <p className="text-sm text-gray-400">Load Capacity</p>
              </div>
            </div>
          </div>

          {/* Operator Info */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <User className="w-6 h-6 mr-2" />
              Operator Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-lg font-semibold">{dashboardData.operator.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Experience</p>
                <p className="text-lg font-semibold">{dashboardData.operator.experience_years} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Certification</p>
                <p className="text-lg font-semibold">{dashboardData.operator.certification_level}</p>
              </div>
            </div>
          </div>

          {/* Task Planning */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Task Planning & Prediction</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Fuel Prediction</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => predictFuel('excavation', 'rocky')}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-2"
                  >
                    Rocky Excavation
                  </button>
                  <button 
                    onClick={() => predictFuel('loading', 'sandy')}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-2"
                  >
                    Sandy Loading
                  </button>
                  <button 
                    onClick={() => predictFuel('digging', 'clay')}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                  >
                    Clay Digging
                  </button>
                </div>
                {fuelPrediction && (
                  <div className="mt-4 p-3 bg-gray-700 rounded">
                    <p className="text-sm">Current Fuel: {fuelPrediction.current_fuel}%</p>
                    <p className="text-sm">Predicted Consumption: {fuelPrediction.predicted_consumption.toFixed(1)}%</p>
                    <p className="text-sm">Fuel After Task: {fuelPrediction.fuel_after_task.toFixed(1)}%</p>
                    <p className={`text-sm font-bold ${fuelPrediction.sufficient ? 'text-green-400' : 'text-red-400'}`}>
                      {fuelPrediction.sufficient ? 'Sufficient Fuel' : 'Refueling Required'}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Time Estimation</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => estimateTime('excavation', 'rocky')}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded mr-2"
                  >
                    Rocky Excavation
                  </button>
                  <button 
                    onClick={() => estimateTime('loading', 'sandy')}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded mr-2"
                  >
                    Sandy Loading
                  </button>
                  <button 
                    onClick={() => estimateTime('digging', 'clay')}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                  >
                    Clay Digging
                  </button>
                </div>
                {timeEstimation && (
                  <div className="mt-4 p-3 bg-gray-700 rounded">
                    <p className="text-sm">Estimated Time: {timeEstimation.estimated_minutes} minutes</p>
                    <p className="text-sm">Weather: {timeEstimation.weather_condition}</p>
                    {timeEstimation.machine_condition_impact && (
                      <p className="text-sm text-yellow-400">Machine condition may slow progress</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Voice Chat Interface */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Mic className="w-6 h-6 mr-2" />
              Voice Assistant
            </h2>
            
            {/* Chat History */}
            <div className="h-64 overflow-y-auto mb-4 p-4 bg-gray-700 rounded">
              {chatHistory.length === 0 ? (
                <p className="text-gray-400 text-center">Start a conversation with your AI assistant...</p>
              ) : (
                chatHistory.map((chat, index) => (
                  <div key={index} className={`mb-4 ${chat.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-3 rounded-lg max-w-xs ${
                      chat.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-600 text-white'
                    }`}>
                      <p className="text-sm">{chat.message}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {chat.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="text-left mb-4">
                  <div className="inline-block p-3 rounded-lg bg-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex items-center space-x-2">
              <form onSubmit={handleSubmitMessage} className="flex-1 flex">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask me anything about your machine..."
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-l border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-r"
                >
                  Send
                </button>
              </form>
              <button
                onClick={toggleListening}
                className={`p-2 rounded-full ${
                  isListening ? 'bg-red-600 animate-pulse' : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Alerts Panel */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Active Alerts
            </h2>
            <div className="space-y-2">
              {alerts.length === 0 ? (
                <p className="text-gray-400">No active alerts</p>
              ) : (
                alerts.map((alert, index) => (
                  <div key={index} className={`p-3 rounded-lg ${getAlertColor(alert.type)}`}>
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs opacity-75">Priority: {alert.priority}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Continuous Tips */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Zap className="w-6 h-6 mr-2" />
              Continuous Tips
            </h2>
            <div className="space-y-3">
              {tips.map((tip, index) => (
                <div key={index} className="p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      {getTipIcon(tip.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize">{tip.type}</p>
                      <p className="text-xs text-gray-300">{tip.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => handleVoiceChat("What's my current fuel level?")}
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded text-left"
              >
                Check Fuel Level
              </button>
              <button
                onClick={() => handleVoiceChat("Should I take a break?")}
                className="w-full bg-green-600 hover:bg-green-700 py-2 px-4 rounded text-left"
              >
                Fatigue Check
              </button>
              <button
                onClick={() => handleVoiceChat("What maintenance is due?")}
                className="w-full bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded text-left"
              >
                Maintenance Status
              </button>
              <button
                onClick={() => handleVoiceChat("How's the weather looking?")}
                className="w-full bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded text-left"
              >
                Weather Check
              </button>
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <MapPin className="w-6 h-6 mr-2" />
              Location & Terrain
            </h2>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-400">Coordinates</p>
                <p className="text-sm font-mono">
                  {dashboardData.machine.location_lat.toFixed(4)}, {dashboardData.machine.location_lon.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Machine Status</p>
                <p className="text-sm capitalize">{dashboardData.machine.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Last Updated</p>
                <p className="text-sm">{new Date(dashboardData.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartOperatorAssistant;