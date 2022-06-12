import type { NextPage } from 'next'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { 
  connectWallet, 
  getAsset, 
  getBalance, 
  getChainId, 
  getWalletAddress, 
} from '../services/wallet-services'
import { 
  getNetwork, 
  getNetworkCurrency, 
  getNetworkTokens, 
} from '../services/network-list'
import Image from 'next/image'
import { formatEther, formatUnits } from 'ethers/lib/utils'
import { Token } from "../types/token.type"
import { promises } from 'stream'


const Home: NextPage = () => {

  const [address,setAddrees] = useState<string | null>(null)
  const [network,setNetwork] = useState<string | null>(null)
  const [balance,setBalance] = useState<string | null>(null)
  
  const handleAccountsChanged =(address:string[])=>{
    setAddrees(address[0])
    console.log(address[0])
  }

  const handleChainChanged =(chainId:string)=>{
    setNetwork(chainId)
    console.log(chainId)
    window.location.reload()
  }

  const loadAccount =async () => {
    setAddrees(getWalletAddress())
    getChainId().then(chainId =>{setNetwork(chainId)})
    getBalance().then(balance =>{setBalance(formatEther(balance))})
    // const test = getAsset().then((args:any)=>{console.log(args)})

    const tokenList = getNetworkTokens(network)
    
    const balanceList = await Promise.all(
      tokenList.map((token)=>{
        getAsset(token.address).then((res:any)=>{
          console.log(res)
        })
      })
    )
   
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
      {address ? ( 
        <div>
          <p>Your wallet address is {address}</p>
          <p>current network is {getNetwork(network)}</p>
          <p>your blance is {balance} {getNetworkCurrency(network)}</p>
          <h1 className='font-bold'>Token list</h1>
          <div>
            {
              getNetworkTokens(network).map((token)=>(
                <div key={token.symbol} className='flex'>
                  <div>
                    <img src={token.imageUrl} className='w-20 h-20 mr-8' />
                  </div>
                  <div>
                    <div>{token.name} ({token.symbol})</div>
                    <div> 0 {token.symbol}</div>
                  </div>

                </div>
              ))
            }
          </div>
        </div>
         
      ):( 
        <button className='bg-green-400 rounded-md' onClick={connectWallet}>Connect</button>
      )}
      <button >LogOut</button>
    </div>
  )
}

export default Home
