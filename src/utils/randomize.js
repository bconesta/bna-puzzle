export const randomize = (n) => {
    const rand = [];
    while(rand.length < n){
      const num = Math.floor(Math.random()*n);
      if(!rand.includes(num)) rand.push(num);
    }
    return rand;
}