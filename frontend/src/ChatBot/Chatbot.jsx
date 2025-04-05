import  { useState } from 'react';
import './ChatbotIcon.css'; // Optional custom CSS for overrides or unique styles

const ChatbotIcon = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: 'Hello! How can I assist you today?', sender: 'bot' },
        { text: 'I have a question about my booked sessions.', sender: 'user' },
        { text: 'Certainly, please provide your user ID or the session details.', sender: 'bot' },
    ]);
    const [userInput, setUserInput] = useState('');

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
        console.log('Chatbot toggled:', !isOpen);
    };

    const handleSendMessage = () => {
        if (userInput.trim()) {
            setMessages([...messages, { text: userInput, sender: 'user' }]);
            setUserInput('');
            setTimeout(() => {
                setMessages([...messages, { text: userInput, sender: 'user' }, { text: 'Thank you for the information. Our support team will review and get back to you within 24 hours.', sender: 'bot' }]);
            }, 750);
        }
    };

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    return (
        <div className="chatbot-icon-container">
            <button className="chatbot-icon-button btn btn-primary btn-lg rounded-circle shadow" onClick={toggleChatbot}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="chatbot-icon-svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M4.804 21.607A6.75 6.75 0 0011.25 21.75v-2.407a.75.75 0 01.75-.75h9a.75.75 0 01.75.75v2.407a6.75 6.75 0 006.446-4.857l-1.522-1.522A4.5 4.5 0 0016.837 19.5h-9a.75.75 0 01-.75-.75v-5.625a.75.75 0 01.75-.75h9a.75.75 0 01.75.75v2.625a6.75 6.75 0 00-6.446 4.857l1.522 1.522a4.5 4.5 0 003.163-1.5h9a.75.75 0 01.75-.75V6.75a.75.75 0 01.75-.75h-9a.75.75 0 01-.75-.75V4.5a6.75 6.75 0 00-6.446 4.857l1.522 1.522a4.5 4.5 0 003.163 1.5h9a.75.75 0 01.75.75v9a.75.75 0 01-.75.75h-9a.75.75 0 01-.75-.75v-2.25a6.75 6.75 0 00-6.446-4.857l1.522 1.522a4.5 4.5 0 003.163-1.5H4.5a.75.75 0 01-.75-.75V15a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V6a.75.75 0 01-.75-.75H1.5a.75.75 0 01-.75.75v12.75a.75.75 0 01.75.75h1.5a.75.75 0 01.75-.75V18a.75.75 0 01.75-.75h9a.75.75 0 01.75.75v2.25A6.75 6.75 0 004.804 21.607z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
            {isOpen && (
                <div className="chatbot-window card shadow-lg">
                    <div className="card-header bg-primary text-white py-3">
                        <h5 className="mb-0">Need Assistance?</h5>
                        <button type="button" className="btn-close btn-close-white float-end" aria-label="Close" onClick={toggleChatbot}></button>
                    </div>
                    <div className="card-body chatbot-messages-container p-3">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chatbot-message alert ${msg.sender === 'user' ? 'alert-success' : 'alert-info'} mb-3 p-2`}>
                                <p className="mb-0">{msg.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="card-footer p-3">
                        <div className="input-group mb-2">
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                value={userInput}
                                onChange={handleInputChange}
                                placeholder="Type your message..."
                            />
                            <button className="btn btn-primary btn-lg" onClick={handleSendMessage}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.26.41a.5.5 0 0 0 .886-.083l6.06-15.29zm-1.633 1.94l-1.861 1.204L11.578 4.04l.472-2.79zM8 12.21a.5.5 0 0 1-.322.194l-5.8-.933-.588-.942 2.697-1.703L8 12.21zm3.448-1.242L15.91 6.564 4.59 12.697l.648.168 2.127-1.342z"/>
                                </svg>
                            </button>
                        </div>
                        <div className="text-center text-muted small">Powered by a helpful AI</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatbotIcon;