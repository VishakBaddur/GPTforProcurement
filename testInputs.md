# Test Inputs for Procurvv MVP

## ✅ Valid Test Cases

### Office Furniture
```
Input: "I need 100 ergonomic chairs under $120 per unit, delivery within 30 days, 1 year warranty."
Expected: 
- item: "ergonomic chairs"
- quantity: 100
- budget: 120
- deliveryDays: 30
- warranty: "1 year"
- warrantyMonths: 12
```

### Industrial Materials
```
Input: "Procure 200 steel rods, budget $5,000 max, delivery 2 weeks."
Expected:
- item: "steel rods"
- quantity: 200
- budget: 5000
- deliveryDays: 14
```

### Safety Equipment
```
Input: "Looking for 50 packs of personal protective equipment - can we have in 7 days?"
Expected:
- item: "personal protective equipment"
- quantity: 50
- deliveryDays: 7
```

### Electronics
```
Input: "Need 25 laptops under $800 each, 2-year warranty, delivery in 14 days."
Expected:
- item: "laptops"
- quantity: 25
- budget: 800
- deliveryDays: 14
- warranty: "2-year"
- warrantyMonths: 24
```

### Office Supplies
```
Input: "Procure 500 reams of paper, budget under $2,000, delivery within 1 week."
Expected:
- item: "paper"
- quantity: 500
- budget: 2000
- deliveryDays: 7
```

## ❌ Edge Cases & Clarifications

### Missing Quantity
```
Input: "I need office chairs under $100 each."
Expected Response: "I didn't catch the quantity — how many units do you need?"
```

### Missing Budget
```
Input: "Need 50 desks delivered in 2 weeks."
Expected Response: "What's your budget range for this procurement?"
```

### Missing Delivery
```
Input: "Looking for 100 monitors with 2-year warranty."
Expected Response: "When do you need delivery? Please specify the timeframe."
```

### Missing Item
```
Input: "I need 50 units delivered in 2 weeks under $5000."
Expected Response: "I didn't catch what you're looking to procure. Could you specify the item or service you need?"
```

## 🔧 Parser Test Cases

### Quantity Variations
- "100 units" → 100
- "50 pieces" → 50
- "25 pcs" → 25
- "200 items" → 200

### Budget Variations
- "under $100" → 100
- "budget $500" → 500
- "below $1000" → 1000
- "<= $2000" → 2000
- "budget $1000-$2000" → 1000, maxBudget: 2000

### Delivery Variations
- "30 days" → 30
- "2 weeks" → 14
- "1 week" → 7
- "45 days" → 45

### Warranty Variations
- "1 year" → 12 months
- "2 years" → 24 months
- "6 months" → 6 months
- "12 months" → 12 months

## 🎯 Demo Script Sentences

### Primary Demo
```
"I need 100 ergonomic chairs under $120 per unit, delivery within 30 days, 1 year warranty."
```

### Alternative Demos
```
"Procure 200 steel rods, budget $5,000 max, delivery 2 weeks."
"Looking for 50 packs of personal protective equipment - can we have in 7 days?"
"Need 25 laptops under $800 each, 2-year warranty, delivery in 14 days."
```

## 🧪 Automated Testing

### Test Function
```typescript
function testParser() {
  const testCases = [
    {
      input: "I need 100 ergonomic chairs under $120 per unit, delivery within 30 days, 1 year warranty.",
      expected: {
        item: "ergonomic chairs",
        quantity: 100,
        budget: 120,
        deliveryDays: 30,
        warrantyMonths: 12
      }
    },
    // ... more test cases
  ];
  
  testCases.forEach(testCase => {
    const result = parseRequest(testCase.input);
    console.assert(
      JSON.stringify(result) === JSON.stringify(testCase.expected),
      `Failed for input: ${testCase.input}`
    );
  });
}
```

## 📊 Success Metrics

### Parsing Accuracy
- **Target**: 90%+ for demo sentences
- **Measurement**: Manual testing with test cases
- **Fallback**: Clarification questions for failures

### Response Time
- **Target**: <2 seconds for parsing
- **Measurement**: Browser dev tools
- **Optimization**: Caching and optimization

### User Experience
- **Target**: Smooth, intuitive flow
- **Measurement**: User testing
- **Improvement**: Iterative refinement

## 🚀 Production Readiness

### Error Handling
- [ ] Network timeout handling
- [ ] Invalid input graceful degradation
- [ ] User-friendly error messages
- [ ] Fallback to manual input

### Performance
- [ ] Parse time <2 seconds
- [ ] Auction start <5 seconds
- [ ] UI responsiveness <100ms
- [ ] Memory usage optimization

### Accessibility
- [ ] Screen reader compatibility
- [ ] Keyboard navigation
- [ ] Color contrast compliance
- [ ] Focus management

---

**Note**: These test cases should be run regularly to ensure parsing accuracy and user experience quality.
