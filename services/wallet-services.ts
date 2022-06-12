import { ethers } from "ethers";

declare global {
    interface Window{
        ethereum: any
    }
}

export const hasEthereum = ()=>{
    if (typeof window.ethereum !== 'undefined') {
       return window.ethereum 
    }
    return null
}

export const connectWallet = async()=>{
    const accounts = await hasEthereum()?.request({ method: 'eth_requestAccounts' })
    const account = accounts[0]
    return account
}

export const getWalletAddress = () =>{
    connectWallet() //
    return hasEthereum()?.selectedAddress
}

export const getChainId =()=>{
    return hasEthereum()?.request({method:'eth_chainId'}) as Promise<string>
}

export const getBalance =()=>{
    const account = getWalletAddress()
    return hasEthereum()?.request({method:'eth_getBalance', params: [account, 'latest']}) as Promise<string>
    
}

export const getAsset =async(tokenAddress:string)=>{
    const account = getWalletAddress()
    return hasEthereum()?.request({method:'eth_getStorageAt', params: [tokenAddress,account, 'latest']})
}