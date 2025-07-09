import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, TrendingUp, TrendingDown, ChevronDown, RefreshCw } from 'lucide-react';

export default function RangeLight() {
  // State for position and prices
  const [currentPrice, setCurrentPrice] = useState(35.77);
  const [minRange, setMinRange] = useState(33.18);
  const [maxRange, setMaxRange] = useState(38.18);
  const [priceHistory, setPriceHistory] = useState([35.77]);
  const [isInRange, setIsInRange] = useState(true);
  const [nearEdgeWarning, setNearEdgeWarning] = useState(false);
  const [selectedToken0, setSelectedToken0] = useState('UFART');
  const [selectedToken1, setSelectedToken1] = useState('HYPE');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [token0Price, setToken0Price] = useState(0);
  const [token1Price, setToken1Price] = useState(0);
  const [trafficLight, setTrafficLight] = useState('green'); // green, yellow, red
  
  // Available tokens with addresses
  const [availableTokens] = useState({
    'HYPE': { symbol: 'HYPE', address: '0x5555555555555555555555555555555555555555', decimals: 18 },
    'LHYPE': { symbol: 'LHYPE', address: '0x5748ae796ae46a4f1348a1693de4b50560485562', decimals: 18 },
    'UBTC': { symbol: 'UBTC', address: '0x9fdbda0a5e284c32744d2f17ee5c74b284993463', decimals: 18 },
    'USOL': { symbol: 'USOL', address: '0x068f321fa8fb9f0d135f290ef6a3e2813e1c8a29', decimals: 18 },
    'UFART': { symbol: 'UFART', address: '0xda3aaae38ee71382ee091c7a4978491f39bf851d', decimals: 18 },
    'USDT': { symbol: 'USDT', address: '0xbf2d3b1a37d54ce86d0e1455884da875a97c87a8', decimals: 18 },
    'USDHL': { symbol: 'USDHL', address: '0xb50A96253aBDF803D85efcDce07Ad8becBc52BD5', decimals: 18 },
    'PIP': { symbol: 'PIP', address: '0x1bee6762f0b522c606dc2ffb106c0bb391b2e309', decimals: 18 },
    'BUDDY': { symbol: 'BUDDY', address: '0x47bb061c0204af921f43dc73c7d7768d2672ddee', decimals: 18 },
    'LIQD': { symbol: 'LIQD', address: '0x1ecd15865d7f8019d546f76d095d9c93cc34edfa', decimals: 18 },
    'KITTEN': { symbol: 'KITTEN', address: '0x618275F8EFE54c2afa87bfB9F210A52F0fF89364', decimals: 18 },
    'feUSD': { symbol: 'feUSD', address: '0x02c6a2fa58cc01a18b8d9e00ea48d65e4df26c70', decimals: 18 },
    'USDe': { symbol: 'USDe', address: '0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34', decimals: 18 },
    'PURR': { symbol: 'PURR', address: '0x9b498c3c8a0b8cd8ba1d9851d40d186f1872b44e', decimals: 18 },
    'USDXL': { symbol: 'USDXL', address: '0xca79db4b49f608ef54a5cb813fbed3a6387bc645', decimals: 18 },
    'WHLP': { symbol: 'WHLP', address: '0x1359b05241ca5076c9f59605214f4f84114c0de8', decimals: 18 },
    'HFUN': { symbol: 'HFUN', address: '0xa320d9f65ec992eff38622c63627856382db726c', decimals: 18 },
    'RUB': { symbol: 'RUB', address: '0x7dcffcb06b40344eeced2d1cbf096b299fe4b405', decimals: 18 },
    'UETH': { symbol: 'UETH', address: '0xbe6727b535545c67d5caa73dea54865b92cf7907', decimals: 18 },
    'MHYPE': { symbol: 'MHYPE', address: '0xdabb040c428436d41cecd0fb06bcfdbaad3a9aa8', decimals: 18 },
    'WHYPE': { symbol: 'WHYPE', address: '0x5555555555555555555555555555555555555555', decimals: 18 } // Note: Same as HYPE
  });

  // DEX links configuration
  const [dexLinks] = useState([
    { name: 'Kittenswap', url: 'https://app.kittenswap.finance/', logo: '🐱' },
    { name: 'Hyperswap', url: 'https://app.hyperswap.exchange/#/swap?referral=Freak', logo: '⚡' },
    { name: 'HybraFinance', url: 'https://www.hybra.finance?code=SVGRAT', logo: '🐉' },
    { name: 'GLIQUID', url: 'https://www.gliquid.xyz?referral=fUO91jHL', logo: '💧' },
    { name: 'Laminar', url: 'https://laminar.xyz/explore/pools', logo: '🌀' }
  ]);

  // Price feed configuration
  const [priceConfig] = useState({
    // Your price feed endpoint (UPDATE THIS with your actual endpoint)
    priceFeedUrl: 'https://your-price-api.com/prices',
    // Backup: RPC endpoint for fallback
    rpcUrl: 'https://evmrpc-eu.hyperpc.app/cdbd4d94ff1b4cde839f8fa59126e200',
    // Price update interval (ms)
    updateInterval: 2000
  });

  // Function to fetch token prices from price feed
  const fetchTokenPrices = async () => {
    try {
      setLoading(true);
      const token0Data = availableTokens[selectedToken0];
      const token1Data = availableTokens[selectedToken1];
      
      // Option 1: Fetch from price API (preferred)
      try {
        const response = await fetch(`${priceConfig.priceFeedUrl}?tokens=${token0Data.address},${token1Data.address}`);
        const data = await response.json();
        
        // Example response format - adjust based on your API
        const price0 = data[token0Data.address]?.usd || 0;
        const price1 = data[token1Data.address]?.usd || 0;
        
        setToken0Price(price0);
        setToken1Price(price1);
        
        // Calculate ratio (token0/token1)
        if (price1 > 0) {
          const ratio = price0 / price1;
          setCurrentPrice(ratio);
          setPriceHistory(prev => [...prev.slice(-50), ratio]);
        }
        
        setConnectionStatus('connected');
      } catch (apiError) {
        console.error('API fetch failed, using simulation:', apiError);
        
        // Fallback: Simulate price movement (replace with actual backup method)
        const change = (Math.random() - 0.5) * 0.02;
        const newPrice = currentPrice * (1 + change);
        setCurrentPrice(newPrice);
        setPriceHistory(prev => [...prev.slice(-50), newPrice]);
        
        setConnectionStatus('degraded');
      }
    } catch (error) {
      console.error('Price fetch error:', error);
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Price update loop
  useEffect(() => {
    // Initial fetch
    fetchTokenPrices();
    
    // Set up interval
    const interval = setInterval(fetchTokenPrices, priceConfig.updateInterval);
    
    return () => clearInterval(interval);
  }, [selectedToken0, selectedToken1]);

  // Check if in range with dynamic sensitivity
  useEffect(() => {
    const inRange = currentPrice >= minRange && currentPrice <= maxRange;
    setIsInRange(inRange);
    
    // Dynamic sensitivity based on range width - INCREASED SENSITIVITY
    const rangeWidth = maxRange - minRange;
    const rangePercent = rangeWidth / currentPrice;
    
    // Increased yellow zone sensitivity
    // Tight range (< 10% width): 10% buffer (was 5%)
    // Medium range (10-20% width): 15% buffer (was 8%)
    // Wide range (> 20% width): 20% buffer (was 12%)
    let bufferPercent;
    if (rangePercent < 0.1) {
      bufferPercent = 0.10; // 10% for tight ranges
    } else if (rangePercent < 0.2) {
      bufferPercent = 0.15; // 15% for medium ranges
    } else {
      bufferPercent = 0.20; // 20% for wide ranges
    }
    
    const rangeBuffer = rangeWidth * bufferPercent;
    const nearEdge = currentPrice <= minRange + rangeBuffer || currentPrice >= maxRange - rangeBuffer;
    setNearEdgeWarning(nearEdge && inRange);
    
    // Set traffic light state
    if (!inRange) {
      setTrafficLight('red');
    } else if (nearEdge) {
      setTrafficLight('yellow');
    } else {
      setTrafficLight('green');
    }
  }, [currentPrice, minRange, maxRange]);

  // Calculate position percentage
  const positionPercentage = ((currentPrice - minRange) / (maxRange - minRange)) * 100;

  // Price change percentage
  const priceChange = priceHistory.length > 1 
    ? ((currentPrice - priceHistory[0]) / priceHistory[0]) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gray-900 p-2 sm:p-4">
      {/* DEX Links Bar */}
      <div className="max-w-4xl mx-auto mb-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <a 
          href="https://app.hypurr.fi/buddies/FREAK"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-green-400 transition-colors flex items-center gap-1"
        >
          Powered by HypurrFi 🐾
        </a>
        <div className="flex items-center gap-1 sm:gap-3 flex-wrap justify-center">
          <span className="text-xs text-gray-500 hidden sm:inline mr-2">Trade on:</span>
          {dexLinks.map((dex) => (
            <a
              key={dex.name}
              href={dex.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1 px-1.5 sm:px-2 py-1 bg-gray-800 rounded-lg border border-gray-700 hover:border-green-500 transition-all hover:scale-105"
              title={dex.name}
            >
              <span className="text-sm">{dex.logo}</span>
              <span className="text-xs text-gray-400 group-hover:text-green-400 hidden sm:inline">{dex.name}</span>
            </a>
          ))}
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {/* Header with Pair Selector */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              {/* Traffic Light */}
              <div className="flex flex-col items-center gap-1 bg-gray-900 p-2 sm:p-3 rounded-lg">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all duration-300 ${
                  trafficLight === 'red' ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-gray-700'
                }`} />
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all duration-300 ${
                  trafficLight === 'yellow' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 'bg-gray-700'
                }`} />
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all duration-300 ${
                  trafficLight === 'green' ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-700'
                }`} />
              </div>
              
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  RangeLight 🚦
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm">Real-time LP position monitor</p>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-4">
                <div className="relative flex-1 sm:flex-initial">
                  <select
                    value={selectedToken0}
                    onChange={(e) => setSelectedToken0(e.target.value)}
                    className="appearance-none bg-gray-900 text-white px-2 sm:px-3 py-2 pr-8 rounded-lg border border-gray-700 focus:outline-none focus:border-green-500 font-semibold text-sm w-full"
                  >
                    {Object.keys(availableTokens).map(token => (
                      <option key={token} value={token} disabled={token === selectedToken1}>
                        {token}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                
                <button
                  onClick={() => {
                    const temp = selectedToken0;
                    setSelectedToken0(selectedToken1);
                    setSelectedToken1(temp);
                  }}
                  className="p-1.5 bg-gray-900 rounded-lg border border-gray-700 hover:border-green-500 transition-colors"
                  title="Swap tokens"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
                
                <div className="relative flex-1 sm:flex-initial">
                  <select
                    value={selectedToken1}
                    onChange={(e) => setSelectedToken1(e.target.value)}
                    className="appearance-none bg-gray-900 text-white px-2 sm:px-3 py-2 pr-8 rounded-lg border border-gray-700 focus:outline-none focus:border-green-500 font-semibold text-sm w-full"
                  >
                    {Object.keys(availableTokens).map(token => (
                      <option key={token} value={token} disabled={token === selectedToken0}>
                        {token}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-0 sm:ml-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-400' : 
                  connectionStatus === 'degraded' ? 'bg-yellow-400' :
                  connectionStatus === 'error' ? 'bg-red-400' : 'bg-gray-400'
                }`} />
                <span className="text-xs sm:text-sm text-gray-400">
                  {connectionStatus === 'connected' ? 'Live' : 
                   connectionStatus === 'degraded' ? 'Simulated' :
                   connectionStatus === 'error' ? 'Error' : 'Connecting...'}
                </span>
              </div>
            </div>
            <button
              onClick={fetchTokenPrices}
              className="p-2 bg-gray-900 rounded-lg border border-gray-700 hover:border-green-500 transition-colors self-end sm:self-auto"
            >
              <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          {/* Price Difference Warning - MADE SMALLER */}
          <div className="mb-2 px-2 py-1 bg-yellow-900/20 border border-yellow-600 rounded text-xs">
            <span className="text-yellow-400">
              <strong>Note:</strong> This uses global token prices, not your specific DEX pool price. Actual pool prices may differ due to liquidity and arbitrage. Always verify on your DEX!
            </span>
          </div>
          
          {/* Popular Pairs Quick Select */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">Popular pairs:</p>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {[
                ['USDT', 'HYPE'],
                ['UBTC', 'HYPE'],
                ['UFART', 'HYPE'],
                ['USOL', 'HYPE'],
                ['UETH', 'HYPE']
              ].map(([token0, token1]) => (
                <button
                  key={`${token0}/${token1}`}
                  onClick={() => {
                    setSelectedToken0(token0);
                    setSelectedToken1(token1);
                  }}
                  className={`px-2 sm:px-3 py-1 text-xs rounded-lg border transition-colors ${
                    selectedToken0 === token0 && selectedToken1 === token1
                      ? 'bg-green-900 border-green-500 text-green-400'
                      : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {token0}/{token1}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <div className="bg-gray-900 rounded p-2 sm:p-3">
              <div className="text-xs text-gray-400">{selectedToken0} Price</div>
              <div className="text-sm sm:text-lg font-semibold text-white">
                ${token0Price > 0 ? token0Price.toFixed(6) : '---'}
              </div>
            </div>
            <div className="bg-gray-900 rounded p-2 sm:p-3">
              <div className="text-xs text-gray-400">{selectedToken1} Price</div>
              <div className="text-sm sm:text-lg font-semibold text-white">
                ${token1Price > 0 ? token1Price.toFixed(6) : '---'}
              </div>
            </div>
            <div className="bg-gray-900 rounded p-2 sm:p-3">
              <div className="text-xs text-gray-400">Ratio ({selectedToken0}/{selectedToken1})</div>
              <div className={`text-sm sm:text-lg font-semibold flex items-center gap-1 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {currentPrice.toFixed(4)}
                {priceChange >= 0 ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />}
              </div>
            </div>
            <div className="bg-gray-900 rounded p-2 sm:p-3">
              <div className="text-xs text-gray-400">24h Change</div>
              <div className={`text-sm sm:text-lg font-semibold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        {/* Range Visualization */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-white">Position Range Monitor</h2>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className={`w-3 h-3 rounded-full ${
                trafficLight === 'green' ? 'bg-green-500' : 
                trafficLight === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className={`font-medium ${
                trafficLight === 'green' ? 'text-green-400' : 
                trafficLight === 'yellow' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {trafficLight === 'green' ? 'Safe Zone' : 
                 trafficLight === 'yellow' ? 'Caution Zone' : 'Danger Zone'}
              </span>
            </div>
          </div>
          
          {/* Status Alert */}
          {!isInRange && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg flex items-center gap-2 animate-pulse">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-400 font-medium">🔴 RED LIGHT - Position is OUT OF RANGE! Consider rebalancing.</span>
            </div>
          )}
          
          {nearEdgeWarning && (
            <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-400 font-medium">🟡 YELLOW LIGHT - Approaching range boundary!</span>
            </div>
          )}

          {/* Range Bar */}
          <div className="relative mb-6">
            <div className="h-20 bg-gray-900 rounded-lg relative overflow-hidden">
              {/* In-range area */}
              <div className="absolute inset-y-0 bg-green-900/30 border-x-2 border-green-500"
                style={{
                  left: '0%',
                  right: '0%'
                }}
              />
              
              {/* Current position indicator */}
              <div 
                className={`absolute top-0 bottom-0 w-1 transition-all duration-1000 ${
                  isInRange ? 'bg-green-400' : 'bg-red-400'
                }`}
                style={{
                  left: `${Math.max(0, Math.min(100, positionPercentage))}%`,
                  boxShadow: isInRange 
                    ? '0 0 10px rgba(74, 222, 128, 0.6)' 
                    : '0 0 10px rgba(239, 68, 68, 0.6)'
                }}
              >
                <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                  isInRange ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {currentPrice.toFixed(4)}
                </div>
              </div>
            </div>
            
            {/* Range labels */}
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-400">{minRange.toFixed(4)}</span>
              <span className="text-sm text-gray-400"></span>
              <span className="text-sm text-gray-400"></span>
              <span className="text-sm text-gray-400">{maxRange.toFixed(4)}</span>
            </div>
          </div>

          {/* Range Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Min Range (Ratio)</label>
              <input
                type="number"
                value={minRange}
                onChange={(e) => setMinRange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                step="0.0001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Max Range (Ratio)</label>
              <input
                type="number"
                value={maxRange}
                onChange={(e) => setMaxRange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                step="0.0001"
              />
            </div>
          </div>
          
          {/* Sensitivity Indicator - UPDATED WITH NEW VALUES */}
          <div className="mt-4 text-xs text-gray-400 text-center">
            Range Width: {((maxRange - minRange) / currentPrice * 100).toFixed(1)}% | 
            Yellow Zone: {
              ((maxRange - minRange) / currentPrice * 100) < 10 ? ' 10%' :
              ((maxRange - minRange) / currentPrice * 100) < 20 ? ' 15%' : ' 20%'
            } from edges
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 sm:mt-6 mb-8 grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
            <div className="text-xs sm:text-sm text-gray-400">Position Status</div>
            <div className={`text-sm sm:text-lg font-semibold ${isInRange ? 'text-green-400' : 'text-red-400'}`}>
              {isInRange ? 'IN RANGE' : 'OUT OF RANGE'}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
            <div className="text-xs sm:text-sm text-gray-400">Range Width</div>
            <div className="text-sm sm:text-lg font-semibold text-white">
              {(maxRange - minRange).toFixed(4)}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
            <div className="text-xs sm:text-sm text-gray-400">24h Change</div>
            <div className={`text-sm sm:text-lg font-semibold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
