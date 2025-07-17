import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle, Power, StopCircle, Play, Pause, Activity, TrendingUp, Thermometer, Gauge, Droplets, Battery } from 'lucide-react';

const CatMachineTerrainSystem = () => {
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [preventedHazards, setPreventedHazards] = useState([]);
  const [activeWarnings, setActiveWarnings] = useState([]);
  const [systemOverride, setSystemOverride] = useState(false);
  const [machineResponse, setMachineResponse] = useState('pending');
  const [responseTimer, setResponseTimer] = useState(null);
  const [geminiAnalysis, setGeminiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const intervalRef = useRef(null);

  // 25 Critical Machine-Terrain Scenarios
  const scenarios = [
    {
      id: 1,
      machine: { name: 'Dozer 854', temp: 115, fuelLevel: 8, hydraulicPressure: 520, batteryVoltage: 11.2, status: 'critical_overheat' },
      terrain: { type: 'steep_slope', angle: 45, stability: 25, drainage: 'poor', surface: 'loose_rock' },
      weather: { condition: 'hot', temp: 42, humidity: 20, wind: 'strong' },
      criticalLevel: 10
    },
    {
      id: 2,
      machine: { name: 'Excavator 345', temp: 98, fuelLevel: 3, hydraulicPressure: 580, batteryVoltage: 10.8, status: 'fuel_emergency' },
      terrain: { type: 'muddy_valley', angle: 15, stability: 15, drainage: 'flooded', surface: 'soft_clay' },
      weather: { condition: 'heavy_rain', temp: 18, humidity: 95, wind: 'calm' },
      criticalLevel: 9
    },
    {
      id: 3,
      machine: { name: 'Loader 988', temp: 105, fuelLevel: 25, hydraulicPressure: 650, batteryVoltage: 11.5, status: 'hydraulic_failure' },
      terrain: { type: 'cliff_edge', angle: 60, stability: 10, drainage: 'good', surface: 'solid_rock' },
      weather: { condition: 'foggy', temp: 12, humidity: 90, wind: 'light' },
      criticalLevel: 10
    },
    {
      id: 4,
      machine: { name: 'Dozer 854', temp: 92, fuelLevel: 45, hydraulicPressure: 380, batteryVoltage: 10.2, status: 'battery_critical' },
      terrain: { type: 'frozen_ground', angle: 20, stability: 80, drainage: 'poor', surface: 'ice_covered' },
      weather: { condition: 'blizzard', temp: -15, humidity: 60, wind: 'severe' },
      criticalLevel: 9
    },
    {
      id: 5,
      machine: { name: 'Excavator 345', temp: 110, fuelLevel: 60, hydraulicPressure: 700, batteryVoltage: 12.1, status: 'pressure_overload' },
      terrain: { type: 'quarry_floor', angle: 5, stability: 90, drainage: 'excellent', surface: 'granite' },
      weather: { condition: 'clear', temp: 38, humidity: 25, wind: 'calm' },
      criticalLevel: 8
    },
    {
      id: 6,
      machine: { name: 'Loader 988', temp: 88, fuelLevel: 12, hydraulicPressure: 420, batteryVoltage: 11.8, status: 'low_fuel_remote' },
      terrain: { type: 'desert_dunes', angle: 30, stability: 35, drainage: 'poor', surface: 'loose_sand' },
      weather: { condition: 'sandstorm', temp: 45, humidity: 5, wind: 'extreme' },
      criticalLevel: 9
    },
    {
      id: 7,
      machine: { name: 'Dozer 854', temp: 102, fuelLevel: 35, hydraulicPressure: 480, batteryVoltage: 12.3, status: 'overheating' },
      terrain: { type: 'swamp_land', angle: 2, stability: 5, drainage: 'waterlogged', surface: 'peat_bog' },
      weather: { condition: 'humid', temp: 35, humidity: 98, wind: 'none' },
      criticalLevel: 10
    },
    {
      id: 8,
      machine: { name: 'Excavator 345', temp: 95, fuelLevel: 18, hydraulicPressure: 350, batteryVoltage: 10.5, status: 'multi_system_warning' },
      terrain: { type: 'avalanche_zone', angle: 55, stability: 20, drainage: 'good', surface: 'snow_pack' },
      weather: { condition: 'snow', temp: -8, humidity: 70, wind: 'moderate' },
      criticalLevel: 10
    },
    {
      id: 9,
      machine: { name: 'Loader 988', temp: 118, fuelLevel: 8, hydraulicPressure: 600, batteryVoltage: 11.0, status: 'thermal_emergency' },
      terrain: { type: 'volcanic_ash', angle: 25, stability: 40, drainage: 'poor', surface: 'ash_deposit' },
      weather: { condition: 'ash_fall', temp: 55, humidity: 10, wind: 'strong' },
      criticalLevel: 10
    },
    {
      id: 10,
      machine: { name: 'Dozer 854', temp: 85, fuelLevel: 5, hydraulicPressure: 420, batteryVoltage: 12.0, status: 'fuel_critical' },
      terrain: { type: 'underground_tunnel', angle: 12, stability: 60, drainage: 'poor', surface: 'concrete' },
      weather: { condition: 'confined_space', temp: 28, humidity: 85, wind: 'none' },
      criticalLevel: 8
    },
    {
      id: 11,
      machine: { name: 'Excavator 345', temp: 108, fuelLevel: 40, hydraulicPressure: 550, batteryVoltage: 11.2, status: 'cooling_failure' },
      terrain: { type: 'tidal_zone', angle: 8, stability: 30, drainage: 'tidal', surface: 'wet_sand' },
      weather: { condition: 'stormy', temp: 22, humidity: 85, wind: 'gale' },
      criticalLevel: 9
    },
    {
      id: 12,
      machine: { name: 'Loader 988', temp: 90, fuelLevel: 15, hydraulicPressure: 480, batteryVoltage: 10.8, status: 'electrical_fault' },
      terrain: { type: 'mine_shaft', angle: 35, stability: 45, drainage: 'good', surface: 'ore_deposits' },
      weather: { condition: 'underground', temp: 15, humidity: 95, wind: 'ventilated' },
      criticalLevel: 9
    },
    {
      id: 13,
      machine: { name: 'Dozer 854', temp: 125, fuelLevel: 22, hydraulicPressure: 620, batteryVoltage: 11.5, status: 'extreme_overheat' },
      terrain: { type: 'lava_field', angle: 18, stability: 70, drainage: 'none', surface: 'hardened_lava' },
      weather: { condition: 'extreme_heat', temp: 65, humidity: 5, wind: 'thermal' },
      criticalLevel: 10
    },
    {
      id: 14,
      machine: { name: 'Excavator 345', temp: 82, fuelLevel: 35, hydraulicPressure: 320, batteryVoltage: 10.2, status: 'low_pressure' },
      terrain: { type: 'sinkhole_area', angle: 10, stability: 8, drainage: 'unpredictable', surface: 'limestone' },
      weather: { condition: 'humid', temp: 32, humidity: 80, wind: 'light' },
      criticalLevel: 9
    },
    {
      id: 15,
      machine: { name: 'Loader 988', temp: 95, fuelLevel: 6, hydraulicPressure: 440, batteryVoltage: 11.8, status: 'emergency_stop' },
      terrain: { type: 'river_crossing', angle: 25, stability: 50, drainage: 'current', surface: 'river_bed' },
      weather: { condition: 'flood', temp: 20, humidity: 100, wind: 'strong' },
      criticalLevel: 10
    },
    {
      id: 16,
      machine: { name: 'Dozer 854', temp: 100, fuelLevel: 28, hydraulicPressure: 500, batteryVoltage: 10.5, status: 'warning_cascade' },
      terrain: { type: 'toxic_soil', angle: 15, stability: 65, drainage: 'contaminated', surface: 'chemical_waste' },
      weather: { condition: 'chemical_fog', temp: 25, humidity: 70, wind: 'none' },
      criticalLevel: 9
    },
    {
      id: 17,
      machine: { name: 'Excavator 345', temp: 112, fuelLevel: 45, hydraulicPressure: 580, batteryVoltage: 11.0, status: 'sensor_failure' },
      terrain: { type: 'earthquake_zone', angle: 22, stability: 25, drainage: 'cracked', surface: 'fractured_rock' },
      weather: { condition: 'seismic', temp: 30, humidity: 45, wind: 'variable' },
      criticalLevel: 10
    },
    {
      id: 18,
      machine: { name: 'Loader 988', temp: 87, fuelLevel: 18, hydraulicPressure: 380, batteryVoltage: 10.1, status: 'power_loss' },
      terrain: { type: 'magnetic_anomaly', angle: 8, stability: 75, drainage: 'good', surface: 'iron_ore' },
      weather: { condition: 'electromagnetic', temp: 28, humidity: 60, wind: 'calm' },
      criticalLevel: 8
    },
    {
      id: 19,
      machine: { name: 'Dozer 854', temp: 106, fuelLevel: 12, hydraulicPressure: 460, batteryVoltage: 11.8, status: 'dual_failure' },
      terrain: { type: 'permafrost', angle: 35, stability: 40, drainage: 'frozen', surface: 'frozen_ground' },
      weather: { condition: 'arctic', temp: -25, humidity: 40, wind: 'bitter' },
      criticalLevel: 9
    },
    {
      id: 20,
      machine: { name: 'Excavator 345', temp: 120, fuelLevel: 8, hydraulicPressure: 640, batteryVoltage: 10.8, status: 'system_meltdown' },
      terrain: { type: 'gas_pocket', angle: 12, stability: 55, drainage: 'poor', surface: 'shale_gas' },
      weather: { condition: 'methane_risk', temp: 35, humidity: 30, wind: 'dangerous' },
      criticalLevel: 10
    },
    {
      id: 21,
      machine: { name: 'Loader 988', temp: 98, fuelLevel: 32, hydraulicPressure: 520, batteryVoltage: 11.2, status: 'brake_failure' },
      terrain: { type: 'steep_quarry', angle: 50, stability: 60, drainage: 'good', surface: 'marble' },
      weather: { condition: 'dusty', temp: 40, humidity: 15, wind: 'moderate' },
      criticalLevel: 9
    },
    {
      id: 22,
      machine: { name: 'Dozer 854', temp: 115, fuelLevel: 20, hydraulicPressure: 580, batteryVoltage: 10.9, status: 'fire_risk' },
      terrain: { type: 'dry_vegetation', angle: 20, stability: 70, drainage: 'drought', surface: 'dried_grass' },
      weather: { condition: 'wildfire_risk', temp: 48, humidity: 8, wind: 'extreme' },
      criticalLevel: 10
    },
    {
      id: 23,
      machine: { name: 'Excavator 345', temp: 88, fuelLevel: 15, hydraulicPressure: 400, batteryVoltage: 10.3, status: 'isolation_mode' },
      terrain: { type: 'radioactive_zone', angle: 5, stability: 85, drainage: 'sealed', surface: 'contaminated' },
      weather: { condition: 'radiation', temp: 22, humidity: 50, wind: 'contained' },
      criticalLevel: 9
    },
    {
      id: 24,
      machine: { name: 'Loader 988', temp: 110, fuelLevel: 9, hydraulicPressure: 600, batteryVoltage: 11.5, status: 'final_warning' },
      terrain: { type: 'dam_spillway', angle: 40, stability: 20, drainage: 'overflow', surface: 'concrete_slope' },
      weather: { condition: 'torrential', temp: 25, humidity: 100, wind: 'hurricane' },
      criticalLevel: 10
    },
    {
      id: 25,
      machine: { name: 'Dozer 854', temp: 130, fuelLevel: 4, hydraulicPressure: 700, batteryVoltage: 10.1, status: 'catastrophic' },
      terrain: { type: 'caldera_rim', angle: 65, stability: 5, drainage: 'lava_flow', surface: 'volcanic_rock' },
      weather: { condition: 'volcanic', temp: 80, humidity: 2, wind: 'ash_storm' },
      criticalLevel: 10
    }
  ];

  const getCurrentScenario = () => scenarios[currentScenario];

  // Generate terrain-aware solutions
  const generateTerrainAwareSolutions = (scenario) => {
    const solutions = [];
    const { machine, terrain, weather } = scenario;

    // Critical Temperature + Terrain Solutions
    if (machine.temp > 110) {
      if (terrain.angle > 25) {
        solutions.push({
          type: 'critical',
          title: 'EXTREME OVERHEAT ON SLOPE',
          problem: `Machine ${machine.temp}°C on ${terrain.angle}° ${terrain.type}`,
          solution: `⚠️ SLOPE PROTOCOL:\n1. Reduce power to 30%\n2. Slowly descend to flat area\n3. Activate emergency cooling\n4. THEN shutdown safely\n❌ DO NOT shutdown on slope!`,
          action: 'slope_emergency_descent',
          timeLimit: 20,
          manualOverride: true
        });
      } else {
        solutions.push({
          type: 'critical',
          title: 'CRITICAL TEMPERATURE',
          problem: `Machine ${machine.temp}°C on flat ${terrain.type}`,
          solution: `🔥 IMMEDIATE SHUTDOWN:\n1. Emergency stop NOW\n2. Activate fire suppression\n3. Evacuate 50m radius\n4. Call fire department`,
          action: 'emergency_shutdown',
          timeLimit: 10,
          manualOverride: true
        });
      }
    }

    // Fuel Emergency + Terrain Access
    if (machine.fuelLevel < 10) {
      if (terrain.type.includes('desert') || terrain.type.includes('remote') || terrain.accessibility === 'impossible') {
        solutions.push({
          type: 'critical',
          title: 'FUEL EMERGENCY - REMOTE LOCATION',
          problem: `${machine.fuelLevel}% fuel in ${terrain.type}`,
          solution: `🚁 EMERGENCY PROTOCOL:\n1. Activate GPS beacon\n2. Conserve fuel - idle only\n3. Helicopter fuel drop dispatched\n4. Prepare landing zone`,
          action: 'emergency_fuel_drop',
          timeLimit: 15,
          manualOverride: true
        });
      } else {
        solutions.push({
          type: 'warning',
          title: 'LOW FUEL - ACCESSIBLE AREA',
          problem: `${machine.fuelLevel}% fuel on ${terrain.type}`,
          solution: `⛽ FUEL PROTOCOL:\n1. Complete current cycle\n2. Return to fuel station\n3. Refuel before continuing\n4. Update fuel management`,
          action: 'return_for_fuel',
          timeLimit: 30,
          manualOverride: false
        });
      }
    }

    // Terrain Stability Issues
    if (terrain.stability < 25) {
      solutions.push({
        type: 'critical',
        title: 'GROUND COLLAPSE IMMINENT',
        problem: `${terrain.stability}% stability on ${terrain.type}`,
        solution: `⚠️ EVACUATION PROTOCOL:\n1. STOP all movement\n2. Distribute weight evenly\n3. Slowly back to stable ground\n4. Geological survey required`,
        action: 'ground_evacuation',
        timeLimit: 25,
        manualOverride: true
      });
    }

    // Weather + Machine Combinations
    if (weather.condition === 'blizzard' && machine.batteryVoltage < 11.0) {
      solutions.push({
        type: 'critical',
        title: 'COLD WEATHER BATTERY FAILURE',
        problem: `${machine.batteryVoltage}V battery in ${weather.temp}°C blizzard`,
        solution: `🥶 COLD WEATHER PROTOCOL:\n1. Start engine immediately\n2. Run heating system\n3. Seek shelter\n4. Emergency power backup`,
        action: 'cold_weather_emergency',
        timeLimit: 12,
        manualOverride: true
      });
    }

    // Hydraulic Pressure + Terrain
    if (machine.hydraulicPressure > 600) {
      if (terrain.angle > 40) {
        solutions.push({
          type: 'critical',
          title: 'HYDRAULIC OVERLOAD ON STEEP TERRAIN',
          problem: `${machine.hydraulicPressure} kPa pressure on ${terrain.angle}° slope`,
          solution: `💥 PRESSURE EMERGENCY:\n1. Reduce load immediately\n2. Lower boom position\n3. Decrease slope angle\n4. Hydraulic relief valve`,
          action: 'hydraulic_pressure_relief',
          timeLimit: 15,
          manualOverride: true
        });
      }
    }

    // Environmental Hazards
    if (terrain.type.includes('volcanic') || terrain.type.includes('lava')) {
      solutions.push({
        type: 'critical',
        title: 'VOLCANIC HAZARD ZONE',
        problem: `Machine operating in ${terrain.type}`,
        solution: `🌋 VOLCANIC PROTOCOL:\n1. Evacuate immediately\n2. Seismic monitoring active\n3. Ash filter protection\n4. Emergency air supply`,
        action: 'volcanic_evacuation',
        timeLimit: 8,
        manualOverride: true
      });
    }

    // Flooding/Water Hazards
    if (terrain.drainage === 'flooded' || weather.condition === 'flood') {
      solutions.push({
        type: 'critical',
        title: 'FLOOD EMERGENCY',
        problem: `${terrain.drainage} terrain in ${weather.condition}`,
        solution: `🌊 FLOOD PROTOCOL:\n1. Move to higher ground\n2. Seal electrical systems\n3. Waterproof mode ON\n4. Emergency flotation ready`,
        action: 'flood_evacuation',
        timeLimit: 18,
        manualOverride: true
      });
    }

    return solutions;
  };

  // Simulate machine response (automatic systems)
  const simulateMachineResponse = (solution) => {
    if (responseTimer) clearTimeout(responseTimer);
   
    setMachineResponse('processing');
   
    const timer = setTimeout(() => {
      // Simulate machine system response
      const scenario = getCurrentScenario();
      const systemReliability = scenario.criticalLevel < 8 ? 0.9 : 0.6; // Lower reliability in critical situations
     
      if (Math.random() < systemReliability) {
        setMachineResponse('executed');
        setPreventedHazards(prev => [...prev, {
          id: Date.now(),
          scenario: scenario.id,
          hazardType: solution.title,
          preventionMethod: 'automatic_systems',
          severity: solution.type,
          terrainType: scenario.terrain.type,
          machineTemp: scenario.machine.temp,
          timestamp: new Date()
        }]);
      } else {
        setMachineResponse('system_failure');
        if (solution.manualOverride) {
          initiateManualOverride(solution, scenario);
        }
      }
    }, solution.timeLimit * 50); // Faster for demo
   
    setResponseTimer(timer);
  };

  // Enhanced manual override system
  const initiateManualOverride = (solution, scenario) => {
    setSystemOverride(true);
    setPreventedHazards(prev => [...prev, {
      id: Date.now(),
      scenario: scenario.id,
      hazardType: solution.title,
      preventionMethod: 'manual_override',
      severity: solution.type,
      terrainType: scenario.terrain.type,
      machineTemp: scenario.machine.temp,
      timestamp: new Date()
    }]);
   
    setTimeout(() => {
      setSystemOverride(false);
    }, 4000);
  };

  // Generate Gemini analysis
  const generateGeminiAnalysis = async (scenario) => {
    setIsAnalyzing(true);
   
    // Simulate Gemini API analysis
    setTimeout(() => {
      const analysis = {
        riskScore: scenario.criticalLevel,
        primaryThreats: [
          `Machine temperature ${scenario.machine.temp}°C in ${scenario.terrain.type}`,
          `Fuel level ${scenario.machine.fuelLevel}% with ${scenario.terrain.accessibility} access`,
          `Hydraulic pressure ${scenario.machine.hydraulicPressure} kPa on ${scenario.terrain.angle}° slope`,
          `Ground stability ${scenario.terrain.stability}% in ${scenario.weather.condition}`
        ],
        recommendations: [
          scenario.criticalLevel >= 9 ? 'IMMEDIATE SHUTDOWN REQUIRED' : 'Urgent intervention needed',
          `Terrain-specific protocol: ${scenario.terrain.type} evacuation`,
          `Weather consideration: ${scenario.weather.condition} precautions`,
          'Activate emergency response team'
        ],
        predictedOutcome: scenario.criticalLevel === 10 ? 'CATASTROPHIC FAILURE IN <5 MINUTES' :
                         scenario.criticalLevel >= 8 ? 'SERIOUS INCIDENT WITHIN 15 MINUTES' :
                         'EQUIPMENT DAMAGE LIKELY',
        timeToFailure: scenario.criticalLevel >= 9 ? '< 5 minutes' : '< 15 minutes',
        confidence: `${85 + scenario.criticalLevel}%`
      };
     
      setGeminiAnalysis(analysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  // Auto-cycle through scenarios
  useEffect(() => {
    if (isAutoMode) {
      intervalRef.current = setInterval(() => {
        setCurrentScenario(prev => (prev + 1) % scenarios.length);
      }, 6000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
   
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoMode]);

  // Generate solutions and analysis when scenario changes
  useEffect(() => {
    const scenario = getCurrentScenario();
    const solutions = generateTerrainAwareSolutions(scenario);
    setActiveWarnings(solutions);
   
    // Auto-generate Gemini analysis for critical scenarios
    if (scenario.criticalLevel >= 7) {
      generateGeminiAnalysis(scenario);
    }
   
    // Simulate machine response for critical warnings
    const criticalSolution = solutions.find(s => s.type === 'critical');
    if (criticalSolution) {
      simulateMachineResponse(criticalSolution);
    }
  }, [currentScenario]);

  const scenario = getCurrentScenario();
  const criticalHazards = preventedHazards.filter(h => h.severity === 'critical').length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-lg mb-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">🚨 MACHINE-TERRAIN HAZARD PREVENTION</h1>
              <p className="text-xl mt-2">AI-Powered Critical Situation Detection & Override</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsAutoMode(!isAutoMode)}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  isAutoMode
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {isAutoMode ? <Pause className="w-5 h-5 inline mr-2" /> : <Play className="w-5 h-5 inline mr-2" />}
                {isAutoMode ? 'AUTO SCANNING' : 'START AUTO SCAN'}
              </button>
              <div className="text-right">
                <div className="text-lg font-bold">Scenario {scenario.id}/25</div>
                <div className="text-sm">Critical Hazards Prevented: {criticalHazards}</div>
              </div>
            </div>
          </div>
        </div>

        {/* System Override Alert */}
        {systemOverride && (
          <div className="bg-red-900 border-2 border-red-500 p-6 rounded-lg mb-6 shadow-2xl animate-pulse">
            <div className="flex items-center space-x-4">
              <StopCircle className="w-10 h-10 text-red-300" />
              <div>
                <h2 className="text-3xl font-bold">🔴 MANUAL OVERRIDE ACTIVATED</h2>
                <p className="text-xl">Automatic systems failed - Manual control engaged</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Machine Status */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-yellow-400" />
              Machine Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Thermometer className="w-4 h-4 mr-2 text-red-400" />
                  Temperature
                </span>
                <span className={`font-bold ${
                  scenario.machine.temp > 100 ? 'text-red-400' :
                  scenario.machine.temp > 85 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {scenario.machine.temp}°C
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Droplets className="w-4 h-4 mr-2 text-blue-400" />
                  Fuel Level
                </span>
                <span className={`font-bold ${
                  scenario.machine.fuelLevel < 15 ? 'text-red-400' :
                  scenario.machine.fuelLevel < 30 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {scenario.machine.fuelLevel}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Gauge className="w-4 h-4 mr-2 text-purple-400" />
                  Hydraulic Pressure
                </span>
                <span className={`font-bold ${
                  scenario.machine.hydraulicPressure > 550 ? 'text-red-400' :
                  scenario.machine.hydraulicPressure > 450 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {scenario.machine.hydraulicPressure} kPa
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Battery className="w-4 h-4 mr-2 text-green-400" />
                  Battery
                </span>
                <span className={`font-bold ${
                  scenario.machine.batteryVoltage < 11.0 ? 'text-red-400' :
                  scenario.machine.batteryVoltage < 11.5 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {scenario.machine.batteryVoltage}V
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-300">Machine Status:</div>
              <div className="font-bold text-yellow-400">{scenario.machine.status.replace('_', ' ').toUpperCase()}</div>
            </div>
          </div>

          {/* Terrain Conditions */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-blue-400" />
              Terrain Analysis
            </h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-300">Terrain Type:</div>
                <div className="font-bold text-blue-400">{scenario.terrain.type.replace('_', ' ').toUpperCase()}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-gray-300">Slope:</div>
                  <div className={`font-bold ${
                    scenario.terrain.angle > 35 ? 'text-red-400' :
                    scenario.terrain.angle > 20 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {scenario.terrain.angle}°
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-300">Stability:</div>
                  <div className={`font-bold ${
                    scenario.terrain.stability < 30 ? 'text-red-400' :
                    scenario.terrain.stability < 60 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {scenario.terrain.stability}%
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-300">Surface:</div>
                <div className="font-bold text-purple-400">{scenario.terrain.surface.replace('_', ' ').toUpperCase()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-300">Drainage:</div>
                <div className="font-bold text-cyan-400">{scenario.terrain.drainage.replace('_', ' ').toUpperCase()}</div>
              </div>
            </div>
          </div>

          {/* Weather Conditions */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-green-400" />
              Weather Impact
            </h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-300">Condition:</div>
                <div className="font-bold text-green-400">{scenario.weather.condition.replace('_', ' ').toUpperCase()}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-gray-300">Temperature:</div>
                  <div className={`font-bold ${
                    scenario.weather.temp > 40 || scenario.weather.temp < 0 ? 'text-red-400' :
                    scenario.weather.temp > 30 || scenario.weather.temp < 10 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {scenario.weather.temp}°C
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-300">Humidity:</div>
                  <div className="font-bold text-blue-400">{scenario.weather.humidity}%</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-300">Wind:</div>
                <div className="font-bold text-yellow-400">{scenario.weather.wind.replace('_', ' ').toUpperCase()}</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-300">Critical Level:</div>
              <div className={`text-2xl font-bold ${
                scenario.criticalLevel >= 9 ? 'text-red-400' :
                scenario.criticalLevel >= 7 ? 'text-orange-400' : 'text-yellow-400'
              }`}>
                {scenario.criticalLevel}/10
              </div>
            </div>
          </div>
        </div>

        {/* Gemini AI Analysis */}
        {geminiAnalysis && (
          <div className="bg-purple-900 rounded-lg p-6 mb-6 shadow-lg border-2 border-purple-500">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              🤖 GEMINI AI ANALYSIS
              <span className="ml-3 text-sm bg-purple-600 px-3 py-1 rounded-full">
                Confidence: {geminiAnalysis.confidence}
              </span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-purple-300 mb-2">Primary Threats:</h3>
                <ul className="space-y-1 text-sm">
                  {geminiAnalysis.primaryThreats.map((threat, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-400 mr-2">⚠️</span>
                      {threat}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-purple-300 mb-2">AI Recommendations:</h3>
                <ul className="space-y-1 text-sm">
                  {geminiAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-400 mr-2">💡</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-purple-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-purple-300">Predicted Outcome:</div>
                  <div className="font-bold text-red-400">{geminiAnalysis.predictedOutcome}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-purple-300">Time to Failure:</div>
                  <div className="font-bold text-orange-400">{geminiAnalysis.timeToFailure}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Warnings */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">
            🚨 ACTIVE WARNINGS & SOLUTIONS ({activeWarnings.length})
          </h2>
         
          <div className="space-y-4">
            {activeWarnings.map((warning, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  warning.type === 'critical'
                    ? 'border-l-red-500 bg-red-900 bg-opacity-30'
                    : 'border-l-yellow-500 bg-yellow-900 bg-opacity-30'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <AlertTriangle className={`w-6 h-6 ${
                    warning.type === 'critical' ? 'text-red-400' : 'text-yellow-400'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">🚨</span>
                      <span className="font-bold text-xl">{warning.title}</span>
                      <span className={`text-xs px-2 py-1 rounded font-bold ${
                        warning.type === 'critical' ? 'bg-red-600' : 'bg-yellow-600'
                      }`}>
                        {warning.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300 mb-2">Problem: {warning.problem}</div>
                    <div className="bg-gray-700 p-3 rounded-lg mb-3">
                      <div className="text-sm font-medium text-gray-300 mb-1">Solution:</div>
                      <div className="text-sm whitespace-pre-line">{warning.solution}</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-400">
                        Response Time: {warning.timeLimit}s
                      </span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        machineResponse === 'executed' ? 'bg-green-600' :
                        machineResponse === 'processing' ? 'bg-blue-600' :
                        machineResponse === 'system_failure' ? 'bg-red-600' :
                        'bg-gray-600'
                      }`}>
                        {machineResponse === 'executed' ? '✅ EXECUTED' :
                         machineResponse === 'processing' ? '⏳ PROCESSING' :
                         machineResponse === 'system_failure' ? '❌ SYSTEM FAILURE' :
                         '⏱️ PENDING'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prevention Statistics */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">📊 HAZARD PREVENTION STATISTICS</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{preventedHazards.length}</div>
              <div className="text-sm text-gray-300">Total Hazards Prevented</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{criticalHazards}</div>
              <div className="text-sm text-gray-300">Critical Situations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {preventedHazards.filter(h => h.preventionMethod === 'manual_override').length}
              </div>
              <div className="text-sm text-gray-300">Manual Overrides</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {Math.round((preventedHazards.length / scenarios.length) * 100)}%
              </div>
              <div className="text-sm text-gray-300">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatMachineTerrainSystem;