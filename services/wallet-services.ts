import { ethers } from "ethers";
import {Token} from '../types/token.type'

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

export const getProvider =()=>{
    return new ethers.providers.Web3Provider(hasEthereum())
}

export const connectWallet = async()=>{
    const accounts = await hasEthereum()?.request({ method: 'eth_requestAccounts' })
    const account = accounts[0]
    window.location.reload()
    return account
}

export const getWalletAddress = () =>{
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

export const getTokenBalance = async (
    tokenAddress: string,
    ownerAddress: string
  ) => {
    const abi = ["function balanceOf(address owner) view returns (uint256)"];
    const contract = new ethers.Contract(tokenAddress, abi, getProvider()!);
    return contract.balanceOf(ownerAddress);
}

export const addTokenToWallet = async (token: Token) => {
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: token.address, // The address that the token is at.
            symbol: token.symbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: token.decimals, // The number of decimals in the token
            image: token.imageUrl, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };