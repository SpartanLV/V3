// client/src/components/PaymentPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './payments.css';

const PaymentPage = () => {
    const [products] = useState([
        { id: 1, name: 'CSE110', price: 22000, description: 'Introduction to Programming' },
        { id: 2, name: 'CSE111', price: 22000, description: 'Object-Oriented Programming' },
        { id: 3, name: 'CSE112', price: 22000, description: 'Data Structures' }
    ]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const calculatedTotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
        setTotal(calculatedTotal);
    }, [selectedItems]);

    const toggleSelection = (productId) => {
        setSelectedItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === productId);
            if (existingItem) {
                return prevItems.filter(item => item.id !== productId);
            } else {
                const product = products.find(p => p.id === productId);
                return [...prevItems, product];
            }
        });
    };

    const generateReceipt = () => {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    
        const receiptContent = `
    ===============================
           COURSE PAYMENT RECEIPT
    ===============================
    Date: ${formattedDate}
    Payment Bank: BRAC BANK
    
    COURSE DETAILS:
    ${selectedItems.map(item => 
        `- ${item.name}: ${item.description} (৳${item.price.toLocaleString('en-IN')})`
    ).join('\n')}
    
    TOTAL: ৳${total.toLocaleString('en-IN')}
    
    Please pay at any BRAC BANK branch
    or through bKash to BRAC BANK account
    
    Thank you for your enrollment!
    ===============================
    `;
    
        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Payment_Receipt_${currentDate.getTime()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    return (
        <div className="payment-container">
            <div className="payment-card">
                <header className="payment-header">
                    <h1 className="payment-title">Course Enrollment</h1>
                    <p className="payment-subtitle">Select your courses and download the payment receipt</p>
                </header>

                <div className="courses-grid">
                    {products.map(product => (
                        <div 
                            key={product.id} 
                            className={`course-card ${selectedItems.some(item => item.id === product.id) ? 'selected' : ''}`}
                            onClick={() => toggleSelection(product.id)}
                        >
                            <div className="course-selector">
                                <div className="custom-checkbox">
                                    {selectedItems.some(item => item.id === product.id) && (
                                        <div className="checkmark"></div>
                                    )}
                                </div>
                            </div>
                            <div className="course-content">
                                <h3 className="course-name">{product.name}</h3>
                                <p className="course-description">{product.description}</p>
                            </div>
                            <div className="course-price">
                                <span>৳{product.price.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="payment-footer">
                    <div className="total-display">
                        <span className="total-label">Total Amount:</span>
                        <span className="total-amount">৳{total.toLocaleString('en-IN')}</span>
                    </div>
                    <button 
                        onClick={generateReceipt} 
                        disabled={total <= 0}
                        className="receipt-button"
                    >
                        <span className="button-icon">↓</span>
                        Download Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;