/**
 * WCAG 2.1 Contrast Ratio Calculator
 * Calculates contrast ratios for LEGO theme color pairs
 */

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function sRGBtoLinear(channel) {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(hex) {
  const rgb = hexToRgb(hex);
  const r = sRGBtoLinear(rgb.r);
  const g = sRGBtoLinear(rgb.g);
  const b = sRGBtoLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(color1, color2) {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function wcagResult(ratio, normalText = true) {
  if (normalText) {
    return ratio >= 4.5 ? 'AA' : (ratio >= 3.0 ? 'AA Large' : 'FAIL');
  } else {
    return ratio >= 3.0 ? 'AA Large' : 'FAIL';
  }
}

// LEGO theme color definitions
const colors = {
  black: '#000000',
  white: '#ffffff',
  muted: '#555555',
  gray: '#e4e4e4',
  red: '#d11013',
  blue: '#0055bf',
  yellow: '#f6ec35'
};

console.log('WCAG 2.1 Contrast Ratio Results for LEGO Theme\n');
console.log('=' .repeat(70));

// Test critical text/background pairs
const pairs = [
  { fg: 'black', bg: 'gray', usage: 'Body text on baseplate background' },
  { fg: 'muted', bg: 'gray', usage: 'Muted text on baseplate background' },
  { fg: 'white', bg: 'red', usage: 'Site title on header' },
  { fg: 'white', bg: 'blue', usage: 'Nav links on blue background' },
  { fg: 'yellow', bg: 'blue', usage: 'Nav hover state' },
  { fg: 'black', bg: 'white', usage: 'Text on card backgrounds' }
];

pairs.forEach(pair => {
  const ratio = getContrastRatio(colors[pair.fg], colors[pair.bg]);
  const normalText = wcagResult(ratio, true);
  const largeText = wcagResult(ratio, false);

  console.log(`\n${pair.usage}`);
  console.log(`  Colors: ${pair.fg} (${colors[pair.fg]}) on ${pair.bg} (${colors[pair.bg]})`);
  console.log(`  Contrast ratio: ${ratio.toFixed(2)}:1`);
  console.log(`  WCAG AA normal text: ${normalText}`);
  console.log(`  WCAG AA large text: ${largeText}`);
});

console.log('\n' + '='.repeat(70));
console.log('\nWCAG AA Requirements:');
console.log('  - Normal text (< 18pt or < 14pt bold): >= 4.5:1');
console.log('  - Large text (>= 18pt or >= 14pt bold): >= 3.0:1');
