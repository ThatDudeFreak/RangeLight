// Get available token pairs based on existing pools
  const getAvailableTokensForPair = (selectedToken) => {
    const availablePairs = [];
    
    // Check all pool combinations
    Object.keys(poolAddresses).forEach(poolPair => {
      const [token0, token1] = poolPair.split('/');
      
      if (token0 === selectedToken) {
        availablePairs.push(token1);
      } else if (token1 === selectedToken) {
        availablePairs.push(token0);
      }
    });
    
    return availablePairs;
  };
  
  // Get all tokens that have pools
  const getTokensWithPools = () => {
    const tokensSet = new Set();
    
    Object.keys(poolAddresses).forEach(poolPair => {
      const [token0, token1] = poolPair.split('/');
      tokensSet.add(token0);
      tokensSet.add(token1);
    });
    
    return Array.from(tokensSet);
  };
  
  const tokensWithPools = getTokensWithPools();
  const availableForToken0 = selectedToken1 ? getAvailableTokensForPair(selectedToken1) : tokensWithPools;
  const availableForToken1 = selectedToken0 ? getAvailableTokensForPair(selectedToken0) : tokensWithPools;
  
  // Check if current pair has a pool (check both directions)
  const currentPoolKey = `${selectedToken0}/${selectedToken1}`;
  const reversePoolKey = `${selectedToken1}/${selectedToken0}`;
  const hasPool = poolAddresses.hasOwnProperty(currentPoolKey) || poolAddresses.hasOwnProperty(reversePoolKey);
  const actualPoolKey = poolAddresses.hasOwnProperty(currentPoolKey) ? currentPoolKey : reversePoolKey;import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, TrendingUp, TrendingDown, ChevronDown, RefreshCw } from 'lucide-react';

