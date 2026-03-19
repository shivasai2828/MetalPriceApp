// metalApi.js
// Using goldapi.io for live precious metal prices

const API_KEY = 'goldapi-31wrs0hsmmx30awm-io';
const BASE_URL = 'https://www.goldapi.io/api';

// goldapi.io metal symbols
const METAL_SYMBOLS = {
  gold: 'XAU',
  silver: 'XAG',
  platinum: 'XPT',
  palladium: 'XPD',
};

/**
 * Fetch live price for a given metal from goldapi.io
 *
 * API Response fields used:
 *   timestamp        – Unix epoch (seconds)
 *   metal            – e.g. "XAU"
 *   currency         – "USD"
 *   exchange         – e.g. "FOREXCOM"
 *   symbol           – e.g. "FOREXCOM:XAUUSD"
 *   price            – current price per troy oz
 *   prev_close_price – previous session close
 *   open_price       – current session open
 *   low_price        – session low
 *   high_price       – session high
 *   ch               – absolute change
 *   chp              – % change
 *   ask              – ask price
 *   bid              – bid price
 *   price_gram_24k   – price per gram at 24K purity
 *   price_gram_22k   – price per gram at 22K purity
 *   price_gram_21k   – price per gram at 21K purity
 *   price_gram_20k   – price per gram at 20K purity
 *   price_gram_18k   – price per gram at 18K purity
 *   price_gram_16k   – price per gram at 16K purity
 *   price_gram_14k   – price per gram at 14K purity
 *   price_gram_10k   – price per gram at 10K purity
 */
export const fetchMetalPrice = async metalKey => {
  const symbol = METAL_SYMBOLS[metalKey];

  if (!symbol) {
    throw new Error(`Unknown metal: ${metalKey}`);
  }

  const response = await fetch(`${BASE_URL}/${symbol}/USD`, {
    method: 'GET',
    headers: {
      'x-access-token': API_KEY,
      'Content-Type': 'application/json',
    },
  });

  // goldapi.io returns error details in JSON body even on non-200 status
  if (!response.ok) {
    let errorMsg = `API error ${response.status}`;
    try {
      const errBody = await response.json();
      if (errBody?.error) errorMsg = errBody.error;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  const data = await response.json();

  // Normalize to a consistent shape used across the app
  return {
    // Identity
    metal: data.metal,
    currency: data.currency,
    exchange: data.exchange,
    symbol: data.symbol,

    // Timing
    timestamp: data.timestamp, // unix seconds — used for "Updated" time
    open_time: data.open_time,

    // Prices (troy oz)
    price: data.price,
    prev_close_price: data.prev_close_price,
    open_price: data.open_price,
    low_price: data.low_price,
    high_price: data.high_price,

    // Change
    ch: data.ch,
    chp: data.chp,

    // Spread
    ask: data.ask,
    bid: data.bid,

    // Per-gram prices by karat
    price_gram_24k: data.price_gram_24k,
    price_gram_22k: data.price_gram_22k,
    price_gram_21k: data.price_gram_21k,
    price_gram_20k: data.price_gram_20k,
    price_gram_18k: data.price_gram_18k,
    price_gram_16k: data.price_gram_16k,
    price_gram_14k: data.price_gram_14k,
    price_gram_10k: data.price_gram_10k,
  };
};
