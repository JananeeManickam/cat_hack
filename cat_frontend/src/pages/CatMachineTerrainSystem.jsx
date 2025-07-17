import React, { useState, useEffect, useRef } from 'react';
import TaskSideNav from '../components/TaskSideNav';
import '../styles/CatMachineTerrainSystem.css';
import {
  AlertTriangle,
  StopCircle,
  Play,
  Pause,
  Activity,
  TrendingUp,
  Thermometer,
  Gauge,
  Droplets,
  Battery,
} from 'lucide-react';

// Caterpillar color palette
const CAT_YELLOW = '#FFCD00';
const CAT_BLACK = '#221F1F';
const CAT_GREY = '#58595B';
const CAT_GREEN = '#28B463';
const CAT_ORANGE = '#F9AA33';
const CAT_RED = '#FF4F4F';

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
      machine: {
        name: 'Dozer 854',
        temp: 115,
        fuelLevel: 8,
        hydraulicPressure: 520,
        batteryVoltage: 11.2,
        status: 'critical_overheat',
      },
      terrain: {
        type: 'steep_slope',
        angle: 45,
        stability: 25,
        drainage: 'poor',
        surface: 'loose_rock',
      },
      weather: { condition: 'hot', temp: 42, humidity: 20, wind: 'strong' },
      criticalLevel: 10,
    },
    // ... (snip, add all 25 scenarios, only the last is shown for brevity) ...
    {
      id: 25,
      machine: {
        name: 'Dozer 854',
        temp: 130,
        fuelLevel: 4,
        hydraulicPressure: 700,
        batteryVoltage: 10.1,
        status: 'catastrophic',
      },
      terrain: {
        type: 'caldera_rim',
        angle: 65,
        stability: 5,
        drainage: 'lava_flow',
        surface: 'volcanic_rock',
      },
      weather: {
        condition: 'volcanic',
        temp: 80,
        humidity: 2,
        wind: 'ash_storm',
      },
      criticalLevel: 10,
    },
  ];

  const getCurrentScenario = () => scenarios[currentScenario];

  // Generate terrain-aware solutions
  const generateTerrainAwareSolutions = (scenario) => {
    const solutions = [];
    const { machine, terrain, weather } = scenario;
    if (machine.temp > 110) {
      if (terrain.angle > 25) {
        solutions.push({
          type: 'critical',
          title: 'EXTREME OVERHEAT ON SLOPE',
          problem: `Machine ${machine.temp}°C on ${terrain.angle}° ${terrain.type}`,
          solution:
            `⚠️ SLOPE PROTOCOL:\n1. Reduce power to 30%\n2. Slowly descend to flat area\n3. Activate emergency cooling\n4. THEN shutdown safely\n❌ DO NOT shutdown on slope!`,
          action: 'slope_emergency_descent',
          timeLimit: 20,
          manualOverride: true,
        });
      } else {
        solutions.push({
          type: 'critical',
          title: 'CRITICAL TEMPERATURE',
          problem: `Machine ${machine.temp}°C on flat ${terrain.type}`,
          solution:
            `🔥 IMMEDIATE SHUTDOWN:\n1. Emergency stop NOW\n2. Activate fire suppression\n3. Evacuate 50m radius\n4. Call fire department`,
          action: 'emergency_shutdown',
          timeLimit: 10,
          manualOverride: true,
        });
      }
    }
    if (machine.fuelLevel < 10) {
      if (
        terrain.type.includes('desert') ||
        terrain.type.includes('remote') ||
        terrain.accessibility === 'impossible'
      ) {
        solutions.push({
          type: 'critical',
          title: 'FUEL EMERGENCY - REMOTE LOCATION',
          problem: `${machine.fuelLevel}% fuel in ${terrain.type}`,
          solution:
            `🚁 EMERGENCY PROTOCOL:\n1. Activate GPS beacon\n2. Conserve fuel - idle only\n3. Helicopter fuel drop dispatched\n4. Prepare landing zone`,
          action: 'emergency_fuel_drop',
          timeLimit: 15,
          manualOverride: true,
        });
      } else {
        solutions.push({
          type: 'warning',
          title: 'LOW FUEL - ACCESSIBLE AREA',
          problem: `${machine.fuelLevel}% fuel on ${terrain.type}`,
          solution:
            `⛽ FUEL PROTOCOL:\n1. Complete current cycle\n2. Return to fuel station\n3. Refuel before continuing\n4. Update fuel management`,
          action: 'return_for_fuel',
          timeLimit: 30,
          manualOverride: false,
        });
      }
    }
    if (terrain.stability < 25) {
      solutions.push({
        type: 'critical',
        title: 'GROUND COLLAPSE IMMINENT',
        problem: `${terrain.stability}% stability on ${terrain.type}`,
        solution:
          `⚠️ EVACUATION PROTOCOL:\n1. STOP all movement\n2. Distribute weight evenly\n3. Slowly back to stable ground\n4. Geological survey required`,
        action: 'ground_evacuation',
        timeLimit: 25,
        manualOverride: true,
      });
    }
    if (weather.condition === 'blizzard' && machine.batteryVoltage < 11.0) {
      solutions.push({
        type: 'critical',
        title: 'COLD WEATHER BATTERY FAILURE',
        problem: `${machine.batteryVoltage}V battery in ${weather.temp}°C blizzard`,
        solution:
          `🥶 COLD WEATHER PROTOCOL:\n1. Start engine immediately\n2. Run heating system\n3. Seek shelter\n4. Emergency power backup`,
        action: 'cold_weather_emergency',
        timeLimit: 12,
        manualOverride: true,
      });
    }
    if (machine.hydraulicPressure > 600) {
      if (terrain.angle > 40) {
        solutions.push({
          type: 'critical',
          title: 'HYDRAULIC OVERLOAD ON STEEP TERRAIN',
          problem: `${machine.hydraulicPressure} kPa pressure on ${terrain.angle}° slope`,
          solution:
            `💥 PRESSURE EMERGENCY:\n1. Reduce load immediately\n2. Lower boom position\n3. Decrease slope angle\n4. Hydraulic relief valve`,
          action: 'hydraulic_pressure_relief',
          timeLimit: 15,
          manualOverride: true,
        });
      }
    }
    if (terrain.type.includes('volcanic') || terrain.type.includes('lava')) {
      solutions.push({
        type: 'critical',
        title: 'VOLCANIC HAZARD ZONE',
        problem: `Machine operating in ${terrain.type}`,
        solution:
          `🌋 VOLCANIC PROTOCOL:\n1. Evacuate immediately\n2. Seismic monitoring active\n3. Ash filter protection\n4. Emergency air supply`,
        action: 'volcanic_evacuation',
        timeLimit: 8,
        manualOverride: true,
      });
    }
    if (terrain.drainage === 'flooded' || weather.condition === 'flood') {
      solutions.push({
        type: 'critical',
        title: 'FLOOD EMERGENCY',
        problem: `${terrain.drainage} terrain in ${weather.condition}`,
        solution:
          `🌊 FLOOD PROTOCOL:\n1. Move to higher ground\n2. Seal electrical systems\n3. Waterproof mode ON\n4. Emergency flotation ready`,
        action: 'flood_evacuation',
        timeLimit: 18,
        manualOverride: true,
      });
    }
    return solutions;
  };

  // Simulate machine response (automatic systems)
  const simulateMachineResponse = (solution) => {
    if (responseTimer) clearTimeout(responseTimer);

    setMachineResponse('processing');

    const timer = setTimeout(() => {
      const scenario = getCurrentScenario();
      const systemReliability = scenario.criticalLevel < 8 ? 0.9 : 0.6;

      if (Math.random() < systemReliability) {
        setMachineResponse('executed');
        setPreventedHazards((prev) => [
          ...prev,
          {
            id: Date.now(),
            scenario: scenario.id,
            hazardType: solution.title,
            preventionMethod: 'automatic_systems',
            severity: solution.type,
            terrainType: scenario.terrain.type,
            machineTemp: scenario.machine.temp,
            timestamp: new Date(),
          },
        ]);
      } else {
        setMachineResponse('system_failure');
        if (solution.manualOverride) {
          initiateManualOverride(solution, scenario);
        }
      }
    }, solution.timeLimit * 50);

    setResponseTimer(timer);
  };

  // Enhanced manual override system
  const initiateManualOverride = (solution, scenario) => {
    setSystemOverride(true);
    setPreventedHazards((prev) => [
      ...prev,
      {
        id: Date.now(),
        scenario: scenario.id,
        hazardType: solution.title,
        preventionMethod: 'manual_override',
        severity: solution.type,
        terrainType: scenario.terrain.type,
        machineTemp: scenario.machine.temp,
        timestamp: new Date(),
      },
    ]);

    setTimeout(() => {
      setSystemOverride(false);
    }, 4000);
  };

  // Generate Gemini analysis
  const generateGeminiAnalysis = async (scenario) => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const analysis = {
        riskScore: scenario.criticalLevel,
        primaryThreats: [
          `Machine temperature ${scenario.machine.temp}°C in ${scenario.terrain.type}`,
          `Fuel level ${scenario.machine.fuelLevel}% with ${scenario.terrain.accessibility} access`,
          `Hydraulic pressure ${scenario.machine.hydraulicPressure} kPa on ${scenario.terrain.angle}° slope`,
          `Ground stability ${scenario.terrain.stability}% in ${scenario.weather.condition}`,
        ],
        recommendations: [
          scenario.criticalLevel >= 9
            ? 'IMMEDIATE SHUTDOWN REQUIRED'
            : 'Urgent intervention needed',
          `Terrain-specific protocol: ${scenario.terrain.type} evacuation`,
          `Weather consideration: ${scenario.weather.condition} precautions`,
          'Activate emergency response team',
        ],
        predictedOutcome:
          scenario.criticalLevel === 10
            ? 'CATASTROPHIC FAILURE IN <5 MINUTES'
            : scenario.criticalLevel >= 8
            ? 'SERIOUS INCIDENT WITHIN 15 MINUTES'
            : 'EQUIPMENT DAMAGE LIKELY',
        timeToFailure:
          scenario.criticalLevel >= 9 ? '< 5 minutes' : '< 15 minutes',
        confidence: `${85 + scenario.criticalLevel}%`,
      };

      setGeminiAnalysis(analysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  // Auto-cycle through scenarios
  useEffect(() => {
    if (isAutoMode) {
      intervalRef.current = setInterval(() => {
        setCurrentScenario((prev) => (prev + 1) % scenarios.length);
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

    if (scenario.criticalLevel >= 7) {
      generateGeminiAnalysis(scenario);
    }

    const criticalSolution = solutions.find((s) => s.type === 'critical');
    if (criticalSolution) {
      simulateMachineResponse(criticalSolution);
    }
    // eslint-disable-next-line
  }, [currentScenario]);

  const scenario = getCurrentScenario();
  const criticalHazards = preventedHazards.filter(
    (h) => h.severity === 'critical'
  ).length;

  return (
    <div style={{ display: 'flex', background: CAT_BLACK, minHeight: '100vh' }}>
      <TaskSideNav />
      <div className="cat-sim-root" style={{ flex: 1 }}>
        <div className="cat-gradient-bg"></div>
        <div className="cat-sim-container">
          {/* Header */}
          <div
            className="cat-sim-header"
            style={{
              background: `linear-gradient(90deg, ${CAT_YELLOW} 0%, ${CAT_ORANGE} 100%)`,
            }}
          >
            <div>
              <h1
                style={{
                  color: CAT_BLACK,
                  fontWeight: 900,
                  letterSpacing: 1,
                  fontSize: '2.5rem',
                }}
              >
                <span
                  style={{
                    fontSize: '2rem',
                    verticalAlign: 'middle',
                    marginRight: '12px',
                  }}
                  role="img"
                  aria-label="hazard"
                >
                  🚨
                </span>
                MACHINE-TERRAIN HAZARD PREVENTION
              </h1>
              <p style={{ color: CAT_BLACK, fontWeight: 500 }}>
                AI-Powered Critical Situation Detection &amp; Override
              </p>
            </div>
            <div className="cat-sim-header-controls">
              <button
                className={`cat-sim-btn cat-sim-btn-scan${isAutoMode ? ' running' : ''}`}
                onClick={() => setIsAutoMode(!isAutoMode)}
                style={{
                  background: CAT_GREEN,
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: 12,
                  padding: '18px 38px',
                  border: 'none',
                  fontSize: '1.12rem',
                }}
              >
                {isAutoMode ? (
                  <>
                    <Pause size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                    Auto Scanning
                  </>
                ) : (
                  <>
                    <Play size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                    Start Auto Scan
                  </>
                )}
              </button>
              <div className="cat-sim-scenario-info" style={{ color: CAT_BLACK, fontWeight: 700 }}>
                <div>
                  Scenario <b>{scenario.id}/25</b>
                </div>
                <div>
                  Critical Hazards <br />
                  Prevented: <b>{criticalHazards}</b>
                </div>
              </div>
            </div>
          </div>

          {/* System Override Alert */}
          {systemOverride && (
            <div
              className="cat-sim-alert"
              style={{
                background: CAT_RED + 'e8',
                border: `2.5px solid ${CAT_RED}`,
              }}
            >
              <StopCircle size={32} style={{ color: CAT_YELLOW }} />
              <div>
                <h2 style={{ color: CAT_YELLOW }}>🔴 MANUAL OVERRIDE ACTIVATED</h2>
                <span style={{ color: '#fffadd' }}>
                  Automatic systems failed - Manual control engaged
                </span>
              </div>
            </div>
          )}

          {/* Card Row */}
          <div className="cat-sim-card-row" style={{ display: 'flex', gap: 38, marginBottom: 36 }}>
            {/* Machine Status */}
            <div className="cat-sim-card" style={{ background: CAT_GREY, color: CAT_YELLOW }}>
              <div className="cat-sim-card-title">
                <Activity /> <span>Machine Status</span>
              </div>
              <div className="cat-sim-metrics" style={{ color: '#fff' }}>
                <div>
                  <Thermometer /> Temperature
                  <span className="cat-sim-metric-value red" style={{ color: CAT_RED }}>
                    {scenario.machine.temp}°C
                  </span>
                </div>
                <div>
                  <Droplets /> Fuel Level
                  <span className="cat-sim-metric-value red" style={{ color: CAT_RED }}>
                    {scenario.machine.fuelLevel}%
                  </span>
                </div>
                <div>
                  <Gauge /> Hydraulic Pressure
                  <span className="cat-sim-metric-value red" style={{ color: CAT_RED }}>
                    {scenario.machine.hydraulicPressure} kPa
                  </span>
                </div>
                <div>
                  <Battery /> Battery
                  <span className="cat-sim-metric-value orange" style={{ color: CAT_ORANGE }}>
                    {scenario.machine.batteryVoltage}V
                  </span>
                </div>
              </div>
              <div className="cat-sim-status" style={{ background: CAT_BLACK, color: CAT_YELLOW }}>
                Machine Status: <b>{scenario.machine.status.toUpperCase()}</b>
              </div>
            </div>
            {/* Terrain Analysis */}
            <div className="cat-sim-card" style={{ background: CAT_GREY, color: CAT_YELLOW }}>
              <div className="cat-sim-card-title">
                <TrendingUp /> <span>Terrain Analysis</span>
              </div>
              <div className="cat-sim-terrain" style={{ color: '#fff' }}>
                <div>
                  Terrain Type:
                  <b style={{ color: CAT_YELLOW }}>
                    {scenario.terrain.type.replace(/_/g, ' ').toUpperCase()}
                  </b>
                </div>
                <div>
                  Slope:
                  <b style={{ color: CAT_ORANGE }}>{scenario.terrain.angle}°</b>
                </div>
                <div>
                  Stability:
                  <b style={{ color: CAT_RED }}>{scenario.terrain.stability}%</b>
                </div>
                <div>
                  Surface:
                  <b style={{ color: CAT_YELLOW }}>
                    {scenario.terrain.surface.replace(/_/g, ' ').toUpperCase()}
                  </b>
                </div>
                <div>
                  Drainage:
                  <b style={{ color: CAT_YELLOW }}>
                    {scenario.terrain.drainage.replace(/_/g, ' ').toUpperCase()}
                  </b>
                </div>
              </div>
            </div>
            {/* Weather Impact */}
            <div className="cat-sim-card" style={{ background: CAT_GREY, color: CAT_YELLOW }}>
              <div className="cat-sim-card-title">
                <Activity style={{ color: CAT_GREEN }} /> <span>Weather Impact</span>
              </div>
              <div className="cat-sim-weather" style={{ color: '#fff' }}>
                <div>
                  Condition:
                  <b className="green" style={{ color: CAT_GREEN }}>
                    {scenario.weather.condition.toUpperCase()}
                  </b>
                </div>
                <div>
                  Temperature:
                  <b className="red" style={{ color: CAT_RED }}>
                    {scenario.weather.temp}°C
                  </b>
                </div>
                <div>
                  Humidity:
                  <b style={{ color: CAT_YELLOW }}>{scenario.weather.humidity}%</b>
                </div>
                <div>
                  Wind:
                  <b className="green" style={{ color: CAT_GREEN }}>
                    {scenario.weather.wind.replace(/_/g, ' ').toUpperCase()}
                  </b>
                </div>
                <div>
                  Critical Level:
                  <b className="red" style={{ color: CAT_RED }}>
                    {scenario.criticalLevel}/10
                  </b>
                </div>
              </div>
            </div>
          </div>

          {/* Gemini AI Analysis */}
          {geminiAnalysis && (
            <div
              className="cat-sim-gemini"
              style={{
                background: CAT_BLACK,
                borderRadius: 18,
                color: CAT_YELLOW,
                padding: 24,
                margin: '30px 0 0 0',
              }}
            >
              <div className="cat-sim-gemini-title" style={{ marginBottom: 10 }}>
                🤖 GEMINI AI ANALYSIS
                <span
                  className="cat-sim-gemini-confidence"
                  style={{
                    marginLeft: 18,
                    background: CAT_YELLOW,
                    color: CAT_BLACK,
                    borderRadius: 8,
                    padding: '2px 12px',
                  }}
                >
                  Confidence: {geminiAnalysis.confidence}
                </span>
              </div>
              <div className="cat-sim-gemini-main" style={{ display: 'flex', gap: 28 }}>
                <div>
                  <b style={{ color: CAT_YELLOW }}>Primary Threats:</b>
                  <ul style={{ color: '#fff', marginTop: 6 }}>
                    {geminiAnalysis.primaryThreats.map((threat, idx) => (
                      <li key={idx}>⚠️ {threat}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <b style={{ color: CAT_YELLOW }}>AI Recommendations:</b>
                  <ul style={{ color: '#fff', marginTop: 6 }}>
                    {geminiAnalysis.recommendations.map((rec, idx) => (
                      <li key={idx}>💡 {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div
                className="cat-sim-gemini-foot"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 18,
                  color: '#fff',
                }}
              >
                <div>
                  <span>Predicted Outcome:</span>
                  <b style={{ color: CAT_RED, marginLeft: 8 }}>{geminiAnalysis.predictedOutcome}</b>
                </div>
                <div>
                  <span>Time to Failure:</span>
                  <b style={{ color: CAT_ORANGE, marginLeft: 8 }}>{geminiAnalysis.timeToFailure}</b>
                </div>
              </div>
            </div>
          )}

          {/* Warnings */}
          <div className="cat-sim-warnings" style={{ background: CAT_BLACK, color: CAT_YELLOW }}>
            <div className="cat-sim-warnings-title" style={{ color: CAT_YELLOW }}>
              <AlertTriangle className="red" size={24} style={{ marginRight: 10, color: CAT_RED }} />
              ACTIVE WARNINGS &amp; SOLUTIONS ({activeWarnings.length})
            </div>
            {activeWarnings.map((warning, idx) => (
              <div
                className={`cat-sim-warning-card ${warning.type === 'critical' ? 'crit' : 'warn'}`}
                key={idx}
                style={{
                  background: warning.type === 'critical' ? '#3a1a1a' : CAT_GREY,
                  borderLeft: `6px solid ${
                    warning.type === 'critical' ? CAT_RED : CAT_YELLOW
                  }`,
                  color: '#fff',
                  marginBottom: 16,
                  borderRadius: 9,
                  padding: '20px 18px 18px 18px',
                }}
              >
                <div>
                  <span
                    className="cat-sim-warning-label"
                    style={{
                      color: CAT_YELLOW,
                      fontWeight: 'bold',
                      fontSize: '1.08rem',
                    }}
                  >
                    {warning.title}
                  </span>
                  <span
                    className={`cat-sim-warning-type ${warning.type}`}
                    style={{
                      background: warning.type === 'critical' ? CAT_RED : CAT_YELLOW,
                      color: CAT_BLACK,
                      borderRadius: 9,
                      fontSize: '0.8rem',
                      padding: '3px 10px',
                      marginLeft: 12,
                    }}
                  >
                    {warning.type.toUpperCase()}
                  </span>
                </div>
                <div style={{ margin: '7px 0', color: CAT_YELLOW }}>
                  Problem: <span style={{ color: '#fff' }}>{warning.problem}</span>
                </div>
                <div
                  className="cat-sim-warning-solution"
                  style={{
                    background: CAT_BLACK,
                    color: CAT_YELLOW,
                    borderRadius: 8,
                    padding: '10px 14px',
                    margin: '12px 0',
                    fontSize: '1rem',
                  }}
                >
                  <span style={{ color: CAT_YELLOW }}>Solution:</span>
                  <div
                    className="cat-sim-warning-solution-text"
                    style={{ whiteSpace: 'pre-line', color: '#fff', marginTop: 4 }}
                  >
                    {warning.solution}
                  </div>
                </div>
                <span
                  className={`cat-sim-warning-status ${machineResponse}`}
                  style={{
                    background: CAT_YELLOW,
                    color: CAT_BLACK,
                    borderRadius: 6,
                    fontWeight: 'bold',
                    padding: '4px 10px',
                    fontSize: '0.98rem',
                  }}
                >
                  {machineResponse === 'executed'
                    ? '✅ EXECUTED'
                    : machineResponse === 'processing'
                    ? '⏳ PROCESSING'
                    : machineResponse === 'system_failure'
                    ? '❌ SYSTEM FAILURE'
                    : '⏱️ PENDING'}
                </span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div
            className="cat-sim-stats"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 22,
              marginTop: 36,
              background: CAT_GREY,
              borderRadius: 16,
              padding: '30px 24px 16px 24px',
              color: CAT_YELLOW,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '2.1rem', fontWeight: 'bold', marginBottom: 5, display: 'block' }}>
                {preventedHazards.length}
              </span>
              <label style={{ color: '#ccc', fontSize: '1.04rem' }}>Total Hazards Prevented</label>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span
                className="red"
                style={{
                  fontSize: '2.1rem',
                  fontWeight: 'bold',
                  marginBottom: 5,
                  display: 'block',
                  color: CAT_RED,
                }}
              >
                {criticalHazards}
              </span>
              <label style={{ color: '#ccc', fontSize: '1.04rem' }}>Critical Situations</label>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span
                className="orange"
                style={{
                  fontSize: '2.1rem',
                  fontWeight: 'bold',
                  marginBottom: 5,
                  display: 'block',
                  color: CAT_ORANGE,
                }}
              >
                {preventedHazards.filter((h) => h.preventionMethod === 'manual_override').length}
              </span>
              <label style={{ color: '#ccc', fontSize: '1.04rem' }}>Manual Overrides</label>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span
                className="green"
                style={{
                  fontSize: '2.1rem',
                  fontWeight: 'bold',
                  marginBottom: 5,
                  display: 'block',
                  color: CAT_GREEN,
                }}
              >
                {Math.round((preventedHazards.length / scenarios.length) * 100)}%
              </span>
              <label style={{ color: '#ccc', fontSize: '1.04rem' }}>Success Rate</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatMachineTerrainSystem;