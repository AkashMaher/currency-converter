/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client"
import Image from 'next/image'
import { useState } from 'react';
import currencyapi from "@everapi/currencyapi-js";

const apiKey = process.env.NEXT_PUBLIC_API_KEY ||'';
  const client = new currencyapi(apiKey);

export default function Home() {

    const [currencyFrom, setCurrencyFrom] = useState("INR");
    const [currencyTo, setCurrencyTo] = useState("USD");
    const [conversionAmount, setConversionAmt] = useState(0);
    const [inputVal, setInputVal] = useState(0);
    const [convertedVal, setConvertedVal] = useState(0);

  



  async function swapButton() {
    let [to, from] = [currencyFrom, currencyTo]
    const res = await client.latest({ base_currency:from, currencies: to });
    console.log(res?.data)
    let val = res?.data?.[to]?.value
    const c1:any = document.getElementById("currency1");
    const c2:any = document.getElementById("currency2");
    if(c1) {
      c1.value = to;
    }
    if (c2) {
      c2.value = from;
    }
    console.log(c1)
    await Promise.all([
    setConversionAmt(val),
    setConvertedVal(inputVal>0?val*inputVal:0),
    setCurrencyFrom(from),
    setCurrencyTo(to)
    ])
    
  }

  async function convertButton(){
  const res = await client.latest({ base_currency: currencyFrom, currencies: currencyTo });
  console.log(res?.data);

  setConvertedVal((res?.data?.[currencyTo]?.value)*inputVal);

  }

  async function inputs(e:any) {
    // console.log(e.target.value)
    setInputVal(parseFloat(e.target.value))
    // console.log(parseFloat(e.target.value));
  }

  async function changeCurrency(e: any, event:any) {
    let [to, from] = [currencyTo, currencyFrom];
    if(event==='from') {
    setCurrencyFrom(e.target.value);
    from = e.target.value
    }
    else {
    setCurrencyTo(e.target.value)
    to = e.target.value;
  }

    
    const res = await client.latest({ base_currency: from, currencies: to });
    console.log(res?.data);
    let val = res?.data?.[to]?.value;
    setConversionAmt(val);


  }
  return (
    <main className=" bg-white min-h-screen flex items-center ">
      <div className=" bg-white m-auto gap-[27px] top-[111px] left-[20px] w-[350px] p-4 h-full text-center justify-center border-[2px] rounded-lg border-slate-500">
        <div className=" pb-12">
          <h1 className="font-bold text-3xl text-[#1f2261] text-center">
            Currency Converter
          </h1>
        </div>
        <div className="w-[320px] h-[290px] border-[#E7E7EE] rounded-2xl ">
          <div className="w-[280px] h-[77px] top-[85px] left-[20px]  text-[#1f2261] rounded-2xl">
            <p className="text-start pl-2 text-sm">Amount</p>
            <select
              id="currency1"
              name="currency1"
              className="text-[#1f2261]"
              onChange={(e) => {
                changeCurrency(e, "from")
              }}
            >
              <option value={"INR"}>INR</option>
              <option value={"USD"}>USD</option>
              <option value={"AED"}>AED</option>
            </select>
            <input
              className="border-black bg-[#EFEFEF] w-36 h-11 top-28 left-40 rounded-md"
              placeholder="0"
              onChange={(e) => {
                inputs(e);
              }}
            ></input>
            <button className="grid pl-36" onClick={swapButton}>
              <img src="swap.svg"></img>
            </button>
            <p className="text-start pl-2 text-sm">Converted Amount</p>
            <select
              id="currency2"
              name="currency2"
              onChange={(e) => {
                changeCurrency(e, "to");
              }}
              className="text-[#1f2261]"
            >
              <option value={"USD"}>USD</option>
              <option value={"INR"}>INR</option>
              <option value={"AED"}>AED</option>
            </select>
            <input
              className=" border-black bg-[#EFEFEF] w-36 h-11 top-28 left-40 rounded-md"
              disabled
              value={convertedVal > 0 ? convertedVal.toFixed(3) : 0}
            ></input>
            <div className="pt-4">
              <button
                className=" w-[320px] h-11 rounded-2xl justify-between px-3 bg-[#26278D] text-white"
                onClick={convertButton}
              >
                Convert
              </button>
              <div className="ml-12 pt-2">
                <p>Indicative Exchange Rate</p>
                <p>
                  1 {currencyFrom} ={" "}
                  {conversionAmount == 0
                    ? "0.012"
                    : conversionAmount.toFixed(3)}{" "}
                  {currencyTo}
                </p>
              </div>
            </div>
            {/* <div className="bg-white"></div> */}
          </div>
        </div>
      </div>
    </main>
  );
}