export default function RangeLight() {
  // State for position and prices
  const [currentPrice, setCurrentPrice] = useState(1.00);
  const [minRange, setMinRange] = useState(0.90);
  const [maxRange, setMaxRange] = useState(1.10);
  const [priceHistory, setPriceHistory] = useState([1.00]);
  const [isInRange, setIsInRange] = useState(true);
  const [nearEdgeWarning, setNearEdgeWarning] = useState(false);
  const [selectedToken0, setSelectedToken0] = useState('UFART');
  const [selectedToken1, setSelectedToken1] = useState('WHYPE');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [token0Price, setToken0Price] = useState(0);
  const [token1Price, setToken1Price] = useState(0);
  const [trafficLight, setTrafficLight] = useState('green'); // green, yellow, red
  const [usePoolData, setUsePoolData] = useState(false); // Toggle for pool vs DeFiLlama
  
  // Pool addresses for direct DEX data (Hyperswap & Hybra)
  const [poolAddresses] = useState({
    // Hyperswap pools
    'WHYPE/USDT': '0x3603ffebb994cc110b4186040cac3005b2cf4465',  // Changed from USDTO to USDT
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
    // Add more verified pools here as we find them
    // Format: 'TOKEN0/TOKEN1': '0x...' 
    // To find pool addresses, check transactions on Hyperscan or Purrsec
  });
  // Get available token pairs based on existing pools
  const getAvailableTokensForPair = (selectedToken) => {
    const availablePairs = [];
    
    // Check all pool combinations
    Object.keys(poolAddresses).forEach(poolPair => {
      const [token0, token1] = poolPair.split('/');
      
      if (token0 === selectedToken) {
        availablePairs.push(token1);
      } else if (token1 === selectedToken) {
        availablePairs.push(token0);
      }
    });
    
    return availablePairs;
  };
  
  // Get all tokens that have pools
  const getTokensWithPools = () => {
    const tokensSet = new Set();
    
    Object.keys(poolAddresses).forEach(poolPair => {
      const [token0, token1] = poolPair.split('/');
      tokensSet.add(token0);
      tokensSet.add(token1);
    });
    
    return Array.from(tokensSet);
  };
  
  const tokensWithPools = getTokensWithPools();
  const availableForToken0 = selectedToken1 ? getAvailableTokensForPair(selectedToken1) : tokensWithPools;
  // Check if current pair has a pool
  const currentPoolKey = `${selectedToken0}/${selectedToken1}`;
  const hasPool = poolAddresses.hasOwnProperty(currentPoolKey);
  
  // Pool addresses for direct DEX data (Hyperswap & Hybra)
  const [poolAddresses] = useState({
    // Hyperswap pools
    'WHYPE/USDTO': '0x3603ffebb994cc110b4186040cac3005b2cf4465',
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
    // Add more verified pools here as we find them
    // Format: 'TOKEN0/TOKEN1': '0x...' 
    // To find pool addresses, check transactions on Hyperscan or Purrsec
  });
  
  // Function to identify pool tokens
  const identifyPool = async (poolAddress) => {
    try {
      // Get token0
      const token0Response = await fetch(priceConfig.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_call',
          params: [{
            to: poolAddress,
            data: '0x0dfe1681' // token0()
          }, 'latest']
        })
      });
      
      // Get token1
      const token1Response = await fetch(priceConfig.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'eth_call',
          params: [{
            to: poolAddress,
            data: '0xd21220a7' // token1()
          }, 'latest']
        })
      });
      
      const token0Data = await token0Response.json();
      const token1Data = await token1Response.json();
      
      if (token0Data.result && token1Data.result) {
        // Remove 0x and pad addresses
        const token0 = '0x' + token0Data.result.slice(-40);
        const token1 = '0x' + token1Data.result.slice(-40);
        
        console.log(`Pool ${poolAddress}:`);
        console.log(`Token0: ${token0}`);
        console.log(`Token1: ${token1}`);
        
        // Find token names from our list
        const token0Name = Object.entries(availableTokens).find(([_, data]) => 
          data.address.toLowerCase() === token0.toLowerCase()
        )?.[0] || 'Unknown';
        
        const token1Name = Object.entries(availableTokens).find(([_, data]) => 
          data.address.toLowerCase() === token1.toLowerCase()
        )?.[0] || 'Unknown';
        
        console.log(`Pair: ${token0Name}/${token1Name}`);
        return { token0, token1, token0Name, token1Name };
      }
    } catch (error) {
      console.error('Error identifying pool:', error);
    }
  };
  
  // Hyperswap factory
  const HYPERSWAP_FACTORY = '0x6eDA206207c09e5428F281761DdC0D300851fBC8';
  
  // Basic pool ABI for reading reserves
  const POOL_ABI = [
    {
      "constant": true,
      "inputs": [],
      "name": "getReserves",
      "outputs": [
        {"name": "_reserve0", "type": "uint112"},
        {"name": "_reserve1", "type": "uint112"},
        {"name": "_blockTimestampLast", "type": "uint32"}
      ],
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "token0",
      "outputs": [{"name": "", "type": "address"}],
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "token1",
      "outputs": [{"name": "", "type": "address"}],
      "type": "function"
    }
  ];
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
    'WHYPE': { symbol: 'WHYPE', address: '0x5555555555555555555555555555555555555555', decimals: 18 }, // Note: Same as HYPE
    'XAUTO': { symbol: 'XAUTO', address: '0xf4D9235269a96aaDaFc9aDAe454a0618eBE37949', decimals: 18 } // "Liquid Gold"
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
    // DeFiLlama price API (free, no rate limits)
    priceFeedUrl: 'https://coins.llama.fi/prices/current',
    // Hyperliquid RPC endpoint (can also fetch pool data)
    rpcUrl: 'https://evmrpc-jp.hyperpc.app/6043a2905bbc4765ba3dd43fabe4eec0?apikey=BRExesZrDWsu0LErgac2s6jTpSOa7UeZ',
    // Price update interval (ms)
    updateInterval: 2000
  });

  // Function to analyze a transaction to find pool info
  const analyzeTransaction = async (txHash) => {
    try {
      const response = await fetch(priceConfig.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        })
      });
      
      const data = await response.json();
      if (data.result) {
        console.log('Transaction details:', data.result);
        console.log('Contract interacted with:', data.result.to);
        console.log('Logs:', data.result.logs);
        // Look for Swap events or pool interactions in logs
        return data.result;
      }
    } catch (error) {
      console.error('Error analyzing transaction:', error);
    }
  };

  // Function to fetch pool data directly from DEX
  const fetchPoolData = async (poolAddress) => {
    try {
      const calls = [
        {
          to: poolAddress,
          data: '0x0902f1ac' // getReserves() function selector
        },
        {
          to: poolAddress,
          data: '0x0dfe1681' // token0() function selector
        },
        {
          to: poolAddress,
          data: '0xd21220a7' // token1() function selector
        }
      ];
      
      const response = await fetch(priceConfig.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_call',
          params: [calls[0], 'latest']
        })
      });
      
      const data = await response.json();
      console.log('Pool data:', data);
      
      // This would return reserves which we can use to calculate actual pool ratio
      // For now, we'll continue using DeFiLlama prices
      
    } catch (error) {
      console.error('Error fetching pool data:', error);
    }
  };

  // Function to fetch pool reserves and calculate ratio directly
  const fetchPoolRatio = async () => {
    if (!hasPool) return;
    
    try {
      const poolAddress = poolAddresses[actualPoolKey];
      const isReversed = actualPoolKey === reversePoolKey;
      
      // Get reserves
      const response = await fetch(priceConfig.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_call',
          params: [{
            to: poolAddress,
            data: '0x0902f1ac' // getReserves()
          }, 'latest']
        })
      });
      
      const data = await response.json();
      if (data.result) {
        // Decode reserves (first 64 chars after 0x = reserve0, next 64 = reserve1)
        // Parse as hex strings
        const reserve0Hex = data.result.slice(2, 66);
        const reserve1Hex = data.result.slice(66, 130);
        
        // Convert to numbers (may lose precision for very large numbers)
        const reserve0 = parseInt(reserve0Hex, 16) / 1e18; // Assume 18 decimals
        const reserve1 = parseInt(reserve1Hex, 16) / 1e18; // Assume 18 decimals
        
        // Calculate ratio
        const ratio = isReversed 
          ? reserve1 / reserve0 
          : reserve0 / reserve1;
        setCurrentPrice(ratio);
        setPriceHistory(prev => [...prev.slice(-50), ratio]);
        setConnectionStatus('pool');
        
        console.log('Pool reserves:', { reserve0, reserve1, ratio, isReversed });
      }
    } catch (error) {
      console.error('Error fetching pool data:', error);
      // Fall back to DeFiLlama
      fetchTokenPrices();
    }
  };

  // Function to fetch token prices from price feed
  // Note: Pool reserves give us ratios, but we still need USD prices from DeFiLlama
  // to show dollar values. Pool ratio = token0_reserves / token1_reserves
  const fetchTokenPrices = async () => {
    try {
      setLoading(true);
      const token0Data = availableTokens[selectedToken0];
      const token1Data = availableTokens[selectedToken1];
      
      // Fetch from DeFiLlama API
      try {
        // Construct the token identifiers for DeFiLlama
        const tokens = [
          `hyperliquid:${token0Data.address.toLowerCase()}`,
          `hyperliquid:${token1Data.address.toLowerCase()}`
        ].join(',');
        
        const response = await fetch(`${priceConfig.priceFeedUrl}/${tokens}`);
        const data = await response.json();
        
        // Extract prices from DeFiLlama response format
        const token0Key = `hyperliquid:${token0Data.address.toLowerCase()}`;
        const token1Key = `hyperliquid:${token1Data.address.toLowerCase()}`;
        
        const price0 = data.coins?.[token0Key]?.price || 0;
        const price1 = data.coins?.[token1Key]?.price || 0;
        
        setToken0Price(price0);
        setToken1Price(price1);
        
        // Calculate ratio (token0/token1)
        if (price1 > 0) {
          const ratio = price0 / price1;
          setCurrentPrice(ratio);
          setPriceHistory(prev => [...prev.slice(-50), ratio]);
          setConnectionStatus('connected');
        } else {
          console.error('Unable to calculate ratio - token prices not available');
          setConnectionStatus('error');
        }
        
      } catch (apiError) {
        console.error('DeFiLlama API error:', apiError);
        setConnectionStatus('error');
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
    if (usePoolData && hasPool) {
      fetchPoolRatio();
    } else {
      fetchTokenPrices();
    }
    
    // Set up interval
    const interval = setInterval(() => {
      if (usePoolData && hasPool) {
        fetchPoolRatio();
      } else {
        fetchTokenPrices();
      }
    }, priceConfig.updateInterval);
    
    return () => clearInterval(interval);
  }, [selectedToken0, selectedToken1, usePoolData]);
  
  // Identify unknown pool on load (temporary for debugging)
  useEffect(() => {
    // Uncomment to identify the pool
    // identifyPool('0x97a4f83a383b560b92f7c6a80056abdca4495ef2');
  }, []);

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
                  🚦 RangeLight
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm">Real-time LP position monitor</p>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-4">
                {tokensWithPools.length > 0 ? (
                  <>
                    <div className="relative flex-1 sm:flex-initial">
                      <select
                        value={selectedToken0}
                        onChange={(e) => setSelectedToken0(e.target.value)}
                        className="appearance-none bg-gray-900 text-white px-2 sm:px-3 py-2 pr-8 rounded-lg border border-gray-700 focus:outline-none focus:border-green-500 font-semibold text-sm w-full"
                      >
                        {availableForToken0.map(token => (
                          <option key={token} value={token}>
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
                        {availableForToken1.map(token => (
                          <option key={token} value={token}>
                            {token}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500 italic">No pools configured</div>
                )}
              </div>
              
              <div className="flex items-center gap-2 ml-0 sm:ml-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-400' : 
                  connectionStatus === 'pool' ? 'bg-blue-400' :
                  connectionStatus === 'error' ? 'bg-red-400' : 'bg-gray-400'
                }`} />
                <span className="text-xs sm:text-sm text-gray-400">
                  {connectionStatus === 'connected' ? 'Live (DeFiLlama)' : 
                   connectionStatus === 'pool' ? 'Pool Data' :
                   connectionStatus === 'error' ? 'Error' : 'Connecting...'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 self-end sm:self-auto">{/* Fixed alignment */}
              {hasPool && (
                <label className="flex items-center gap-2 text-xs text-gray-400">
                  <input
                    type="checkbox"
                    checked={usePoolData}
                    onChange={(e) => setUsePoolData(e.target.checked)}
                    className="rounded border-gray-600 bg-gray-900 text-green-500 focus:ring-green-500"
                  />
                  Use Pool Data
                </label>
              )}
              <button
                onClick={() => usePoolData && hasPool ? fetchPoolRatio() : fetchTokenPrices()}
                className="p-2 bg-gray-900 rounded-lg border border-gray-700 hover:border-green-500 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Price Difference Warning - MADE SMALLER */}
          <div className="mb-2 px-2 py-1 bg-yellow-900/20 border border-yellow-600 rounded text-xs">
            <span className="text-yellow-400">
              <strong>Note:</strong> {usePoolData ? 'Using pool reserves for ratio. No USD prices shown.' : 'Prices via DeFiLlama API. Your specific DEX pool price may differ due to liquidity and arbitrage.'} Always verify on your DEX!
            </span>
          </div>
          
          {/* Limited Pools Notice - Only show if less than 20 pools */}
          {Object.keys(poolAddresses).length < 20 && Object.keys(poolAddresses).length > 0 && (
            <div className="mb-2 px-2 py-1 bg-blue-900/20 border border-blue-600 rounded text-xs">
              <span className="text-blue-400">
                <strong>Tracking {Object.keys(poolAddresses).length} pools:</strong> Continue adding Hyperswap & Hybra pool addresses to track more pairs.
              </span>
            </div>
          )}
          
          {/* Available Pools Quick Select */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">Available pools ({Object.keys(poolAddresses).length}):</p>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {Object.keys(poolAddresses).map(poolPair => {
                const [token0, token1] = poolPair.split('/');
                return (
                  <button
                    key={poolPair}
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
                    {poolPair}
                  </button>
                );
              })}
              {Object.keys(poolAddresses).length > 0 && Object.keys(poolAddresses).length < 30 && (
                <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 italic">
                  + more pools available
                </span>
              )}
            </div>
            {Object.keys(poolAddresses).length === 0 && (
              <p className="text-xs text-gray-500 italic">No pools configured yet. Add pool addresses to start tracking pairs.</p>
            )}
          </div>
          
          {tokensWithPools.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              {!usePoolData && (
                <>
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
                </>
              )}
              <div className={`bg-gray-900 rounded p-2 sm:p-3 ${usePoolData ? 'col-span-2' : ''}`}>
                <div className="text-xs text-gray-400">Ratio ({selectedToken0}/{selectedToken1})</div>
                <div className={`text-sm sm:text-lg font-semibold flex items-center gap-1 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {currentPrice < 0.0001 ? currentPrice.toFixed(8) : currentPrice < 0.01 ? currentPrice.toFixed(6) : currentPrice.toFixed(4)}
                  {priceChange >= 0 ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />}
                </div>
                {hasPool && (
                  <div className="text-xs text-gray-500 mt-1">Pool: {poolAddresses[actualPoolKey].slice(0, 6)}...{poolAddresses[actualPoolKey].slice(-4)}</div>
                )}
              </div>
              <div className={`bg-gray-900 rounded p-2 sm:p-3 ${usePoolData ? 'col-span-2' : ''}`}>
                <div className="text-xs text-gray-400">24h Change</div>
                <div className={`text-sm sm:text-lg font-semibold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                </div>
              </div>
            </div>
          )}
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
                  {currentPrice < 0.0001 ? currentPrice.toFixed(8) : currentPrice < 0.01 ? currentPrice.toFixed(6) : currentPrice.toFixed(4)}
                </div>
              </div>
            </div>
            
            {/* Range labels */}
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-400">{minRange < 0.0001 ? minRange.toFixed(8) : minRange < 0.01 ? minRange.toFixed(6) : minRange.toFixed(4)}</span>
              <span className="text-sm text-gray-400">MIN</span>
              <span className="text-sm text-gray-400">MAX</span>
              <span className="text-sm text-gray-400">{maxRange < 0.0001 ? maxRange.toFixed(8) : maxRange < 0.01 ? maxRange.toFixed(6) : maxRange.toFixed(4)}</span>
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
              {(maxRange - minRange) < 0.0001 ? (maxRange - minRange).toFixed(8) : (maxRange - minRange) < 0.01 ? (maxRange - minRange).toFixed(6) : (maxRange - minRange).toFixed(4)}
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
