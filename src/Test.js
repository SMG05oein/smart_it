import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Test() {
    const [test, setTest] = useState('AAA');

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/Test`,{
        })
            .then(res => {
                // setTest(res.data.message)
                console.log(res.data);
            })
    }, []);

    return (
        <>{test}</>
    )
}
