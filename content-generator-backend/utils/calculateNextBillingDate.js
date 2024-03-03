/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-03-02 22:34:04
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-02 22:34:52
 */
const calculateNextBillingDate = () => {
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
  return oneMonthFromNow;
};

module.exports = calculateNextBillingDate;
