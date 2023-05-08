export function flat(arr) {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].children) {
      //children存在
      newArr.push(...flat(arr[i].children));
      delete arr[i].children;
    }
    newArr.push({ ...arr[i] });
  }
  return newArr;
}
