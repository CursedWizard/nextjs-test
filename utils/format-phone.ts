export const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/
const normilizePhoneNumber = (phone: string) => {
  let res = ""
  if (phone.length > 0)
    res += `+${phone[0]} `

  if (phone.length > 1)
    res += `(${phone[1]}`

  if (phone.length > 2)
    res += `${phone[2]}`

  if (phone.length > 3)
    res += `${phone[3]}) `

  if (phone.length > 4)
    res += `${phone[4]}`

  if (phone.length > 5)
    res += `${phone[5]}`

  if (phone.length > 6)
    res += `${phone[6]}-`

  if (phone.length > 7)
    res += `${phone[7]}`

  if (phone.length > 8)
    res += `${phone[8]}-`

  if (phone.length > 9)
    res += `${phone[9]}`

  if (phone.length > 10)
    res += `${phone[10]}`

  return res;
}

export const normalizeInput = (value: string, previousValue: string) => {
  if (!value) return ""; 

  // only allows 0-9 inputs
  const numberedCurrentValue = value.replace(/[^\d]/g, '');
  if (numberedCurrentValue.length > 11)
    return previousValue;

  if (previousValue.length > value.length && !/\d/g.test(previousValue[previousValue.length - 1])) {
      return normilizePhoneNumber(
        numberedCurrentValue.slice(0, numberedCurrentValue.length - 1)
      );
    }

  return normilizePhoneNumber(numberedCurrentValue);
};
