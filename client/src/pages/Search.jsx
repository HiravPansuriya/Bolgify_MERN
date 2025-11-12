import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axiosConfig";
import "./All.css";

function Search() 
{
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const query = params.get("query") || "";

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {

        const fetchSearchResults = async () => {

            try 
            {
                setLoading(true);
                const res = await api.get(`/blog/search?query=${query}&page=${currentPage}`);
                setBlogs(res.data.blogs || []);
                setTotalPages(res.data.totalPages || 1);
            } 
            catch(err) 
            {
                console.error("Error fetching search results:", err.response?.data || err.message);
                setError("Failed to load search results. Please try again later.");
            } 
            finally 
            {
                setLoading(false);
            }
        };

        if (query) {
            fetchSearchResults();
        }

    }, [query, currentPage]);

    if(loading) 
    {
        return (
            <div className="loading-container">
                <p>Loading search results...</p>
            </div>
        );
    }

    if(error) 
    {
        return (
            <div className="error-container">
                <p className="error-text">{error}</p>
            </div>
        );
    }

    return (
        <div className="search-page container mt-5">
            <h3>Search Results for "{query}"</h3>
            <hr />

            <div className="container py-4">
                <div className="row g-4">
                    {blogs.length > 0 ? (
                        blogs.map((blog) => (
                            <div key={blog._id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
                                <div className="card w-100">
                                    <img
                                        src={blog.coverImageURL}
                                        className="card-img-top"
                                        alt={blog.title}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{blog.title}</h5>
                                        <Link to={`/blog/${blog._id}`} className="btn btn-outline-primary">
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-results">No blogs found for "{query}".</p>
                    )}
                </div>
            </div>

            {totalPages > 1 && (
                <nav aria-label="Pagination">
                    <ul className="pagination justify-content-center">
                        {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            return (
                                <li
                                    key={page}
                                    className={`page-item ${currentPage === page ? "active" : ""}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            )}
        </div>
    );
}

export default Search;
