import React from 'react'
import searchIcon from '../../public/Assets/searchIcon.svg'
import {useState, useEffect} from 'react'
import axios from 'axios';

const SearchBar = () => {

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (query.trim() !== '') {
                axios.get(`/api/v1/products/search?q=${query}`)
                    .then(res => {
                        setResults(Array.isArray(res.data) ? res.data : []);
                        console.log(res.data);
                    })
                    .catch(() => setResults([]));
            } else {
                setResults([]);
            }
        }, 300); // debounce 300ms

        return () => clearTimeout(delay);
    }, [query]);

    return (
        <div className='flex flex-col'>
            <div className='navbarSearch'>
                    <img src={searchIcon} alt="search" />
                    <input
                        placeholder='Search for products' 
                        type="text"
                        onChange={(e) => setQuery(e.target.value)}
                    />
            </div>

            {results.length > 0 && (
                <ul className="bg-white shadow-3xl rounded-lg absolute top-18 w-1/4 flex flex-col gap-4">
                    {results.map((product) => (
                        <li key={product._id} className="hover:bg-gray-100 hover:cursor-pointer rounded-lg p-4">
                            {product.name} - <span className='text-green-700'>{product.price}$</span>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    )
}

export default SearchBar;
