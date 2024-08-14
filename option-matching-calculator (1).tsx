import React, { useState } from 'react';

// 辅助函数：获取腿类型索引
const getLegTypeIndex = (type) => {
  const types = ['long call', 'short call', 'long put', 'short put', 'long stock', 'short stock'];
  return types.indexOf(type);
};

// 辅助函数：获取腿类型名称
const getLegTypeName = (index) => {
  const types = ['long Call', 'short Call', 'long Put', 'short Put', 'long Stock', 'short Stock'];
  return types[index];
};

// 验证代码格式
const isValidCode = (code, type) => {
  if (type.includes('stock')) {
    // 股票代码格式: 1-5个大写字母
    return /^[A-Z]{1,5}$/.test(code);
  } else {
    // 期权代码格式: 股票代码(空格)日期C/P行权价
    return /^[A-Z]{1,5}\s\d{6}[CP]\d{8}$/.test(code);
  }
};

const OptionMatchingCalculator = () => {
  const initialInput = { type: 'long call', code: '', available: '', order: '' };
  
  const [inputs, setInputs] = useState([initialInput]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (index, field, value) => {
    const newInputs = [...inputs];
    if (field === 'available' || field === 'order') {
      value = value === '' ? '' : Number(value);
    }
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const handleAddInput = () => {
    setInputs([...inputs, { ...initialInput }]);
  };

  const parseUserInput = (userData) => {
    const availableVector = new Array(6).fill(0);
    const nonAvailableVector = new Array(6).fill(0);
    const codeMapping = {
      'long Call': [], 'short Call': [], 'long Put': [], 'short Put': [], 'long Stock': [], 'short Stock': []
    };

    userData.forEach(item => {
      const index = getLegTypeIndex(item.type);
      availableVector[index] += Number(item.available) || 0;
      nonAvailableVector[index] += Number(item.order) || 0;
      if (item.code) {
        codeMapping[getLegTypeName(index)].push(item.code);
      }
    });

    return { availableVector, nonAvailableVector, codeMapping };
  };

  const calculateCombinations = (availableVector, nonAvailableVector, codeMapping) => {
    const totalVector = availableVector.map((v, i) => v + nonAvailableVector[i]);

    const targetVectors = {
      '1B': [0, 1, 0, 0, 1, 0], '1D': [0, 0, 0, 1, 0, 1],
      '1A': [0, 0, 1, 0, 1, 0], '1C': [1, 0, 0, 0, 0, 1],
      '2B': [1, 1, 0, 0, 0, 0], '2A': [0, 0, 1, 1, 0, 0],
      '2C': [0, 1, 0, 1, 0, 0], '2D': [1, 0, 1, 0, 0, 0]
    };

    const calculateCombinationCounts = (vector) => {
      const counts = {};
      const details = {};
      const remainingVector = [...vector];

      for (const [comb, targetVector] of Object.entries(targetVectors)) {
        const minRatio = Math.min(...targetVector.map((t, i) => t > 0 ? remainingVector[i] / t : Infinity));
        const count = Math.floor(minRatio);
        counts[comb] = count;
        for (let i = 0; i < 6; i++) {
          remainingVector[i] -= count * targetVector[i];
        }

        details[comb] = {
          available: count,
          details: targetVector.map((t, i) => t > 0 ? {
            type: getLegTypeName(i),
            code: codeMapping[getLegTypeName(i)][0] || 'N/A'
          } : null).filter(Boolean)
        };
      }

      return { counts, details, remainingVector };
    };

    const totalResult = calculateCombinationCounts(totalVector);
    const availableResult = calculateCombinationCounts(availableVector);

    const nonAvailableCounts = {};
    for (const comb in totalResult.counts) {
      nonAvailableCounts[comb] = totalResult.counts[comb] - availableResult.counts[comb];
    }

    return {
      combinationCountsAvailable: availableResult.counts,
      combinationDetailsAvailable: availableResult.details,
      combinationCountsNonAvailable: nonAvailableCounts,
      combinationDetailsNonAvailable: totalResult.details,
      remainingVectorFinal: totalResult.remainingVector,
      codeMapping
    };
  };

  const formatOutput = (result) => {
    const { 
      combinationCountsAvailable, 
      combinationDetailsAvailable, 
      combinationCountsNonAvailable, 
      combinationDetailsNonAvailable, 
      remainingVectorFinal, 
      codeMapping 
    } = result;

    const output = {
      available_combinations: {},
      non_available_combinations: {},
      remaining_legs: []
    };

    for (const comb in combinationCountsAvailable) {
      if (combinationCountsAvailable[comb] > 0) {
        output.available_combinations[comb] = {
          count: combinationCountsAvailable[comb],
          details: combinationDetailsAvailable[comb].details
        };
      }
    }

    for (const comb in combinationCountsNonAvailable) {
      if (combinationCountsNonAvailable[comb] > 0) {
        output.non_available_combinations[comb] = {
          count: combinationCountsNonAvailable[comb],
          details: combinationDetailsNonAvailable[comb].details
        };
      }
    }

    remainingVectorFinal.forEach((count, i) => {
      if (count > 0) {
        output.remaining_legs.push({
          type: getLegTypeName(i),
          count: count,
          code: codeMapping[getLegTypeName(i)][0] || 'N/A'
        });
      }
    });

    return output;
  };

  const handleSubmit = () => {
    let hasError = false;
    const newInputs = inputs.map(input => {
      if (input.code && !isValidCode(input.code, input.type)) {
        hasError = true;
        return { ...input, error: `无效的${input.type.includes('stock') ? '股票' : '期权'}代码格式。` };
      }
      return { ...input, error: '' };
    });

    if (hasError) {
      setInputs(newInputs);
      setError('请修正所有无效的代码格式后再提交。');
      return;
    }

    setError('');
    const { availableVector, nonAvailableVector, codeMapping } = parseUserInput(inputs);
    const calculatedResult = calculateCombinations(availableVector, nonAvailableVector, codeMapping);
    const formattedResult = formatOutput(calculatedResult);
    setResult(formattedResult);
  };

  const handleReset = () => {
    setInputs([{ ...initialInput }]);
    setResult(null);
    setError('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h2>用户输入</h2>
        {inputs.map((input, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <select
              value={input.type}
              onChange={(e) => handleInputChange(index, 'type', e.target.value)}
              style={{ marginRight: '10px', padding: '5px' }}
            >
              <option value="long call">Long Call</option>
              <option value="short call">Short Call</option>
              <option value="long put">Long Put</option>
              <option value="short put">Short Put</option>
              <option value="long stock">Long Stock</option>
              <option value="short stock">Short Stock</option>
            </select>
            <input
              type="text"
              placeholder={input.type.includes('stock') ? "股票代码 (如: BABA)" : "期权代码 (如: BABA 210205C00055000)"}
              value={input.code}
              onChange={(e) => handleInputChange(index, 'code', e.target.value)}
              style={{ marginRight: '10px', padding: '5px', width: '200px' }}
            />
            <input
              type="text"
              placeholder="可用数量"
              value={input.available}
              onChange={(e) => handleInputChange(index, 'available', e.target.value)}
              style={{ marginRight: '10px', padding: '5px', width: '80px' }}
            />
            <input
              type="text"
              placeholder="订单数量"
              value={input.order}
              onChange={(e) => handleInputChange(index, 'order', e.target.value)}
              style={{ marginRight: '10px', padding: '5px', width: '80px' }}
            />
            {input.error && <div style={{ color: 'red' }}>{input.error}</div>}
          </div>
        ))}
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <button onClick={handleAddInput} style={{ marginRight: '10px', padding: '5px 10px' }}>添加输入</button>
        <button onClick={handleSubmit} style={{ marginRight: '10px', padding: '5px 10px' }}>计算</button>
        <button onClick={handleReset} style={{ padding: '5px 10px' }}>重置</button>
      </div>

      {result && (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h2>结果输出</h2>
          <h3>可用组合</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>组合</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>数量</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>详情</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(result.available_combinations).map(([key, value]) => (
                <tr key={key}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{key}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{value.count}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {value.details.map((detail, index) => (
                      <div key={index}>{detail.type}: {detail.code}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>非可用组合</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>组合</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>数量</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>详情</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(result.non_available_combinations).map(([key, value]) => (
                <tr key={key}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{key}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{value.count}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {value.details.map((detail, index) => (
                      <div key={index}>{detail.type}: {detail.code}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>剩余单腿</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>类型</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>数量</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>代码</th>
              </tr>
            </thead>
            <tbody>
              {result.remaining_legs.map((leg, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{leg.type}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{leg.count}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{leg.code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OptionMatchingCalculator;
