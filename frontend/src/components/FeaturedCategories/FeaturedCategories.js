import React from 'react';
import './FeaturedCategories.css';
import { Link } from 'react-router-dom';

const FeaturedCategories = () => {
    const categories = [
        {
            name: 'Turmeric Powder',
            image: `${process.env.PUBLIC_URL}/400_g.webp`,
            description: 'Organic, pure turmeric powder for health and wellness',
            categoryName: 'turmeric powder'
        },
        {
            name: 'Jaggery Powder',
            image: `${process.env.PUBLIC_URL}/Jaggery_Powder_1.webp`,
            description: 'Natural sweetener packed with essential nutrients',
            categoryName: 'jaggery powder'
        }
    ];

    return (
        <section className="categories-section">
            <h2 className="category-section-title">Featured Categories</h2>

            <div className="categories-grid">
                {categories.map((category, index) => (
                    <div className="category-card" key={index}>
                        <div className="card-image">
                            <img
                                src={category.image}
                                alt={category.name}
                                loading="lazy"
                            />
                            <div className="image-overlay"></div>
                        </div>
                        <div className="card-content">
                            <h3>{category.name}</h3>
                            <p>{category.description}</p>
                            <Link 
                                to={`/shop?category=${encodeURIComponent(category.categoryName)}`}
                                className="shop-now-btn"
                            >
                                Shop Now
                                <span className="arrow">→</span>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedCategories;