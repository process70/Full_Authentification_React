import React, { useEffect, useState } from 'react'

const getLocalValue = (key, initValue) => {
    //SSR Next.js 
    if (typeof window === 'undefined') return initValue;

    // if a value is already store 
    const localValue = JSON.parse(localStorage.getItem(key));
    if (localValue) return localValue;

    // if initValue is a function stored in local storage return result of that function 
    if (initValue instanceof Function) return initValue();

    return initValue;
}

const useLocalStorage = (key, initValue) => {
    const [value, setValue] = useState(() => {
        return getLocalValue(key, initValue)
    })

    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value))

    }, [key, value])
    
  return [value, setValue]
}

export default useLocalStorage
