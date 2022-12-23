export const SpaceCodeGenerator = (length) => {
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
  const char = lowerCase + lowerCase.toUpperCase();
  const int = '1234567890';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomNum = randomNumber(2);
    randomNum === 0
      ? (result += char.charAt(randomNumber(char.length)))
      : (result += int.charAt(randomNumber(int.length)));
  }
  return result;
};

export const randomNumber = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const paginationOptions = (page: number, pageSize: number) => ({
  take: pageSize,
  skip: pageSize * (page - 1),
});
