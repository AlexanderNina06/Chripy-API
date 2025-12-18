export function validateProfane(arr: string[]){
  const arr2 = ["kerfuffle", "sharbert", "fornax"]
  for(let i = 0; i < arr.length; i++){
    for(let j = 0; j < arr2.length;j++){
      if(arr[i].toUpperCase() === arr2[j].toUpperCase()){
        arr[i] = "****"
      }
    }
  }
  return arr
}

export function envOrThrow(key: string) : string{
  const value = process.env[key];

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}