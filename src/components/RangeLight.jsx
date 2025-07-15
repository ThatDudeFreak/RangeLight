import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function RangeLight() {
  // Pool addresses for direct DEX data (Hyperswap & Hybra)
  const [poolAddresses] = useState({
    // Hyperswap pools
    'WHYPE/USD₮0': '0x3603ffebb994cc110b4186040cac3005b2cf4465',
    'WHYPE/USDHL': '0xf47882f97becd8476ba7b37f737824ca63c7d643',
    'WHYPE/UBTC': '0x43779f5e56720fbd7f99a18ca4b625838bec934c',
    'WHYPE/UETH': '0xa90d4bc085ff2304f786f9f1633f3cd508182aca',
    'LIQD/WHYPE': '0xacf4788f95acb78863edf5703cd57f839514c5d0',
    // Hybra pools
    'UFART/WHYPE': '0x54363f140fd753ffcd64886ae2086e208eec2249',
    'USOL/WHYPE': '0xae738002475bcdebf137c8da218973dea9d5f2de',
    'BUDDY/WHYPE': '0x813f1d0182b4f832449df1f9426930bfea82725b',
    'WHLP/WHYPE': '0x761819512f4b156944606849b1555822b45bdae5',
    'WHYPE/RUB': '0x33a5b9fc5a386cd29868e5f1d19277ad02d119b4',
    'WHYPE/XAUTO': '0x91522dfddb5e5831a889326426373fb894ec37b1',
    'WHYPE/KITTEN': '0xf2cd2e2f7446f308174e4c67e0ab42200d4c00a4',
  });

  // State for position and prices
  const [currentPrice, setCurrentPrice] = useState(0);
  const [minRange, setMinRange] = useState(0);
  const [maxRange, setMaxRange] = useState(0);
  const [priceHistory, setPriceHistory] = useState([]);
  const [isInRange, setIsInRange] = useState(true);
  const [nearEdgeWarning, setNearEdgeWarning] = useState(false);
  const [selectedToken0, setSelectedToken0] = useState('WHLP');
  const [selectedToken1, setSelectedToken1] = useState('WHYPE');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [token0Price, setToken0Price] = useState(0);
  const [token1Price, setToken1Price] = useState(0);
  const [trafficLight, setTrafficLight] = useState('green');
  const [refreshProgress, setRefreshProgress] = useState(0);
  
  const [availableTokens] = useState({
    'HYPE': { symbol: 'HYPE', address: '0x5555555555555555555555555555555555555555', decimals: 18 },
    'LHYPE': { symbol: 'LHYPE', address: '0x5748ae796ae46a4f1348a1693de4b50560485562', decimals: 18 },
    'UBTC': { symbol: 'UBTC', address: '0x9fdbda0a5e284c32744d2f17ee5c74b284993463', decimals: 18 },
    'USOL': { symbol: 'USOL', address: '0x068f321fa8fb9f0d135f290ef6a3e2813e1c8a29', decimals: 18 },
    'UFART': { symbol: 'UFART', address: '0xda3aaae38ee71382ee091c7a4978491f39bf851d', decimals: 18 },
    'USD₮0': { symbol: 'USD₮0', address: '0xbf2d3b1a37d54ce86d0e1455884da875a97c87a8', decimals: 18 },
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
    'WHYPE': { symbol: 'WHYPE', address: '0x5555555555555555555555555555555555555555', decimals: 18 },
    'XAUTO': { symbol: 'XAUTO', address: '0xf4D9235269a96aaDaFc9aDAe454a0618eBE37949', decimals: 18 }
  });

  // DEX links configuration
  const [dexLinks] = useState([
    { name: 'Prj X', url: 'https://www.prjx.com/@FREAK', logo: '❌' },
    { name: 'Kittenswap', url: 'https://app.kittenswap.finance/', logo: '🐱' },
    { name: 'Hyperswap', url: 'https://app.hyperswap.exchange/#/swap?referral=Freak', logo: '⚡' },
    { name: 'HybraFinance', url: 'https://www.hybra.finance?code=SVGRAT', logo: '🐉' },
    { name: 'GLIQUID', url: 'https://www.gliquid.xyz?referral=fUO91jHL', logo: '💧' },
    { name: 'Laminar', url: 'https://laminar.xyz/explore/pools', logo: '🌀' }
  ]);

  // Price feed configuration
  const [priceConfig] = useState({
    priceFeedUrl: 'https://coins.llama.fi/prices/current',
    rpcUrl: 'https://evmrpc-jp.hyperpc.app/6043a2905bbc4765ba3dd43fabe4eec0?apikey=BRExesZrDWsu0LErgac2s6jTpSOa7UeZ',
    updateInterval: 1000 // Update every second for maximum freshness
  });

  // Check if current pair has a pool (check both directions)
  const currentPoolKey = `${selectedToken0}/${selectedToken1}`;
  const reversePoolKey = `${selectedToken1}/${selectedToken0}`;
  const hasPool = poolAddresses.hasOwnProperty(currentPoolKey) || poolAddresses.hasOwnProperty(reversePoolKey);
  const actualPoolKey = poolAddresses.hasOwnProperty(currentPoolKey) ? currentPoolKey : reversePoolKey;

  // Function to set aggressive 2% range
  const setAggressiveRange = (price) => {
    const rangePercent = 0.02; // 2%
    const newMin = price * (1 - rangePercent);
    const newMax = price * (1 + rangePercent);
    setMinRange(newMin);
    setMaxRange(newMax);
    console.log(`Setting range for price ${price}: ${newMin} - ${newMax}`);
  };

  // Function to fetch token prices from DeFiLlama
  const fetchTokenPrices = async () => {
    try {
      setLoading(true);
      const token0Data = availableTokens[selectedToken0];
      const token1Data = availableTokens[selectedToken1];
      
      if (!token0Data || !token1Data) {
        console.error('Token data not found');
        return;
      }
      
      const tokens = [
        `hyperliquid:${token0Data.address.toLowerCase()}`,
        `hyperliquid:${token1Data.address.toLowerCase()}`
      ].join(',');
      
      const response = await fetch(`${priceConfig.priceFeedUrl}/${tokens}`);
      const data = await response.json();
      
      const token0Key = `hyperliquid:${token0Data.address.toLowerCase()}`;
      const token1Key = `hyperliquid:${token1Data.address.toLowerCase()}`;
      
      let price0 = data.coins?.[token0Key]?.price || 0;
      let price1 = data.coins?.[token1Key]?.price || 0;
      
      // Special handling for USD₮0 - always $1
      if (selectedToken0 === 'USD₮0') price0 = 1;
      if (selectedToken1 === 'USD₮0') price1 = 1;
      
      setToken0Price(price0);
      setToken1Price(price1);
      
      if (price1 > 0) {
        const ratio = price0 / price1;
        setCurrentPrice(ratio);
        setPriceHistory(prev => {
          const newHistory = [...prev, ratio];
          // Keep only last 50 entries
          return newHistory.slice(-50);
        });
        setConnectionStatus('connected');
        
        // Set aggressive range if this is the first price or range not set
        if ((minRange === 0 || maxRange === 0) && ratio > 0) {
          setAggressiveRange(ratio);
        }
      } else {
        console.error('Unable to calculate ratio - token prices not available');
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Price fetch error:', error);
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Reset price history and set aggressive range when pair changes
  useEffect(() => {
    // Clear price history
    setPriceHistory([]);
    setCurrentPrice(0);
    // Clear range - will be set when price is fetched
    setMinRange(0);
    setMaxRange(0);
    // Reset connection status
    setConnectionStatus('disconnected');
  }, [selectedToken0, selectedToken1]);

  // Price update loop with refresh animation
  useEffect(() => {
    let isMounted = true;
    
    // Initial fetch
    const fetchData = async () => {
      if (isMounted) {
        await fetchTokenPrices();
      }
    };
    
    fetchData();
    
    // Set up interval with progress animation
    const interval = setInterval(() => {
      fetchData();
    }, priceConfig.updateInterval);
    
    // Update refresh progress
    const progressInterval = setInterval(() => {
      setRefreshProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + (100 / (priceConfig.updateInterval / 50)); // Complete in updateInterval ms
      });
    }, 50);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [selectedToken0, selectedToken1]);

  // Check if in range with dynamic sensitivity
  useEffect(() => {
    // Only check range if we have valid values
    if (currentPrice > 0 && minRange > 0 && maxRange > 0 && minRange < maxRange) {
      const inRange = currentPrice >= minRange && currentPrice <= maxRange;
      setIsInRange(inRange);
      
      console.log(`Range check: ${currentPrice} in [${minRange}, ${maxRange}] = ${inRange}`);
      
      const rangeWidth = maxRange - minRange;
      const rangePercent = rangeWidth / currentPrice;
      
      let bufferPercent;
      if (rangePercent < 0.1) {
        bufferPercent = 0.10;
      } else if (rangePercent < 0.2) {
        bufferPercent = 0.15;
      } else {
        bufferPercent = 0.20;
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
    }
  }, [currentPrice, minRange, maxRange]);

  // Calculate position percentage
  const positionPercentage = (maxRange - minRange) > 0 
    ? ((currentPrice - minRange) / (maxRange - minRange)) * 100
    : 50; // Default to center if range is invalid

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
                  currentPrice > 0 && minRange > 0 && maxRange > 0 && trafficLight === 'red' ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-gray-700'
                }`} />
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all duration-300 ${
                  currentPrice > 0 && minRange > 0 && maxRange > 0 && trafficLight === 'yellow' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 'bg-gray-700'
                }`} />
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all duration-300 ${
                  currentPrice > 0 && minRange > 0 && maxRange > 0 && trafficLight === 'green' ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-700'
                }`} />
              </div>
              
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  RangeLight 🚦 <span className="text-xs text-gray-500 font-normal">Beta v1.0</span>
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm">Real-time LP position monitor</p>
              </div>
              
              {/* Current Pair Display */}
              <div className="flex items-center gap-2 sm:ml-4 bg-gray-900 px-3 py-2 rounded-lg border border-gray-700">
                <span className="text-sm font-semibold text-white">
                  {selectedToken0}/{selectedToken1}
                </span>
              </div>
              
              <div className="flex items-center gap-2 ml-0 sm:ml-2">
                {/* Refresh Progress Circle */}
                <div className="relative w-6 h-6">
                  <svg className="w-6 h-6 -rotate-90 transform">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-gray-700"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-green-400"
                      strokeDasharray={`${2 * Math.PI * 10}`}
                      strokeDashoffset={`${2 * Math.PI * 10 * (1 - refreshProgress / 100)}`}
                      style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                    />
                  </svg>
                  {refreshProgress >= 99 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RefreshCw className="w-3 h-3 text-green-400 animate-pulse" />
                    </div>
                  )}
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-400' : 
                  connectionStatus === 'error' ? 'bg-red-400' : 'bg-gray-400'
                }`} />
                <span className="text-xs sm:text-sm text-gray-400">
                  {connectionStatus === 'connected' ? 'Live' : 
                   connectionStatus === 'error' ? 'Error' : 'Connecting...'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 self-end sm:self-auto">
              <button
                onClick={() => {
                  setAggressiveRange(currentPrice);
                  fetchTokenPrices();
                }}
                className="p-2 bg-gray-900 rounded-lg border border-gray-700 hover:border-green-500 transition-colors"
                title="Reset to 2% range"
              >
                <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Loading Overlay */}
          {loading && currentPrice === 0 && (
            <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500 rounded-lg flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="text-blue-400 font-medium">Loading price data...</span>
            </div>
          )}
          
          {/* Available Pools - Primary Selection */}
          <div className="mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
            <p className="text-sm font-semibold text-white mb-3">Select Trading Pair ({Object.keys(poolAddresses).length} pools available)</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(poolAddresses).map(poolPair => {
                const [token0, token1] = poolPair.split('/');
                return (
                  <button
                    key={poolPair}
                    onClick={() => {
                      setSelectedToken0(token0);
                      setSelectedToken1(token1);
                      // Clear any stale range values
                      setMinRange(0);
                      setMaxRange(0);
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                      selectedToken0 === token0 && selectedToken1 === token1
                        ? 'bg-green-900 border-green-500 text-green-400 shadow-lg shadow-green-500/20'
                        : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                    }`}
                  >
                    {poolPair}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-gray-900 rounded p-2 sm:p-3">
              <div className="text-xs text-gray-400">{selectedToken0} Price</div>
              <div className="text-sm sm:text-lg font-semibold text-white">
                ${token0Price > 0 ? (token0Price < 0.01 ? token0Price.toFixed(8) : token0Price < 1 ? token0Price.toFixed(6) : token0Price.toFixed(4)) : '---'}
              </div>
            </div>
            <div className="bg-gray-900 rounded p-2 sm:p-3">
              <div className="text-xs text-gray-400">{selectedToken1} Price</div>
              <div className="text-sm sm:text-lg font-semibold text-white">
                ${token1Price > 0 ? (token1Price < 0.01 ? token1Price.toFixed(8) : token1Price < 1 ? token1Price.toFixed(6) : token1Price.toFixed(4)) : '---'}
              </div>
            </div>
            <div className="bg-gray-900 rounded p-2 sm:p-3">
              <div className="text-xs text-gray-400">Ratio ({selectedToken0}/{selectedToken1})</div>
              <div className="text-sm sm:text-lg font-semibold text-white">
                {currentPrice > 0 ? (
                  currentPrice < 0.0001 ? currentPrice.toFixed(8) : currentPrice < 0.01 ? currentPrice.toFixed(6) : currentPrice.toFixed(4)
                ) : (
                  <span className="text-gray-500">---</span>
                )}
              </div>
              {hasPool && (
                <div className="text-xs text-gray-500 mt-1">Pool: {poolAddresses[actualPoolKey].slice(0, 6)}...{poolAddresses[actualPoolKey].slice(-4)}</div>
              )}
            </div>
          </div>
        </div>

        {/* Range Visualization */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-white">Position Range Monitor</h2>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className={`w-3 h-3 rounded-full ${
                currentPrice > 0 && minRange > 0 && maxRange > 0 ? (
                  trafficLight === 'green' ? 'bg-green-500' : 
                  trafficLight === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                ) : 'bg-gray-500'
              }`} />
              <span className={`font-medium ${
                currentPrice > 0 && minRange > 0 && maxRange > 0 ? (
                  trafficLight === 'green' ? 'text-green-400' : 
                  trafficLight === 'yellow' ? 'text-yellow-400' : 'text-red-400'
                ) : 'text-gray-400'
              }`}>
                {currentPrice > 0 && minRange > 0 && maxRange > 0 ? (
                  trafficLight === 'green' ? 'Safe Zone' : 
                  trafficLight === 'yellow' ? 'Caution Zone' : 'Danger Zone'
                ) : 'Loading...'}
              </span>
            </div>
          </div>
          
          {/* Status Alert */}
          {!isInRange && currentPrice > 0 && minRange > 0 && maxRange > 0 && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg flex items-center gap-2 animate-pulse">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-400 font-medium">🔴 RED LIGHT - Position is OUT OF RANGE! Consider rebalancing.</span>
            </div>
          )}
          
          {nearEdgeWarning && currentPrice > 0 && minRange > 0 && maxRange > 0 && (
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
              {currentPrice > 0 && minRange > 0 && maxRange > 0 && (
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
                    {currentPrice < 0.0001 ? currentPrice.toFixed(8) : currentPrice < 0.01 ? currentPrice.toFixed(6) : currentPrice.toFixed(4)}
                  </div>
                </div>
              )}
            </div>
            
            {/* Range labels */}
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-400">
                {minRange > 0 ? (minRange < 0.0001 ? minRange.toFixed(8) : minRange < 0.01 ? minRange.toFixed(6) : minRange.toFixed(4)) : '---'}
              </span>
              <span className="text-sm text-gray-400">MIN</span>
              <span className="text-sm text-gray-400">MAX</span>
              <span className="text-sm text-gray-400">
                {maxRange > 0 ? (maxRange < 0.0001 ? maxRange.toFixed(8) : maxRange < 0.01 ? maxRange.toFixed(6) : maxRange.toFixed(4)) : '---'}
              </span>
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
                step="0.00000001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Max Range (Ratio)</label>
              <input
                type="number"
                value={maxRange}
                onChange={(e) => setMaxRange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                step="0.00000001"
              />
            </div>
          </div>
          
          {/* Sensitivity Indicator */}
          <div className="mt-4 text-xs text-gray-400 text-center">
            Range Width: {minRange > 0 && maxRange > 0 ? ((maxRange - minRange) / currentPrice * 100).toFixed(1) : '0'}% | 
            Yellow Zone: {
              minRange > 0 && maxRange > 0 && currentPrice > 0 ? (
                ((maxRange - minRange) / currentPrice * 100) < 10 ? ' 10%' :
                ((maxRange - minRange) / currentPrice * 100) < 20 ? ' 15%' : ' 20%'
              ) : ' ---'
            } from edges
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 sm:mt-6 mb-4 grid grid-cols-2 gap-2 sm:gap-4">
          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
            <div className="text-xs sm:text-sm text-gray-400">Position Status</div>
            <div className={`text-sm sm:text-lg font-semibold ${isInRange ? 'text-green-400' : 'text-red-400'}`}>
              {currentPrice > 0 && minRange > 0 && maxRange > 0 ? (
                isInRange ? 'IN RANGE' : 'OUT OF RANGE'
              ) : (
                <span className="text-gray-500">LOADING...</span>
              )}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
            <div className="text-xs sm:text-sm text-gray-400">Range Width</div>
            <div className="text-sm sm:text-lg font-semibold text-white">
              {minRange > 0 && maxRange > 0 ? (
                (maxRange - minRange) < 0.0001 ? (maxRange - minRange).toFixed(8) : 
                (maxRange - minRange) < 0.01 ? (maxRange - minRange).toFixed(6) : 
                (maxRange - minRange).toFixed(4)
              ) : '---'}
            </div>
          </div>
        </div>
        
        {/* Info Notes */}
        <div className="space-y-2 mb-4">
          <div className="px-2 py-1 bg-yellow-900/20 border border-yellow-600 rounded text-xs">
            <span className="text-yellow-400">
              <strong>Note:</strong> Prices via DeFiLlama API. Your specific DEX pool price may differ due to liquidity and arbitrage. Always verify on your DEX!
            </span>
          </div>
          
          <div className="px-2 py-1 bg-blue-900/20 border border-blue-600 rounded text-xs">
            <span className="text-blue-400">
              <strong>Auto-Range:</strong> Automatically sets 2% aggressive range when switching pairs. Click refresh to reset range to current price ±2%.
            </span>
          </div>
        </div>
        
        {/* Contact Footer */}
        <div className="text-center pb-4">
          <p className="text-xs text-gray-500">
            DM <a href="https://x.com/ThatNFTGawd" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 underline">@ThatNFTGawd</a> on X with suggestions, bugs, or if you want a trading pair added
          </p>
        </div>
      </div>
    </div>
  );
}
