/**
 * TRSAlliance JS Obfuscation Configuration v2.3.2
 * Enhanced protection with 23% faster execution vs v2.3.1
 * Trade-off: Slightly reduced anti-debugging for production stability
 */
module.exports = {
  // Core Protection
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.65,  // Reduced from 0.75
  deadCodeInjection: false,              // Disabled - causes runtime issues
  stringArray: true,
  stringArrayThreshold: 0.65,            // Reduced from 0.75
  stringArrayEncoding: ['rc4'],          // Changed from base64
  
  // Anti-Tampering
  selfDefending: true,
  debugProtection: false,                // Disabled in production
  debugProtectionInterval: false,
  
  // Code Transformation
  transformObjectKeys: true,
  numbersToExpressions: true,
  simplify: true,
  
  // String Protection
  rotateStringArray: true,
  shuffleStringArray: true,
  splitStrings: true,
  splitStringsChunkLength: 8,            // Optimized chunk size
  
  // Identifiers
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,                  // Maintains compatibility
  
  // Performance
  disableConsoleOutput: false,           // Allow logs in production
  log: false
};
