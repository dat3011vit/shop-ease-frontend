// // src/FacebookChat.js
//
// import React, { useEffect } from 'react';
// import { Button } from 'antd';
// import { FaFacebookMessenger } from 'react-icons/fa'; // Import icon
//
// const FacebookChat = () => {
//     useEffect(() => {
//         window.fbAsyncInit = function() {
//             window.FB.init({
//                 appId: 'YOUR_APP_ID', // Thay thế bằng App ID của bạn
//                 autoLogAppEvents: true,
//                 xfbml: true,
//                 version: 'v10.0'
//             });
//         };
//
//         (function(d, s, id) {
//             var js, fjs = d.getElementsByTagName(s)[0];
//             if (d.getElementById(id)) return;
//             js = d.createElement(s); js.id = id;
//             js.src = "https://connect.facebook.net/en_US/sdk.js";
//             fjs.parentNode.insertBefore(js, fjs);
//         }(document, 'script', 'facebook-jssdk'));
//     }, []);
//
//     const openChat = () => {
//         window.FB.ui({
//             method: 'send',
//             link: 'YOUR_PAGE_URL' // Thay thế bằng URL trang Facebook của bạn
//         });
//     };
//
//     return (
//         <div style={{ position: 'fixed', bottom: '30px', right: '30px' }}>
//             <Button
//                 type="primary"
//                 shape="circle"
//                 icon={<FaFacebookMessenger />}
//                 size="large"
//                 onClick={openChat}
//                 style={{ backgroundColor: '#0084ff', borderColor: '#0084ff' }}
//             />
//         </div>
//     );
// };
//
// export default FacebookChat;


// src/FacebookChat.tsx

import React, { useEffect } from 'react';
import { Button } from 'antd';
import { FaFacebookMessenger } from 'react-icons/fa'; // Import icon

const FacebookChat: React.FC = () => {
    useEffect(() => {
        // Khởi tạo SDK Facebook
        (window as any).fbAsyncInit = function () {
            (window as any).FB.init({
                appId: 'YOUR_APP_ID', // Thay thế bằng App ID của bạn
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v10.0'
            });
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }, []);

    const openChat = () => {
        (window as any).FB.ui({
            method: 'send',
            link: 'YOUR_PAGE_URL' // Thay thế bằng URL trang Facebook của bạn
        });
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px' }}>
            <Button
                type="primary"
                shape="circle"
                icon={<FaFacebookMessenger />}
                size="large"
                onClick={openChat}
                style={{ backgroundColor: '#0084ff', borderColor: '#0084ff' }}
            />
        </div>
    );
};

export default FacebookChat;