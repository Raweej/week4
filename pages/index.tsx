import type { NextPage } from 'next'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { 
  connectWallet, 
  getAsset, 
  getBalance, 
  getChainId, 
  getProvider, 
  getWalletAddress, 
  getTokenBalance,
  addTokenToWallet

} from '../services/wallet-services'
import { 
  getNetwork, 
  getNetworkCurrency, 
  getNetworkTokens, 
} from '../services/network-list'
import { formatEther, formatUnits } from 'ethers/lib/utils'
import Navbar from '../component/navbar'



const Home: NextPage = () => {

  const [address,setAddrees] = useState<string | null>(null)
  const [network,setNetwork] = useState<string | null>(null)
  const [balance,setBalance] = useState<string | null>(null)
  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>(
    {}
  );
  
  const handleAccountsChanged =(address:string[])=>{
    setAddrees(address[0])
  }

  const handleChainChanged =(chainId:string)=>{
    setNetwork(chainId)
    window.location.reload()
  }


  const loadAccount =async () => {
    const curAddress = getWalletAddress()
    if(curAddress){
      setAddrees(curAddress)
      getChainId().then(chainId =>{setNetwork(chainId)})
      getBalance().then(balance =>{setBalance(formatEther(balance))})
      
      const tokenList = getNetworkTokens(network);

      const tokenBalList = await Promise.all(
        tokenList.map((token) =>
          getTokenBalance(token.address, curAddress).then((res) =>
            formatUnits(res, token.decimals)
          )
        )
      )
      
      tokenList.forEach((token, i) => {
        tokenBalances[token.symbol] = tokenBalList[i]
      })
      setTokenBalances({ ...tokenBalances })
    }
  }
  
  useEffect(()=>{

    loadAccount()

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)
    
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
    
  },[])

  return (
    <div>
      <div className='flex bg-white shadow-md shadow-violet-200 h-16 items-center justify-between px-5'>
        <Navbar/>
      </div>

      <div>
        {address ? ( 
          <div>
            <p className=''>Your wallet address is {address}</p>
            <p>current network is {getNetwork(network)}</p>
            <p>your blance is {balance} {getNetworkCurrency(network)}</p>
            <div className='flex justify-center'>
              <div className='border-4 border-blue-200 rounded-2xl w-[50%]  '>
                <div className='px-10 mt-10 mb-10'>
                  <div className='flex justify-between'>
                    <p className='font-bold '>Assets</p>
                    <p className='font-bold'>Balance</p>
                  </div>
                  
                  <div className='flex flex-col justify-center'>
                    {
                      getNetworkTokens(network).map((token)=>(
                        <div key={token.symbol} className='flex justify-center  bg-white mt-4 rounded-xl '>
                          <div className=''>
                            <img
                              onClick={() => addTokenToWallet(token)}
                              src={token.imageUrl} 
                              className='w-20 h-20 mr-8 cursor-pointer' 
                            />
                          </div>
                          <div>
                            <div>{token.name} ({token.symbol})</div>
                            <div>{tokenBalances[token.symbol] || 0} {token.symbol}</div>
                          </div>

                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          
        ):( 
          
            <button className='bg-green-400 rounded-md' onClick={connectWallet}>Connect</button>

        )}
      </div>
      
    </div>
    
  )
}

export default Home
