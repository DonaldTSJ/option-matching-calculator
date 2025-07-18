# Option Matching Calculator - Quick Reference

## 🚀 Quick Start

```javascript
// Initialize with one input row
renderInputs();

// Add a position
handleInputChange(0, 'type', 'long call');
handleInputChange(0, 'code', 'BABA 210205C00055000');
handleInputChange(0, 'available', '10');
handleInputChange(0, 'order', '5');

// Calculate results
handleSubmit();
```

## 📋 Position Types

| Index | Type | Description |
|-------|------|-------------|
| 0 | `long call` | Long Call |
| 1 | `short call` | Short Call |
| 2 | `long put` | Long Put |
| 3 | `short put` | Short Put |
| 4 | `long stock` | Long Stock |
| 5 | `short stock` | Short Stock |

## 🎯 Combination Types

| Code | Description | Components |
|------|-------------|------------|
| 1A | Long Put + Long Stock | [0, 0, 1, 0, 1, 0] |
| 1B | Short Call + Long Stock | [0, 1, 0, 0, 1, 0] |
| 1C | Long Call + Short Stock | [1, 0, 0, 0, 0, 1] |
| 1D | Short Put + Short Stock | [0, 0, 0, 1, 0, 1] |
| 2A | Long Put + Short Put | [0, 0, 1, 1, 0, 0] |
| 2B | Long Call + Short Call | [1, 1, 0, 0, 0, 0] |
| 2C | Short Call + Short Put | [0, 1, 0, 1, 0, 0] |
| 2D | Long Call + Long Put | [1, 0, 1, 0, 0, 0] |

## 🔧 Core Functions

### Input Processing
```javascript
parseUserInput(userData) // Converts user input to vectors
```

### Calculations
```javascript
calculateCombinations(availableVector, nonAvailableVector, codeMapping) // Main calculation engine
```

### Output Formatting
```javascript
formatOutput(result) // Formats results for display
```

### UI Management
```javascript
renderInputs() // Renders input form
renderResult(result) // Renders results tables
```

## 📝 Data Structures

### Input Object
```javascript
{
  type: string,      // Position type
  code: string,      // Option/stock code
  available: number, // Available quantity
  order: number,     // Order quantity
  error?: string     // Error message
}
```

### Vector Format
```javascript
[longCall, shortCall, longPut, shortPut, longStock, shortStock]
```

### Result Object
```javascript
{
  available_combinations: { [type]: { count: number, details: Array } },
  non_available_combinations: { [type]: { count: number, details: Array } },
  remaining_legs: Array<{ type: string, count: number, code: string }>
}
```

## 🔍 Validation Rules

### Option Codes
- **Pattern**: `/^[A-Z]{1,5}\s\d{6}[CP]\d{8}$/`
- **Example**: `BABA 210205C00055000`

### Stock Codes
- **Pattern**: `/^[A-Z]{1,5}$/`
- **Example**: `BABA`

### Quantities
- Must be non-negative numbers
- Empty = 0
- Decimals supported

## 🎮 UI Functions

### Input Management
```javascript
addInput() // Add new input row
handleInputChange(index, field, value) // Update input field
handleReset() // Reset all inputs
```

### Form Actions
```javascript
handleSubmit() // Validate and calculate
```

### Rendering
```javascript
renderInputs() // Render input form
renderResult(result) // Render results
```

## 🛠️ Utility Functions

### Type Conversion
```javascript
getLegTypeIndex(type) // String → Index
getLegTypeName(index) // Index → String
```

### Validation
```javascript
isValidCode(code, type) // Validate code format
```

## 📊 Example Workflow

```javascript
// 1. Set up inputs
const userData = [
  { type: 'long call', code: 'BABA 210205C00055000', available: 10, order: 5 },
  { type: 'short put', code: 'BABA 210205P00055000', available: 8, order: 3 }
];

// 2. Parse inputs
const { availableVector, nonAvailableVector, codeMapping } = parseUserInput(userData);

// 3. Calculate combinations
const calculatedResult = calculateCombinations(availableVector, nonAvailableVector, codeMapping);

// 4. Format output
const formattedResult = formatOutput(calculatedResult);

// 5. Display results
renderResult(formattedResult);
```

## 🔧 Common Patterns

### Add Multiple Positions
```javascript
// Add first position
handleInputChange(0, 'type', 'long call');
handleInputChange(0, 'code', 'BABA 210205C00055000');
handleInputChange(0, 'available', '10');
handleInputChange(0, 'order', '5');

// Add second position
addInput();
handleInputChange(1, 'type', 'short put');
handleInputChange(1, 'code', 'BABA 210205P00055000');
handleInputChange(1, 'available', '8');
handleInputChange(1, 'order', '3');
```

### Validate Before Calculation
```javascript
// Check if all codes are valid
const allValid = inputs.every(input => 
  !input.code || isValidCode(input.code, input.type)
);

if (!allValid) {
  console.log('Invalid codes detected');
  return;
}
```

### Access Results Programmatically
```javascript
const result = formatOutput(calculatedResult);

// Available combinations
console.log(result.available_combinations);

// Non-available combinations
console.log(result.non_available_combinations);

// Remaining legs
console.log(result.remaining_legs);
```

## 🚨 Error Handling

### Input Validation Errors
```javascript
// Errors are stored in input.error
inputs.forEach((input, index) => {
  if (input.error) {
    console.log(`Row ${index}: ${input.error}`);
  }
});
```

### Calculation Errors
```javascript
try {
  const result = calculateCombinations(availableVector, nonAvailableVector, codeMapping);
} catch (error) {
  console.error('Calculation error:', error);
}
```

## 🔄 State Management

### Global Variables
```javascript
let inputs = [{ type: 'long call', code: '', available: '', order: '' }];
```

### Reset State
```javascript
handleReset(); // Resets to initial state
```

## 📱 Browser Compatibility

- **ES6+**: Arrow functions, template literals, destructuring
- **CSS Flexbox**: Modern layout system
- **HTML5**: Form validation, number inputs

## ⚡ Performance Tips

1. **Batch DOM Updates**: Use `renderInputs()` after multiple changes
2. **Validate Early**: Check codes before calculation
3. **Limit Input Rows**: Large numbers may impact performance
4. **Use Efficient Loops**: Prefer `forEach` over `for...in` for arrays

## 🔍 Debugging

### Console Logging
```javascript
// Log input state
console.log('Inputs:', inputs);

// Log calculation vectors
console.log('Available Vector:', availableVector);
console.log('Non-Available Vector:', nonAvailableVector);

// Log results
console.log('Formatted Result:', formattedResult);
```

### Common Issues
- **Invalid codes**: Check format with `isValidCode()`
- **Empty results**: Verify quantities are non-zero
- **Rendering issues**: Check DOM element IDs exist