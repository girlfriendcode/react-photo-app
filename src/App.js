import './App.css';
import {getImages, searchImages} from './api';
import React, {useEffect, useState} from "react";

function App() {
    const [imageList, setImageList] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            const responseJson = await getImages();
            setImageList(responseJson.resources);
            setNextCursor(responseJson.next_cursor);
        }

        fetchData();
    }, []);
    const handleLoadMoreButtonClick = async () => {
        const respponseJson = await getImages(nextCursor);
        setImageList((currentImageList) => [...currentImageList, ...respponseJson.resources]);
        setNextCursor(respponseJson.next_cursor);
    };
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const responseJson = await searchImages(searchValue, nextCursor);
        setImageList(responseJson.resources);
        setNextCursor(responseJson.next_cursor);
    };
    const resetForm = async () => {
        const responseJson = await getImages(nextCursor);
        setImageList(responseJson.resources);
        setNextCursor(nextCursor);
        setSearchValue('');
    }


    return (
        <div>
            <form onSubmit={handleFormSubmit} className="search-bar">
                <input value={searchValue}
                       onChange={(event) => setSearchValue(event.target.value)}
                       required='required' placeholder="Enter a search value..."></input>
                <button type="submit" className="search-button">Search</button>
                <button type="button" onClick={resetForm} className="seach-button">Clear</button>
            </form>
            <div className="image-grid">
                {imageList.map((image) => <img src={image.url} alt={image.public_id}></img>)}
            </div>
            <div className="footer">
                {nextCursor && <button onClick={handleLoadMoreButtonClick}>Load More</button>}
            </div>
        </div>

    );
}

export default App;
