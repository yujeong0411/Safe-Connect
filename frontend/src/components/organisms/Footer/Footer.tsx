import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full bg-gray-100 py-4">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                    {/* 왼쪽: 저작권 */}
                    <p className="text-sm text-gray-600">
                        © 2024 Safe Connect. All rights reserved.
                    </p>

                    {/* 오른쪽: 링크들 */}
                    <div className="flex space-x-6">
                        <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                            개인정보처리방침
                        </Link>
                        <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                            이용약관
                        </Link>
                        <a
                            href="mailto:support@safeconnect.com"
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            문의하기
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;