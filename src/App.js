import "./styles.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  const observerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let res = await axios.get(
          `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=10`
        );
        if (res.status === 200) {
          setData((prev) => [...prev, ...res.data]);
          setLoading(false);
          if (res.data.length > 10) {
            setHasMoreData(false);
          }
        } else {
          throw new Error("Something went wrong");
        }
      } catch (e) {
        console.log("error inside error handler", e);
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  useEffect(() => {
    const obsOptions = {
      index: null,
      threshold: 0.1,
    };

    const observerCallBack = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loading && hasMoreData) {
          setPage((prev) => prev + 1);
        }
      });
    };
    const observer = new IntersectionObserver(observerCallBack, obsOptions);
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loading, hasMoreData]);

  return (
    <div className="App">
      <h1>Infinite Scroll Mini Challenge</h1>
      <div className="infinite-scroll">
        <div className="data-container">
          {data &&
            data.map((el, index) => {
              return (
                <div key={el.index} className="data-individual">
                  {el.title}
                </div>
              );
            })}
        </div>
        {loading && <div>Loading...</div>}
        <div ref={observerRef} className="ovserver"></div>
      </div>
    </div>
  );
}
