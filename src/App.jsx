import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const URI = `https://api.unsplash.com/photos/?client_id=${API_KEY}&page=${pageNumber}&per_page=10`;
  console.log(URI);

  const pageEnd = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URI);
        const data = await response.json();

        data.map((item) => (item.id = item.id + new Date()));

        setPhotos((prevPhotos) => {
          return [...prevPhotos, ...data];
        });
        setLoading(false);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [URI]);

  const loadMore = () => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  useEffect(() => {
    const options = { threshold: 0.1 };

    const pageEndCopy = pageEnd.current;

    const handleIntersecting = ([pageEnd]) => {
      if (pageEnd.isIntersecting) loadMore();
    };

    if (!loading) {
      const observer = new IntersectionObserver(handleIntersecting, options);

      observer.observe(pageEnd.current);

      return () => {
        observer.unobserve(pageEndCopy);
      };
    }
  }, [loading]);

  const photoList = photos.map((photo) => {
    return (
      <section className='photos' key={photo.id}>
        <img src={photo.urls.thumb} alt={photo.urls.alt_description} />
        <p>
          {photo.user.first_name} {photo.user.last_name}
        </p>
      </section>
    );
  });

  return (
    <main>
      {photoList}
      <footer ref={pageEnd}></footer>
    </main>
  );
};

export default App;
