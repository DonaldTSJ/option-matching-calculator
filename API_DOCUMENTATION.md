# Option Matching Calculator - API Documentation

## Overview

The Option Matching Calculator is a web-based tool designed to calculate optimal matching combinations for options and stocks. It helps identify available and non-available combinations, as well as remaining single-leg positions.

## Table of Contents

1. [Core Functions](#core-functions)
2. [Utility Functions](#utility-functions)
3. [UI Functions](#ui-functions)
4. [Data Structures](#data-structures)
5. [Usage Examples](#usage-examples)
6. [Error Handling](#error-handling)

## Core Functions

### `parseUserInput(userData)`

Parses user input data and converts it into internal vector representations.

**Parameters:**
- `userData` (Array): Array of input objects with the following structure:
  ```javascript
  {
    type: string,      // Position type (e.g., 'long call', 'short put', 'long stock')
    code: string,      // Option/stock code
    available: number, // Available quantity
    order: number      // Order quantity
  }
  ```

**Returns:**
- `Object`: Parsed data containing:
  - `availableVector`: Array of 6 numbers representing available quantities for each position type
  - `nonAvailableVector`: Array of 6 numbers representing order quantities for each position type
  - `codeMapping`: Object mapping position types to their codes

**Example:**
```javascript
const userData = [
  { type: 'long call', code: 'BABA 210205C00055000', available: 10, order: 5 },
  { type: 'short put', code: 'BABA 210205P00055000', available: 8, order: 3 }
];
const result = parseUserInput(userData);
// Returns: { availableVector: [10, 0, 0, 8, 0, 0], nonAvailableVector: [5, 0, 0, 3, 0, 0], codeMapping: {...} }
```

### `calculateCombinations(availableVector, nonAvailableVector, codeMapping)`

Calculates all possible option combinations based on available and ordered quantities.

**Parameters:**
- `availableVector` (Array): Array of 6 numbers representing available quantities
- `nonAvailableVector` (Array): Array of 6 numbers representing order quantities
- `codeMapping` (Object): Mapping of position types to their codes

**Returns:**
- `Object`: Calculation results containing:
  - `combinationCountsAvailable`: Count of available combinations by type
  - `combinationDetailsAvailable`: Detailed information about available combinations
  - `combinationCountsNonAvailable`: Count of non-available combinations by type
  - `combinationDetailsNonAvailable`: Detailed information about non-available combinations
  - `remainingVectorFinal`: Remaining quantities after all combinations
  - `codeMapping`: Original code mapping

**Supported Combinations:**
- `1A`: Long Put + Long Stock
- `1B`: Short Call + Long Stock
- `1C`: Long Call + Short Stock
- `1D`: Short Put + Short Stock
- `2A`: Long Put + Short Put
- `2B`: Long Call + Short Call
- `2C`: Short Call + Short Put
- `2D`: Long Call + Long Put

**Example:**
```javascript
const availableVector = [10, 5, 8, 3, 20, 0];
const nonAvailableVector = [5, 2, 4, 1, 10, 0];
const codeMapping = { 'long Call': ['BABA 210205C00055000'], 'short Call': ['BABA 210205C00055000'] };
const result = calculateCombinations(availableVector, nonAvailableVector, codeMapping);
```

### `formatOutput(result)`

Formats the calculation results into a user-friendly structure.

**Parameters:**
- `result` (Object): Result object from `calculateCombinations()`

**Returns:**
- `Object`: Formatted output containing:
  - `available_combinations`: Object with available combination details
  - `non_available_combinations`: Object with non-available combination details
  - `remaining_legs`: Array of remaining single-leg positions

**Example:**
```javascript
const calculationResult = calculateCombinations(availableVector, nonAvailableVector, codeMapping);
const formattedResult = formatOutput(calculationResult);
// Returns formatted object ready for display
```

## Utility Functions

### `getLegTypeIndex(type)`

Converts position type string to its corresponding index in the vector.

**Parameters:**
- `type` (string): Position type (e.g., 'long call', 'short put', 'long stock')

**Returns:**
- `number`: Index (0-5) corresponding to the position type

**Position Type Mapping:**
- 0: 'long call'
- 1: 'short call'
- 2: 'long put'
- 3: 'short put'
- 4: 'long stock'
- 5: 'short stock'

**Example:**
```javascript
const index = getLegTypeIndex('long call'); // Returns 0
const index = getLegTypeIndex('short put'); // Returns 3
```

### `getLegTypeName(index)`

Converts vector index to position type name.

**Parameters:**
- `index` (number): Index (0-5) representing position type

**Returns:**
- `string`: Position type name

**Example:**
```javascript
const type = getLegTypeName(0); // Returns 'long Call'
const type = getLegTypeName(3); // Returns 'short Put'
```

### `isValidCode(code, type)`

Validates option or stock code format.

**Parameters:**
- `code` (string): Code to validate
- `type` (string): Position type to determine validation rules

**Returns:**
- `boolean`: True if code format is valid, false otherwise

**Validation Rules:**
- **Stock codes**: 1-5 uppercase letters (e.g., 'BABA', 'AAPL')
- **Option codes**: Stock code + space + 6 digits + C/P + 8 digits (e.g., 'BABA 210205C00055000')

**Example:**
```javascript
isValidCode('BABA', 'long stock'); // Returns true
isValidCode('BABA 210205C00055000', 'long call'); // Returns true
isValidCode('invalid', 'long call'); // Returns false
```

## UI Functions

### `renderInputs()`

Renders the input form with all current input fields.

**Description:**
Creates HTML elements for each input row, including dropdowns for position types, text inputs for codes, and number inputs for quantities.

**Example:**
```javascript
renderInputs(); // Renders all input fields based on the global 'inputs' array
```

### `handleInputChange(index, field, value)`

Handles changes to input field values.

**Parameters:**
- `index` (number): Index of the input row being modified
- `field` (string): Field name ('type', 'code', 'available', 'order')
- `value` (string|number): New value for the field

**Example:**
```javascript
handleInputChange(0, 'type', 'long call');
handleInputChange(0, 'available', '10');
```

### `addInput()`

Adds a new input row to the form.

**Description:**
Appends a new input object to the global `inputs` array and re-renders the form.

**Example:**
```javascript
addInput(); // Adds a new input row with default values
```

### `handleReset()`

Resets the form to its initial state.

**Description:**
Clears all inputs, hides results, and resets error messages.

**Example:**
```javascript
handleReset(); // Resets the entire form
```

### `handleSubmit()`

Processes the form submission and calculates results.

**Description:**
Validates all inputs, performs calculations, and displays results.

**Example:**
```javascript
handleSubmit(); // Validates and calculates combinations
```

### `renderResult(result)`

Renders the calculation results in HTML tables.

**Parameters:**
- `result` (Object): Formatted result object from `formatOutput()`

**Description:**
Creates HTML tables showing available combinations, non-available combinations, and remaining legs.

**Example:**
```javascript
const formattedResult = formatOutput(calculationResult);
renderResult(formattedResult);
```

## Data Structures

### Input Object
```javascript
{
  type: string,      // Position type: 'long call', 'short call', 'long put', 'short put', 'long stock', 'short stock'
  code: string,      // Option or stock code
  available: number, // Available quantity (non-negative)
  order: number,     // Order quantity (non-negative)
  error?: string     // Error message (optional)
}
```

### Combination Vector
```javascript
[longCall, shortCall, longPut, shortPut, longStock, shortStock]
```

### Result Object
```javascript
{
  available_combinations: {
    [combinationType]: {
      count: number,
      details: Array<{type: string, code: string}>
    }
  },
  non_available_combinations: {
    [combinationType]: {
      count: number,
      details: Array<{type: string, code: string}>
    }
  },
  remaining_legs: Array<{
    type: string,
    count: number,
    code: string
  }>
}
```

## Usage Examples

### Basic Usage

1. **Initialize the application:**
```javascript
// The application automatically initializes with one input row
renderInputs();
```

2. **Add multiple positions:**
```javascript
// Add a long call position
handleInputChange(0, 'type', 'long call');
handleInputChange(0, 'code', 'BABA 210205C00055000');
handleInputChange(0, 'available', '10');
handleInputChange(0, 'order', '5');

// Add a short put position
addInput();
handleInputChange(1, 'type', 'short put');
handleInputChange(1, 'code', 'BABA 210205P00055000');
handleInputChange(1, 'available', '8');
handleInputChange(1, 'order', '3');
```

3. **Calculate combinations:**
```javascript
handleSubmit();
```

### Advanced Usage

**Programmatic calculation:**
```javascript
// Create input data
const userData = [
  { type: 'long call', code: 'BABA 210205C00055000', available: 10, order: 5 },
  { type: 'short put', code: 'BABA 210205P00055000', available: 8, order: 3 },
  { type: 'long stock', code: 'BABA', available: 20, order: 10 }
];

// Parse and calculate
const { availableVector, nonAvailableVector, codeMapping } = parseUserInput(userData);
const calculatedResult = calculateCombinations(availableVector, nonAvailableVector, codeMapping);
const formattedResult = formatOutput(calculatedResult);

// Display results
renderResult(formattedResult);
```

## Error Handling

### Input Validation

The application includes comprehensive input validation:

1. **Code Format Validation:**
   - Stock codes must be 1-5 uppercase letters
   - Option codes must follow the pattern: `STOCKCODE YYMMDD[CP]XXXXXXXX`

2. **Quantity Validation:**
   - All quantities must be non-negative numbers
   - Empty quantities are treated as 0

3. **Error Display:**
   - Validation errors are displayed inline with each input row
   - General errors are shown in the error container

### Error Recovery

- Use `handleReset()` to clear all errors and start over
- Individual input errors can be corrected by modifying the specific field
- The application prevents submission until all validation errors are resolved

## Browser Compatibility

This application is compatible with all modern browsers that support:
- ES6+ JavaScript features
- CSS Flexbox
- HTML5 form elements

## Performance Considerations

- The combination calculation algorithm has O(n) complexity where n is the number of combination types
- Large numbers of input rows may impact rendering performance
- Consider limiting input rows to reasonable numbers (e.g., < 50) for optimal performance

## Security Notes

- This is a client-side application with no server communication
- All calculations are performed locally in the browser
- No sensitive data is transmitted or stored externally
- Input validation is performed client-side for user experience