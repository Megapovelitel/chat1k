import { useEffect, useState } from 'react'
import axios from 'axios'

export const useRest = () => {
    const [data, setData] = useState<unknown>()

    useEffect(() => {
        const getHelloWorld = async () => {
            const result = await axios.get(import.meta.env.VITE_API_ROUTE + '/api/v0/hello')
            setData(result.data)
        }
        void getHelloWorld()
    }, [])

    return data
}
