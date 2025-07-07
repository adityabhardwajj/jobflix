'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

type AvatarExpression = 'happy' | 'thinking' | 'excited' | 'focused' | 'celebrating' | 'surprised';

const TechAgentAvatar = () => {
  const [currentExpression, setCurrentExpression] = useState<AvatarExpression>('happy');
  const [isInteracting, setIsInteracting] = useState(false);

  const expressions = {
    happy: {
      smile: 'w-20 h-3',
      smileTop: 'w-16 h-1',
      smileBottom: 'w-14 h-1',
      eyeSquint: true,
      glowColor: 'coral'
    },
    thinking: {
      smile: 'w-12 h-1',
      smileTop: 'w-8 h-0.5',
      smileBottom: 'w-6 h-0.5',
      eyeSquint: false,
      glowColor: 'indigo'
    },
    excited: {
      smile: 'w-24 h-4',
      smileTop: 'w-20 h-1.5',
      smileBottom: 'w-18 h-1.5',
      eyeSquint: true,
      glowColor: 'pink'
    },
    focused: {
      smile: 'w-14 h-1.5',
      smileTop: 'w-10 h-0.5',
      smileBottom: 'w-8 h-0.5',
      eyeSquint: false,
      glowColor: 'purple'
    },
    celebrating: {
      smile: 'w-22 h-4',
      smileTop: 'w-18 h-1.5',
      smileBottom: 'w-16 h-1.5',
      eyeSquint: true,
      glowColor: 'coral'
    },
    surprised: {
      smile: 'w-8 h-2',
      smileTop: 'w-6 h-0.5',
      smileBottom: 'w-4 h-0.5',
      eyeSquint: false,
      glowColor: 'yellow'
    }
  };

  const currentExp = expressions[currentExpression];

  const handleInteraction = (expression: AvatarExpression) => {
    setIsInteracting(true);
    setCurrentExpression(expression);
    setTimeout(() => {
      setIsInteracting(false);
      setCurrentExpression('happy');
    }, 3000);
  };
  return (
    <div className="my-8 select-none">
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px);
          }
          50% { 
            transform: translateY(-8px);
          }
        }
        
        @keyframes blink {
          0%, 85% { 
            opacity: 1;
          }
          90%, 100% { 
            opacity: 0.3;
          }
        }
        
        @keyframes wink {
          0%, 80% { 
            transform: scaleY(1);
          }
          85%, 95% { 
            transform: scaleY(0.1);
          }
          100% { 
            transform: scaleY(1);
          }
        }
        
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(251, 113, 133, 0.3);
          }
          50% { 
            box-shadow: 0 0 35px rgba(251, 113, 133, 0.6);
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.7;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.1);
          }
        }
        
        @keyframes scan {
          0% { 
            transform: translateY(-100%);
          }
          100% { 
            transform: translateY(100%);
          }
        }
        
        @keyframes bounce {
          0%, 100% { 
            transform: translateY(0);
          }
          50% { 
            transform: translateY(-10px);
          }
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        .blink-animation {
          animation: blink 3s ease-in-out infinite;
        }
        
        .wink-animation {
          animation: wink 4s ease-in-out infinite;
        }
        
        .glow-animation {
          animation: glow 3s ease-in-out infinite;
        }
        
        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .scan-animation {
          animation: scan 2s linear infinite;
        }
        
        .bounce-animation {
          animation: bounce 2s ease-in-out infinite;
        }
      `}</style>
      
      <motion.div
        className="flex justify-center items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main Avatar Container */}
        <motion.div
          className="relative w-72 h-72"
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.3 }
          }}
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, 1, 0, -1, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-coral-400/20 via-indigo-400/20 to-purple-400/20 glow-animation" />
          
          {/* Main Avatar Body - Circular */}
          <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 rounded-full border-2 border-slate-600 shadow-2xl overflow-hidden">
            
            {/* Face */}
            <div className="absolute inset-8 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 rounded-full border border-slate-500/30">
              
              {/* Eyes Container */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 flex gap-6">
                {/* Left Eye - Happy */}
                <motion.div
                  className="relative w-8 h-8 bg-gradient-to-br from-coral-400 to-pink-500 rounded-full"
                  whileHover={{ 
                    scale: 1.2,
                    transition: { duration: 0.2 }
                  }}
                >
                  {/* Eye Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-coral-300 to-pink-400 rounded-full opacity-60" />
                  
                  {/* Eye Pupil */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-coral-600 to-pink-700 rounded-full blink-animation" />
                  
                  {/* Eye Shine */}
                  <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-90" />
                  
                  {/* Dynamic Eye Squint */}
                  {currentExp.eyeSquint && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-coral-400/40 to-pink-500/40 rounded-b-full"
                      animate={{ 
                        scaleY: isInteracting ? [1, 1.5, 1] : 1
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </motion.div>
                
                {/* Right Eye - Winking */}
                <motion.div
                  className="relative w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full"
                  whileHover={{ 
                    scale: 1.2,
                    transition: { duration: 0.2 }
                  }}
                >
                  {/* Eye Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 to-purple-400 rounded-full opacity-60" />
                  
                  {/* Eye Pupil */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full blink-animation" />
                  
                  {/* Eye Shine */}
                  <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-90" />
                  
                  {/* Winking Eyelid */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full"
                    animate={{ 
                      scaleY: [1, 0.1, 1],
                      opacity: [0, 0.8, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  />
                  
                  {/* Dynamic Eye Squint */}
                  {currentExp.eyeSquint && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400/40 to-purple-500/40 rounded-b-full"
                      animate={{ 
                        scaleY: isInteracting ? [1, 1.5, 1] : 1
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </motion.div>
              </div>
              
              {/* Dynamic Smile */}
              <motion.div 
                className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 ${currentExp.smile} bg-gradient-to-r from-coral-400 to-pink-500 rounded-full opacity-100`}
                animate={{ 
                  scale: isInteracting ? [1, 1.1, 1] : 1,
                  rotate: currentExpression === 'excited' ? [0, 2, -2, 0] : 0
                }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Smile Curve - Top */}
              <motion.div 
                className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 ${currentExp.smileTop} bg-gradient-to-r from-coral-400 to-pink-500 rounded-full opacity-80`}
                animate={{ 
                  scale: isInteracting ? [1, 1.05, 1] : 1
                }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Smile Curve - Bottom */}
              <motion.div 
                className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 ${currentExp.smileBottom} bg-gradient-to-r from-coral-400 to-pink-500 rounded-full opacity-80`}
                animate={{ 
                  scale: isInteracting ? [1, 1.05, 1] : 1
                }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Cheek Dimples - Only for happy expressions */}
              {currentExpression === 'happy' || currentExpression === 'excited' || currentExpression === 'celebrating' ? (
                <>
                  <motion.div 
                    className="absolute bottom-8 left-6 w-3 h-1.5 bg-gradient-to-r from-coral-400/70 to-pink-500/70 rounded-full opacity-80"
                    animate={{ 
                      scale: isInteracting ? [1, 1.2, 1] : 1
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div 
                    className="absolute bottom-8 right-6 w-3 h-1.5 bg-gradient-to-r from-coral-400/70 to-pink-500/70 rounded-full opacity-80"
                    animate={{ 
                      scale: isInteracting ? [1, 1.2, 1] : 1
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </>
              ) : null}
            </div>
            
            {/* Hovering Headset Mic */}
            <motion.div
              className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gradient-to-r from-coral-400/40 to-indigo-400/40 rounded-full border border-coral-300/50"
              animate={{ 
                y: [0, -3, 0],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              {/* Headset Details */}
              <div className="absolute inset-1 bg-gradient-to-r from-coral-300/30 to-indigo-300/30 rounded-full" />
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-coral-400 rounded-full" />
              <div className="absolute top-1 right-1/2 transform translate-x-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full" />
            </motion.div>
            
            {/* Floating Assistant Bubble */}
            <motion.div
              className="absolute -top-8 -right-8 w-12 h-12 bg-gradient-to-br from-coral-400/60 to-pink-500/60 rounded-full border-2 border-coral-300/50 shadow-lg"
              animate={{ 
                y: [0, -12, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <div className="absolute inset-2 bg-white/20 rounded-full" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
                📎
              </div>
            </motion.div>
            
            {/* Glowing Tech Lines */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute top-4 left-4 w-16 h-0.5 bg-gradient-to-r from-coral-400 to-transparent rounded-full"
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scaleX: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-8 right-4 w-12 h-0.5 bg-gradient-to-l from-indigo-400 to-transparent rounded-full"
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scaleX: [1, 1.3, 1]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div
                className="absolute bottom-8 left-6 w-14 h-0.5 bg-gradient-to-r from-purple-400 to-transparent rounded-full"
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scaleX: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              />
            </div>
            
            {/* Scanning Line */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-coral-400/20 to-transparent scan-animation" />
            
            {/* Floating Badges */}
            <div className="absolute inset-0">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-b from-coral-400 to-pink-500 rounded-full"
                  style={{
                    left: `${20 + (i * 15) % 60}%`,
                    top: `${15 + (i * 10) % 70}%`
                  }}
                  animate={{
                    y: [0, -20, 0],
                    x: [0, 8, 0],
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            
            {/* Status Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              <motion.div
                className="w-2 h-2 bg-coral-400 rounded-full"
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="w-2 h-2 bg-indigo-400 rounded-full"
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div
                className="w-2 h-2 bg-purple-400 rounded-full"
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
              />
            </div>
          </div>
          
          {/* Floating Tech Elements */}
          <motion.div
            className="absolute -top-10 -left-10 w-8 h-8 bg-gradient-to-br from-indigo-400/40 to-purple-400/40 rounded-full border border-indigo-300/40"
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <div className="absolute inset-1.5 bg-indigo-300/20 rounded-full" />
          </motion.div>
          
          <motion.div
            className="absolute -bottom-10 -right-10 w-10 h-10 bg-gradient-to-br from-coral-400/40 to-pink-400/40 rounded-full border border-coral-300/40"
            animate={{ 
              y: [0, 8, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <div className="absolute inset-2 bg-coral-300/20 rounded-full" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TechAgentAvatar; 