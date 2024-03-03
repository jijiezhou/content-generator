/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-03-02 22:37:05
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-02 22:38:13
 */
const shouldRenewSubscriptionPlan = (user) => {
  const today = new Date();
  return !user?.nextBillingDate || user?.nextBillingDate <= today;
};

module.exports = shouldRenewSubscriptionPlan;
