import React, { useState } from 'react';
import TabList from './TabList';
import SettingPanel from './SettingPanel';
import './SettingPage.css';

const SettingPage = () => {
    const [activeTab, setActiveTab] = useState('system');

    return (
        <div className="setting-page">
            <TabList activeTab={activeTab} setActiveTab={setActiveTab} />
            <SettingPanel activeTab={activeTab} />
        </div>
    );
};

export default SettingPage;
