// import React, { useState } from 'react';

// // --- DashboardCardModal (finish task modal) ---
// const DashboardCardModal = ({ onClose, onDone }) => {
//   const [form, setForm] = useState({
//     day: 'Monday',
//     date: new Date().toISOString().slice(0, 10),
//     target: '',
//     actual: '',
//     carryOver: '',
//     delayReason: '',
//     taskNumber: 'CAT-100',
//     instruction: 'Install foundation'
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   return (
//     <div style={{
//       position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
//       background: "rgba(0,0,0,0.6)", zIndex: 9000, display: "flex", justifyContent: "center", alignItems: "center"
//     }}>
//       <div style={{
//         background: "#222", color: "#ffd700", border: "2px solid #ffd700", borderRadius: 16,
//         minWidth: 340, maxWidth: 400, padding: 30, boxShadow: "0 8px 32px rgba(255, 215, 0, 0.18)"
//       }}>
//         <h2 style={{ margin: "0 0 20px 0", color: "#ffd700" }}>Finish Task - Enter Summary</h2>
//         <div style={{ marginBottom: 12 }}>
//           <label>Day: <input name="day" value={form.day} onChange={handleChange} style={inputStyle} /></label>
//         </div>
//         <div style={{ marginBottom: 12 }}>
//           <label>Date: <input name="date" type="date" value={form.date} onChange={handleChange} style={inputStyle} /></label>
//         </div>
//         <div style={{ marginBottom: 12 }}>
//           <label>Task Number: <input name="taskNumber" value={form.taskNumber} onChange={handleChange} style={inputStyle} /></label>
//         </div>
//         <div style={{ marginBottom: 12 }}>
//           <label>Instruction: <input name="instruction" value={form.instruction} onChange={handleChange} style={inputStyle} /></label>
//         </div>
//         <div style={{ marginBottom: 12 }}>
//           <label>Target (units): <input name="target" type="number" value={form.target} onChange={handleChange} style={inputStyle} /></label>
//         </div>
//         <div style={{ marginBottom: 12 }}>
//           <label>Actual Completed (units): <input name="actual" type="number" value={form.actual} onChange={handleChange} style={inputStyle} /></label>
//         </div>
//         <div style={{ marginBottom: 12 }}>
//           <label>Carry Over (units): <input name="carryOver" type="number" value={form.carryOver} onChange={handleChange} style={inputStyle} /></label>
//         </div>
//         <div style={{ marginBottom: 18 }}>
//           <label>Delay Reason: <input name="delayReason" value={form.delayReason} onChange={handleChange} style={inputStyle} /></label>
//         </div>
//         <div style={{ display: "flex", justifyContent: "space-between" }}>
//           <button onClick={onClose} style={modalBtnStyle}>Cancel</button>
//           <button onClick={() => onDone()} style={{ ...modalBtnStyle, background: "#ffd700", color: "#1a1a1a" }}>Done</button>
//         </div>
//       </div>
//     </div>
//   );
// };
// const inputStyle = {
//   marginLeft: 8,
//   borderRadius: 4,
//   border: "1px solid #ffd700",
//   padding: "4px 8px",
//   fontSize: 15,
//   background: "#171717",
//   color: "#ffd700",
//   outline: "none"
// };
// const modalBtnStyle = {
//   fontWeight: "bold",
//   padding: "8px 22px",
//   background: "#232323",
//   color: "#ffd700",
//   border: "1px solid #ffd700",
//   borderRadius: 6,
//   cursor: "pointer"
// };

// // --- Main App ---
// const JobSimulatorApp = () => {
//   const [currentPage, setCurrentPage] = useState('operator');
//   const [showFinishModal, setShowFinishModal] = useState(false);

//   // --- Operator Data ---
//   const operatorData = {
//     name: 'John Smith',
//     id: 'OP-2025-001',
//     date: new Date().toISOString().split('T')[0],
//     time: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5)
//   };

//   // --- Sensor Data ---
//   const [sensorData, setSensorData] = useState({
//     seatBelt: false,
//     fuelLevel: 50,
//     engineTemp: 75,
//     oilLevel: 80,
//     brakeFluid: 90,
//     tirePressure: 32,
//     batteryVoltage: 12.6,
//     coolantLevel: 85
//   });
//   const [savedSensorData, setSavedSensorData] = useState(null);

//   // --- Speech Recognition ---
//   const [isListening, setIsListening] = useState(false);
//   const [transcript, setTranscript] = useState('');
//   const [serverResponse, setServerResponse] = useState('');
//   const [isProcessing] = useState(false); // not used, but kept for compatibility
//   const [recognition, setRecognition] = useState(null);

//   React.useEffect(() => {
//     if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       const recognitionInstance = new SpeechRecognition();
//       recognitionInstance.continuous = false;
//       recognitionInstance.interimResults = false;
//       recognitionInstance.lang = 'en-US';

//       recognitionInstance.onstart = () => {
//         setIsListening(true);
//       };

//       recognitionInstance.onresult = (event) => {
//         const speechToText = event.results[0][0].transcript;
//         setTranscript(speechToText);
//         setServerResponse(`(Simulated) You said: "${speechToText}"`);
//       };

//       recognitionInstance.onerror = (event) => {
//         setIsListening(false);
//       };

//       recognitionInstance.onend = () => {
//         setIsListening(false);
//       };

//       setRecognition(recognitionInstance);
//     }
//   }, []);

//   const startListening = () => {
//     if (recognition) {
//       setTranscript('');
//       setServerResponse('');
//       recognition.start();
//     }
//   };

//   const handleSensorChange = (field, value) => {
//     setSensorData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };
//   const saveSensorData = () => {
//     setSavedSensorData({ ...sensorData });
//   };

//   // --- Check Status Logic ---
//   const getCheckStatus = (checkType) => {
//     if (!savedSensorData) return 'pending';
//     switch (checkType) {
//       case 'seatBelt':
//         return savedSensorData.seatBelt ? 'pass' : 'fail';
//       case 'fuelLevel':
//         return savedSensorData.fuelLevel >= 25 ? 'pass' : 'fail';
//       case 'engineTemp':
//         return savedSensorData.engineTemp >= 60 && savedSensorData.engineTemp <= 90 ? 'pass' : 'fail';
//       case 'oilLevel':
//         return savedSensorData.oilLevel >= 40 ? 'pass' : 'fail';
//       case 'brakeFluid':
//         return savedSensorData.brakeFluid >= 50 ? 'pass' : 'fail';
//       case 'tirePressure':
//         return savedSensorData.tirePressure >= 30 && savedSensorData.tirePressure <= 35 ? 'pass' : 'fail';
//       case 'batteryVoltage':
//         return savedSensorData.batteryVoltage >= 12.0 ? 'pass' : 'fail';
//       case 'coolantLevel':
//         return savedSensorData.coolantLevel >= 50 ? 'pass' : 'fail';
//       default:
//         return 'pending';
//     }
//   };

//   const checks = [
//     { id: 'seatBelt', label: 'Seat Belt Check', description: 'Operator seat belt engaged' },
//     { id: 'fuelLevel', label: 'Fuel Level Check', description: 'Fuel level above 25%' },
//     { id: 'engineTemp', label: 'Engine Temperature', description: 'Engine temperature 60-90°C' },
//     { id: 'oilLevel', label: 'Oil Level Check', description: 'Oil level above 40%' },
//     { id: 'brakeFluid', label: 'Brake Fluid Check', description: 'Brake fluid level above 50%' },
//     { id: 'tirePressure', label: 'Tire Pressure Check', description: 'Tire pressure 30-35 PSI' },
//     { id: 'batteryVoltage', label: 'Battery Voltage Check', description: 'Battery voltage above 12.0V' },
//     { id: 'coolantLevel', label: 'Coolant Level Check', description: 'Coolant level above 50%' }
//   ];

//   // --- Pages ---
//   if (currentPage === 'operator') {
//     return (
//       <div style={{
//         minHeight: '100vh',
//         backgroundColor: '#1a1a1a',
//         color: '#ffd700',
//         fontFamily: 'Arial, sans-serif',
//         padding: '20px'
//       }}>
//         <div style={{
//           maxWidth: '600px',
//           margin: '0 auto',
//           backgroundColor: '#2a2a2a',
//           padding: '40px',
//           borderRadius: '12px',
//           boxShadow: '0 8px 32px rgba(255, 215, 0, 0.1)',
//           border: '2px solid #ffd700'
//         }}>
//           <h1 style={{
//             textAlign: 'center',
//             marginBottom: '40px',
//             fontSize: '32px',
//             fontWeight: 'bold',
//             textShadow: '0 0 10px #ffd700'
//           }}>
//             Job Simulator - Operator Details
//           </h1>
//           <div style={{ marginBottom: '30px' }}>
//             <label style={{
//               display: 'block',
//               marginBottom: '8px',
//               fontSize: '18px',
//               fontWeight: 'bold'
//             }}>
//               Operator Name:
//             </label>
//             <div style={{
//               width: '100%',
//               padding: '12px',
//               fontSize: '16px',
//               backgroundColor: '#1a1a1a',
//               border: '2px solid #ffd700',
//               borderRadius: '6px',
//               color: '#ffd700',
//               fontWeight: 'bold'
//             }}>
//               {operatorData.name}
//             </div>
//           </div>
//           <div style={{ marginBottom: '30px' }}>
//             <label style={{
//               display: 'block',
//               marginBottom: '8px',
//               fontSize: '18px',
//               fontWeight: 'bold'
//             }}>
//               Operator ID:
//             </label>
//             <div style={{
//               width: '100%',
//               padding: '12px',
//               fontSize: '16px',
//               backgroundColor: '#1a1a1a',
//               border: '2px solid #ffd700',
//               borderRadius: '6px',
//               color: '#ffd700',
//               fontWeight: 'bold'
//             }}>
//               {operatorData.id}
//             </div>
//           </div>
//           <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
//             <div style={{ flex: 1 }}>
//               <label style={{
//                 display: 'block',
//                 marginBottom: '8px',
//                 fontSize: '18px',
//                 fontWeight: 'bold'
//               }}>
//                 Date:
//               </label>
//               <div style={{
//                 width: '100%',
//                 padding: '12px',
//                 fontSize: '16px',
//                 backgroundColor: '#1a1a1a',
//                 border: '2px solid #ffd700',
//                 borderRadius: '6px',
//                 color: '#ffd700',
//                 fontWeight: 'bold'
//               }}>
//                 {operatorData.date}
//               </div>
//             </div>
//             <div style={{ flex: 1 }}>
//               <label style={{
//                 display: 'block',
//                 marginBottom: '8px',
//                 fontSize: '18px',
//                 fontWeight: 'bold'
//               }}>
//                 Time:
//               </label>
//               <div style={{
//                 width: '100%',
//                 padding: '12px',
//                 fontSize: '16px',
//                 backgroundColor: '#1a1a1a',
//                 border: '2px solid #ffd700',
//                 borderRadius: '6px',
//                 color: '#ffd700',
//                 fontWeight: 'bold'
//               }}>
//                 {operatorData.time}
//               </div>
//             </div>
//           </div>
//           <button
//             onClick={() => setCurrentPage('simulator')}
//             style={{
//               width: '100%',
//               padding: '16px',
//               fontSize: '20px',
//               fontWeight: 'bold',
//               backgroundColor: '#ffd700',
//               color: '#1a1a1a',
//               border: 'none',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               transition: 'all 0.3s ease',
//               textTransform: 'uppercase',
//               letterSpacing: '2px'
//             }}
//             onMouseOver={(e) => {
//               e.target.style.backgroundColor = '#ffed4e';
//               e.target.style.transform = 'translateY(-2px)';
//               e.target.style.boxShadow = '0 4px 16px rgba(255, 215, 0, 0.4)';
//             }}
//             onMouseOut={(e) => {
//               e.target.style.backgroundColor = '#ffd700';
//               e.target.style.transform = 'translateY(0)';
//               e.target.style.boxShadow = 'none';
//             }}
//           >
//             Start Job
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (currentPage === 'voice-assistant') {
//     return (
//       <div style={{
//         minHeight: '100vh',
//         backgroundColor: '#1a1a1a',
//         color: '#ffd700',
//         fontFamily: 'Arial, sans-serif',
//         padding: '20px'
//       }}>
//         <div style={{
//           maxWidth: '800px',
//           margin: '0 auto'
//         }}>
//           <div style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: '30px',
//             padding: '20px',
//             backgroundColor: '#2a2a2a',
//             borderRadius: '8px',
//             border: '2px solid #ffd700'
//           }}>
//             <h1 style={{
//               fontSize: '28px',
//               fontWeight: 'bold',
//               textShadow: '0 0 10px #ffd700'
//             }}>
//               Voice Assistant
//             </h1>
//             <button
//               onClick={() => setCurrentPage('simulator')}
//               style={{
//                 padding: '10px 20px',
//                 backgroundColor: '#ffd700',
//                 color: '#1a1a1a',
//                 border: 'none',
//                 borderRadius: '6px',
//                 cursor: 'pointer',
//                 fontWeight: 'bold'
//               }}
//             >
//               Back to Simulator
//             </button>
//           </div>
//           <div style={{
//             backgroundColor: '#2a2a2a',
//             padding: '40px',
//             borderRadius: '12px',
//             border: '2px solid #ffd700',
//             textAlign: 'center'
//           }}>
//             <div style={{ marginBottom: '40px' }}>
//               <button
//                 onClick={startListening}
//                 disabled={isListening || isProcessing}
//                 style={{
//                   width: '120px',
//                   height: '120px',
//                   borderRadius: '50%',
//                   border: 'none',
//                   backgroundColor: isListening ? '#ff4444' : '#ffd700',
//                   color: '#1a1a1a',
//                   fontSize: '48px',
//                   cursor: isListening || isProcessing ? 'not-allowed' : 'pointer',
//                   transition: 'all 0.3s ease',
//                   boxShadow: isListening ? '0 0 30px #ff4444' : '0 0 20px #ffd700',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   margin: '0 auto',
//                   animation: isListening ? 'pulse 1s infinite' : 'none'
//                 }}
//                 onMouseOver={(e) => {
//                   if (!isListening && !isProcessing) {
//                     e.target.style.backgroundColor = '#ffed4e';
//                     e.target.style.transform = 'scale(1.05)';
//                   }
//                 }}
//                 onMouseOut={(e) => {
//                   if (!isListening && !isProcessing) {
//                     e.target.style.backgroundColor = '#ffd700';
//                     e.target.style.transform = 'scale(1)';
//                   }
//                 }}
//               >
//                 🎤
//               </button>
//               <style>
//                 {`
//                   @keyframes pulse {
//                     0% { transform: scale(1); }
//                     50% { transform: scale(1.1); }
//                     100% { transform: scale(1); }
//                   }
//                 `}
//               </style>
//             </div>
//             <div style={{
//               fontSize: '20px',
//               fontWeight: 'bold',
//               marginBottom: '30px',
//               color: isListening ? '#ff4444' : isProcessing ? '#ffaa00' : '#ffd700'
//             }}>
//               {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Click microphone to speak'}
//             </div>
//             {transcript && (
//               <div style={{
//                 backgroundColor: '#1a1a1a',
//                 padding: '20px',
//                 borderRadius: '8px',
//                 border: '2px solid #ffd700',
//                 marginBottom: '20px'
//               }}>
//                 <h3 style={{
//                   fontSize: '18px',
//                   fontWeight: 'bold',
//                   marginBottom: '10px',
//                   color: '#ffd700'
//                 }}>
//                   You said:
//                 </h3>
//                 <p style={{
//                   fontSize: '16px',
//                   color: '#fff',
//                   lineHeight: '1.5'
//                 }}>
//                   "{transcript}"
//                 </p>
//               </div>
//             )}
//             {serverResponse && (
//               <div style={{
//                 backgroundColor: '#1a1a1a',
//                 padding: '20px',
//                 borderRadius: '8px',
//                 border: '2px solid #00ff00',
//                 marginBottom: '20px'
//               }}>
//                 <h3 style={{
//                   fontSize: '18px',
//                   fontWeight: 'bold',
//                   marginBottom: '10px',
//                   color: '#00ff00'
//                 }}>
//                   Assistant Response:
//                 </h3>
//                 <p style={{
//                   fontSize: '16px',
//                   color: '#fff',
//                   lineHeight: '1.5'
//                 }}>
//                   {serverResponse}
//                 </p>
//               </div>
//             )}
//             <div style={{
//               backgroundColor: '#1a1a1a',
//               padding: '20px',
//               borderRadius: '8px',
//               border: '2px solid #666',
//               marginTop: '30px',
//               marginBottom: 20
//             }}>
//               <h3 style={{
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 marginBottom: '10px',
//                 color: '#ffd700'
//               }}>
//                 Instructions:
//               </h3>
//               <ul style={{
//                 textAlign: 'left',
//                 fontSize: '14px',
//                 color: '#ccc',
//                 lineHeight: '1.5'
//               }}>
//                 <li>Click the microphone button to start voice recognition</li>
//                 <li>Speak clearly when the microphone is active (red)</li>
//                 <li>Your speech will be displayed below</li>
//                 <li>This demo does not connect to a backend or play audio responses</li>
//               </ul>
//             </div>
//             {/* Finish Task Button */}
//             <button
//               onClick={() => setShowFinishModal(true)}
//               style={{
//                 marginTop: 30,
//                 width: "100%",
//                 padding: "16px",
//                 fontSize: "20px",
//                 fontWeight: "bold",
//                 backgroundColor: "#ffd700",
//                 color: "#1a1a1a",
//                 border: "none",
//                 borderRadius: "8px",
//                 cursor: "pointer",
//                 transition: "all 0.3s ease",
//                 textTransform: "uppercase",
//                 letterSpacing: "2px"
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.backgroundColor = '#ffed4e';
//                 e.target.style.transform = 'translateY(-2px)';
//                 e.target.style.boxShadow = '0 4px 16px rgba(255, 215, 0, 0.4)';
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.backgroundColor = '#ffd700';
//                 e.target.style.transform = 'translateY(0)';
//                 e.target.style.boxShadow = 'none';
//               }}
//             >
//               Finish Task &rarr;
//             </button>
//             {showFinishModal && (
//               <DashboardCardModal
//                 onClose={() => setShowFinishModal(false)}
//                 onDone={() => {
//                   setShowFinishModal(false);
//                   setCurrentPage('operator');
//                 }}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // --- Simulator Page ---
//   return (
//     <div style={{
//       minHeight: '100vh',
//       backgroundColor: '#1a1a1a',
//       color: '#ffd700',
//       fontFamily: 'Arial, sans-serif',
//       padding: '20px'
//     }}>
//       <div style={{
//         maxWidth: '1200px',
//         margin: '0 auto'
//       }}>
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: '30px',
//           padding: '20px',
//           backgroundColor: '#2a2a2a',
//           borderRadius: '8px',
//           border: '2px solid #ffd700'
//         }}>
//           <h1 style={{
//             fontSize: '28px',
//             fontWeight: 'bold',
//             textShadow: '0 0 10px #ffd700'
//           }}>
//             Pre-Run Check Simulator
//           </h1>
//           <button
//             onClick={() => setCurrentPage('operator')}
//             style={{
//               padding: '10px 20px',
//               backgroundColor: '#ffd700',
//               color: '#1a1a1a',
//               border: 'none',
//               borderRadius: '6px',
//               cursor: 'pointer',
//               fontWeight: 'bold'
//             }}
//           >
//             Back to Operator
//           </button>
//         </div>
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: '1fr 1fr',
//           gap: '30px'
//         }}>
//           {/* Sensor Input Section */}
//           <div style={{
//             backgroundColor: '#2a2a2a',
//             padding: '30px',
//             borderRadius: '12px',
//             border: '2px solid #ffd700'
//           }}>
//             <h2 style={{
//               fontSize: '24px',
//               fontWeight: 'bold',
//               marginBottom: '25px',
//               textAlign: 'center'
//             }}>
//               Hardware Sensor Inputs
//             </h2>
//             {/* Sensor Inputs */}
//             <div style={{ marginBottom: '20px' }}>
//               <label style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 marginBottom: '10px'
//               }}>
//                 <input
//                   type="checkbox"
//                   checked={sensorData.seatBelt}
//                   onChange={(e) => handleSensorChange('seatBelt', e.target.checked)}
//                   style={{
//                     marginRight: '10px',
//                     width: '18px',
//                     height: '18px',
//                     accentColor: '#ffd700'
//                   }}
//                 />
//                 Seat Belt Engaged
//               </label>
//             </div>
//             <div style={{ marginBottom: '20px' }}>
//               <label style={{
//                 display: 'block',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 marginBottom: '8px'
//               }}>
//                 Fuel Level (%): {sensorData.fuelLevel}
//               </label>
//               <input
//                 type="range"
//                 min="0"
//                 max="100"
//                 value={sensorData.fuelLevel}
//                 onChange={(e) => handleSensorChange('fuelLevel', parseInt(e.target.value))}
//                 style={{
//                   width: '100%',
//                   height: '8px',
//                   backgroundColor: '#1a1a1a',
//                   outline: 'none',
//                   borderRadius: '4px',
//                   accentColor: '#ffd700'
//                 }}
//               />
//             </div>
//             <div style={{ marginBottom: '20px' }}>
//               <label style={{
//                 display: 'block',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 marginBottom: '8px'
//               }}>
//                 Engine Temperature (°C): {sensorData.engineTemp}
//               </label>
//               <input
//                 type="range"
//                 min="40"
//                 max="120"
//                 value={sensorData.engineTemp}
//                 onChange={(e) => handleSensorChange('engineTemp', parseInt(e.target.value))}
//                 style={{
//                   width: '100%',
//                   height: '8px',
//                   backgroundColor: '#1a1a1a',
//                   outline: 'none',
//                   borderRadius: '4px',
//                   accentColor: '#ffd700'
//                 }}
//               />
//             </div>
//             <div style={{ marginBottom: '20px' }}>
//               <label style={{
//                 display: 'block',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 marginBottom: '8px'
//               }}>
//                 Oil Level (%): {sensorData.oilLevel}
//               </label>
//               <input
//                 type="range"
//                 min="0"
//                 max="100"
//                 value={sensorData.oilLevel}
//                 onChange={(e) => handleSensorChange('oilLevel', parseInt(e.target.value))}
//                 style={{
//                   width: '100%',
//                   height: '8px',
//                   backgroundColor: '#1a1a1a',
//                   outline: 'none',
//                   borderRadius: '4px',
//                   accentColor: '#ffd700'
//                 }}
//               />
//             </div>
//             <div style={{ marginBottom: '20px' }}>
//               <label style={{
//                 display: 'block',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 marginBottom: '8px'
//               }}>
//                 Brake Fluid Level (%): {sensorData.brakeFluid}
//               </label>
//               <input
//                 type="range"
//                 min="0"
//                 max="100"
//                 value={sensorData.brakeFluid}
//                 onChange={(e) => handleSensorChange('brakeFluid', parseInt(e.target.value))}
//                 style={{
//                   width: '100%',
//                   height: '8px',
//                   backgroundColor: '#1a1a1a',
//                   outline: 'none',
//                   borderRadius: '4px',
//                   accentColor: '#ffd700'
//                 }}
//               />
//             </div>
//             <div style={{ marginBottom: '20px' }}>
//               <label style={{
//                 display: 'block',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 marginBottom: '8px'
//               }}>
//                 Tire Pressure (PSI): {sensorData.tirePressure}
//               </label>
//               <input
//                 type="range"
//                 min="20"
//                 max="40"
//                 value={sensorData.tirePressure}
//                 onChange={(e) => handleSensorChange('tirePressure', parseInt(e.target.value))}
//                 style={{
//                   width: '100%',
//                   height: '8px',
//                   backgroundColor: '#1a1a1a',
//                   outline: 'none',
//                   borderRadius: '4px',
//                   accentColor: '#ffd700'
//                 }}
//               />
//             </div>
//             <div style={{ marginBottom: '20px' }}>
//               <label style={{
//                 display: 'block',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 marginBottom: '8px'
//               }}>
//                 Battery Voltage (V): {sensorData.batteryVoltage}
//               </label>
//               <input
//                 type="range"
//                 min="10"
//                 max="15"
//                 step="0.1"
//                 value={sensorData.batteryVoltage}
//                 onChange={(e) => handleSensorChange('batteryVoltage', parseFloat(e.target.value))}
//                 style={{
//                   width: '100%',
//                   height: '8px',
//                   backgroundColor: '#1a1a1a',
//                   outline: 'none',
//                   borderRadius: '4px',
//                   accentColor: '#ffd700'
//                 }}
//               />
//             </div>
//             <div style={{ marginBottom: '30px' }}>
//               <label style={{
//                 display: 'block',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 marginBottom: '8px'
//               }}>
//                 Coolant Level (%): {sensorData.coolantLevel}
//               </label>
//               <input
//                 type="range"
//                 min="0"
//                 max="100"
//                 value={sensorData.coolantLevel}
//                 onChange={(e) => handleSensorChange('coolantLevel', parseInt(e.target.value))}
//                 style={{
//                   width: '100%',
//                   height: '8px',
//                   backgroundColor: '#1a1a1a',
//                   outline: 'none',
//                   borderRadius: '4px',
//                   accentColor: '#ffd700'
//                 }}
//               />
//             </div>
//             <button
//               onClick={saveSensorData}
//               style={{
//                 width: '100%',
//                 padding: '16px',
//                 fontSize: '18px',
//                 fontWeight: 'bold',
//                 backgroundColor: '#ffd700',
//                 color: '#1a1a1a',
//                 border: 'none',
//                 borderRadius: '8px',
//                 cursor: 'pointer',
//                 transition: 'all 0.3s ease',
//                 textTransform: 'uppercase',
//                 letterSpacing: '1px'
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.backgroundColor = '#ffed4e';
//                 e.target.style.transform = 'translateY(-2px)';
//                 e.target.style.boxShadow = '0 4px 16px rgba(255, 215, 0, 0.4)';
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.backgroundColor = '#ffd700';
//                 e.target.style.transform = 'translateY(0)';
//                 e.target.style.boxShadow = 'none';
//               }}
//             >
//               Save Sensor Data
//             </button>
//           </div>
//           {/* Check Status Section */}
//           <div style={{
//             backgroundColor: '#2a2a2a',
//             padding: '30px',
//             borderRadius: '12px',
//             border: '2px solid #ffd700'
//           }}>
//             <h2 style={{
//               fontSize: '24px',
//               fontWeight: 'bold',
//               marginBottom: '25px',
//               textAlign: 'center'
//             }}>
//               System Check Status
//             </h2>
//             {checks.map((check) => {
//               const status = getCheckStatus(check.id);
//               return (
//                 <div
//                   key={check.id}
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     padding: '15px',
//                     marginBottom: '15px',
//                     backgroundColor: '#1a1a1a',
//                     borderRadius: '8px',
//                     border: `2px solid ${status === 'pass' ? '#00ff00' : status === 'fail' ? '#ff0000' : '#666'}`,
//                     transition: 'all 0.3s ease'
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: '20px',
//                       height: '20px',
//                       borderRadius: '50%',
//                       backgroundColor: status === 'pass' ? '#00ff00' : status === 'fail' ? '#ff0000' : '#666',
//                       marginRight: '15px',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       color: '#1a1a1a',
//                       fontWeight: 'bold',
//                       fontSize: '12px'
//                     }}
//                   >
//                     {status === 'pass' ? '✓' : status === 'fail' ? '✗' : '?'}
//                   </div>
//                   <div style={{ flex: 1 }}>
//                     <div style={{
//                       fontSize: '16px',
//                       fontWeight: 'bold',
//                       marginBottom: '4px'
//                     }}>
//                       {check.label}
//                     </div>
//                     <div style={{
//                       fontSize: '14px',
//                       color: '#ccc'
//                     }}>
//                       {check.description}
//                     </div>
//                   </div>
//                   <div style={{
//                     fontSize: '14px',
//                     fontWeight: 'bold',
//                     color: status === 'pass' ? '#00ff00' : status === 'fail' ? '#ff0000' : '#666',
//                     textTransform: 'uppercase'
//                   }}>
//                     {status === 'pending' ? 'Pending' : status === 'pass' ? 'Pass' : 'Fail'}
//                   </div>
//                 </div>
//               );
//             })}
//             {savedSensorData && (
//               <div style={{
//                 marginTop: '30px',
//                 padding: '20px',
//                 backgroundColor: '#1a1a1a',
//                 borderRadius: '8px',
//                 border: '2px solid #ffd700'
//               }}>
//                 <h3 style={{
//                   fontSize: '18px',
//                   fontWeight: 'bold',
//                   marginBottom: '15px',
//                   textAlign: 'center'
//                 }}>
//                   Overall Status
//                 </h3>
//                 <div style={{
//                   textAlign: 'center',
//                   fontSize: '24px',
//                   fontWeight: 'bold',
//                   color: checks.every(check => getCheckStatus(check.id) === 'pass') ? '#00ff00' : '#ff0000',
//                   marginBottom: '20px'
//                 }}>
//                   {checks.every(check => getCheckStatus(check.id) === 'pass') ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED'}
//                 </div>
//                 <button
//                   onClick={() => {
//                     const allPassed = checks.every(check => getCheckStatus(check.id) === 'pass');
//                     if (allPassed) {
//                       setCurrentPage('voice-assistant');
//                     } else {
//                       alert('Some checks failed. Please fix issues before proceeding.');
//                     }
//                   }}
//                   disabled={!checks.every(check => getCheckStatus(check.id) === 'pass')}
//                   style={{
//                     width: '100%',
//                     padding: '16px',
//                     fontSize: '18px',
//                     fontWeight: 'bold',
//                     backgroundColor: checks.every(check => getCheckStatus(check.id) === 'pass') ? '#ffd700' : '#666',
//                     color: '#1a1a1a',
//                     border: 'none',
//                     borderRadius: '8px',
//                     cursor: checks.every(check => getCheckStatus(check.id) === 'pass') ? 'pointer' : 'not-allowed',
//                     transition: 'all 0.3s ease',
//                     textTransform: 'uppercase',
//                     letterSpacing: '1px'
//                   }}
//                   onMouseOver={(e) => {
//                     if (checks.every(check => getCheckStatus(check.id) === 'pass')) {
//                       e.target.style.backgroundColor = '#ffed4e';
//                       e.target.style.transform = 'translateY(-2px)';
//                       e.target.style.boxShadow = '0 4px 16px rgba(255, 215, 0, 0.4)';
//                     }
//                   }}
//                   onMouseOut={(e) => {
//                     if (checks.every(check => getCheckStatus(check.id) === 'pass')) {
//                       e.target.style.backgroundColor = '#ffd700';
//                       e.target.style.transform = 'translateY(0)';
//                       e.target.style.boxShadow = 'none';
//                     }
//                   }}
//                 >
//                   Proceed
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobSimulatorApp;

import React, { useState } from 'react';

// --- DashboardCardModal (finish task modal) ---
const DashboardCardModal = ({ onClose, onDone }) => {
  const [form, setForm] = useState({
    day: 'Monday',
    date: new Date().toISOString().slice(0, 10),
    target: '',
    actual: '',
    carryOver: '',
    delayReason: '',
    taskNumber: 'CAT-100',
    instruction: 'Install foundation'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div style={{
      position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.6)", zIndex: 9000, display: "flex", justifyContent: "center", alignItems: "center"
    }}>
      <div style={{
        background: "#222", color: "#ffd700", border: "2px solid #ffd700", borderRadius: 16,
        minWidth: 340, maxWidth: 400, padding: 30, boxShadow: "0 8px 32px rgba(255, 215, 0, 0.18)"
      }}>
        <h2 style={{ margin: "0 0 20px 0", color: "#ffd700" }}>Finish Task - Enter Summary</h2>
        <div style={{ marginBottom: 12 }}>
          <label>Day: <input name="day" value={form.day} onChange={handleChange} style={inputStyle} /></label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Date: <input name="date" type="date" value={form.date} onChange={handleChange} style={inputStyle} /></label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Task Number: <input name="taskNumber" value={form.taskNumber} onChange={handleChange} style={inputStyle} /></label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Instruction: <input name="instruction" value={form.instruction} onChange={handleChange} style={inputStyle} /></label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Target (units): <input name="target" type="number" value={form.target} onChange={handleChange} style={inputStyle} /></label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Actual Completed (units): <input name="actual" type="number" value={form.actual} onChange={handleChange} style={inputStyle} /></label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Carry Over (units): <input name="carryOver" type="number" value={form.carryOver} onChange={handleChange} style={inputStyle} /></label>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>Delay Reason: <input name="delayReason" value={form.delayReason} onChange={handleChange} style={inputStyle} /></label>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={onClose} style={modalBtnStyle}>Cancel</button>
          <button onClick={() => onDone()} style={{ ...modalBtnStyle, background: "#ffd700", color: "#1a1a1a" }}>Done</button>
        </div>
      </div>
    </div>
  );
};
const inputStyle = {
  marginLeft: 8,
  borderRadius: 4,
  border: "1px solid #ffd700",
  padding: "4px 8px",
  fontSize: 15,
  background: "#171717",
  color: "#ffd700",
  outline: "none"
};
const modalBtnStyle = {
  fontWeight: "bold",
  padding: "8px 22px",
  background: "#232323",
  color: "#ffd700",
  border: "1px solid #ffd700",
  borderRadius: 6,
  cursor: "pointer"
};

// --- Main App ---
const JobSimulatorApp = () => {
  const [currentPage, setCurrentPage] = useState('operator');
  const [showFinishModal, setShowFinishModal] = useState(false);

  // --- Operator Data ---
  const operatorData = {
    name: 'John Smith',
    id: 'OP-2025-001',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5)
  };

  // --- Sensor Data ---
  const [sensorData, setSensorData] = useState({
    seatBelt: false,
    fuelLevel: 50,
    engineTemp: 75,
    oilLevel: 80,
    brakeFluid: 90,
    tirePressure: 32,
    batteryVoltage: 12.6,
    coolantLevel: 85
  });
  const [savedSensorData, setSavedSensorData] = useState(null);

  // --- Speech Recognition & Backend ---
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [serverResponse, setServerResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognition, setRecognition] = useState(null);

  React.useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        setTranscript(speechToText);
        sendToFlaskServer(speechToText);
      };

      recognitionInstance.onerror = (event) => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setTranscript('');
      setServerResponse('');
      recognition.start();
    }
  };

  // --- Backend integration (original) ---
  const sendToFlaskServer = async (text) => {
    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:5000/api/process-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
      });
      if (response.ok) {
        const data = await response.json();
        setServerResponse(data.response);
        playAudioResponse(data.audioFile);
      } else {
        setServerResponse('Error: Unable to process request');
      }
    } catch (error) {
      setServerResponse('Error: Unable to connect to server');
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudioResponse = (audioFileName) => {
    // Play audio from local directory
    const audio = new Audio(`/audio/${audioFileName}`);
    audio.play().catch(error => {
      // Fallback to browser TTS
      speakText(serverResponse);
    });
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const handleSensorChange = (field, value) => {
    setSensorData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const saveSensorData = () => {
    setSavedSensorData({ ...sensorData });
  };

  // --- Check Status Logic ---
  const getCheckStatus = (checkType) => {
    if (!savedSensorData) return 'pending';
    switch (checkType) {
      case 'seatBelt':
        return savedSensorData.seatBelt ? 'pass' : 'fail';
      case 'fuelLevel':
        return savedSensorData.fuelLevel >= 25 ? 'pass' : 'fail';
      case 'engineTemp':
        return savedSensorData.engineTemp >= 60 && savedSensorData.engineTemp <= 90 ? 'pass' : 'fail';
      case 'oilLevel':
        return savedSensorData.oilLevel >= 40 ? 'pass' : 'fail';
      case 'brakeFluid':
        return savedSensorData.brakeFluid >= 50 ? 'pass' : 'fail';
      case 'tirePressure':
        return savedSensorData.tirePressure >= 30 && savedSensorData.tirePressure <= 35 ? 'pass' : 'fail';
      case 'batteryVoltage':
        return savedSensorData.batteryVoltage >= 12.0 ? 'pass' : 'fail';
      case 'coolantLevel':
        return savedSensorData.coolantLevel >= 50 ? 'pass' : 'fail';
      default:
        return 'pending';
    }
  };

  const checks = [
    { id: 'seatBelt', label: 'Seat Belt Check', description: 'Operator seat belt engaged' },
    { id: 'fuelLevel', label: 'Fuel Level Check', description: 'Fuel level above 25%' },
    { id: 'engineTemp', label: 'Engine Temperature', description: 'Engine temperature 60-90°C' },
    { id: 'oilLevel', label: 'Oil Level Check', description: 'Oil level above 40%' },
    { id: 'brakeFluid', label: 'Brake Fluid Check', description: 'Brake fluid level above 50%' },
    { id: 'tirePressure', label: 'Tire Pressure Check', description: 'Tire pressure 30-35 PSI' },
    { id: 'batteryVoltage', label: 'Battery Voltage Check', description: 'Battery voltage above 12.0V' },
    { id: 'coolantLevel', label: 'Coolant Level Check', description: 'Coolant level above 50%' }
  ];

  // --- Pages ---
  if (currentPage === 'operator') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#ffd700',
        fontFamily: 'Arial, sans-serif',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#2a2a2a',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(255, 215, 0, 0.1)',
          border: '2px solid #ffd700'
        }}>
          <h1 style={{
            textAlign: 'center',
            marginBottom: '40px',
            fontSize: '32px',
            fontWeight: 'bold',
            textShadow: '0 0 10px #ffd700'
          }}>
            Job Simulator - Operator Details
          </h1>
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              Operator Name:
            </label>
            <div style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              backgroundColor: '#1a1a1a',
              border: '2px solid #ffd700',
              borderRadius: '6px',
              color: '#ffd700',
              fontWeight: 'bold'
            }}>
              {operatorData.name}
            </div>
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              Operator ID:
            </label>
            <div style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              backgroundColor: '#1a1a1a',
              border: '2px solid #ffd700',
              borderRadius: '6px',
              color: '#ffd700',
              fontWeight: 'bold'
            }}>
              {operatorData.id}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                Date:
              </label>
              <div style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                backgroundColor: '#1a1a1a',
                border: '2px solid #ffd700',
                borderRadius: '6px',
                color: '#ffd700',
                fontWeight: 'bold'
              }}>
                {operatorData.date}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                Time:
              </label>
              <div style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                backgroundColor: '#1a1a1a',
                border: '2px solid #ffd700',
                borderRadius: '6px',
                color: '#ffd700',
                fontWeight: 'bold'
              }}>
                {operatorData.time}
              </div>
            </div>
          </div>
          <button
            onClick={() => setCurrentPage('simulator')}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '20px',
              fontWeight: 'bold',
              backgroundColor: '#ffd700',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#ffed4e';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 16px rgba(255, 215, 0, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#ffd700';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Start Job
          </button>
        </div>
      </div>
    );
  }

  if (currentPage === 'voice-assistant') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#ffd700',
        fontFamily: 'Arial, sans-serif',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#2a2a2a',
            borderRadius: '8px',
            border: '2px solid #ffd700'
          }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              textShadow: '0 0 10px #ffd700'
            }}>
              Voice Assistant
            </h1>
            <button
              onClick={() => setCurrentPage('simulator')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ffd700',
                color: '#1a1a1a',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Back to Simulator
            </button>
          </div>
          <div style={{
            backgroundColor: '#2a2a2a',
            padding: '40px',
            borderRadius: '12px',
            border: '2px solid #ffd700',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '40px' }}>
              <button
                onClick={startListening}
                disabled={isListening || isProcessing}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: isListening ? '#ff4444' : '#ffd700',
                  color: '#1a1a1a',
                  fontSize: '48px',
                  cursor: isListening || isProcessing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isListening ? '0 0 30px #ff4444' : '0 0 20px #ffd700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  animation: isListening ? 'pulse 1s infinite' : 'none'
                }}
                onMouseOver={(e) => {
                  if (!isListening && !isProcessing) {
                    e.target.style.backgroundColor = '#ffed4e';
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isListening && !isProcessing) {
                    e.target.style.backgroundColor = '#ffd700';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                🎤
              </button>
              <style>
                {`
                  @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                  }
                `}
              </style>
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '30px',
              color: isListening ? '#ff4444' : isProcessing ? '#ffaa00' : '#ffd700'
            }}>
              {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Click microphone to speak'}
            </div>
            {transcript && (
              <div style={{
                backgroundColor: '#1a1a1a',
                padding: '20px',
                borderRadius: '8px',
                border: '2px solid #ffd700',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  color: '#ffd700'
                }}>
                  You said:
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#fff',
                  lineHeight: '1.5'
                }}>
                  "{transcript}"
                </p>
              </div>
            )}
            {serverResponse && (
              <div style={{
                backgroundColor: '#1a1a1a',
                padding: '20px',
                borderRadius: '8px',
                border: '2px solid #00ff00',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  color: '#00ff00'
                }}>
                  Assistant Response:
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#fff',
                  lineHeight: '1.5'
                }}>
                  {serverResponse}
                </p>
              </div>
            )}
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '20px',
              borderRadius: '8px',
              border: '2px solid #666',
              marginTop: '30px',
              marginBottom: 20
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '10px',
                color: '#ffd700'
              }}>
                Instructions:
              </h3>
              <ul style={{
                textAlign: 'left',
                fontSize: '14px',
                color: '#ccc',
                lineHeight: '1.5'
              }}>
                <li>Click the microphone button to start voice recognition</li>
                <li>Speak clearly when the microphone is active (red)</li>
                <li>Your speech will be converted to text and sent to the server</li>
                <li>The response will be displayed and played as audio</li>
                <li>Audio files should be placed in the /audio/ directory</li>
              </ul>
            </div>
            {/* Finish Task Button */}
            <button
              onClick={() => setShowFinishModal(true)}
              style={{
                marginTop: 30,
                width: "100%",
                padding: "16px",
                fontSize: "20px",
                fontWeight: "bold",
                backgroundColor: "#ffd700",
                color: "#1a1a1a",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                letterSpacing: "2px"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#ffed4e';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 16px rgba(255, 215, 0, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#ffd700';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Finish Task &rarr;
            </button>
            {showFinishModal && (
              <DashboardCardModal
                onClose={() => setShowFinishModal(false)}
                onDone={() => {
                  setShowFinishModal(false);
                  setCurrentPage('operator');
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Simulator Page ---
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#ffd700',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#2a2a2a',
          borderRadius: '8px',
          border: '2px solid #ffd700'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            textShadow: '0 0 10px #ffd700'
          }}>
            Pre-Run Check Simulator
          </h1>
          <button
            onClick={() => setCurrentPage('operator')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ffd700',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Back to Operator
          </button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px'
        }}>
          {/* Sensor Input Section */}
          <div style={{
            backgroundColor: '#2a2a2a',
            padding: '30px',
            borderRadius: '12px',
            border: '2px solid #ffd700'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '25px',
              textAlign: 'center'
            }}>
              Hardware Sensor Inputs
            </h2>
            {/* Sensor Inputs */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                <input
                  type="checkbox"
                  checked={sensorData.seatBelt}
                  onChange={(e) => handleSensorChange('seatBelt', e.target.checked)}
                  style={{
                    marginRight: '10px',
                    width: '18px',
                    height: '18px',
                    accentColor: '#ffd700'
                  }}
                />
                Seat Belt Engaged
              </label>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                Fuel Level (%): {sensorData.fuelLevel}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={sensorData.fuelLevel}
                onChange={(e) => handleSensorChange('fuelLevel', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#1a1a1a',
                  outline: 'none',
                  borderRadius: '4px',
                  accentColor: '#ffd700'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                Engine Temperature (°C): {sensorData.engineTemp}
              </label>
              <input
                type="range"
                min="40"
                max="120"
                value={sensorData.engineTemp}
                onChange={(e) => handleSensorChange('engineTemp', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#1a1a1a',
                  outline: 'none',
                  borderRadius: '4px',
                  accentColor: '#ffd700'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                Oil Level (%): {sensorData.oilLevel}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={sensorData.oilLevel}
                onChange={(e) => handleSensorChange('oilLevel', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#1a1a1a',
                  outline: 'none',
                  borderRadius: '4px',
                  accentColor: '#ffd700'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                Brake Fluid Level (%): {sensorData.brakeFluid}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={sensorData.brakeFluid}
                onChange={(e) => handleSensorChange('brakeFluid', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#1a1a1a',
                  outline: 'none',
                  borderRadius: '4px',
                  accentColor: '#ffd700'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                Tire Pressure (PSI): {sensorData.tirePressure}
              </label>
              <input
                type="range"
                min="20"
                max="40"
                value={sensorData.tirePressure}
                onChange={(e) => handleSensorChange('tirePressure', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#1a1a1a',
                  outline: 'none',
                  borderRadius: '4px',
                  accentColor: '#ffd700'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                Battery Voltage (V): {sensorData.batteryVoltage}
              </label>
              <input
                type="range"
                min="10"
                max="15"
                step="0.1"
                value={sensorData.batteryVoltage}
                onChange={(e) => handleSensorChange('batteryVoltage', parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#1a1a1a',
                  outline: 'none',
                  borderRadius: '4px',
                  accentColor: '#ffd700'
                }}
              />
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                Coolant Level (%): {sensorData.coolantLevel}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={sensorData.coolantLevel}
                onChange={(e) => handleSensorChange('coolantLevel', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#1a1a1a',
                  outline: 'none',
                  borderRadius: '4px',
                  accentColor: '#ffd700'
                }}
              />
            </div>
            <button
              onClick={saveSensorData}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: '#ffd700',
                color: '#1a1a1a',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#ffed4e';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 16px rgba(255, 215, 0, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#ffd700';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Save Sensor Data
            </button>
          </div>
          {/* Check Status Section */}
          <div style={{
            backgroundColor: '#2a2a2a',
            padding: '30px',
            borderRadius: '12px',
            border: '2px solid #ffd700'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '25px',
              textAlign: 'center'
            }}>
              System Check Status
            </h2>
            {checks.map((check) => {
              const status = getCheckStatus(check.id);
              return (
                <div
                  key={check.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px',
                    marginBottom: '15px',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '8px',
                    border: `2px solid ${status === 'pass' ? '#00ff00' : status === 'fail' ? '#ff0000' : '#666'}`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: status === 'pass' ? '#00ff00' : status === 'fail' ? '#ff0000' : '#666',
                      marginRight: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1a1a1a',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}
                  >
                    {status === 'pass' ? '✓' : status === 'fail' ? '✗' : '?'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      marginBottom: '4px'
                    }}>
                      {check.label}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#ccc'
                    }}>
                      {check.description}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: status === 'pass' ? '#00ff00' : status === 'fail' ? '#ff0000' : '#666',
                    textTransform: 'uppercase'
                  }}>
                    {status === 'pending' ? 'Pending' : status === 'pass' ? 'Pass' : 'Fail'}
                  </div>
                </div>
              );
            })}
            {savedSensorData && (
              <div style={{
                marginTop: '30px',
                padding: '20px',
                backgroundColor: '#1a1a1a',
                borderRadius: '8px',
                border: '2px solid #ffd700'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  textAlign: 'center'
                }}>
                  Overall Status
                </h3>
                <div style={{
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: checks.every(check => getCheckStatus(check.id) === 'pass') ? '#00ff00' : '#ff0000',
                  marginBottom: '20px'
                }}>
                  {checks.every(check => getCheckStatus(check.id) === 'pass') ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED'}
                </div>
                <button
                  onClick={() => {
                    const allPassed = checks.every(check => getCheckStatus(check.id) === 'pass');
                    if (allPassed) {
                      setCurrentPage('voice-assistant');
                    } else {
                      alert('Some checks failed. Please fix issues before proceeding.');
                    }
                  }}
                  disabled={!checks.every(check => getCheckStatus(check.id) === 'pass')}
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    backgroundColor: checks.every(check => getCheckStatus(check.id) === 'pass') ? '#ffd700' : '#666',
                    color: '#1a1a1a',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: checks.every(check => getCheckStatus(check.id) === 'pass') ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                  onMouseOver={(e) => {
                    if (checks.every(check => getCheckStatus(check.id) === 'pass')) {
                      e.target.style.backgroundColor = '#ffed4e';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 16px rgba(255, 215, 0, 0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (checks.every(check => getCheckStatus(check.id) === 'pass')) {
                      e.target.style.backgroundColor = '#ffd700';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  Proceed
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSimulatorApp;