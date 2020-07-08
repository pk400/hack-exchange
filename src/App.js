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

function App() {
  const [data, setData] = useState({})
  const [currentBase, setCurrentBase] = useState('CAD')
  const [isLoading, setIsLoading] = useState(true)
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
  if (isLoading) {
    return (
      <div className='m-12'>
        <h1 className='text-4xl font-bold text-teal-900'>CurrEx</h1>
        <div className='mt-6 mb-6'>
          LOADING
        </div>
      </div>
    )
  }
  return (
    <div className='m-12'>
      <h1 className='text-4xl font-bold text-teal-900'>CurrEx</h1>
      <h2 className='text-2xl font-semibold text-teal-600'>Currency Exchange Tool</h2>
      <span className='inline-block mt-3'>Quick and easy currency conversion tool for various countries.</span>
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
      <div className='rounded-lg bg-gray-200 p-6 w-auto inline-block text-center shadow-md'>
        {
          'rates' in data ? Object.keys(data.rates).sort().map((currencyCode, key) => {
            if (currencyCode !== currentBase) {
              const converted = amount * data.rates[currencyCode]
              const symbol = converted.toLocaleString('en', {style: 'currency', currency: currencyCode, minimumFractionDigits: 2, maximumFractionDigits: 2}).replace('0.00', '')
              return (
                <div key={key} className='w-auto text-left'>
                  <div className='inline-block w-20'>
                    <span className='font-bold'>{Config.flags[currencyCode]} {currencyCode}</span>
                  </div>
                  <div className='inline-block'>
                    <span className='text-center'>{symbol}</span>
                  </div>
                </div>)
            }
            return []
          }) : []
        }
      </div>
    </div>
  );
}

export default App;
