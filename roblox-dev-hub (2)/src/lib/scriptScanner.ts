import { SecurityScanResult, SecurityStatus } from '../types';

/**
 * Scans Lua / RBXM code for potential security hazards like backdoors,
 * rogue third-party asset requires, loadstring obfuscation, or webhook leaks.
 */
export function scanRobloxScript(code: string): SecurityScanResult {
  const lines = code.split('\n');
  const findings: SecurityScanResult['suspiciousFindings'] = [];

  lines.forEach((lineText, idx) => {
    const lineNumber = idx + 1;
    const trimmed = lineText.trim();

    // Ignore full line comments
    if (trimmed.startsWith('--')) return;

    // Check for numeric require (require(12345678)) which loads unknown external asset scripts at runtime
    if (/require\s*\(\s*\d+\s*\)/i.test(trimmed)) {
      findings.push({
        type: 'require',
        line: lineNumber,
        code: trimmed,
        description: 'Numeric require() detected: Loads external unverified Roblox asset ID at runtime.',
      });
    }

    // Check for loadstring() which executes dynamic string code
    if (/loadstring\s*\(/i.test(trimmed)) {
      findings.push({
        type: 'loadstring',
        line: lineNumber,
        code: trimmed,
        description: 'loadstring() detected: Can execute arbitrary hidden code strings at runtime.',
      });
    }

    // Check for environment manipulation
    if (/getfenv\s*\(|setfenv\s*\(/i.test(trimmed)) {
      findings.push({
        type: 'getfenv',
        line: lineNumber,
        code: trimmed,
        description: 'getfenv()/setfenv() detected: Manipulates execution environment to hide code behavior.',
      });
    }

    // Check for HttpService / Discord Webhook calls
    if (/HttpService|PostAsync|GetAsync|discord\.com\/api\/webhooks/i.test(trimmed)) {
      findings.push({
        type: 'http_webhook',
        line: lineNumber,
        code: trimmed,
        description: 'HttpService / Webhook call detected: May send game data or IP info to external servers.',
      });
    }

    // Check for string obfuscation (string.reverse, byte arrays)
    if (/string\.reverse|\\x[0-9a-fA-F]{2}|string\.char\s*\(\s*\d+,\s*\d+/i.test(trimmed)) {
      findings.push({
        type: 'obfuscation',
        line: lineNumber,
        code: trimmed,
        description: 'Obfuscation pattern detected: Encrypted character codes or string reversing used to hide logic.',
      });
    }
  });

  let status: SecurityStatus = 'verified';
  let isSafe = true;

  if (findings.length > 0) {
    const hasCritical = findings.some(
      (f) => f.type === 'require' || f.type === 'loadstring' || f.type === 'obfuscation'
    );
    if (hasCritical) {
      status = 'warning';
      isSafe = false;
    } else {
      status = 'warning';
    }
  }

  let recommendation = '✅ Asset script passed standard security checks. Safe to insert into Roblox Studio.';
  if (!isSafe) {
    recommendation =
      '⚠ Caution: This asset contains runtime script execution or external asset requires. Inspect script contents in Roblox Studio Explorer before running.';
  }

  return {
    isSafe,
    status,
    scannedLines: lines.length,
    suspiciousFindings: findings,
    recommendation,
  };
}
