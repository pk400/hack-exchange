import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Config from './config.json'

const apiGet = (options={base: 'CAD'}) => {
  return axios.get(Config.api_url, {
    params: {
      ...options
    }
  })
}

const convertCurrency = (amount, currencyCode) =>
  amount.toLocaleString('en', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).replace('0.00', '')

function App() {
  // const [data, setData] = useState({"rates":{"CAD":1.3590288853,"HKD":7.750132908,"ISK":139.4648236754,"PHP":49.5286195286,"DKK":6.6004784689,"HUF":314.9831649832,"CZK":23.7001594896,"GBP":0.7967659047,"RON":4.2892078682,"SEK":9.2424242424,"IDR":14414.3186248449,"INR":75.0004430268,"BRL":5.3552188552,"RUB":71.2904483431,"HRK":6.6795144427,"JPY":107.5580365054,"THB":31.2351586036,"CHF":0.9413432571,"EUR":0.8860535176,"MYR":4.2724614567,"BGN":1.7329434698,"TRY":6.8649654439,"CNY":7.0142654616,"NOK":9.4705830232,"NZD":1.5272904483,"ZAR":16.9792663477,"USD":1.0,"MXN":22.7213361687,"SGD":1.3950912635,"AUD":1.4391281233,"ILS":3.4510898458,"KRW":1195.1621477937,"PLN":3.9664185717},"base":"USD","date":"2020-07-08"})
  const [data, setData] = useState({})
  const [currentBase, setCurrentBase] = useState('CAD')
  const [isLoading, setIsLoading] = useState(false)
  const [watchers, setWatchers] = useState({})
  const [amount, setAmount] = useState(parseFloat(1.00).toFixed(2))

  useEffect(() => {
    if (Object.keys(data).length === 0 && data.constructor === Object) {
      apiGet().then(response => setData(response.data))
      setIsLoading(false)
    }
  }, [data])

  const changeBase = (event) => {
    const currencyCode = event.target.value
    apiGet({base: currencyCode}).then(response => {
      setCurrentBase(currencyCode)
      setData(response.data)
    })
  }

  const addToWatcher = (currencyCode, currencyAmount) => {
    return () => {
      setData(data)
      setWatchers({
        ...watchers,
        [currencyCode]: currencyAmount
      })
    }
  }

  if (isLoading) {
    return (
      <div className='m-12'>
        <h1 className='text-4xl font-bold text-teal-900'>LOADING...</h1>
      </div>
    )
  }

  return (
    <div className='m-12'>
      <h1 className='text-4xl font-extrabold text-teal-900 uppercase'>CurrEx</h1>
      <h2 className='text-2xl font-semibold text-teal-600'>Currency Exchange Tool</h2>
      <span className='inline-block mt-3 font-medium'>Quick and easy currency conversion tool for various countries.</span>
      <div className='mt-6 mb-6'>
        <label htmlFor='base'>Base</label>
        <select id='base' className='ml-3 mr-3 p-2 shadow-md rounded-md focus:outline-none' onChange={changeBase} value={currentBase}>
          {
            'rates' in data ? Object.keys(data.rates).sort().map((currencyCode, key) => {
            return <option key={key} value={currencyCode}>{Config.flags[currencyCode]} {currencyCode}</option>
            }) : []
          }
        </select>
        <label htmlFor='value'>Amount</label>
        <input id='value' value={amount} onChange={(event) => setAmount(event.target.value)} type='number' step='0.01' min='0.01' className='ml-3 p-2 shadow-md rounded-md focus:outline-none' />
      </div>
      <div className='rounded-lg bg-gray-200 p-6 w-auto inline-block text-center shadow-md align-text-top'>
        <h3 className='font-bold text-xl text-teal-800'>Convert</h3>
        {
          'rates' in data ? Object.keys(data.rates).sort().map((currencyCode, key) => {
            if (currencyCode !== currentBase) {
              const converted = amount * data.rates[currencyCode]
              return (
                <div key={key} className='w-auto text-left mb-2'>
                  <button className='inline-block pr-2' onClick={addToWatcher(currencyCode, data.rates[currencyCode])}>⭕️</button>
                  <div className='inline-block w-20'>
                    <span className='font-bold'>{Config.flags[currencyCode]} {currencyCode}</span>
                  </div>
                  <div className='inline-block'>
                    <span className='text-center'>{convertCurrency(converted, currencyCode)}</span>
                  </div>
                </div>)
            }
            return []
          }) : []
        }
      </div>
      <div className='ml-6 rounded-lg bg-gray-200 p-6 w-auto inline-block text-center shadow-md align-text-top'>
        <h3 className='font-bold text-xl text-teal-800'>Watchers</h3>
        {
          Object.keys(watchers).length > 0 && watchers.constructor === Object ? Object.keys(watchers).sort().map((currencyCode, key) => {
            const converted = amount * watchers[currencyCode]
            console.log(converted)
            return (
              <div key={key} className='w-auto text-left mb-2'>
                <div className='inline-block w-20'>
                  <span className='font-bold'>{Config.flags[currencyCode]} {currencyCode}</span>
                </div>
                <div className='inline-block'>
                  <span className='text-center'>{convertCurrency(converted, currencyCode)}</span>
                </div>
              </div>
            )
          }) : []
        }
      </div>
    </div>
  );
}

export default App;
