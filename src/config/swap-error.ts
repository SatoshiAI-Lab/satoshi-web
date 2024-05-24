export const SwapError = {
  crossChainNoTransfer: 'cross-chain-no-transfer',

  /**
   * 不支持从某条链跨到某条链
   */
  crossChainNotSupper: 'cross-chain',
  /**
   * 跨链余额过少
   */
  crossChaiMinAmount: 'cross-chain-min-amount',
  /**
   * 跨链余额过多
   */
  crossChaiMaxAmount: 'cross-chain-max-amount',
  /**
   * 跨链流动性不足
   */
  crossChainLiquidity: 'cross-chain-liquidity',
  /**
   * 没找到跨链路径
   */
  crossChainNotPath: 'cross-chain-no-path',
  /**
   * 余额不足
   */
  insufficient: 'insufficient-balance',
  /**
   * 购买成本不足
   */
  buyCost: 'buy-cost',
  /**
   * 滑点设置的不对
   */
  slippage: 'slippage',
  /**
   * 输入的代币数量不满足跨链需求
   */
  littleBalance: 'too-little-balance',
}
