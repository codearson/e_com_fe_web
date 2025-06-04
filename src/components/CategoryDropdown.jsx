import React, { useState, useEffect } from 'react';
import { getAllProductCategoriesBySearch } from '../API/ProductCategoryApi';

export const CategoryDropdown = ({ isOpen, onClose, parentCategory }) => {
    const [categories, setCategories] = useState([]);
    const [hoveredCategory, setHoveredCategory] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const result = await getAllProductCategoriesBySearch();
            console.log('Dropdown categories:', result);
            if (result && !result.errorDescription) {
                if (Array.isArray(result)) {
                    setCategories(result);
                } 
                else if (result.responseDto && Array.isArray(result.responseDto)) {
                    setCategories(result.responseDto);
                }
            }
        };
        fetchCategories();
    }, []);

    const getChildCategories = (parentId) => {
        return categories.filter(cat => {
            const isActive = cat.isActive === true || cat.isActive === 1;
            return cat.parentId === parentId && isActive;
        });
    };

    const buildCategoryTree = (category) => {
        const children = getChildCategories(category.id);
        if (children.length === 0) return null;

        return (
            <div className="absolute left-full top-0 bg-white shadow-lg rounded-lg p-4 min-w-[200px] z-50">
                {children.map(child => (
                    <div key={child.id} className="relative group">
                        <div 
                            className="px-4 py-2 hover:bg-gray-100 rounded cursor-pointer flex items-center justify-between"
                            onMouseEnter={() => setHoveredCategory(child.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                        >
                            <span>{child.name}</span>
                            {getChildCategories(child.id).length > 0 && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                        </div>
                        {hoveredCategory === child.id && buildCategoryTree(child)}
                    </div>
                ))}
            </div>
        );
    };

    if (!isOpen || !parentCategory) return null;

    const childCategories = getChildCategories(parentCategory.id);
    console.log('Child categories for', parentCategory.name, ':', childCategories);

    return (
        <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg p-4 min-w-[200px] z-50">
            {childCategories.map(category => (
                <div key={category.id} className="relative group">
                    <div 
                        className="px-4 py-2 hover:bg-gray-100 rounded cursor-pointer flex items-center justify-between"
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                    >
                        <span>{category.name}</span>
                        {getChildCategories(category.id).length > 0 && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                    </div>
                    {hoveredCategory === category.id && buildCategoryTree(category)}
                </div>
            ))}
        </div>
    );
}; 