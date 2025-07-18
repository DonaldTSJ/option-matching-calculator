# Option Matching Calculator

A web-based tool for calculating optimal matching combinations for options and stocks. This application helps traders identify available and non-available option combinations, as well as remaining single-leg positions.

## 🚀 Features

- **Multi-Position Input**: Support for up to 6 different position types (long/short calls, puts, and stocks)
- **Real-time Validation**: Input validation for option and stock codes
- **Comprehensive Calculations**: Identifies 8 different option combination types
- **Visual Results**: Clear tabular display of results with detailed breakdowns
- **Responsive Design**: Works on desktop and mobile devices
- **Client-side Processing**: All calculations performed locally for privacy and speed

## 📋 Supported Position Types

| Position Type | Description | Code Format |
|---------------|-------------|-------------|
| Long Call | Buy call options | `STOCK YYMMDDCXXXXXXXX` |
| Short Call | Sell call options | `STOCK YYMMDDCXXXXXXXX` |
| Long Put | Buy put options | `STOCK YYMMDDPXXXXXXXX` |
| Short Put | Sell put options | `STOCK YYMMDDPXXXXXXXX` |
| Long Stock | Buy stock | `STOCK` |
| Short Stock | Sell stock | `STOCK` |

## 🎯 Supported Combinations

The calculator identifies the following option combinations:

### Type 1 Combinations (Stock + Option)
- **1A**: Long Put + Long Stock
- **1B**: Short Call + Long Stock  
- **1C**: Long Call + Short Stock
- **1D**: Short Put + Short Stock

### Type 2 Combinations (Option + Option)
- **2A**: Long Put + Short Put
- **2B**: Long Call + Short Call
- **2C**: Short Call + Short Put
- **2D**: Long Call + Long Put

## 🛠️ Installation & Usage

### Quick Start

1. **Download**: Clone or download the project files
2. **Open**: Open `index.html` in any modern web browser
3. **Use**: Start adding positions and calculating combinations

### No Dependencies Required

This application is completely self-contained:
- No server setup required
- No external libraries needed
- Works offline
- No installation process

## 📖 Documentation

### [API Documentation](API_DOCUMENTATION.md)
Complete reference for all functions, methods, and data structures:
- Core calculation functions
- Utility functions
- Data structures and formats
- Usage examples and code snippets

### [Component Documentation](COMPONENT_DOCUMENTATION.md)
Detailed information about UI components and user interface:
- Page structure and layout
- CSS styling and responsive design
- Interactive elements and event handling
- Accessibility features

## 🎮 How to Use

### Step 1: Add Positions
1. Select the position type from the dropdown
2. Enter the option or stock code
3. Input available quantity (current holdings)
4. Input order quantity (planned trades)

### Step 2: Add More Positions
- Click "添加输入" (Add Input) to add additional positions
- Repeat for all positions you want to analyze

### Step 3: Calculate
- Click "计算" (Calculate) to process all inputs
- Review validation messages if any errors occur

### Step 4: Review Results
The results show three categories:
- **【全为】组合** (Available Combinations): Combinations where all legs are available
- **【非全为】组合** (Non-Available Combinations): Combinations requiring additional orders
- **剩余单腿** (Remaining Legs): Individual positions that couldn't be matched

## 📝 Code Examples

### Basic Usage
```javascript
// Add a long call position
handleInputChange(0, 'type', 'long call');
handleInputChange(0, 'code', 'BABA 210205C00055000');
handleInputChange(0, 'available', '10');
handleInputChange(0, 'order', '5');

// Calculate combinations
handleSubmit();
```

### Programmatic Calculation
```javascript
const userData = [
  { type: 'long call', code: 'BABA 210205C00055000', available: 10, order: 5 },
  { type: 'short put', code: 'BABA 210205P00055000', available: 8, order: 3 }
];

const { availableVector, nonAvailableVector, codeMapping } = parseUserInput(userData);
const result = calculateCombinations(availableVector, nonAvailableVector, codeMapping);
const formattedResult = formatOutput(result);
```

## 🔧 Code Validation

### Option Code Format
- **Pattern**: `STOCKCODE YYMMDD[CP]XXXXXXXX`
- **Example**: `BABA 210205C00055000`
- **Components**:
  - Stock code: 1-5 uppercase letters
  - Date: 6 digits (YYMMDD)
  - Option type: C (call) or P (put)
  - Strike price: 8 digits

### Stock Code Format
- **Pattern**: 1-5 uppercase letters
- **Examples**: `BABA`, `AAPL`, `TSLA`

### Quantity Validation
- Must be non-negative numbers
- Empty fields are treated as 0
- Decimal values are supported

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 60+ | ✅ Full Support |
| Firefox | 55+ | ✅ Full Support |
| Safari | 12+ | ✅ Full Support |
| Edge | 79+ | ✅ Full Support |

## 🔒 Security & Privacy

- **Client-side Only**: All calculations performed locally
- **No Data Transmission**: No information sent to external servers
- **No Storage**: No data stored locally or remotely
- **Open Source**: Transparent code for security review

## 🚀 Performance

- **Fast Calculations**: O(n) complexity for combination calculations
- **Efficient Rendering**: Optimized DOM updates
- **Memory Efficient**: Minimal memory footprint
- **Scalable**: Handles large numbers of positions efficiently

## 🤝 Contributing

This is a standalone application, but suggestions for improvements are welcome:

1. **Bug Reports**: Document any issues you encounter
2. **Feature Requests**: Suggest new functionality
3. **Code Improvements**: Propose optimizations or enhancements

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For questions or issues:
1. Check the documentation files
2. Review the code examples
3. Test with simple inputs first
4. Ensure browser compatibility

## 🔄 Version History

- **v1.0**: Initial release with core functionality
- Complete option combination calculation
- Real-time input validation
- Responsive web interface
- Comprehensive documentation

---

**Note**: This tool is designed for educational and analytical purposes. Always verify calculations and consult with financial professionals before making trading decisions.